import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.post('/', validateBody(createUserSchema), userController.create);
router.put('/:id', validateBody(createUserSchema), userController.update);
router.patch('/:id', validateBody(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;
