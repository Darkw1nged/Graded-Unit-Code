import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import AccountHandler from './AccountHandler';

/**
 * Represents an Express server that listens for incoming requests.
 */
class Server {
    /**
    * Creates a new instance of the Server class.
    */
    constructor() {
        console.log('Starting server...');
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    /**
     * Loads environment variables from the .env file.
     */
    loadEnvironmentVariables() {
        dotenv.config();
    }

    /**
    * Handles GET requests to the API endpoint.
    * @param req - The HTTP request object.
    * @param res - The HTTP response object.
    */
    async handleApiRequest(req: express.Request, res: express.Response) {
        try {
            res.send('Hello from the API!');
        } catch (error) {
            console.log('Error querying database', error);
            res.status(500).send('Error querying database');
        }
    }

    /**
    * Starts the server and begins listening for incoming requests.
    * @param port - The port number on which to listen for incoming requests.
    */
    listen(port: number) {
        this.app.get('/api', this.handleApiRequest);

        this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
        
        this.app.post('/account/create', AccountHandler.create);
        this.app.post('/account/login', AccountHandler.login);
        this.app.post('/account/logout', AccountHandler.logout);
        this.app.post('/account/forgot-password', AccountHandler.forgotPassword);
        this.app.post('/account/reset-password', AccountHandler.resetPassword);
    }

    private app: express.Application;
}

const server = new Server();
server.loadEnvironmentVariables();
server.listen(5000);
