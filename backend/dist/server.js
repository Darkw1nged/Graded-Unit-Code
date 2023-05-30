"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const MySqlConnector = __importStar(require("./utils/mysql.connector"));
const MySqlTables = __importStar(require("./utils/mysql.tables"));
const user_service_1 = __importDefault(require("./services/user.service"));
const vehicle_service_1 = __importDefault(require("./services/vehicle.service"));
const payment_service_1 = __importDefault(require("./services/payment.service"));
const booking_service_1 = __importDefault(require("./services/booking.service"));
const contact_service_1 = __importDefault(require("./services/contact.service"));
const admin_service_1 = __importDefault(require("./services/admin.service"));
const discount_service_1 = __importDefault(require("./services/discount.service"));
const price_service_1 = __importDefault(require("./services/price.service"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const apiVersion = process.env.API_VERSION || 'v1';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
MySqlConnector.init();
MySqlTables.init();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/**
 * Default route that returns a greeting message.
 */
app.get('/api/' + apiVersion, (req, res) => {
    res.send('Hello from the API!');
});
/**
 * Endpoint to generate a client secret for Stripe payment.
 * @param {number} amount - The amount to be charged.
 * @returns {object} The client secret.
 */
app.post('/api/' + apiVersion + '/secret', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    try {
        const intent = yield stripe.paymentIntents.create({
            amount: amount,
            currency: 'gbp',
            automatic_payment_methods: { enabled: true },
        });
        res.json({ client_secret: intent.client_secret });
    }
    catch (err) {
        console.log(err);
    }
}));
/**
 * Listens for requests on the specified port
 */
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    // potential routes
    app.get('/api/' + apiVersion + '/users', user_service_1.default.getUsers);
    app.get('/api/' + apiVersion + '/users/deleted', user_service_1.default.getDeletedUsers);
    app.get('/api/' + apiVersion + '/users/customers', user_service_1.default.getCustomers);
    app.get('/api/' + apiVersion + '/users/persons', user_service_1.default.getPersons);
    app.get('/api/' + apiVersion + '/users/business', user_service_1.default.getBusiness);
    app.get('/api/' + apiVersion + '/users/staff', user_service_1.default.getStaff);
    app.get('/api/' + apiVersion + '/users/admins', user_service_1.default.getAdmins);
    app.post('/api/' + apiVersion + '/users/add/personal', user_service_1.default.addPersonal);
    app.post('/api/' + apiVersion + '/users/add/business', user_service_1.default.addBusiness);
    app.post('/api/' + apiVersion + '/users/add/staff', user_service_1.default.addStaff);
    app.post('/api/' + apiVersion + '/users/update', user_service_1.default.update);
    app.post('/api/' + apiVersion + '/users/delete', user_service_1.default.delete);
    app.post('/api/' + apiVersion + '/users/find', user_service_1.default.find);
    app.post('/api/' + apiVersion + '/users/login', user_service_1.default.login);
    app.post('/api/' + apiVersion + '/users/logout', user_service_1.default.logout);
    app.post('/api/' + apiVersion + '/users/forgot-password', contact_service_1.default.sendResetPasswordEmail);
    app.post('/api/' + apiVersion + '/users/reset-password', user_service_1.default.resetPassword);
    app.post('/api/' + apiVersion + '/users/contact', contact_service_1.default.sendEmail);
    app.get('/api/' + apiVersion + '/vehicles', vehicle_service_1.default.getVehicles);
    app.get('/api/' + apiVersion + '/vehicles/user', vehicle_service_1.default.getUserVehicles);
    app.post('/api/' + apiVersion + '/users/vehicles/add', vehicle_service_1.default.addVehicle);
    app.post('/api/' + apiVersion + '/users/vehicles/update', vehicle_service_1.default.updateVehicle);
    app.post('/api/' + apiVersion + '/users/vehicles/delete', vehicle_service_1.default.deleteVehicle);
    app.post('/api/' + apiVersion + '/users/vehicles/find', vehicle_service_1.default.findVehicle);
    app.get('/api/' + apiVersion + '/cards', payment_service_1.default.getCards);
    app.get('/api/' + apiVersion + '/cards/user', payment_service_1.default.getUserCards);
    app.post('/api/' + apiVersion + '/users/cards/add', payment_service_1.default.addCard);
    app.post('/api/' + apiVersion + '/users/cards/update', payment_service_1.default.updateCard);
    app.post('/api/' + apiVersion + '/users/cards/delete', payment_service_1.default.deleteCard);
    app.post('/api/' + apiVersion + '/users/cards/find', payment_service_1.default.findCard);
    app.get('/api/' + apiVersion + '/discounts', discount_service_1.default.getDiscounts);
    app.post('/api/' + apiVersion + '/discounts/add', discount_service_1.default.addDiscount);
    app.post('/api/' + apiVersion + '/discounts/update', discount_service_1.default.updateDiscount);
    app.post('/api/' + apiVersion + '/discounts/delete', discount_service_1.default.deleteDiscount);
    app.post('/api/' + apiVersion + '/discounts/find', discount_service_1.default.findDiscount);
    app.get('/api/' + apiVersion + '/prices', price_service_1.default.getPrice);
    app.post('/api/' + apiVersion + '/prices/update', price_service_1.default.updatePrice);
    app.get('/api/' + apiVersion + '/bookings', booking_service_1.default.getBookings);
    app.get('/api/' + apiVersion + '/bookings/user', booking_service_1.default.getUserBookings);
    app.post('/api/' + apiVersion + '/bookings/search', booking_service_1.default.searchBookings);
    app.post('/api/' + apiVersion + '/bookings/create', booking_service_1.default.createBooking);
    app.post('/api/' + apiVersion + '/bookings/update', booking_service_1.default.updateBooking);
    app.post('/api/' + apiVersion + '/bookings/delete', booking_service_1.default.deleteBooking);
    app.post('/api/' + apiVersion + '/bookings/find', booking_service_1.default.findBooking);
    app.post('/api/' + apiVersion + '/bookings/fetch-details', booking_service_1.default.fetchBookingDetails);
    app.post('/api/' + apiVersion + '/bookings/cancel');
    app.post('/api/' + apiVersion + '/bookings/refund');
    app.post('/api/' + apiVersion + '/bookings/refund/confirm');
    app.post('/api/' + apiVersion + '/bookings/refund/decline');
    app.get('/api/' + apiVersion + '/admin/analytics/bookings/daily', admin_service_1.default.getDailyBookingsReport);
    app.get('/api/' + apiVersion + '/admin/analytics/bookings/monthly', admin_service_1.default.getMonthlyBookingReport);
    app.post('/api/' + apiVersion + '/admin/dashboard/protection', admin_service_1.default.protectedRoute);
    app.post('/api/' + apiVersion + '/admin/dashboard/statistics', admin_service_1.default.getStatistics);
});
