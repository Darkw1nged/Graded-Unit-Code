import express from 'express';
import bodyParser from 'body-parser';

import { createConnection } from 'mysql2/promise';

import userRouter from './users';

console.log('Starting server...');
const app = express();
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '99Bootboy!',
    database: 'college'
}

async function connectToDatabase() {
    try {
        const connection = await createConnection(dbConfig);
        console.log('Connected to database');
        return connection;
    } catch (error) {
        console.log('Error connecting to database', error);
        process.exit(1);
    }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.get('/api', async (req, res) => {
    const connection = await connectToDatabase();
    res.send('Server is running and database is connected');
    connection?.end();
});

const port = 5000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});