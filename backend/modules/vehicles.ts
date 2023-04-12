/**
 * The Vehicle class
 * @class Vehicle
 * @description This is the Vehicle class.
 * @property {string} registration - The vehicle's registration number
 * @property {string} make - The vehicle's make
 * @property {string} model - The vehicle's model
 * @property {string} colour - The vehicle's colour
 * @property {number} occupents - The vehicle's number of occupents
 * @property {Date} hire_date - The vehicle's hire date
 */
export default class Vehicle {
    /**
     * The vehicle's registration number
     * @type {string}
     * @memberof Vehicle
     * @description This is the vehicle's registration number.
     */
    registration: string;

    /**
     * The vehicle's make
     * @type {string}
     * @memberof Vehicle
     * @description This is the vehicle's make.
     */
    make: string;

    /**
     * The vehicle's model
     * @type {string}
     * @memberof Vehicle
     * @description This is the vehicle's model.
     */
    model: string;

    /**
     * The vehicle's colour
     * @type {string}
     * @memberof Vehicle
     * @description This is the vehicle's colour.
     */
    colour: string;

    /**
     * The vehicle's number of occupents
     * @type {number}
     * @memberof Vehicle
     * @description This is the vehicle's number of occupents.
     */
    occupents: number;

    /**
     * The vehicle's hire date
     * @type {Date}
     * @memberof Vehicle
     * @description This is the vehicle's hire date.
     */
    hire_date: Date;

    /**
     * The constructor for the Vehicle class
     * @param {string} registration - The vehicle's registration number
     * @param {string} make - The vehicle's make
     * @param {string} model - The vehicle's model
     * @param {string} colour - The vehicle's colour
     * @param {number} occupents - The vehicle's number of occupents
     * @param {Date} hire_date - The vehicle's hire date
     * @memberof Vehicle
     * @description This is the constructor for the Vehicle class.
     */
    constructor(registration: string, make: string, model: string, colour: string, occupents: number, hire_date: Date) {
        this.registration = registration;
        this.make = make;
        this.model = model;
        this.colour = colour;
        this.occupents = occupents;
        this.hire_date = hire_date;
    }
}