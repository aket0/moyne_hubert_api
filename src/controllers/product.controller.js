import * as productService from '../services/product.service.js';

export const getAll = async (req, res, next) => {
  try {
    const { sortBy, order } = req.query;
    const products = await productService.findAll({ sortBy, order });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await productService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Produit introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
