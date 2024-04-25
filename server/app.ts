import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const port = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from express!');
});

app.listen(port, () => {
  console.log(`Backend listening at port ${port}`);
});
