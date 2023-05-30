import { Request, Response } from 'express';
import Booking from '../models/booking';
import User from '../models/user';
import Payment from '../models/payment';
import Person from '../models/person';
import Business from '../models/business';
import Extra from '../models/extra';
import Discount from '../models/discount';
import Vehicle from '../models/vehicle';
import * as Sender from '../utils/email.connector';

class BookingService {

    /**
     * Retrieves all bookings.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getBookings(req: Request, res: Response) {
        try {
            const bookings = await Booking.getAll();
            res.status(200).json({ bookings });
        } catch (err) {
            res.status(500).json(err);
        }
    }

    /**
     * Retrieves bookings for a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getUserBookings(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const bookings = await Booking.getAllByUserID(user_id);
            res.status(200).json(bookings);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Searches for bookings within a given time range.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async searchBookings(req: Request, res: Response) {
        const { departureTime, arrivalTime } = req.body;
        try {
            const bookings = await Booking.searchBookings(departureTime, arrivalTime);
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
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Creates a new booking.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async createBooking(req: Request, res: Response) {
        const { space, departureTime, arrivalTime, user, person, business, card, vehicle, extra, discount, isLoggedIn, cost, cash } = req.body;

        try {
            if (departureTime === undefined || arrivalTime === undefined) {
                res.status(400).json({ message: 'Departure time or arrival time was not provided.' });
                return;
            }
            const departure = new Date(departureTime);
            const arrival = new Date(arrivalTime);

            let user_id = await User.getUserID(user.email);
            const password = Math.random().toString(36).slice(-13) + Math.random().toString(36).slice(-13);
            if (!user_id) {
                const newUser = new User(user.email, password, 'person', undefined, user.telephone, user.addressLineOne,
                    user.addressLineTwo, user.city, '', user.zip, user.country);
                await User.create(newUser);

                user_id = await User.getUserID(user.email);
                if (!user_id) {
                    res.status(400).json({ message: 'Internal server error' });
                    return;
                }

                if (person === undefined && business === undefined) {
                    res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                    return;
                }

                const newPerson = new Person(user_id, person.forename, person.surname);
                await Person.create(newPerson);

                const personID = await Person.getByUserID(user_id);
                if (!personID) {
                    res.status(400).json({ message: 'Internal server error' });
                    console.log('Person not created in createBooking');
                    return;
                }
            } else if (user_id && !isLoggedIn) {
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
            } else if (business !== undefined) {
                if (business.name === '') {
                    res.status(400).json({ message: 'Personal details were not entered conrrectly' });
                    return;
                }
            }

            if (!cash) {
                if (card === undefined) {
                    res.status(400).json({ message: 'Card details were not entered correctly' });
                    return;
                }

                const payment = await Payment.get(card.cvv);
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

            const booking = new Booking(user_id, vehicle.registration_number, space, new Date(), departure, arrival, cost, false);
            const booking_id = await Booking.create(booking);
            if (!booking_id) {
                res.status(400).json({ message: 'Internal server error' });
                return;
            }

            const newExtra = new Extra(booking_id, extra.mini_valet, extra.full_valet, extra.signature_valet);
            const extra_id = await Extra.create(newExtra);
            if (!extra_id) {
                res.status(400).json({ message: 'Internal server error' });
                return;
            }

            booking.extras_id = extra_id;
            Booking.update(booking, booking_id);

            const discount_id = await Discount.getDiscountID(discount);
            if (discount_id) {
                booking.discount_id = discount_id;
                Booking.update(booking, booking_id);
            }

            Sender.sendEmail(user.email, 'We recieved your booking', 'Thank you for booking with us. We will be in touch shortly to confirm your booking.');
            res.status(200).json({
                message: 'Booking created successfully',
                booking_id
            });

            if (isLoggedIn) {
                const newUser = new User(user.email, user.password, user.role, user.remember_token, user.telephone,
                    user.addressLineOne, user.addressLineTwo, user.city, '', user.zip, user.country);
                await User.update(newUser);

                if (person) {
                    const newPerson = new Person(user_id, person.forename, person.surname);
                    await Person.update(newPerson, newUser.email);
                } else if (business) {
                    const newBusiness = new Business(user_id, business.name);
                    await Business.update(newBusiness, newUser.email);
                }

                if (!cash) {
                    const card_id = await Payment.get(card.cvv);
                    if (!card_id) {
                        const newCard = new Payment(user_id, card.cardholder_name, card.card_number, card.expiry_date, card.cvv);
                        await Payment.create(newCard);
                    }
                }

                const vehicle_id = await Vehicle.get(vehicle.registration_number);
                if (!vehicle_id) {
                    const newVehicle = new Vehicle(vehicle.registration_number, user_id, vehicle.make, vehicle.model, vehicle.colour);
                    await Vehicle.create(newVehicle);
                }
            } else {
                Sender.sendEmail(user.email, 'Welcome to ParkEasy', 'Thank you again for making a booking with us! Here is your temporery password' + password + ', go to http:localhost:3000/account/login and enter in the email and the password provided to make changes to your booking!.');
            }


        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates an existing booking.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async updateBooking(req: Request, res: Response) {
        const { booking, extra } = req.body;
        try {
            const foundBooking = await Booking.getBookingByID(booking.id);
            if (!foundBooking) {
                res.status(400).json({ message: 'Booking does not exist' });
                return;
            }

            if (booking.departure > booking.arrival) {
                res.status(400).json({ message: 'Departure date must be before arrival date' });
                return;
            }

            const vehicle = await Vehicle.get(booking.vehicle_registration_number);
            if (!vehicle) {
                res.status(400).json({ message: 'Vehicle does not exist' });
                return;
            }

            foundBooking.vehicle_registration_number = booking.vehicle_registration_number;
            foundBooking.space = booking.space;
            foundBooking.booked_from = booking.booked_from;
            foundBooking.booked_until = booking.booked_until;

            const foundExtra = await Extra.get(booking.id)
            if (foundExtra) {
                foundExtra.mini_valet = extra.mini_valet || foundExtra.mini_valet;
                foundExtra.full_valet = extra.full_valet || foundExtra.mini_valet;
                foundExtra.signature_valet = extra.signature_valet || foundExtra.mini_valet;
                await Extra.update(foundExtra);
            }

            await Booking.update(foundBooking, booking.id);
            res.status(200).json({ message: 'Booking updated successfully' });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Marks a booking as paid.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async markAsPaid(req: Request, res: Response) {
        const { email, booking_id } = req.body;
        try {
            const booking = await Booking.getBookingByID(booking_id);
            if (!booking) {
                res.status(400).json({ message: 'Booking does not exist' });
                return;
            }


            booking.paid = true;
            await Booking.update(booking, booking_id);

            await Sender.sendEmail(email, 'Recieved Payment', `Thank you for your payment. Your booking has been confirmed.`);
            res.status(200).json({ message: 'Booking marked as paid' });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Deletes a booking.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async deleteBooking(req: Request, res: Response) {
        const { date_booked } = req.body;
        try {
            const booking = await Booking.get(date_booked);
            if (!booking) {
                res.status(400).json({ message: 'Booking does not exist' });
                return;
            }
            await Booking.delete(date_booked);

            const bookings = await Booking.getAll();
            res.status(200).json({
                message: 'Booking deleted successfully',
                bookings
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves a booking by ID.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async findBooking(req: Request, res: Response) {
        const { booking_id } = req.body;
        try {
            const booking = await Booking.getBookingByID(booking_id);
            if (!booking) {
                res.status(400).json({ message: 'Booking does not exist' });
                return;
            }

            let refund = 0;
            if (booking.date_booked.getTime() - new Date().getTime() > 48 * 60 * 60 * 1000) {
                refund = booking.cost;
            } else if (booking.date_booked.getTime() - new Date().getTime() > 24 * 60 * 60 * 1000) {
                refund = booking.cost / 2;
            }

            const extra = await Extra.get(booking_id);

            res.status(200).json({
                booking,
                refund,
                extra
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Retrieves a booking details from its ID.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async fetchBookingDetails(req: Request, res: Response) {
        const { user_id, vehicle_registration } = req.body;
        try {
            const user = await User.findByID(user_id);
            if (!user) {
                res.status(400).json({ message: 'User does not exist' });
                return;
            }

            const vehicle = await Vehicle.get(vehicle_registration);
            if (!vehicle) {
                res.status(400).json({ message: 'Vehicle does not exist' });
                return;
            }

            const person = await Person.getByUserID(user_id);
            const business = await Business.getByUserID(user_id);

            res.status(200).json({
                user,
                person,
                business,
                vehicle
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default BookingService;