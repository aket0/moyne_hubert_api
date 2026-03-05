import { Router } from 'express';
import * as ratingController from '../controllers/rating.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createRatingSchema, updateRatingSchema } from '../schemas/rating.schema.js';

const router = Router();

router.get('/', ratingController.getAll);
router.get('/:id', ratingController.getOne);
router.post('/', validateBody(createRatingSchema), ratingController.create);
router.put('/:id', validateBody(createRatingSchema), ratingController.update);
router.patch('/:id', validateBody(updateRatingSchema), ratingController.update);
router.delete('/:id', ratingController.remove);

export default router;
