import * as MySqlConnector from '../utils/mysql.connector';
import { OkPacket, RowDataPacket } from 'mysql2';

/**
 * Represents a Vehicle Data Access Object (DAO) for interacting with the database.
 */
class VehicleDAO {
    /**
     * Retrieves a vehicle by its registration number.
     * @param {string} registration_number - The registration number of the vehicle.
     * @returns {Promise<Vehicle | null>} A Promise that resolves to the found Vehicle object or null if not found.
     */
    async get(registration_number: string): Promise<Vehicle | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM vehicles WHERE registration_number = ?',
                [registration_number]
            );
            return rows[0] as Vehicle;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all vehicles from the database.
     * @returns {Promise<Vehicle[] | null>} A Promise that resolves to an array of Vehicle objects or null if none found.
     */
    async getAll(): Promise<Vehicle[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM vehicles');
            return rows as Vehicle[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all vehicles associated with a specific user.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Vehicle[] | null>} A Promise that resolves to an array of Vehicle objects or null if none found.
     */
    async getAllByUserID(user_id: number): Promise<Vehicle[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM vehicles WHERE user_id = ?', [user_id]);
            return rows as Vehicle[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Creates a new vehicle in the database.
     * @param {Vehicle} vehicle - The Vehicle object to create.
     * @returns {Promise<void>} A Promise that resolves once the vehicle is created.
     */
    async create(vehicle: Vehicle): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>(
                'INSERT INTO vehicles (registration_number, user_id, make, model, colour) VALUES (?, ?, ?, ?, ?)',
                [
                    vehicle.getRegistrationNumber(),
                    vehicle.getUserID(),
                    vehicle.getMake(),
                    vehicle.getModel(),
                    vehicle.getColour(),
                ]
            );

            console.log('[Server]: vehicle created, ', vehicle.registration_number);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Updates an existing vehicle in the database.
     * @param {Vehicle} vehicle - The Vehicle object to update.
     * @returns {Promise<void>} A Promise that resolves once the vehicle is updated.
     */
    async update(vehicle: Vehicle): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>(
                'UPDATE vehicles SET make = ?, model = ?, colour = ? WHERE registration_number = ?',
                [vehicle.make, vehicle.model, vehicle.colour, vehicle.registration_number]
            );

            console.log('[Server]: vehicle updated, ', vehicle.registration_number);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Deletes a vehicle from the database based on its registration number.
     * @param {string} registration_number - The registration number of the vehicle to delete.
     * @returns {Promise<void>} A Promise that resolves once the vehicle is deleted.
     */
    async delete(registration_number: string): Promise<void> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('DELETE FROM vehicles WHERE registration_number = ?', [
                registration_number,
            ]);

            console.log('[Server]: vehicle deleted, ', registration_number);
        } catch (error) {
            console.log(error);
        }
    }
}

/**
 * Represents a Vehicle.
 */
class Vehicle {
    registration_number: string;
    user_id: number;
    make: string;
    model: string;
    colour: string;

    /**
     * Constructs a new Vehicle object.
     * @param {string} registration_number - The registration number of the vehicle.
     * @param {number} user_id - The ID of the user associated with the vehicle.
     * @param {string} make - The make of the vehicle.
     * @param {string} model - The model of the vehicle.
     * @param {string} colour - The color of the vehicle.
     */
    constructor(registration_number: string, user_id: number, make: string, model: string, colour: string) {
        this.registration_number = registration_number;
        this.user_id = user_id;
        this.make = make;
        this.model = model;
        this.colour = colour;
    }

    /**
     * Retrieves the registration number of the vehicle.
     * @returns {string} The registration number.
     */
    getRegistrationNumber(): string {
        return this.registration_number;
    }

    /**
     * Retrieves the user ID associated with the vehicle.
     * @returns {number} The user ID.
     */
    getUserID(): number {
        return this.user_id;
    }

    /**
     * Retrieves the make of the vehicle.
     * @returns {string} The make.
     */
    getMake(): string {
        return this.make;
    }

    /**
     * Retrieves the model of the vehicle.
     * @returns {string} The model.
     */
    getModel(): string {
        return this.model;
    }

    /**
     * Retrieves the color of the vehicle.
     * @returns {string} The color.
     */
    getColour(): string {
        return this.colour;
    }

    /**
     * Sets the registration number of the vehicle.
     * @param {string} registration_number - The registration number to set.
     */
    setRegistrationNumber(registration_number: string): void {
        this.registration_number = registration_number;
    }

    /**
     * Sets the user ID associated with the vehicle.
     * @param {number} user_id - The user ID to set.
     */
    setUserID(user_id: number): void {
        this.user_id = user_id;
    }

    /**
     * Sets the make of the vehicle.
     * @param {string} make - The make to set.
     */
    setMake(make: string): void {
        this.make = make;
    }

    /**
     * Sets the model of the vehicle.
     * @param {string} model - The model to set.
     */
    setModel(model: string): void {
        this.model = model;
    }

    /**
     * Sets the color of the vehicle.
     * @param {string} colour - The color to set.
     */
    setColour(colour: string): void {
        this.colour = colour;
    }

    /**
     * Retrieves a vehicle by its registration number.
     * @param {string} registration_number - The registration number of the vehicle.
     * @returns {Promise<Vehicle | null>} A Promise that resolves to the found Vehicle object or null if not found.
     */
    static async get(registration_number: string): Promise<Vehicle | null> {
        return await new VehicleDAO().get(registration_number);
    }

    /**
     * Retrieves all vehicles from the database.
     * @returns {Promise<Vehicle[] | null>} A Promise that resolves to an array of Vehicle objects or null if none found.
     */
    static async getAll(): Promise<Vehicle[] | null> {
        return await new VehicleDAO().getAll();
    }

    /**
     * Retrieves all vehicles associated with a specific user.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Vehicle[] | null>} A Promise that resolves to an array of Vehicle objects or null if none found.
     */
    static async getAllByUserID(user_id: number): Promise<Vehicle[] | null> {
        return await new VehicleDAO().getAllByUserID(user_id);
    }

    /**
     * Creates a new vehicle in the database.
     * @param {Vehicle} vehicle - The Vehicle object to create.
     * @returns {Promise<void>} A Promise that resolves once the vehicle is created.
     */
    static async create(vehicle: Vehicle): Promise<void> {
        await new VehicleDAO().create(vehicle);
    }

    /**
     * Updates an existing vehicle in the database.
     * @param {Vehicle} vehicle - The Vehicle object to update.
     * @returns {Promise<void>} A Promise that resolves once the vehicle is updated.
     */
    static async update(vehicle: Vehicle): Promise<void> {
        await new VehicleDAO().update(vehicle);
    }

    /**
     * Deletes a vehicle from the database based on its registration number.
     * @param {string} registration_number - The registration number of the vehicle to delete.
     * @returns {Promise<void>} A Promise that resolves once the vehicle is deleted.
     */
    static async delete(registration_number: string): Promise<void> {
        await new VehicleDAO().delete(registration_number);
    }
}

export default Vehicle;