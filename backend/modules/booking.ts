import { getConnection } from '../database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';

export class BookingDAO {

    async save(booking: Booking): Promise<void> {
        const connection = await getConnection() as PoolConnection;
        try {
            await connection.execute(`
                INSERT INTO bookings (spaceNumber, dateBooked, bookedFrom, bookedTo, carService, carValet, discount, cost, isCancelled)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [booking.getSpaceNumber(), booking.getDateBooked(), booking.getBookedFrom(), booking.getBookedTo(), booking.getCarService(), booking.getCarValet(), booking.getDiscount(), booking.getCost(), booking.getIsCancelled()]);
        } catch (err) {
            console.log('Error saving booking', err);
        } finally {
            connection.release();
        }
    }

    async update(booking: Booking): Promise<void> {
        const connection = await getConnection() as PoolConnection;
        try {
            await connection.execute(`
                UPDATE bookings SET spaceNumber = ?, dateBooked = ?, bookedFrom = ?, bookedTo = ?, carService = ?, carValet = ?, discount = ?, cost = ?, isCancelled = ? WHERE bookingID = ?
            `, [booking.getSpaceNumber(), booking.getDateBooked(), booking.getBookedFrom(), booking.getBookedTo(), booking.getCarService(), booking.getCarValet(), booking.getDiscount(), booking.getCost(), booking.getIsCancelled()]);
        } catch (err) {
            console.log('Error updating booking', err);
        } finally {
            connection.release();
        }
    }

    async delete(bookingID: number): Promise<void> {
        const connection = await getConnection() as PoolConnection;
        try {
            await connection.execute(`
                DELETE FROM bookings WHERE bookingID = ?
            `, [bookingID]);
        } catch (err) {
            console.log('Error deleting booking', err);
        } finally {
            connection.release();
        }
    }

    async get(bookingID: number): Promise<Booking | null> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM bookings WHERE bookingID = ?
            `, [bookingID]);
            return new Booking(rows[0].spaceNumber, rows[0].dateBooked, rows[0].bookedFrom, rows[0].bookedTo, rows[0].carService, rows[0].carValet, rows[0].discount, rows[0].cost, rows[0].isCancelled);
        } catch (err) {
            console.log('Error getting booking', err);
        } finally {
            connection.release();
        }
        return null;
    }

    async getAll(): Promise<Booking[]> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM bookings
            `);
            const bookings: Booking[] = [];
            rows.forEach(row => {
                bookings.push(new Booking(row.spaceNumber, row.dateBooked, row.bookedFrom, row.bookedTo, row.carService, row.carValet, row.discount, row.cost, row.isCancelled));
            });
            return bookings;
        } catch (err) {
            console.log('Error getting bookings', err);
        } finally {
            connection.release();
        }
        return [];
    }

    async getBookingsByUser(userEmail: string): Promise<Booking[]> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM bookings WHERE userEmail = ?
            `, [userEmail]);
            const bookings: Booking[] = [];
            rows.forEach(row => {
                bookings.push(new Booking(row.spaceNumber, row.dateBooked, row.bookedFrom, row.bookedTo, row.carService, row.carValet, row.discount, row.cost, row.isCancelled));
            });
            return bookings;
        } catch (err) {
            console.log('Error getting bookings', err);
        } finally {
            connection.release();
        }
        return [];
    }

    async getBookingsByVehicle(registration: string): Promise<Booking[]> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM bookings WHERE registration = ?
            `, [registration]);
            const bookings: Booking[] = [];
            rows.forEach(row => {
                bookings.push(new Booking(row.spaceNumber, row.dateBooked, row.bookedFrom, row.bookedTo, row.carService, row.carValet, row.discount, row.cost, row.isCancelled));
            });
            return bookings;
        } catch (err) {
            console.log('Error getting bookings', err);
        } finally {
            connection.release();
        }
        return [];
    }

    async getBookingsByDate(start: Date, end: Date): Promise<Booking[]> {
        const connection = await getConnection() as PoolConnection;
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(`
                SELECT * FROM bookings WHERE bookedFrom >= ? AND bookedTo <= ?
            `, [start, end]);
            const bookings: Booking[] = [];
            rows.forEach(row => {
                bookings.push(new Booking(row.spaceNumber, row.dateBooked, row.bookedFrom, row.bookedTo, row.carService, row.carValet, row.discount, row.cost, row.isCancelled));
            });
            return bookings;
        } catch (err) {
            console.log('Error getting bookings', err);
        } finally {
            connection.release();
        }
        return [];
    }

}

export default class Booking {

    spaceNumber: number;
    dateBooked: Date;
    bookedFrom: Date;
    bookedTo: Date;
    carService: boolean;
    carValet: boolean;
    discount?: number;
    cost: number;
    isCancelled: boolean;


    constructor(
        spaceNumber: number,
        dateBooked: Date,
        bookedFrom: Date,
        bookedTo: Date,
        carService: boolean,
        carValet: boolean,
        discount: number,
        cost: number,
        isCancelled: boolean
    ) {
        this.spaceNumber = spaceNumber;
        this.dateBooked = dateBooked;
        this.bookedFrom = bookedFrom;
        this.bookedTo = bookedTo;
        this.carService = carService;
        this.carValet = carValet;
        this.discount = discount;
        this.cost = cost;
        this.isCancelled = isCancelled;
    }

    getSpaceNumber(): number {
        return this.spaceNumber;
    }

    setSpaceNumber(spaceNumber: number): void {
        this.spaceNumber = spaceNumber;
    }

    getDateBooked(): Date {
        return this.dateBooked;
    }

    setDateBooked(dateBooked: Date): void {
        this.dateBooked = dateBooked;
    }

    getBookedFrom(): Date {
        return this.bookedFrom;
    }

    setBookedFrom(bookedFrom: Date): void {
        this.bookedFrom = bookedFrom;
    }

    getBookedTo(): Date {
        return this.bookedTo;
    }

    setBookedTo(bookedTo: Date): void {
        this.bookedTo = bookedTo;
    }

    getCarService(): boolean {
        return this.carService;
    }

    setCarService(carService: boolean): void {
        this.carService = carService;
    }

    getCarValet(): boolean {
        return this.carValet;
    }

    setCarValet(carValet: boolean): void {
        this.carValet = carValet;
    }

    getDiscount(): number | undefined {
        return this.discount;
    }

    setDiscount(discount: number): void {
        this.discount = discount;
    }

    getCost(): number {
        return this.cost;
    }

    setCost(cost: number): void {
        this.cost = cost;
    }

    getIsCancelled(): boolean {
        return this.isCancelled;
    }

    setIsCancelled(isCancelled: boolean): void {
        this.isCancelled = isCancelled;
    }

    async save(): Promise<void> {
        const bookingDAO = new BookingDAO();
        await bookingDAO.save(this);
    }

    async update(): Promise<void> {
        const bookingDAO = new BookingDAO();
        await bookingDAO.update(this);
    }

    async delete(bookingID : number): Promise<void> {
        const bookingDAO = new BookingDAO();
        await bookingDAO.delete(bookingID);
    }

    static async get(bookingID : number): Promise<Booking | null> {
        const bookingDAO = new BookingDAO();
        return await bookingDAO.get(bookingID);
    }

    static async getAll(): Promise<Booking[]> {
        const bookingDAO = new BookingDAO();
        return await bookingDAO.getAll();
    }

    static async getBookingsByUser(userEmail: string): Promise<Booking[]> {
        const bookingDAO = new BookingDAO();
        return await bookingDAO.getBookingsByUser(userEmail);
    }

    static async getBookingsByVehicle(registration: string): Promise<Booking[]> {
        const bookingDAO = new BookingDAO();
        return await bookingDAO.getBookingsByVehicle(registration);
    }

    static async getBookingsByDate(start: Date, end: Date): Promise<Booking[]> {
        const bookingDAO = new BookingDAO();
        return await bookingDAO.getBookingsByDate(start, end);
    }

}