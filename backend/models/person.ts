import { OkPacket, RowDataPacket } from 'mysql2';
import * as MySqlConnector from '../utils/mysql.connector';

/**
 * Represents a data access object for the Person entity.
 */
class PersonDAO {
    /**
     * Retrieves a Person by user ID.
     * @param {number} UserID - The user ID.
     * @returns {Promise<Person | null>} A Promise that resolves to a Person object or null if not found.
     */
    async getByUserID(UserID: number): Promise<Person | null> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM persons WHERE user_id = ?', [UserID]);
            return rows[0] as Person;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    /**
     * Creates a new Person.
     * @param {Person} person - The Person object to create.
     * @returns {Promise<number>} A Promise that resolves to the ID of the created Person.
     */
    async create(person: Person): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query<OkPacket>('INSERT INTO persons (user_id, forename, surname) VALUES (?, ?, ?)',
                [person.UserID, person.forename, person.surname]);
            return rows.insertId;
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    /**
     * Updates an existing Person.
     * @param {Person} person - The updated Person object.
     * @param {string} email - The email address to identify the Person.
     * @returns {Promise<number>} A Promise that resolves to the ID of the updated Person.
     */
    async update(person: Person, email: string): Promise<number> {
        try {
            const pool = await MySqlConnector.getPool();

            const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
            const id = rows[0].id;

            await pool.query<OkPacket>('UPDATE persons SET forename = ?, surname = ?, middle_name = ?, family_name = ?, date_of_birth = ? WHERE user_id = ?',
                [person.forename, person.surname, person.middle_name, person.family_name, person.date_of_birth, id]);

            return id;
        } catch (error) {
            console.log(error);
        }
        return -1;
    }

    /**
     * Retrieves all Persons.
     * @returns {Promise<Person[]>} A Promise that resolves to an array of Persons.
     */
    async getPersons(): Promise<Person[]> {
        try {
            const pool = await MySqlConnector.getPool();
            const [rows] = await pool.query('SELECT * FROM persons');
            return rows as Person[];
        } catch (error) {
            console.log(error);
        }
        return [];
    }
}

/**
 * Represents a Person entity.
 */
class Person {

    UserID: number;
    forename: string;
    surname: string;
    middle_name?: string;
    family_name?: string;
    date_of_birth?: Date;

    /**
    * Constructs a new Person object.
    * @param {number} UserID - The user ID.
    * @param {string} forename - The forename.
    * @param {string} surname - The surname.
    * @param {string} [middle_name] - The middle name (optional).
    * @param {string} [family_name] - The family name (optional).
    * @param {Date} [date_of_birth] - The date of birth (optional).
    */
    constructor(
        UserID: number,
        forename: string,
        surname: string,
        middle_name?: string,
        family_name?: string,
        date_of_birth?: Date
    ) {
        this.UserID = UserID;
        this.forename = forename;
        this.surname = surname;
        this.middle_name = middle_name;
        this.family_name = family_name;
        this.date_of_birth = date_of_birth;
    }

    /**
     * Gets the user ID.
     * @returns {number} The user ID.
     */
    getUserID(): number {
        return this.UserID;
    }

    /**
     * Gets the forename.
     * @returns {string} The forename.
     */
    getForename(): string {
        return this.forename;
    }

    /**
     * Gets the surname.
     * @returns {string} The surname.
     */
    getSurname(): string {
        return this.surname;
    }

    /**
     * Gets the middle name, if available.
     * @returns {string | undefined} The middle name, or undefined if not available.
     */
    getMiddleName(): string | undefined {
        return this.middle_name;
    }

    /**
     * Gets the family name, if available.
     * @returns {string | undefined} The family name, or undefined if not available.
     */
    getFamilyName(): string | undefined {
        return this.family_name;
    }

    /**
     * Gets the date of birth, if available.
     * @returns {Date | undefined} The date of birth, or undefined if not available.
     */
    getDateOfBirth(): Date | undefined {
        return this.date_of_birth;
    }

    /**
     * Sets the user ID.
     * @param {number} UserID - The user ID.
     */
    setUserID(UserID: number): void {
        this.UserID = UserID;
    }

    /**
     * Sets the forename.
     * @param {string} forename - The forename.
     */
    setForename(forename: string): void {
        this.forename = forename;
    }

    /**
     * Sets the surname.
     * @param {string} surname - The surname.
     */
    setSurname(surname: string): void {
        this.surname = surname;
    }

    /**
     * Sets the middle name.
     * @param {string} middle_name - The middle name.
     */
    setMiddleName(middle_name: string): void {
        this.middle_name = middle_name;
    }

    /**
     * Sets the family name.
     * @param {string} family_name - The family name.
     */
    setFamilyName(family_name: string): void {
        this.family_name = family_name;
    }

    /**
     * Sets the date of birth.
     * @param {Date} date_of_birth - The date of birth.
     */
    setDateOfBirth(date_of_birth: Date): void {
        this.date_of_birth = date_of_birth;
    }

    /**
     * Retrieves a Person by user ID.
     * @param {number} UserID - The user ID.
     * @returns {Promise<Person | null>} A Promise that resolves to a Person object or null if not found.
     */
    static async getByUserID(UserID: number): Promise<Person | null> {
        return await new PersonDAO().getByUserID(UserID);
    }

    /**
     * Retrieves all Persons.
     * @returns {Promise<Person[]>} A Promise that resolves to an array of Persons.
     */
    static async getPersons(): Promise<Person[]> {
        return await new PersonDAO().getPersons();
    }

    /**
     * Creates a new Person.
     * @param {Person} person - The Person object to create.
     * @returns {Promise<number>} A Promise that resolves to the ID of the created Person.
     */
    static async create(person: Person): Promise<number> {
        return await new PersonDAO().create(person);
    }

    /**
     * Updates an existing Person.
     * @param {Person} person - The updated Person object.
     * @param {string} email - The email address to identify the Person.
     * @returns {Promise<number>} A Promise that resolves to the ID of the updated Person.
     */
    static async update(person: Person, email: string): Promise<number> {
        return await new PersonDAO().update(person, email);
    }

}

export default Person;