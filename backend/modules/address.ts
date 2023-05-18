import { getConnection } from '../database';
import { OkPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';

export class AddressDAO {

    async getAddressByID(addressID: number): Promise<Address | undefined> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM addresses WHERE addressID = ? LIMIT 1;',
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

    async getAddressByFullAddress(fullAddress: string): Promise<Address | undefined> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM addresses WHERE CONCAT(addressLineOne, ", ", addressLineTwo, ", ", postcode, ", ", city, ", ", country) = ? LIMIT 1;',
                [fullAddress]
            );
            
            if (rows.length === 0) {
                return undefined;
            }
        } finally {
            connection.release();
        }
    }

    async createAddress(address: Address): Promise<number> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<OkPacket>(
                'INSERT INTO addresses (addressLineOne, addressLineTwo, postcode, city, country) VALUES (?, ?, ?, ?, ?);',
                [address.getAddressLineOne(), address.getAddressLineTwo(), address.getPostcode(), address.getCity(), address.getCountry()]
            );

            return rows.insertId;
        } finally {
            connection.release();
        }
    }

    async updateAddress(address: Address): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.query<OkPacket>(
                'UPDATE addresses SET addressLineOne=?, addressLineTwo=?, postcode=?, city=?, country=? WHERE postcode=?;',
                [address.getAddressLineOne(), address.getAddressLineTwo(), address.getPostcode(), address.getCity(), address.getCountry(), address.getPostcode()]
            );
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

    static getAddressByID(addressID: number | undefined): Promise<Address | undefined> {
        if (!addressID) return Promise.resolve(undefined);

        const addressDAO = new AddressDAO();
        return addressDAO.getAddressByID(addressID);
    }

    static getAddressByFullAddress(fullAddress: string): Promise<Address | undefined> {
        const addressDAO = new AddressDAO();
        return addressDAO.getAddressByFullAddress(fullAddress);
    }

    static create(address: Address): Promise<number> {
        const addressDAO = new AddressDAO();
        return addressDAO.createAddress(address);
    }

    async update(): Promise<void> {
        const addressDAO = new AddressDAO();
        return addressDAO.updateAddress(this);
    }

}