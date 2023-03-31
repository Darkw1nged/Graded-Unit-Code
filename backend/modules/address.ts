/**
 * Address class
 * @class
 * @description This is the class that represents an address.
 * @memberof backend
 * @property {string} addressLineOne The first line of the address.
 * @property {string} addressLineTwo The second line of the address.
 * @property {string} postcode The postcode of the address.
 * @property {string} city The city of the address.
 * @property {string} country The country of the address.
 */

/**
 * The constructor for the Address class.
 * @constructor
 * @param {string} addressLineOne
 * @param {string} addressLineTwo
 * @param {string} postcode
 * @param {string} city
 * @param {string} country
 */
export default class Address {
    addressLineOne: string;
    addressLineTwo: string;
    postcode: string;
    city: string;
    country: string;
    
    constructor(addressLineOne: string, addressLineTwo: string, postcode: string, city: string, country: string) {
        this.addressLineOne = addressLineOne;
        this.addressLineTwo = addressLineTwo;
        this.postcode = postcode;
        this.city = city;
        this.country = country;
    }
}