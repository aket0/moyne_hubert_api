import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema, queryParamsSchema } from '../schemas/product.schema.js';

const router = Router();

router.get('/', validateQuery(queryParamsSchema), productController.getAll);

router.get('/:id', productController.getOne);

router.post('/', validateBody(createProductSchema), productController.create);

router.put('/:id', validateBody(createProductSchema), productController.update);

router.patch('/:id', validateBody(updateProductSchema), productController.update);

router.delete('/:id', productController.remove);

export default router;
