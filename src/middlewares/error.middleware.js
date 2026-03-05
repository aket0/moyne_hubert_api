import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  logger.error(`${req.method} ${req.originalUrl} ${status} - ${message}`);

  const body = { error: message };

  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  res.status(status).json(body);
};
