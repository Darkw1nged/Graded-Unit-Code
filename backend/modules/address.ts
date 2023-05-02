import { getConnection } from '../database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';

export class AddressDAO {

    async getAddressByID(addressID: number): Promise<Address | undefined> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM addresses WHERE id = ? LIMIT 1;',
                [addressID]
            );
            
            if (rows.length === 0) {
                throw new Error(`Address with id ${addressID} not found.`);
            }

            const addressRow = rows[0];
            return new Address(addressRow.addressLineOne, addressRow.addressLineTwo, addressRow.postcode, addressRow.city, addressRow.country);

        } finally {
            connection.release();
        }
    }

}

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

    getAddressLineOne(): string {
        return this.addressLineOne;
    }

    setAddressLineOne(addressLineOne: string) {
        this.addressLineOne = addressLineOne;
    }

    getAddressLineTwo(): string {
        return this.addressLineTwo;
    }

    setAddressLineTwo(addressLineTwo: string) {
        this.addressLineTwo = addressLineTwo;
    }

    getPostcode(): string {
        return this.postcode;
    }

    setPostcode(postcode: string) {
        this.postcode = postcode;
    }

    getCity(): string {
        return this.city;
    }

    setCity(city: string) {
        this.city = city;
    }

    getCountry(): string {
        return this.country;
    }

    setCountry(country: string) {
        this.country = country;
    }

    validate(): boolean {
        return !this.addressLineOne || !this.postcode || !this.city || !this.country;
    }

    getFullAddress(): string {
        return `${this.addressLineOne}, ${this.addressLineTwo}, ${this.postcode}, ${this.city}, ${this.country}`;
    }

    getAddressByID(addressID: number): Promise<Address | undefined> {
        const addressDAO = new AddressDAO();
        return addressDAO.getAddressByID(addressID);
    }

}