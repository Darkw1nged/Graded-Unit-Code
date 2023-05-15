import { Request, Response } from 'express';
import moment from 'moment';
import Profile from './modules/profile';
import Booking from './modules/booking';

export default class AccountService {

    static async getStatistics(req: Request, res: Response) {
        try {
            const startOfMonth = moment().startOf('month').toDate();
            const endOfMonth = moment().endOf('month').toDate();

            const members = await Profile.getAllProfilesByDate(startOfMonth, endOfMonth);
            const totalMembers = members.length;

            const bookings = await Booking.getBookingsByDate(startOfMonth, endOfMonth);
            const totalBookings = bookings.length;
            const totalRevenue = bookings.reduce((total, booking) => total + booking.cost, 0);

            res.status(200).json({
                members: totalMembers,
                bookings: totalBookings,
                sales: totalRevenue
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async getUsers(req: Request, res: Response) {
        try {
            const users = await Profile.getAllProfiles();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

}