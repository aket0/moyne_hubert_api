import { Router } from 'express';
import * as apiKeyController from '../controllers/apiKey.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { verifyApiKeyCreationAccess } from '../middlewares/apiKey.middleware.js';
import { createApiKeySchema } from '../schemas/apiKey.schema.js';

const router = Router();

router.post(
  '/',
  validateBody(createApiKeySchema),
  verifyApiKeyCreationAccess,
  apiKeyController.create
);

export default router;
