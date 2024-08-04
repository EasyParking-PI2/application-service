import expressAsyncHandler from "express-async-handler";
import CustomRequest from "../types/CustomRequest.type";
import { Profile } from "../types/User.type";
import { Vaga } from "../model/Models";


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

    if(numero != undefined && numero != '') vaga.set('numero', numero);
    if(categoria != undefined && categoria != '') vaga.set('categoria', categoria);
    if(status != undefined && status != '') vaga.set('status', status);

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

  if(user.profile != Profile.ADMIN) {
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

export {
  createVaga,
  readVaga,
  readAllVagas,
  updateVaga,
  deleteVaga
};