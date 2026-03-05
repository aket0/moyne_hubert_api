import * as orderService from '../services/order.service.js';

export const getAll = async (req, res, next) => {
  try {
    const orders = await orderService.findAll();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const order = await orderService.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const order = await orderService.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const order = await orderService.update(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await orderService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
