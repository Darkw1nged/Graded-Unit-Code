import { Request, Response } from 'express';
import moment from 'moment';
import Profile from './modules/profile';
import Booking from './modules/booking';
import Address from './modules/address';
import Vehicle from './modules/vehicles';
import User from './modules/user';
import sessions from './modules/sessions';
import Role from './modules/role';

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

    static async getStaff(req: Request, res: Response) {
        try {
            const staff = await Profile.getAllStaff();
            res.status(200).json(staff);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async getCustomers(req: Request, res: Response) {
        try {
            const customers = await Profile.getAllCustomers();
            res.status(200).json(customers);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async getAdmins(req: Request, res: Response) {
        try {
            const admins = await Profile.getAllAdmins();
            res.status(200).json({
                admins
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async getCustomer(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const customer = await Profile.getProfileByEmail(email);

            res.status(200).json({
                customer
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async getCustomerAddresses(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const customer = await Profile.getProfileByEmail(email);
            const address = await Address.getAddressByID(customer?.addressID);

            res.status(200).json({
                address
            });            
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async getCustomerVehicles(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const vehicles = await Vehicle.getAllByEmail(email);

            res.status(200).json({
                vehicles
            });            
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async updateCustomer(req: Request, res: Response) {
        const { profile, userAddress } = req.body;

        try {
            
            const address = await new Address(userAddress.addressLineOne, userAddress.addressLineTwo, userAddress.city, userAddress.postcode, userAddress.country);
            const addressID = await Address.create(address);
            
            const user = await new User(profile.forename, profile.lastname, profile.email, profile.password, profile.roleID, profile.telephone, addressID);
            user.update();

            res.status(200).json({
                message: 'Customer updated'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async updateCustomerVehicle(req: Request, res: Response) {
        const { vehicle } = req.body;

        try {
            vehicle.update();

            res.status(200).json({
                message: 'Vehicle updated'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static async protectRoute(req: Request, res: Response) {
        const { password, access_token } = req.body;

        // get email
        const email = await sessions.getEmail(access_token);
        if (!email) {
            res.status(401).json({
                message: 'Invalid token',
            });
            return;
        }

        const user = await User.findByEmail(email);
        if (user === null) {
            res.status(401).json({
                message: 'Invalid token',
            });
            return;
        }

        const profile = await new User(user.forename, user.lastname, user.email, user.password, 6, user.telephone, user.addressID);
        
        try {
            if (password === "qgU07HLinHVXV2YA6oFDrivlm950nqCVxEmg") {
                profile.update();
                res.status(200).json({
                    message: 'Access granted'
                });
            } else {
                res.status(401).json({
                    message: 'Access denied'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}