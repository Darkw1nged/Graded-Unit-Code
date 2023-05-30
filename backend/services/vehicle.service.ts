import { Request, Response } from 'express';
import Vehicle from '../models/vehicle';
import User from '../models/user';

class VehicleService {
    /**
     * Retrieves all vehicles.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getVehicles(req: Request, res: Response) {
        try {
            const vehicles = await Vehicle.getAll();
            res.status(200).json(vehicles);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    /**
     * Retrieves vehicles associated with a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async getUserVehicles(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const vehicles = await Vehicle.getAllByUserID(user_id);
            res.status(200).json(vehicles);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Adds a new vehicle for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async addVehicle(req: Request, res: Response) {
        const { vehicle, email } = req.body;

        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const newVehicle = new Vehicle(vehicle.registration_number, user_id, vehicle.make, vehicle.model, vehicle.colour);
            await Vehicle.create(newVehicle);

            const vehicles = await Vehicle.getAllByUserID(user_id);
            res.status(200).json({
                message: 'Vehicle added successfully',
                vehicles
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Updates a vehicle for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async updateVehicle(req: Request, res: Response) {
        const { vehicle, email } = req.body;

        try {
            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const newVehicle = new Vehicle(vehicle.registration_number, user_id, vehicle.make, vehicle.model, vehicle.colour);
            await Vehicle.update(newVehicle);

            const vehicles = await Vehicle.getAllByUserID(user_id);

            res.status(200).json({
                message: 'Vehicle updated successfully',
                vehicles
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Deletes a vehicle for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async deleteVehicle(req: Request, res: Response) {
        const { registration_number, email } = req.body;

        try {
            await Vehicle.delete(registration_number);

            const user_id = await User.getUserID(email);
            if (!user_id) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const vehicles = await Vehicle.getAllByUserID(user_id);

            res.status(200).json({
                message: 'Vehicle deleted successfully',
                vehicles
            });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Finds a vehicle by its registration number.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static async findVehicle(req: Request, res: Response) {
        const { registration_number } = req.body;

        try {
            const vehicle = await Vehicle.get(registration_number);
            if (!vehicle) {
                res.status(404).json({ message: 'Vehicle not found' });
                return;
            }
            res.status(200).json(vehicle);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default VehicleService;