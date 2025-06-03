import express from 'express';
import { fetchAndTransformUsers } from '../service/transform.js'; // ✅ ต้องใช้ .js ใน ESM

export const userRouter = express.Router();

userRouter.get('/', async (_req, res) => {
  try {
    const transformed = await fetchAndTransformUsers();
    res.json(transformed);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
