/**
 * The Booking class
 * @class
 * @description The Booking class
 * @memberof modules
 * @property {number} spaceNumber - The space number of the booking
 * @property {Date} dateBooked - The date of the booking
 * @property {Date} bookedFrom - The booked from date of the booking
 * @property {Date} bookedTo - The booked to date of the booking
 * @property {number} discount - The discount of the booking
 * @property {number} cost - The cost of the booking
 * @property {boolean} booked - The booked status of the booking
 */
export default class Booking {

    /**
     * The space number of the booking
     * @type {number}
     * @memberof Booking
     * @description The space number of the booking
     */
    spaceNumber: number;

    /**
     * The date of the booking
     * @type {Date}
     * @memberof Booking
     * @description The date of the booking
     */
    dateBooked: Date;

    /**
     * The booked from date of the booking
     * @type {Date}
     * @memberof Booking
     * @description The booked from date of the booking
     */
    bookedFrom: Date;

    /**
     * The booked to date of the booking
     * @type {Date}
     * @memberof Booking
     * @description The booked to date of the booking
     */
    bookedTo: Date;

    /**
     * The discount of the booking
     * @type {number}
     * @memberof Booking
     * @description The discount of the booking
     */
    discount?: number;

    /**
     * The cost of the booking
     * @type {number}
     * @memberof Booking
     * @description The cost of the booking
     */
    cost: number;

    /**
     * The booked status of the booking
     * @type {boolean}
     * @memberof Booking
     * @description The booked status of the booking
     */
    booked: boolean;

    /**
     * The constructor for the Booking class
     * @param {number} spaceNumber - The space number of the booking
     * @param {Date} dateBooked - The date of the booking
     * @param {Date} bookedFrom - The booked from date of the booking
     * @param {Date} bookedTo - The booked to date of the booking
     * @param {number} discount - The discount of the booking
     * @param {number} cost - The cost of the booking
     * @param {boolean} booked - The booked status of the booking
     * @memberof Booking
     * @description The constructor for the Booking class
     */
    constructor(
        spaceNumber: number,
        dateBooked: Date, 
        bookedFrom: Date,
        bookedTo: Date,
        cost: number, 
        booked: boolean, 
        discount?: number
    ) {
        this.spaceNumber = spaceNumber;
        this.dateBooked = dateBooked;
        this.bookedFrom = bookedFrom;
        this.bookedTo = bookedTo;
        this.discount = discount;
        this.cost = cost;
        this.booked = booked;
    }
}