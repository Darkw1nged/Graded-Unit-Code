/**
 * This is the Flight class.
 * @class
 * @description This is the Flight class.
 * @memberof backend
 * @property {number} id The flight's id.
 * @property {string} departureFlightNumber The flight's departure flight number.
 * @property {string} returnFlightNumber The flight's return flight number.
 * @property {Date} departureFlightDateTime The flight's departure flight time.
 * @property {Date} returnFlightDateTime The flight's return flight time.
 * @property {string} destinationAirport The flight's destination airport. 
 */
export default class Flight {

    /**
     * The flight's id
     * @type {number}
     * @memberof Flight
     * @description This is the flight's id.
     */
    id: number;

    /**
     * The flight's departure flight number
     * @type {string}
     * @memberof Flight
     * @description This is the flight's departure flight number.
     */
    departureFlightNumber: string;

    /**
     * The flight's return flight number
     * @type {string}
     * @memberof Flight
     * @description This is the flight's return flight number.
     */
    returnFlightNumber: string;
    
    /**
     * The flight's departure flight time
     * @type {Date}
     * @memberof Flight
     * @description This is the flight's departure flight time.
     */
    departureFlightDateTime: Date;

    /**
     * The flight's return flight time
     * @type {Date}
     * @memberof Flight
     * @description This is the flight's return flight time.
     */
    returnFlightDateTime: Date;

    /**
     * The flight's destination airport
     * @type {string}
     * @memberof Flight
     * @description This is the flight's destination airport.
     */
    destinationAirport: string;

    /**
     * The constructor for the Flight class
     * @param {number} id - The flight's id
     * @param {string} departureFlightNumber - The flight's departure flight number
     * @param {string} returnFlightNumber - The flight's return flight number
     * @param {Date} departureFlightDateTime - The flight's departure flight time
     * @param {Date} returnFlightDateTime - The flight's return flight time
     * @param {string} destinationAirport - The flight's destination airport
     * @memberof Flight
     * @description This is the constructor for the Flight class.
     */
    constructor(id: number, departureFlightNumber: string, returnFlightNumber: string, departureFlightDateTime: Date, returnFlightDateTime: Date, destinationAirport: string) {
        this.id = id;
        this.departureFlightNumber = departureFlightNumber;
        this.returnFlightNumber = returnFlightNumber;
        this.departureFlightDateTime = departureFlightDateTime;
        this.returnFlightDateTime = returnFlightDateTime;
        this.destinationAirport = destinationAirport;
    }

}