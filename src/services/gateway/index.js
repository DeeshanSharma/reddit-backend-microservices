import express from 'express';
import router from './routes';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log('⚡[SERVER]: Running at http://localhost:' + PORT));
