import * as express from 'express';

import defaultRouter from './default/default.route';
import authRouter from './auth/auth.route';
import chatRouter from './chat/chat.route';
import userRouter from './user/user.route';










const router = express.Router();

router.use('/', defaultRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/chat', chatRouter);











export default router;
