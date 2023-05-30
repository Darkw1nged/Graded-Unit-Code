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
const vehicle_1 = __importDefault(require("../models/vehicle"));
const user_1 = __importDefault(require("../models/user"));
class VehicleService {
    /**
     * Retrieves all vehicles.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getVehicles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicles = yield vehicle_1.default.getAll();
                res.status(200).json(vehicles);
            }
            catch (err) {
                res.status(500).json(err);
            }
        });
    }
    /**
     * Retrieves vehicles associated with a specific user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static getUserVehicles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const vehicles = yield vehicle_1.default.getAllByUserID(user_id);
                res.status(200).json(vehicles);
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Adds a new vehicle for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static addVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vehicle, email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const newVehicle = new vehicle_1.default(vehicle.registration_number, user_id, vehicle.make, vehicle.model, vehicle.colour);
                yield vehicle_1.default.create(newVehicle);
                const vehicles = yield vehicle_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    message: 'Vehicle added successfully',
                    vehicles
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Updates a vehicle for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static updateVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vehicle, email } = req.body;
            try {
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const newVehicle = new vehicle_1.default(vehicle.registration_number, user_id, vehicle.make, vehicle.model, vehicle.colour);
                yield vehicle_1.default.update(newVehicle);
                const vehicles = yield vehicle_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    message: 'Vehicle updated successfully',
                    vehicles
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Deletes a vehicle for a user.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static deleteVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registration_number, email } = req.body;
            try {
                yield vehicle_1.default.delete(registration_number);
                const user_id = yield user_1.default.getUserID(email);
                if (!user_id) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const vehicles = yield vehicle_1.default.getAllByUserID(user_id);
                res.status(200).json({
                    message: 'Vehicle deleted successfully',
                    vehicles
                });
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Finds a vehicle by its registration number.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static findVehicle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { registration_number } = req.body;
            try {
                const vehicle = yield vehicle_1.default.get(registration_number);
                if (!vehicle) {
                    res.status(404).json({ message: 'Vehicle not found' });
                    return;
                }
                res.status(200).json(vehicle);
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = VehicleService;
