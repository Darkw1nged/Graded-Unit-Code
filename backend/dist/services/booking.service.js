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
const booking_1 = __importDefault(require("../models/booking"));
const user_1 = __importDefault(require("../models/user"));
const payment_1 = __importDefault(require("../models/payment"));
const person_1 = __importDefault(require("../models/person"));
const business_1 = __importDefault(require("../models/business"));
const extra_1 = __importDefault(require("../models/extra"));
const discount_1 = __importDefault(require("../models/discount"));
const vehicle_1 = __importDefault(require("../models/vehicle"));
const Sender = __importStar(require("../utils/email.connector"));
class BookingService {
    /**
     * Retrieves all bookings.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield booking_1.default.getAll();
                res.status(200).json({ bookings });
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    /**
     * Retrieves bookings for a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getUserBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const bookings = yield booking_1.default.getAllByUserID(user_id);
                res.status(200).json(bookings);
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Searches for bookings within a given time range.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static searchBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { departureTime, arrivalTime } = req.body;
            try {
                const bookings = yield booking_1.default.searchBookings(departureTime, arrivalTime);
                let space = 1;
                if (bookings) {
                    let spaces = [];
                    for (let i = 0; i < bookings.length; i++) {
                        spaces.push(bookings[i].space);
                    }
                    spaces.sort();
                    for (let i = 1; i <= 150; i++) {
                        if (!spaces.includes(i)) {
                            space = i;
                            break;
                        }
                    }
                }
                res.status(200).json({
                    bookings,
                    space,
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Creates a new booking.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { space, departureTime, arrivalTime, user, person, business, card, vehicle, extra, discount, isLoggedIn, cost } = req.body;
            try {
                if (departureTime === undefined || arrivalTime === undefined) {
                    res.status(400).json({ message: 'Departure time or arrival time was not provided.' });
                    return;
                }
                const departure = new Date(departureTime);
                const arrival = new Date(arrivalTime);
                let user_id = yield user_1.default.getUserID(user.email);
                const password = Math.random().toString(36).slice(-13) + Math.random().toString(36).slice(-13);
                if (!user_id) {
                    const newUser = new user_1.default(user.email, password, 'person', undefined, user.telephone, user.addressLineOne, user.addressLineTwo, user.city, '', user.zip, user.country);
                    yield user_1.default.create(newUser);
                    user_id = yield user_1.default.getUserID(user.email);
                    if (!user_id) {
                        res.status(400).json({ message: 'Internal server error' });
                        return;
                    }
                    if (person === undefined && business === undefined) {
                        res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                        return;
                    }
                    const newPerson = new person_1.default(user_id, person.forename, person.surname);
                    yield person_1.default.create(newPerson);
                    const personID = yield person_1.default.getByUserID(user_id);
                    if (!personID) {
                        res.status(400).json({ message: 'Internal server error' });
                        console.log('Person not created in createBooking');
                        return;
                    }
                }
                else if (user_id && !isLoggedIn) {
                    res.status(400).json({ message: 'Please login to your account before continuing.' });
                    return;
                }
                if (person === undefined && business === undefined) {
                    res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                    return;
                }
                if (user.email === '' || user.telephone === '' || user.addressLineOne === '' ||
                    user.city === '' || user.zip === '' || user.country === '') {
                    res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                    return;
                }
                if (person !== undefined) {
                    if (person.forename === '' || person.surname === '') {
                        res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                        return;
                    }
                }
                else if (business !== undefined) {
                    if (business.name === '') {
                        res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                        return;
                    }
                }
                if (card === undefined) {
                    res.status(400).json({ message: 'Card details were not entered correctly' });
                    return;
                }
                const payment = yield payment_1.default.get(card.cvv);
                if (!payment) {
                    if (card.card_number.length < 16 || card.card_number.length > 19) {
                        res.status(400).json({ message: 'Invalid card number' });
                        return;
                    }
                    if (card.expiry_date.length !== 5) {
                        res.status(400).json({ message: 'Invalid expiry date' });
                        return;
                    }
                    if (card.cvv.length !== 3) {
                        res.status(400).json({ message: 'Invalid CVV' });
                        return;
                    }
                    const expiryDate = card.expiry_date.split('/');
                    const month = parseInt(expiryDate[0]);
                    const year = parseInt(expiryDate[1]);
                    if (month < 1 || month > 12) {
                        res.status(400).json({ message: 'Invalid expiry date' });
                        return;
                    }
                    const currentYear = new Date().getFullYear().toString().substring(2, 4);
                    if (year < parseInt(currentYear) || year > 99) {
                        res.status(400).json({ message: 'Invalid expiry date' });
                        return;
                    }
                    if (year === parseInt(currentYear) && month < new Date().getMonth() + 1 ||
                        month === new Date().getMonth()) {
                        res.status(400).json({ message: 'Invalid expiry date' });
                        return;
                    }
                }
                if (vehicle === undefined) {
                    res.status(400).json({ message: 'Vehicle details were not entered correctly' });
                    return;
                }
                if (vehicle.make === '' || vehicle.model === '' || vehicle.colour === '' ||
                    vehicle.registration_number === '') {
                    res.status(400).json({ message: 'Vehicle details were not entered correctly' });
                    return;
                }
                if (extra !== undefined) {
                    if (extra.mini_valet === true && extra.full_valet === true && extra.signature_valet === true
                        || extra.mini_valet === true && extra.full_valet === true && extra.signature_valet === false
                        || extra.mini_valet === true && extra.full_valet === false && extra.signature_valet === true
                        || extra.mini_valet === false && extra.full_valet === true && extra.signature_valet === true) {
                        res.status(400).json({ message: 'Multiple addons can not be selected' });
                        return;
                    }
                }
                const booking = new booking_1.default(user_id, vehicle.registration_number, space, new Date(), departure, arrival, cost, false);
                const booking_id = yield booking_1.default.create(booking);
                if (!booking_id) {
                    res.status(400).json({ message: 'Internal server error' });
                    return;
                }
                const newExtra = new extra_1.default(booking_id, extra.mini_valet, extra.full_valet, extra.signature_valet);
                const extra_id = yield extra_1.default.create(newExtra);
                if (!extra_id) {
                    res.status(400).json({ message: 'Internal server error' });
                    return;
                }
                booking.extras_id = extra_id;
                booking_1.default.update(booking, booking_id);
                const discount_id = yield discount_1.default.getDiscountID(discount);
                if (discount_id) {
                    booking.discount_id = discount_id;
                    booking_1.default.update(booking, booking_id);
                }
                Sender.sendEmail(user.email, 'We recieved your booking', 'Thank you for booking with us. We will be in touch shortly to confirm your booking.');
                res.status(200).json({ message: 'Booking created successfully' });
                if (isLoggedIn) {
                    const newUser = new user_1.default(user.email, user.password, user.role, user.remember_token, user.telephone, user.addressLineOne, user.addressLineTwo, user.city, '', user.zip, user.country);
                    yield user_1.default.update(newUser);
                    if (person) {
                        const newPerson = new person_1.default(user_id, person.forename, person.surname);
                        yield person_1.default.update(newPerson, newUser.email);
                    }
                    else if (business) {
                        const newBusiness = new business_1.default(user_id, business.name);
                        yield business_1.default.update(newBusiness, newUser.email);
                    }
                    const card_id = yield payment_1.default.get(card.cvv);
                    if (!card_id) {
                        const newCard = new payment_1.default(user_id, card.cardholder_name, card.card_number, card.expiry_date, card.cvv);
                        yield payment_1.default.create(newCard);
                    }
                    const vehicle_id = yield vehicle_1.default.get(vehicle.registration_number);
                    if (!vehicle_id) {
                        const newVehicle = new vehicle_1.default(vehicle.registration_number, user_id, vehicle.make, vehicle.model, vehicle.colour);
                        yield vehicle_1.default.create(newVehicle);
                    }
                }
                else {
                    Sender.sendEmail(user.email, 'Welcome to ParkEasy', 'Thank you again for making a booking with us! Here is your temporery password' + password + ', go to http:localhost:3000/account/login and enter in the email and the password provided to make changes to your booking!.');
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Updates an existing booking.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static updateBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { booking, extra } = req.body;
            try {
                const foundBooking = yield booking_1.default.getBookingByID(booking.id);
                if (!foundBooking) {
                    res.status(400).json({ message: 'Booking does not exist' });
                    return;
                }
                if (booking.departure > booking.arrival) {
                    res.status(400).json({ message: 'Departure date must be before arrival date' });
                    return;
                }
                const vehicle = yield vehicle_1.default.get(booking.vehicle_registration_number);
                if (!vehicle) {
                    res.status(400).json({ message: 'Vehicle does not exist' });
                    return;
                }
                foundBooking.vehicle_registration_number = booking.vehicle_registration_number;
                foundBooking.space = booking.space;
                foundBooking.booked_from = booking.booked_from;
                foundBooking.booked_until = booking.booked_until;
                const foundExtra = yield extra_1.default.get(booking.id);
                if (foundExtra) {
                    foundExtra.mini_valet = extra.mini_valet || foundExtra.mini_valet;
                    foundExtra.full_valet = extra.full_valet || foundExtra.mini_valet;
                    foundExtra.signature_valet = extra.signature_valet || foundExtra.mini_valet;
                    yield extra_1.default.update(foundExtra);
                }
                yield booking_1.default.update(foundBooking, booking.id);
                res.status(200).json({ message: 'Booking updated successfully' });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Deletes a booking.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static deleteBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date_booked } = req.body;
            try {
                const booking = yield booking_1.default.get(date_booked);
                if (!booking) {
                    res.status(400).json({ message: 'Booking does not exist' });
                    return;
                }
                yield booking_1.default.delete(date_booked);
                const bookings = yield booking_1.default.getAll();
                res.status(200).json({
                    message: 'Booking deleted successfully',
                    bookings
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves a booking by ID.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static findBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { booking_id } = req.body;
            try {
                const booking = yield booking_1.default.getBookingByID(booking_id);
                if (!booking) {
                    res.status(400).json({ message: 'Booking does not exist' });
                    return;
                }
                let refund = 0;
                if (booking.date_booked.getTime() - new Date().getTime() > 48 * 60 * 60 * 1000) {
                    refund = booking.cost;
                }
                else if (booking.date_booked.getTime() - new Date().getTime() > 24 * 60 * 60 * 1000) {
                    refund = booking.cost / 2;
                }
                const extra = yield extra_1.default.get(booking_id);
                res.status(200).json({
                    booking,
                    refund,
                    extra
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Retrieves a booking details from its ID.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static fetchBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, vehicle_registration } = req.body;
            try {
                const user = yield user_1.default.findByID(user_id);
                if (!user) {
                    res.status(400).json({ message: 'User does not exist' });
                    return;
                }
                const vehicle = yield vehicle_1.default.get(vehicle_registration);
                if (!vehicle) {
                    res.status(400).json({ message: 'Vehicle does not exist' });
                    return;
                }
                const person = yield person_1.default.getByUserID(user_id);
                const business = yield business_1.default.getByUserID(user_id);
                res.status(200).json({
                    user,
                    person,
                    business,
                    vehicle
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = BookingService;
