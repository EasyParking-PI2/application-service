import expressAsyncHandler from "express-async-handler";
import CustomRequest from "../types/CustomRequest.type";
import { Veiculo } from "../model/Models";
import { Profile } from "../types/User.type";


/**
 * @desc Create a new veiculo
 * @route POST /api/veiculos
 * @access Private
 */
const createVeiculo = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  const { modelo, marca, placa, categoria, dono } = req.body;

  try {
    const veiculo = await Veiculo.create({
      modelo,
      marca,
      placa,
      categoria,
      dono: user.id
    });

    res.status(201).json({
      ...veiculo.toJSON(),
      dono: user
    });
  } catch (err) {
    console.log(err);

    res.status(400);
    throw new Error('Veiculo not created');
  }

});

/**
 * @desc Read a veiculo
 * @route GET /api/veiculos/:id
 */
const readVeiculo = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  const { id } = req.params;

  try {
    const veiculo = await Veiculo.findByPk(id);
    if (!veiculo) {
      res.status(404);
      throw new Error('Veiculo not found');
    }
    
    
    if (user.profile != Profile.ADMIN && veiculo.getDataValue('dono') !== user.id) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    res.status(200).json({
      ...veiculo.toJSON(),
      dono: (user.profile === Profile.ADMIN) ? veiculo.get('dono') : user
    });
  } catch (err) {
    res.status(404);
    throw new Error('Veiculo not found');
  }
});

/**
 * @desc Read all veiculos
 * @route GET /api/veiculos
 * @access Private
 * @admin
 */
const readAllVeiculos = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  if(user.profile != Profile.ADMIN) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  try {
    const veiculos = await Veiculo.findAll();

    res.status(200).json(veiculos);
  } catch (err) {
    res.status(400);
    throw new Error('Veiculo not found');
  }
});

/**
 * @desc Read a veiculo by the id that is the user
 * @route GET /api/veiculos
 * @access Private
 */
const readVeiculoByUser = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  const {user_id} = req.params;

  const idQuery = (user_id != undefined && user.profile === Profile.ADMIN) ? user_id : user.id;

  try {
    const veiculos = await Veiculo.findAll({
      where: {
        dono: idQuery
      }
    });

    res.status(200).json(veiculos);
  } catch (err) {
    res.status(400);
    throw new Error('Veiculo not found');
  }
});


/**
 * @desc Update a veiculo
 * @route PUT /api/veiculos/:id
 * @access Private
 */
const updateVeiculo = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  const id = req.params.id;
  const { modelo, marca, placa, categoria } = req.body;

  try {

    const veiculo = await Veiculo.findByPk(id);
    if (!veiculo) {
      res.status(404);
      throw new Error('Veiculo not found');
    }

    if (veiculo.getDataValue('dono') !== user.id) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    if (marca != undefined && marca != '') veiculo.set('marca', marca);
    if (modelo != undefined && modelo != '') veiculo.set('modelo', modelo);
    if (placa != undefined && placa != '') veiculo.set('placa', placa);
    if(categoria != undefined && categoria != '') veiculo.set('categoria', categoria);

    await veiculo.save();

    res.status(200).json({
      ...veiculo.toJSON,
      dono: user
    });
  } catch (err) {
    console.log(err);
  
    res.status(400);
    throw new Error('Veiculo not updated');
  }
});


/**
 * @desc Delete a veiculo
 * @route DELETE /api/veiculos/:id
 * @access Private
 */
const deleteVeiculo = expressAsyncHandler(async (req, res) => {
  const user = (req as CustomRequest).user;

  const id = req.params.id;

  try {
    const veiculo = await Veiculo.findByPk(id);

    if (!veiculo) {
      res.status(404);
      throw new Error('Veiculo not found');
    }

    if (veiculo.getDataValue('dono') !== user.id && user.profile != Profile.ADMIN) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await veiculo.destroy();

    res.status(200).json({
      message: 'Veiculo deleted'
    });
  } catch (err) {
    console.log(err);
  
    res.status(400);
    throw new Error('Veiculo not deleted');
  }

});


export {
  createVeiculo,
  readAllVeiculos,
  readVeiculo,
  readVeiculoByUser,
  updateVeiculo,
  deleteVeiculo
}