import expressAsyncHandler from "express-async-handler";
import CustomRequest from "../types/CustomRequest.type";
import { Profile } from "../types/User.type";
import { Vaga, Veiculo, VeiculoVaga } from "../model/Models";
import { sequelize } from "../infra/DatabaseConnection";


/**
 * @desc Create a new vaga
 * @route POST /api/vagas
 * @access Private
 * @admin
 */
const createVaga = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  if (user.profile != Profile.ADMIN) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const { numero, categoria } = req.body;

  try {
    const vaga = await Vaga.create({
      numero,
      categoria,
      status: 'disponivel'
    });

    res.status(201).json(vaga.toJSON());
  } catch (err) {
    console.log(err);

    res.status(400);
    throw new Error('Vaga not created');
  }
});

/**
 * @desc Read a vaga
 * @route GET /api/vagas/:id
 * @access Private
 */
const readVaga = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const vaga = await Vaga.findByPk(id);
    if (!vaga) {
      res.status(404);
      throw new Error('Vaga not found');
    }

    res.json(vaga.toJSON());
  } catch (err) {
    console.log(err);

    res.status(400);
    throw new Error('Vaga not found');
  }
});

/**
 * @desc Read all vagas
 * @route GET /api/vagas
 * @access Private
 */
const readAllVagas = expressAsyncHandler(async (req, res) => {
  try {
    const vagas = await Vaga.findAll();
    res.json(vagas);
  } catch (err) {
    console.log(err);

    res.status(400);
    throw new Error('Vagas not found');
  }
});


/**
 * @desc Update a vaga
 * @route PUT /api/vagas/:id
 * @access Private
 * @admin
 */
const updateVaga = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  const { id } = req.params;
  const { numero, categoria, status } = req.body;


  if (user.profile != Profile.ADMIN && status === 'interditada') {
    res.status(401);
    throw new Error('Unauthorized');
  }

  try {
    const vaga = await Vaga.findByPk(id);
    if (!vaga) {
      res.status(404);
      throw new Error('Vaga not found');
    }

    if (numero != undefined && numero != '') vaga.set('numero', numero);
    if (categoria != undefined && categoria != '') vaga.set('categoria', categoria);
    if (status != undefined && status != '') vaga.set('status', status);

    await vaga.save();

    res.status(200).json(vaga);
  } catch (err) {
    console.log(err);

    res.status(400);
    throw new Error('Vaga not updated');
  }
});

/**
 * @desc Delete a vaga
 * @route DELETE /api/vagas/:id
 * @access Private
 */
const deleteVaga = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  if (user.profile != Profile.ADMIN) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const { id } = req.params;

  try {
    const vaga = await Vaga.findByPk(id);
    if (!vaga) {
      res.status(404);
      throw new Error('Vaga not found');
    }

    await vaga.destroy();

    res.status(200).json({
      message: 'Vaga deleted'
    });
  } catch (err) {
    console.log(err);

    res.status(400);
    throw new Error('Vaga not deleted');
  }
});

/**
 * @desc Estacionar um veículo em uma vaga
 * @route POST /api/vagas/estacionar
 * @access Private
 */
const estacionar = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;
  const { placa, numeroVaga } = req.body;
  const transaction = await sequelize.transaction();

  try {

    const veiculo = await Veiculo.findOne({
      where: { placa: placa },
      include: [Vaga]
    });
    if (!veiculo) {
      res.status(404);
      throw new Error('Veículo não encontrado');
    }

    if (veiculo.get('dono') != user.id) {
      res.status(401);
      throw new Error('Veículo não pertence ao usuário');
    }

    const vaga = await Vaga.findOne({
      where: { numero: numeroVaga },
      include: [Veiculo]
    });
    if (!vaga) {
      res.status(404);
      throw new Error('Vaga não encontrada');
    }

    if (vaga.get('status') !== 'disponivel') {
      res.status(400);
      throw new Error('Vaga não disponível');
    }

    vaga.set('status', 'ocupada');

    const veiculoVaga = await VeiculoVaga.create({
      VeiculoId: veiculo.id,
      VagaId: vaga.id,
      dataHoraEntrada: new Date()
    }, { transaction });

    await vaga.save({ transaction });

    await transaction.commit();

    res.status(201).json(veiculoVaga);
  } catch (err) {
    console.log(err);
    transaction.rollback();
    res.status(400);
    throw new Error('Não foi possível estacionar o veículo');
  }

});

/**
 * @desc Desocupar uma vaga
 * @route POST /api/vagas/desocupar
 * @access Private
 */
const desocupar = expressAsyncHandler(async (req, res) => {
  const { placa, numeroVaga } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const veiculo = await Veiculo.findOne({
      where: { placa: placa },
      include: [Vaga]
    });
    if (!veiculo) {
      res.status(404);
      throw new Error('Veículo não encontrado');
    }

    const vaga = await Vaga.findOne({
      where: { numero: numeroVaga },
      include: [Veiculo]
    });
    if (!vaga) {
      res.status(404);
      throw new Error('Vaga não encontrada');
    }

    if (vaga.get('status') !== 'ocupada') {
      res.status(400);
      throw new Error('Vaga não está ocupada');
    }


    const veiculoVaga = await VeiculoVaga.findOne({
      where: {
        veiculoId: veiculo.id,
        vagaId: vaga.id,
        dataHoraSaida: null
      }
    });

    if (!veiculoVaga) {
      res.status(404);
      throw new Error('Veículo não está estacionado na vaga');
    }

    const dataHoraEntrada = veiculoVaga.get('dataHoraEntrada') as Date;
    const dataHoraSaida = new Date();

    const valor = veiculoVaga.calculateValue(dataHoraEntrada, new Date());


    veiculoVaga.set('valor', valor);
    veiculoVaga.set('dataHoraSaida', dataHoraSaida);

    vaga.set('status', 'disponivel');

    await veiculoVaga.save({ transaction });
    await vaga.save({ transaction });

    await transaction.commit();

    res.status(200).json(veiculoVaga);

  } catch (err) {
    console.log(err);
    transaction.rollback();
    res.status(400);
    throw new Error('Não foi possível desocupar a vaga');
  }

});

export {
  createVaga,
  readVaga,
  readAllVagas,
  updateVaga,
  deleteVaga,
  estacionar,
  desocupar
};