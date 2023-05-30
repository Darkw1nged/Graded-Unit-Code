import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import * as MySqlConnector from './utils/mysql.connector';
import * as MySqlTables from './utils/mysql.tables';
import UserService from './services/user.service';
import VehicleService from './services/vehicle.service';
import PaymentService from './services/payment.service';
import BookingService from './services/booking.service';
import ContactService from './services/contact.service';
import AdminService from './services/admin.service';
import DiscountService from './services/discount.service';
import PriceService from './services/price.service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const apiVersion = process.env.API_VERSION || 'v1';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

MySqlConnector.init();
MySqlTables.init();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Default route that returns a greeting message.
 */
app.get('/api/' + apiVersion, (req, res) => {
    res.send('Hello from the API!');
});

interface RequestBody {
    amount: number;
}

/**
 * Endpoint to generate a client secret for Stripe payment.
 * @param {number} amount - The amount to be charged.
 * @returns {object} The client secret.
 */
app.post('/api/' + apiVersion + '/secret', async (req, res) => {
    const { amount }: RequestBody = req.body;

    try {
        const intent = await stripe.checkout.sessions.create({
            amount: amount,
            currency: 'gbp',
            automatic_payment_methods: { enabled: true },
        });

        res.json({ client_secret: intent.client_secret });
    } catch (err) {
        console.log(err);
    }
});

/**
 * Endpoint to process a payment.
 */
app.post('/api/' + apiVersion + '/checkout', async (req, res) => {
    const { products, email, booking_id } = req.body;
    let items: any = [];

    products.forEach((product: any) => {
        items.push({
            price: product.id,
            quantity: product.quantity,
        });
    });

    const session = await stripe.checkout.sessions.create({
        line_items: items,
        mode: 'payment',
        success_url: 'http://localhost:3000/booking/success?email=' + email + '&booking_id=' + booking_id,
        cancel_url: 'http://localhost:3000/booking/failure?email=' + email,
    });

    res.send(JSON.stringify({ url: session.url }));
});


/**
 * Listens for requests on the specified port
 */
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);

    // potential routes
    app.get('/api/' + apiVersion + '/users', UserService.getUsers);
    app.get('/api/' + apiVersion + '/users/deleted', UserService.getDeletedUsers);
    app.get('/api/' + apiVersion + '/users/customers', UserService.getCustomers);
    app.get('/api/' + apiVersion + '/users/persons', UserService.getPersons);
    app.get('/api/' + apiVersion + '/users/business', UserService.getBusiness);
    app.get('/api/' + apiVersion + '/users/staff', UserService.getStaff);
    app.get('/api/' + apiVersion + '/users/admins', UserService.getAdmins);
    app.post('/api/' + apiVersion + '/users/add/personal', UserService.addPersonal);
    app.post('/api/' + apiVersion + '/users/add/business', UserService.addBusiness);
    app.post('/api/' + apiVersion + '/users/add/staff', UserService.addStaff);
    app.post('/api/' + apiVersion + '/users/update', UserService.update);
    app.post('/api/' + apiVersion + '/users/delete', UserService.delete);
    app.post('/api/' + apiVersion + '/users/find', UserService.find);
    app.post('/api/' + apiVersion + '/users/login', UserService.login);
    app.post('/api/' + apiVersion + '/users/logout', UserService.logout);
    app.post('/api/' + apiVersion + '/users/forgot-password', ContactService.sendResetPasswordEmail);
    app.post('/api/' + apiVersion + '/users/reset-password', UserService.resetPassword);
    app.post('/api/' + apiVersion + '/users/contact', ContactService.sendEmail);
    app.post('/api/' + apiVersion + '/users/contact/payment/failure', ContactService.sendPaymentFailure);

    app.get('/api/' + apiVersion + '/vehicles', VehicleService.getVehicles);
    app.get('/api/' + apiVersion + '/vehicles/user', VehicleService.getUserVehicles);
    app.post('/api/' + apiVersion + '/users/vehicles/add', VehicleService.addVehicle);
    app.post('/api/' + apiVersion + '/users/vehicles/update', VehicleService.updateVehicle);
    app.post('/api/' + apiVersion + '/users/vehicles/delete', VehicleService.deleteVehicle);
    app.post('/api/' + apiVersion + '/users/vehicles/find', VehicleService.findVehicle);

    app.get('/api/' + apiVersion + '/cards', PaymentService.getCards);
    app.get('/api/' + apiVersion + '/cards/user', PaymentService.getUserCards);
    app.post('/api/' + apiVersion + '/users/cards/add', PaymentService.addCard);
    app.post('/api/' + apiVersion + '/users/cards/update', PaymentService.updateCard);
    app.post('/api/' + apiVersion + '/users/cards/delete', PaymentService.deleteCard);
    app.post('/api/' + apiVersion + '/users/cards/find', PaymentService.findCard);

    app.get('/api/' + apiVersion + '/discounts', DiscountService.getDiscounts);
    app.post('/api/' + apiVersion + '/discounts/add', DiscountService.addDiscount);
    app.post('/api/' + apiVersion + '/discounts/update', DiscountService.updateDiscount);
    app.post('/api/' + apiVersion + '/discounts/delete', DiscountService.deleteDiscount);
    app.post('/api/' + apiVersion + '/discounts/find', DiscountService.findDiscount);

    app.get('/api/' + apiVersion + '/prices', PriceService.getPrice);
    app.post('/api/' + apiVersion + '/prices/update', PriceService.updatePrice);

    app.get('/api/' + apiVersion + '/bookings', BookingService.getBookings);
    app.get('/api/' + apiVersion + '/bookings/user', BookingService.getUserBookings);
    app.post('/api/' + apiVersion + '/bookings/search', BookingService.searchBookings);
    app.post('/api/' + apiVersion + '/bookings/create', BookingService.createBooking);
    app.post('/api/' + apiVersion + '/bookings/update', BookingService.updateBooking);
    app.post('/api/' + apiVersion + '/bookings/paid', BookingService.markAsPaid);
    app.post('/api/' + apiVersion + '/bookings/delete', BookingService.deleteBooking);
    app.post('/api/' + apiVersion + '/bookings/find', BookingService.findBooking);
    app.post('/api/' + apiVersion + '/bookings/fetch-details', BookingService.fetchBookingDetails);
    app.post('/api/' + apiVersion + '/bookings/refund',);

    app.get('/api/' + apiVersion + '/admin/analytics/bookings/daily', AdminService.getDailyBookingsReport);
    app.get('/api/' + apiVersion + '/admin/analytics/bookings/monthly', AdminService.getMonthlyBookingReport);
    app.post('/api/' + apiVersion + '/admin/dashboard/protection', AdminService.protectedRoute);
    app.post('/api/' + apiVersion + '/admin/dashboard/statistics', AdminService.getStatistics);

});