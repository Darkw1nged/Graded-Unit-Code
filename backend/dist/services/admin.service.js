"use strict";
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
const user_1 = __importDefault(require("../models/user"));
const booking_1 = __importDefault(require("../models/booking"));
/**
 * Service class for administrative operations.
 */
class AdminService {
    /**
     * Handles the protected route for administrative access.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static protectedRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email } = req.body;
            try {
                const user = yield user_1.default.findByEmail(email);
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
                    yield user_1.default.update(user);
                    res.status(200).json({
                        message: 'Access granted'
                    });
                }
                else {
                    // Deny access if the password doesn't match
                    res.status(401).json({
                        message: 'Access denied'
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    /**
     * Retrieves statistics based on a specific date.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static getStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { date } = req.body;
            try {
                const startOfMonth = new Date(date);
                startOfMonth.setDate(1);
                const endOfMonth = new Date(date);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                endOfMonth.setDate(1);
                // Retrieve users between the start and end of the month
                const users = yield user_1.default.getUsersBetweenDate(startOfMonth, endOfMonth);
                // Filter out deleted users
                const filteredUsers = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const deleted = yield user_1.default.isDeleted(user.email);
                    return deleted ? null : user;
                })));
                // Remove null values from the filtered users array
                const updatedUsers = filteredUsers.filter(user => user !== null);
                // Retrieve bookings between the start and end of the month
                const bookings = yield booking_1.default.getBookingsBetweenDates(startOfMonth, endOfMonth);
                // Calculate total sales
                const sales = bookings.reduce((total, booking) => total + booking.cost, 0);
                res.status(200).json({
                    users: updatedUsers.length,
                    bookings: bookings.length,
                    sales: sales,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    /**
     * Retrieves the daily bookings report.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static getDailyBookingsReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                // Retrieve bookings between the start and end of the day
                const bookings = yield booking_1.default.getBookingsBetweenDates(startOfDay, endOfDay);
                // Calculate total sales
                const sales = bookings.reduce((total, booking) => total + booking.cost, 0);
                res.status(200).json({
                    bookings: bookings,
                    sales: sales,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    /**
     * Retrieves the monthly booking report.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     */
    static getMonthlyBookingReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);
                const endOfMonth = new Date();
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                endOfMonth.setDate(1);
                endOfMonth.setHours(23, 59, 59, 999);
                // Retrieve bookings between the start and end of the month
                const bookings = yield booking_1.default.getBookingsBetweenDates(startOfMonth, endOfMonth);
                // Calculate total sales
                const sales = bookings.reduce((total, booking) => total + booking.cost, 0);
                res.status(200).json({
                    bookings: bookings,
                    sales: sales,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.default = AdminService;
