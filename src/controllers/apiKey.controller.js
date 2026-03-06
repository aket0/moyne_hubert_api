import * as apiKeyService from '../services/apiKey.service.js';

export const create = async (req, res, next) => {
  try {
    const result = await apiKeyService.createApiKey(req.body ?? {});
    res.status(201).json({
      message:
        'Cle API et JWT generes. Stockez-les immediatement, ils ne seront plus visibles ensuite.',
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
