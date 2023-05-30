import * as MySqlConnector from '../utils/mysql.connector';
import { OkPacket, RowDataPacket } from 'mysql2';

/**
 * Represents a Data Access Object (DAO) for booking operations.
 */
class BookingDAO {
    /**
     * Retrieves a booking based on the specified date.
     * @param {Date} date_booked - The date of the booking.
     * @returns {Promise<Booking | null>} A promise that resolves to the retrieved booking or null if not found.
     */
    async get(date_booked: Date): Promise<Booking | null> {
        try {
            const date = new Date(date_booked);
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings WHERE date_booked = ?',
                [date]);
            return rows[0] as Booking;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all bookings.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings or null if not found.
     */
    async getAll(): Promise<Booking[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings');
            return rows as Booking[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves all bookings associated with a user ID.
     * @param {number} user_id - The ID of the user.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings or null if not found.
     */
    async getAllByUserID(user_id: number): Promise<Booking[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings WHERE user_id = ?',
                [user_id]);
            return rows as Booking[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves a booking based on the specified booking ID.
     * @param {number} booking_id - The ID of the booking.
     * @returns {Promise<Booking | null>} A promise that resolves to the retrieved booking or null if not found.
     */
    async getBookingByID(booking_id: number): Promise<Booking | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings WHERE id = ?',
                [booking_id]);
            return rows[0] as Booking;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Retrieves bookings between the specified dates.
     * @param {Date} booked_from - The start date of the booking range.
     * @param {Date} booked_until - The end date of the booking range.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings or null if not found.
     */
    async getBookingsBetweenDates(booked_from: Date, booked_until: Date): Promise<Booking[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings WHERE date_booked BETWEEN ? AND ?',
                [booked_from, booked_until]);
            return rows as Booking[];
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Searches for bookings within the specified date range.
     * @param {Date} booked_from - The start date of the search range.
     * @param {Date} booked_until - The end date of the search range.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of filtered bookings or null if not found.
     */
    async searchBookings(booked_from: Date, booked_until: Date): Promise<Booking[] | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings');

            const filteredBookings: Booking[] = [];
            const bookedFrom = new Date(booked_from);
            const bookedUntil = new Date(booked_until);

            for (const row of rows) {
                const bookingFrom = new Date(row.booked_from);
                const bookingUntil = new Date(row.booked_until);

                if (bookingFrom <= bookedUntil && bookingUntil >= bookedFrom) {
                    filteredBookings.push(row as Booking);
                }
            }

            return filteredBookings;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Creates a new booking.
     * @param {Booking} booking - The booking object to be created.
     * @returns {Promise<number | null>} A promise that resolves to the ID of the created booking or null if creation failed.
     */
    async create(booking: Booking): Promise<number | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('INSERT INTO bookings (user_id, vehicle_registration_number, extras_id, discount_id, space, date_booked, booked_from, booked_until, cost, paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [booking.getUserID(), booking.getVehicleRegistrationNumber(), booking.getExtrasID(), booking.getDiscountID(), booking.getSpace(), booking.getDateBooked(), booking.getBookedFrom(), booking.getBookedUntil(), booking.getCost(), booking.getPaid()]);

            console.log('[Server]: user created, ' + booking.getUserID());
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: booking could not be created for, ' + booking.user_id + ', ' + error);
        }
        return null;
    }

    /**
     * Updates an existing booking.
     * @param {Booking} booking - The updated booking object.
     * @param {number} booking_id - The ID of the booking to be updated.
     * @returns {Promise<number | null>} A promise that resolves to the number of affected rows in the database or null if update failed.
     */
    async update(booking: Booking, booking_id: number): Promise<number | null> {
        try {
            const dateBooked = new Date(booking.date_booked);
            const bookedFrom = new Date(booking.booked_from);
            const bookedUntil = new Date(booking.booked_until);

            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('UPDATE bookings SET user_id = ?, vehicle_registration_number = ?, extras_id = ?, discount_id = ?, space = ?, date_booked = ?, booked_from = ?, booked_until = ?, cost = ?, paid = ? WHERE id = ?',
                [booking.user_id, booking.vehicle_registration_number, booking.extras_id, booking.discount_id, booking.space, dateBooked, bookedFrom, bookedUntil, booking.cost, booking.paid, booking_id]);
            return rows.affectedRows;
        } catch (error) {
            console.log('[Server]: booking could not be updated for, ' + booking.user_id + ', ' + error);
        }
        return null;
    }

    /**
     * Deletes a booking based on the specified date.
     * @param {Date} date_booked - The date of the booking to be deleted.
     * @returns {Promise<number | null>} A promise that resolves to the number of affected rows in the database or null if deletion failed.
     */
    async delete(date_booked: Date): Promise<number | null> {
        try {
            const date = new Date(date_booked);

            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('DELETE FROM bookings WHERE date_booked = ?',
                [date]);
            return rows.affectedRows;
        } catch (error) {
            console.log('[Server]: booking could not be deleted, ' + date_booked + ', ' + error);
        }
        return null;
    }
}

class Booking {

    user_id: number;
    vehicle_registration_number: string;
    extras_id?: number;
    discount_id?: number;
    space: number;
    date_booked: Date;
    booked_from: Date;
    booked_until: Date;
    cost: number;
    paid: boolean;

    /**
    * Represents a booking.
    * @constructor
    * @param {number} user_id - The user ID.
    * @param {string} vehicle_registration_number - The vehicle registration number.
    * @param {number} space - The space.
    * @param {Date} date_booked - The date booked.
    * @param {Date} booked_from - The booked from date.
    * @param {Date} booked_until - The booked until date.
    * @param {number} cost - The cost.
    * @param {boolean} paid - Indicates if the booking is paid.
    * @param {number} [extras_id] - The extras ID (optional).
    * @param {number} [discount_id] - The discount ID (optional).
    */
    constructor(
        user_id: number,
        vehicle_registration_number: string,
        space: number,
        date_booked: Date,
        booked_from: Date,
        booked_until: Date,
        cost: number,
        paid: boolean,
        extras_id?: number,
        discount_id?: number
    ) {
        this.user_id = user_id;
        this.vehicle_registration_number = vehicle_registration_number;
        this.extras_id = extras_id;
        this.discount_id = discount_id;
        this.space = space;
        this.date_booked = date_booked;
        this.booked_from = booked_from;
        this.booked_until = booked_until;
        this.cost = cost;
        this.paid = paid;
    }

    /**
     * Gets the user ID.
     * @returns {number} The user ID.
     */
    getUserID() {
        return this.user_id;
    }

    /**
     * Gets the vehicle registration number.
     * @returns {string} The vehicle registration number.
     */
    getVehicleRegistrationNumber() {
        return this.vehicle_registration_number;
    }

    /**
     * Gets the extras ID.
     * @returns {number | undefined} The extras ID, or undefined if not set.
     */
    getExtrasID() {
        return this.extras_id;
    }

    /**
     * Gets the discount ID.
     * @returns {number | undefined} The discount ID, or undefined if not set.
     */
    getDiscountID() {
        return this.discount_id;
    }

    /**
     * Gets the space.
     * @returns {number} The space.
     */
    getSpace() {
        return this.space;
    }

    /**
     * Gets the date booked.
     * @returns {Date} The date booked.
     */
    getDateBooked() {
        return this.date_booked;
    }

    /**
     * Gets the booked from date.
     * @returns {Date} The booked from date.
     */
    getBookedFrom() {
        return this.booked_from;
    }

    /**
     * Gets the booked until date.
     * @returns {Date} The booked until date.
     */
    getBookedUntil() {
        return this.booked_until;
    }

    /**
     * Gets the cost.
     * @returns {number} The cost.
     */
    getCost() {
        return this.cost;
    }

    /**
     * Checks if the booking is paid.
     * @returns {boolean} True if the booking is paid, false otherwise.
     */
    getPaid() {
        return this.paid;
    }

    /**
     * Sets the user ID.
     * @param {number} user_id - The user ID.
     */
    setUserID(user_id: number) {
        this.user_id = user_id;
    }

    /**
     * Sets the vehicle registration number.
     * @param {string} vehicle_registration_number - The vehicle registration number.
     */
    setVehicleRegistrationNumber(vehicle_registration_number: string) {
        this.vehicle_registration_number = vehicle_registration_number;
    }

    /**
     * Sets the extras ID.
     * @param {number} extras_id - The extras ID.
     */
    setExtrasID(extras_id: number) {
        this.extras_id = extras_id;
    }

    /**
     * Sets the discount ID.
     * @param {number} discount_id - The discount ID.
     */
    setDiscountID(discount_id: number) {
        this.discount_id = discount_id;
    }

    /**
     * Sets the space.
     * @param {number} space - The space.
     */
    setSpace(space: number) {
        this.space = space;
    }

    /**
     * Sets the date booked.
     * @param {Date} date_booked - The date booked.
     */
    setDateBooked(date_booked: Date) {
        this.date_booked = date_booked;
    }

    /**
     * Sets the booked from date.
     * @param {Date} booked_from - The booked from date.
     */
    setBookedFrom(booked_from: Date) {
        this.booked_from = booked_from;
    }

    /**
     * Sets the booked until date.
     * @param {Date} booked_until - The booked until date.
     */
    setBookedUntil(booked_until: Date) {
        this.booked_until = booked_until;
    }

    /**
     * Sets the cost.
     * @param {number} cost - The cost.
     */
    setCost(cost: number) {
        this.cost = cost;
    }

    /**
     * Sets whether the booking is paid.
     * @param {boolean} paid - Indicates if the booking is paid.
     */
    setPaid(paid: boolean) {
        this.paid = paid;
    }

    /**
     * Retrieves a booking based on the date booked.
     * @param {Date} date_booked - The date booked.
     * @returns {Promise<Booking | null>} A promise that resolves to the booking, or null if not found.
     */
    static async get(date_booked: Date) {
        return new BookingDAO().get(date_booked);
    }

    /**
     * Retrieves all bookings.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings, or null if not found.
     */
    static async getAll() {
        return new BookingDAO().getAll();
    }

    /**
     * Retrieves all bookings by user ID.
     * @param {number} user_id - The user ID.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings, or null if not found.
     */
    static async getAllByUserID(user_id: number) {
        return new BookingDAO().getAllByUserID(user_id);
    }

    /**
     * Retrieves a booking by its ID.
     * @param {number} booking_id - The booking ID.
     * @returns {Promise<Booking | null>} A promise that resolves to the booking, or null if not found.
     */
    static async getBookingByID(booking_id: number) {
        return new BookingDAO().getBookingByID(booking_id);
    }

    /**
     * Retrieves bookings between two dates.
     * @param {Date} booked_from - The booked from date.
     * @param {Date} booked_until - The booked until date.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings, or null if not found.
     */
    static async getBookingsBetweenDates(booked_from: Date, booked_until: Date) {
        return new BookingDAO().getBookingsBetweenDates(booked_from, booked_until);
    }

    /**
     * Searches bookings based on booked from and booked until dates.
     * @param {Date} booked_from - The booked from date.
     * @param {Date} booked_until - The booked until date.
     * @returns {Promise<Booking[] | null>} A promise that resolves to an array of bookings, or null if not found.
     */
    static async searchBookings(booked_from: Date, booked_until: Date) {
        return new BookingDAO().searchBookings(booked_from, booked_until);
    }

    /**
     * Creates a new booking.
     * @param {Booking} booking - The booking object.
     * @returns {Promise<number | null>} A promise that resolves to the created booking ID, or null if not created.
     */
    static async create(booking: Booking) {
        return new BookingDAO().create(booking);
    }

    /**
     * Updates a booking.
     * @param {Booking} booking - The updated booking object.
     * @param {number} booking_id - The booking ID.
     * @returns {Promise<number | null>} A promise that resolves to the updated booking ID, or null if not updated.
     */
    static async update(booking: Booking, booking_id: number) {
        return new BookingDAO().update(booking, booking_id);
    }

    /**
     * Deletes a booking by date booked.
     * @param {Date} date_booked - The date booked.
     * @returns {Promise<number | null>} A promise that resolves to the deleted booking ID, or null if not deleted.
     */
    static async delete(date_booked: Date) {
        return new BookingDAO().delete(date_booked);
    }
}

export default Booking;