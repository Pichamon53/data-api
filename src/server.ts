import express from 'express';
import open from 'open';
import { userRouter } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 2228;

// ✅ แสดง JSON แบบ pretty-print (default = null = compact)
app.set('json spaces', 2);

app.use('/api/users', userRouter);

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/api/users`;
  console.log(`✅ Server running on ${url}`);
  open(url);
});
