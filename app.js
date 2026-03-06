import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './src/config/data-source.js';
import logger from './src/config/logger.js';
import { rateLimiter } from './src/middlewares/rateLimit.middleware.js';
import { cacheControl } from './src/middlewares/cache.middleware.js';
import { errorHandler } from './src/middlewares/error.middleware.js';
import { apiKeyAuth } from './src/middlewares/apiKey.middleware.js';
import productRoutes from './src/routes/product.routes.js';
import userRoutes from './src/routes/user.routes.js';
import ratingRoutes from './src/routes/rating.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import apiKeyRoutes from './src/routes/apiKey.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(rateLimiter); 

app.use((req, res, next) => {
  res.on('finish', () => {
    const msg = `${req.method} ${req.originalUrl} ${res.statusCode}`;
    if (res.statusCode >= 500) logger.error(msg);
    else if (res.statusCode >= 400) logger.warn(msg);
    else logger.info(msg);
  });
  next();
});

const openApiDoc = JSON.parse(
  fs.readFileSync(new URL('./src/docs/openapi.json', import.meta.url), 'utf-8')
);

app.get('/api-docs.json', (req, res) => {
  res.json(openApiDoc);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDoc, {
    explorer: false,
    customSiteTitle: 'Exo API Docs',
    swaggerOptions: {
      filter: true,
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      docExpansion: 'list',
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  })
);

app.use('/api/keys', apiKeyRoutes);
app.use('/api', apiKeyAuth);
app.use('/api/products', cacheControl, productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res, next) => {
  const err = new Error('Route introuvable');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    logger.info('Base de données connectée');
    app.listen(PORT, () => logger.info(`Serveur démarré sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    logger.error(`Échec de connexion à la base de données : ${err.message}`);
    process.exit(1);
  });
