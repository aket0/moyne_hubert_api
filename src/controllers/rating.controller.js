import * as ratingService from '../services/rating.service.js';

export const getAll = async (req, res, next) => {
  try {
    const ratings = await ratingService.findAll();
    res.status(200).json(ratings);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const rating = await ratingService.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ error: 'Rating introuvable' });
    }
    res.status(200).json(rating);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const rating = await ratingService.create(req.body);
    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const rating = await ratingService.update(req.params.id, req.body);
    if (!rating) {
      return res.status(404).json({ error: 'Rating introuvable' });
    }
    res.status(200).json(rating);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const deleted = await ratingService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Rating introuvable' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
