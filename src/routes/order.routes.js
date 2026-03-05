import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createOrderSchema, updateOrderSchema } from '../schemas/order.schema.js';

const router = Router();

router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);
router.post('/', validateBody(createOrderSchema), orderController.create);
router.put('/:id', validateBody(createOrderSchema), orderController.update);
router.patch('/:id', validateBody(updateOrderSchema), orderController.update);
router.delete('/:id', orderController.remove);

export default router;
