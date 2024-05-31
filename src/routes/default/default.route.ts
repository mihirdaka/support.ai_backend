import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'SupportU.ai Backend service' });
});

export default router;
