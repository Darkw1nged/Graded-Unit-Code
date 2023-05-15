import { getConnection } from '../database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';

export class VehicleDAO {

    async create(vehicle: Vehicle, userEmail: string): Promise<void> {
        const connection = await getConnection() as PoolConnection;
        try {
            await connection.execute(`
                INSERT INTO vehicles (registration, userEmail, make, model, colour)
                VALUES (?, ?, ?, ?, ?)
            `, [vehicle.getRegistration(), userEmail, vehicle.getMake(), vehicle.getModel(), vehicle.getColour()]);
        } catch (err) {
            console.log('Error saving vehicle', err);
        } finally {
            connection.release();
        }
    }

    async update(vehicle: Vehicle): Promise<void> {
        const connection = await getConnection() as PoolConnection;
        try {
            await connection.execute(`
                UPDATE vehicles SET make = ?, model = ?, colour = ? WHERE registration = ?
            `, [vehicle.getMake(), vehicle.getModel(), vehicle.getColour(), vehicle.getRegistration()]);
        } catch (err) {
            console.log('Error updating vehicle', err);
        } finally {
            connection.release();
        }
    }

    async delete(registration: string): Promise<void> {
        const connection = await getConnection() as PoolConnection;
        try {
            await connection.execute(`
                DELETE FROM vehicles WHERE registration = ?
            `, [registration]);
        } catch (err) {
            console.log('Error deleting vehicle', err);
        } finally {
            connection.release();
        }
    }

    async get(registration: string): Promise<Vehicle | null> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM vehicles WHERE registration = ?
            `, [registration]);
            return new Vehicle(rows[0].registration, rows[0].make, rows[0].model, rows[0].colour);
        } catch (err) {
            console.log('Error getting vehicle', err);
        } finally {
            connection.release();
        }
        return null;
    }

    async getAll(): Promise<Vehicle[] | []> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM vehicles
            `);
            const vehicles: Vehicle[] = [];
            for (const row of rows) {
                vehicles.push(new Vehicle(row.registration, row.make, row.model, row.colour));
            }
            return vehicles;
        } catch (err) {
            console.log('Error getting vehicles', err);
        } finally {
            connection.release();
        }
        return [];
    }

    async getAllByUser(userEmail: string): Promise<Vehicle[] | []> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM vehicles WHERE userEmail = ?
            `, [userEmail]);
            const vehicles: Vehicle[] = [];
            for (const row of rows) {
                vehicles.push(new Vehicle(row.registration, row.make, row.model, row.colour));
            }
            return vehicles;
        } catch (err) {
            console.log('Error getting vehicles', err);
        } finally {
            connection.release();
        }
        return [];
    }

}

export default class Vehicle {

    registration: string;
    make: string;
    model: string;
    colour: string;

    constructor(registration: string, make: string, model: string, colour: string) {
        this.registration = registration;
        this.make = make;
        this.model = model;
        this.colour = colour;
    }

    getRegistration(): string {
        return this.registration;
    }

    setRegistration(registration: string) {
        this.registration = registration;
    }

    getMake(): string {
        return this.make;
    }

    setMake(make: string) {
        this.make = make;
    }

    getModel(): string {
        return this.model;
    }

    setModel(model: string) {
        this.model = model;
    }

    getColour(): string {
        return this.colour;
    }

    setColour(colour: string) {
        this.colour = colour;
    }

    async create(userEmail: string): Promise<void> {
        const vehicleDAO = new VehicleDAO();
        await vehicleDAO.create(this, userEmail);
    }
    
    async update(): Promise<void> {
        const vehicleDAO = new VehicleDAO();
        await vehicleDAO.update(this);
    }
    
    async delete(): Promise<void> {
        const vehicleDAO = new VehicleDAO();
        await vehicleDAO.delete(this.registration);
    }
    
    static async get(registration: string): Promise<Vehicle | null> {
        const vehicleDAO = new VehicleDAO();
        return await vehicleDAO.get(registration);
    }
    
    static async getAll(): Promise<Vehicle[] | []> {
        const vehicleDAO = new VehicleDAO();
        return await vehicleDAO.getAll();
    }

    static async getAllByEmail(email: string): Promise<Vehicle[] | []> {
        const vehicleDAO = new VehicleDAO();
        return await vehicleDAO.getAllByUser(email);
    }

}