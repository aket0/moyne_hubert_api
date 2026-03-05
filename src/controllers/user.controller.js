import * as userService from '../services/user.service.js';

export const getAll = async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
