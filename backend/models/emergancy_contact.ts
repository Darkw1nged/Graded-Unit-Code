import * as MySqlConnector from '../utils/mysql.connector';
import { OkPacket, RowDataPacket } from 'mysql2';

/**
 * Data Access Object (DAO) for emergency contacts.
 */
class EmergancyContactDAO {
    /**
     * Creates a new emergency contact record.
     * @param {EmergancyContact} emergancyContact - The emergency contact object to create.
     * @returns {Promise<number | null>} The ID of the newly created contact, or null if creation fails.
     */
    async create(emergancyContact: EmergancyContact): Promise<number | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>(
                'INSERT INTO emergancy_contacts (user_id, forename, surname, telephone, address_line_one, address_line_two, city, region, zip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    emergancyContact.userId,
                    emergancyContact.forename,
                    emergancyContact.surname,
                    emergancyContact.telephone,
                    emergancyContact.addressLineOne,
                    emergancyContact.addressLineTwo,
                    emergancyContact.city,
                    emergancyContact.region,
                    emergancyContact.zip,
                    emergancyContact.country
                ]
            );

            console.log('[Server]: emergancy contact created, ' + emergancyContact.forename + ' ' + emergancyContact.surname);
            return rows.insertId;
        } catch (error) {
            console.log('[Server]: emergancy contact could not be created, ' + error);
        }
        return null;
    }

    /**
     * Updates an existing emergency contact record.
     * @param {EmergancyContact} emergancyContact - The updated emergency contact object.
     * @param {string} email - The email associated with the contact.
     * @returns {Promise<number | null>} The ID of the updated contact, or null if update fails.
     */
    async update(emergancyContact: EmergancyContact, email: string): Promise<number | null> {
        try {
            const pool = await MySqlConnector.getPool();

            const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
            const id = rows[0].id;

            await pool.query<OkPacket>(
                'UPDATE emergancy_contacts SET forename = ?, surname = ?, telephone = ?, address_line_one = ?, address_line_two = ?, city = ?, region = ?, zip = ?, country = ? WHERE user_id = ?',
                [
                    emergancyContact.forename,
                    emergancyContact.surname,
                    emergancyContact.telephone,
                    emergancyContact.addressLineOne,
                    emergancyContact.addressLineTwo,
                    emergancyContact.city,
                    emergancyContact.region,
                    emergancyContact.zip,
                    emergancyContact.country,
                    id
                ]
            );

            console.log('[Server]: emergancy contact updated, ' + emergancyContact.forename + ' ' + emergancyContact.surname);
            return id;
        } catch (error) {
            console.log('[Server]: emergancy contact could not be updated, ' + error);
        }
        return null;
    }

    /**
     * Deletes an emergency contact record.
     * @param {number} user_id - The user ID associated with the contact.
     * @returns {Promise<number | null>} The ID of the deleted contact, or null if deletion fails.
     */
    async delete(user_id: number): Promise<number | null> {
        try {
            const pool = await MySqlConnector.getPool();
            await pool.query<OkPacket>('DELETE FROM emergancy_contacts WHERE user_id = ?', [user_id]);
        } catch (error) {
            console.log('[Server]: emergancy contact could not be deleted, ' + error);
        }
        return null;
    }
}

/**
 * Represents an emergency contact.
 */
class EmergancyContact {

    /**
     * The user ID associated with the emergency contact.
     */
    userId: number;

    /**
     * The forename of the emergency contact.
     */
    forename: string;

    /**
     * The surname of the emergency contact.
     */
    surname: string;

    /**
     * The telephone number of the emergency contact.
     */
    telephone: string;

    /**
     * The first line of the address of the emergency contact (optional).
     */
    addressLineOne?: string;

    /**
     * The second line of the address of the emergency contact (optional).
     */
    addressLineTwo?: string;

    /**
     * The city of the emergency contact (optional).
     */
    city?: string;

    /**
     * The region of the emergency contact (optional).
     */
    region?: string;

    /**
     * The ZIP code of the emergency contact (optional).
     */
    zip?: string;

    /**
     * The country of the emergency contact (optional).
     */
    country?: string;

    /**
     * The creation timestamp of the emergency contact (optional).
     */
    created_at?: Date;

    /**
     * The last update timestamp of the emergency contact (optional).
     */
    updated_at?: Date;

    /**
     * Creates an instance of EmergencyContact.
     * @param {number} userId - The user ID associated with the emergency contact.
     * @param {string} forename - The forename of the emergency contact.
     * @param {string} surname - The surname of the emergency contact.
     * @param {string} telephone - The telephone number of the emergency contact.
     * @param {string} [addressLineOne] - The first line of the address of the emergency contact (optional).
     * @param {string} [addressLineTwo] - The second line of the address of the emergency contact (optional).
     * @param {string} [city] - The city of the emergency contact (optional).
     * @param {string} [region] - The region of the emergency contact (optional).
     * @param {string} [zip] - The ZIP code of the emergency contact (optional).
     * @param {string} [country] - The country of the emergency contact (optional).
     * @param {Date} [created_at] - The creation timestamp of the emergency contact (optional).
     * @param {Date} [updated_at] - The last update timestamp of the emergency contact (optional).
     */
    constructor(
        userId: number,
        forename: string,
        surname: string,
        telephone: string,
        addressLineOne?: string,
        addressLineTwo?: string,
        city?: string,
        region?: string,
        zip?: string,
        country?: string,
        created_at?: Date,
        updated_at?: Date
    ) {
        this.userId = userId;
        this.forename = forename;
        this.surname = surname;
        this.telephone = telephone;
        this.addressLineOne = addressLineOne;
        this.addressLineTwo = addressLineTwo;
        this.city = city;
        this.region = region;
        this.zip = zip;
        this.country = country;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /**
     * Gets the user ID of the emergency contact.
     * @returns {number} The user ID.
     */
    getUserId(): number {
        return this.userId;
    }

    /**
     * Gets the forename of the emergency contact.
     * @returns {string} The forename.
     */
    getForename(): string {
        return this.forename;
    }

    /**
     * Gets the surname of the emergency contact.
     * @returns {string} The surname.
     */
    getSurname(): string {
        return this.surname;
    }

    /**
     * Gets the telephone number of the emergency contact.
     * @returns {string} The telephone number.
     */
    getTelephone(): string {
        return this.telephone;
    }

    /**
     * Gets the first line of the address of the emergency contact.
     * @returns {string | undefined} The first line of the address, or undefined if not provided.
     */
    getAddressLineOne(): string | undefined {
        return this.addressLineOne;
    }

    /**
     * Gets the second line of the address of the emergency contact.
     * @returns {string | undefined} The second line of the address, or undefined if not provided.
     */
    getAddressLineTwo(): string | undefined {
        return this.addressLineTwo;
    }

    /**
     * Gets the city of the emergency contact.
     * @returns {string | undefined} The city, or undefined if not provided.
     */
    getCity(): string | undefined {
        return this.city;
    }

    /**
     * Gets the region of the emergency contact.
     * @returns {string | undefined} The region, or undefined if not provided.
     */
    getRegion(): string | undefined {
        return this.region;
    }

    /**
     * Gets the ZIP code of the emergency contact.
     * @returns {string | undefined} The ZIP code, or undefined if not provided.
     */
    getZip(): string | undefined {
        return this.zip;
    }

    /**
     * Gets the country of the emergency contact.
     * @returns {string | undefined} The country, or undefined if not provided.
     */
    getCountry(): string | undefined {
        return this.country;
    }

    /**
     * Gets the creation timestamp of the emergency contact.
     * @returns {Date | undefined} The creation timestamp, or undefined if not provided.
     */
    getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    /**
     * Gets the last update timestamp of the emergency contact.
     * @returns {Date | undefined} The last update timestamp, or undefined if not provided.
     */
    getUpdatedAt(): Date | undefined {
        return this.updated_at;
    }

    /**
     * Sets the user ID of the emergency contact.
     * @param {number} userId - The user ID.
     */
    setUserId(userId: number): void {
        this.userId = userId;
    }

    /**
     * Sets the forename of the emergency contact.
     * @param {string} forename - The forename.
     */
    setForename(forename: string): void {
        this.forename = forename;
    }

    /**
     * Sets the surname of the emergency contact.
     * @param {string} surname - The surname.
     */
    setSurname(surname: string): void {
        this.surname = surname;
    }

    /**
     * Sets the telephone number of the emergency contact.
     * @param {string} telephone - The telephone number.
     */
    setTelephone(telephone: string): void {
        this.telephone = telephone;
    }

    /**
     * Sets the first line of the address of the emergency contact.
     * @param {string} addressLineOne - The first line of the address.
     */
    setAddressLineOne(addressLineOne: string): void {
        this.addressLineOne = addressLineOne;
    }

    /**
     * Sets the second line of the address of the emergency contact.
     * @param {string} addressLineTwo - The second line of the address.
     */
    setAddressLineTwo(addressLineTwo: string): void {
        this.addressLineTwo = addressLineTwo;
    }

    /**
     * Sets the city of the emergency contact.
     * @param {string} city - The city.
     */
    setCity(city: string): void {
        this.city = city;
    }

    /**
     * Sets the region of the emergency contact.
     * @param {string} region - The region.
     */
    setRegion(region: string): void {
        this.region = region;
    }

    /**
     * Sets the ZIP code of the emergency contact.
     * @param {string} zip - The ZIP code.
     */
    setZip(zip: string): void {
        this.zip = zip;
    }

    /**
     * Sets the country of the emergency contact.
     * @param {string} country - The country.
     */
    setCountry(country: string): void {
        this.country = country;
    }

    /**
     * Sets the creation timestamp of the emergency contact.
     * @param {Date} created_at - The creation timestamp.
     */
    setCreatedAt(created_at: Date): void {
        this.created_at = created_at;
    }

    /**
     * Sets the last update timestamp of the emergency contact.
     * @param {Date} updated_at - The last update timestamp.
     */
    setUpdatedAt(updated_at: Date): void {
        this.updated_at = updated_at;
    }

    /**
     * Creates an emergency contact.
     * @param {EmergancyContact} emergencyContact - The emergency contact to create.
     * @returns {Promise<number | null>} A promise that resolves to the created emergency contact's ID, or null if the creation fails.
     */
    static async create(emergencyContact: EmergancyContact): Promise<number | null> {
        return new EmergancyContactDAO().create(emergencyContact);
    }

    /**
     * Updates an emergency contact.
     * @param {EmergancyContact} emergencyContact - The emergency contact to update.
     * @param {string} email - The email associated with the emergency contact.
     * @returns {Promise<number | null>} A promise that resolves to the updated emergency contact's ID, or null if the update fails.
     */
    static async update(emergencyContact: EmergancyContact, email: string): Promise<number | null> {
        return new EmergancyContactDAO().update(emergencyContact, email);
    }

    /**
     * Deletes an emergency contact.
     * @param {number} userID - The user ID associated with the emergency contact to delete.
     * @returns {Promise<number | null>} A promise that resolves to the deleted emergency contact's ID, or null if the deletion fails.
     */
    static async delete(userID: number): Promise<number | null> {
        return new EmergancyContactDAO().delete(userID);
    }
}

export default EmergancyContact;