import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import AccountService from './AccountService';
import BookingService from './BookingService';
import AdminService from './AdminService';
import config from "./config";

interface RequestBody {
    amount: number
}

/**
 * Represents an Express server that listens for incoming requests.
 * @class
 * @description This class is responsible for creating an Express server that listens for incoming requests.
 */
class Server {
    /**
    * Creates a new instance of the Server class.
    * @constructor
    * @memberof Server
    * @description This constructor creates a new instance of the Server class.
    */
    constructor() {
        console.log('Starting server...');
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
    }
    
    stripe = require('stripe')(config.stripeKey);

    /**
     * Loads environment variables from the .env file.
     * @description This method loads environment variables from the .env file.
     * @memberof Server
     */
    loadEnvironmentVariables() {
        dotenv.config();
    }

    /**
    * Handles GET requests to the API endpoint.
    * @memberof Server
    * @description This method handles GET requests to the API endpoint.
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
    * @memberof Server
    * @description This method starts the server and begins listening for incoming requests.
    * @param port - The port number on which to listen for incoming requests.
    */
    listen(port: number) {
        this.app.get('/api', this.handleApiRequest);

        this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
        
        this.app.post('/account/register/corporate', AccountService.registerCorporate);
        this.app.post('/account/register/personal', AccountService.registerUser);
        // this.app.post('/account/register/social', AccountService.createSocialAccount);
        this.app.post('/account/forgot-password', AccountService.forgotPassword);
        this.app.post('/account/reset-password', AccountService.resetPassword);
        this.app.post('/account/login', AccountService.login);
        this.app.post('/account/logout', AccountService.logout);
        this.app.post('/account/delete', AccountService.deleteAccount);

        this.app.post('/account/find', AccountService.findUser);
        this.app.post('/account/get/profile-details', AccountService.getProfileDetails);
        this.app.post('/account/update', AccountService.updateUser);
        this.app.post('/account/add-vehicle', AccountService.addVehicle);
        this.app.post('/account/delete-vehicle', AccountService.removeVehicle);
        this.app.post('/account/add-payment', AccountService.addPayment);
        this.app.post('/account/delete-payment', AccountService.removePayment);

        this.app.post('/contact', AccountService.contact);

        this.app.post('/search-booking', BookingService.searchBookings);
        this.app.post('/start-booking', BookingService.startBooking);
        this.app.post('/booking/create', BookingService.createBooking);


        this.app.get('/admin/statistics', AdminService.getStatistics);
        this.app.get('/admin/users', AdminService.getUsers);
        this.app.get('/admin/get/staff', AdminService.getStaff);
        this.app.get('/admin/get/customers', AdminService.getCustomers);
        this.app.post('/admin/get/customer', AdminService.getCustomer);
        this.app.post('/admin/get/customer-address', AdminService.getCustomerAddresses);
        this.app.post('/admin/get/customer-vehicles', AdminService.getCustomerVehicles);
        this.app.post('/admin/update/customer', AdminService.updateCustomer);
        this.app.post('/admin/update/customer-vehicle', AdminService.updateCustomerVehicle);

        this.app.post('/secret', async (req: Request, res: Response) => {
            const { amount }:RequestBody = req.body;
        
            try {
                const intent = await this.stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'gbp',
                    automatic_payment_methods: {enabled: true},
                });
        
                res.json({ client_secret: intent.client_secret });
            } catch (error) {
                console.log(error);
            }
        });
    }

    private app: express.Application;
}

const server = new Server();
server.loadEnvironmentVariables();
server.listen(5000);
