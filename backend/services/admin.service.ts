import { Request, Response } from 'express';
import User from '../models/user';
import Booking from '../models/booking';

/**
 * Service class for administrative operations.
 */
class AdminService {

    /**
     * Handles the protected route for administrative access.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static async protectedRoute(req: Request, res: Response) {
        const { password, email } = req.body;
        try {
            const user = await User.findByEmail(email);

            // Check if the user exists
            if (user === undefined || user === null) {
                res.status(401).json({
                    message: 'Invalid token',
                });
                return;
            }

            // Grant access if the password matches
            if (password === "qgU07HLinHVXV2YA6oFDrivlm950nqCVxEmg") {
                user.role = 'admin';
                await User.update(user);

                res.status(200).json({
                    message: 'Access granted'
                });
            } else {
                // Deny access if the password doesn't match
                res.status(401).json({
                    message: 'Access denied'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    /**
     * Retrieves statistics based on a specific date.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static async getStatistics(req: Request, res: Response) {
        const { date } = req.body;
        try {
            const startOfMonth = new Date(date);
            startOfMonth.setDate(1);
            const endOfMonth = new Date(date);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            endOfMonth.setDate(1);

            // Retrieve users between the start and end of the month
            const users = await User.getUsersBetweenDate(startOfMonth, endOfMonth);

            // Filter out deleted users
            const filteredUsers = await Promise.all(users.map(async (user) => {
                const deleted: boolean = await User.isDeleted(user.email);
                return deleted ? null : user;
            }));

            // Remove null values from the filtered users array
            const updatedUsers = filteredUsers.filter(user => user !== null);

            // Retrieve bookings between the start and end of the month
            const bookings = await Booking.getBookingsBetweenDates(startOfMonth, endOfMonth) as Booking[];

            // Calculate total sales
            const sales = bookings.reduce((total, booking) => total + parseInt(booking.cost.toString()), 0);

            res.status(200).json({
                users: updatedUsers.length,
                bookings: bookings.length,
                sales: sales,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    /**
     * Retrieves the daily bookings report.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static async getDailyBookingsReport(req: Request, res: Response) {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Retrieve bookings between the start and end of the day
            const bookings = await Booking.getBookingsBetweenDates(startOfDay, endOfDay) as Booking[];

            // Calculate total sales
            const sales = bookings.reduce((total, booking) => total + booking.cost, 0);

            res.status(200).json({
                bookings: bookings,
                sales: sales,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    /**
     * Retrieves the monthly booking report.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static async getMonthlyBookingReport(req: Request, res: Response) {
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endOfMonth = new Date();
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            endOfMonth.setDate(1);
            endOfMonth.setHours(23, 59, 59, 999);

            // Retrieve bookings between the start and end of the month
            const bookings = await Booking.getBookingsBetweenDates(startOfMonth, endOfMonth) as Booking[];

            // Calculate total sales
            const sales = bookings.reduce((total, booking) => total + booking.cost, 0);

            res.status(200).json({
                bookings: bookings,
                sales: sales,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default AdminService;