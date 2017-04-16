import express from 'express';

import userController from '../controllers/user-controller';
import validateRequest from '../config/validator/param-validator';
import { createUser, findUser } from '../config/validator/user-schema';

const router = express.Router();


router.get('/', userController.list);

router.post('/', validateRequest(createUser), userController.create);

router.get('/:id', validateRequest(findUser), userController.getUser);

export default router;
