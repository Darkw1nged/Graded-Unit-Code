import { getConnection } from '../database';
import { OkPacket, PoolConnection, RowDataPacket } from 'mysql2/promise';
import Address from './address';

export class ProfileDAO {

    async create(profile: Profile): Promise<void> {
        const connection = await getConnection() as PoolConnection;
            
        try {
            await connection.query(
                'INSERT INTO profiles (email, password, roleID, telephone, addressID) VALUES (?, ?, ?, ?, ?);',
                [profile.email, profile.password, profile.roleID, profile.telephone, profile.addressID]
            );
        }
        finally {
            connection.release();
        }
    }
    

    async update(profile: Profile): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.query(
                'UPDATE profiles SET password = ?, roleID = ?, telephone = ?, addressID = ? WHERE email = ?;',
                [profile.password, profile.roleID, profile.telephone, profile.addressID, profile.email]
            );
        }
        finally {
            connection.release();
        }
    }

    async delete(email: string): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.query(
                'DELETE FROM profiles WHERE email = ?;',
                [email]
            );
        } finally {
            connection.release();
        }
    }

    async getAllProfiles(): Promise<Profile[]> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query(
                'SELECT * FROM profiles;'
            );

            return rows as Profile[];
        } finally {
            connection.release();
        }
    }

    async getProfileByEmail(email: string): Promise<Profile | undefined> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                'SELECT * FROM profiles WHERE email = ?;',
                [email]
            );

            return rows[0] as Profile;
        } finally {
            connection.release();
        }
    }

    async getAllProfilesByDate(start: Date, end: Date): Promise<Profile[]> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query(
                'SELECT * FROM profiles WHERE created_at BETWEEN ? AND ?;',
                [start, end]
            );

            return rows as Profile[];
        } finally {
            connection.release();
        }
    }

    async getAllStaff(): Promise<Profile[]> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query(
                'SELECT * FROM profiles WHERE roleID BETWEEN 3 AND 6;'
            );

            return rows as Profile[];
        }
        finally {
            connection.release();
        }
    }

    async getAllCustomers(): Promise<Profile[]> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query(
                'SELECT * FROM profiles WHERE roleID BETWEEN 1 AND 2;'
            );

            return rows as Profile[];
        }
        finally {
            connection.release();
        }
    }

    async getAllAdmins(): Promise<Profile[]> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query(
                'SELECT * FROM profiles WHERE roleID = 6;'
            );

            return rows as Profile[];
        }
        finally {
            connection.release();
        }
    }

}

export default class Profile {

    email: string;
    password: string;
    roleID: number;
    addressID?: number;
    telephone: string;

    constructor(email: string, password: string, roleID: number, telephone: string, addressID?: number) {
        this.email = email;
        this.password = password;
        this.roleID = roleID;
        this.addressID = addressID;
        this.telephone = telephone;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string) {
        this.email = email;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string) {
        this.password = password;
    }

    getRoleID(): number {
        return this.roleID;
    }

    setRoleID(roleID: number) {
        this.roleID = roleID;
    }

    getAddressID(): number | undefined {
        return this.addressID;
    }

    setAddressID(addressID: number) {
        this.addressID = addressID;
    }

    getTelephone(): string {
        return this.telephone;
    }

    setTelephone(telephone: string) {
        this.telephone = telephone;
    }

    async create(): Promise<void> {
        const profileDAO = new ProfileDAO();
        await profileDAO.create(this);
    }
    
    async save(): Promise<void> {
        const profileDAO = new ProfileDAO();
        await profileDAO.update(this);
    }

    async update(): Promise<void> {
        const profileDAO = new ProfileDAO();
        await profileDAO.update(this);
    }

    updatePassword(newPassword: string): void {
        this.password = newPassword;
        this.save();
    }

    async delete(): Promise<void> {
        const profileDAO = new ProfileDAO();
        await profileDAO.delete(this.email);
    }

    getAddresses(): Promise<Address | undefined> {
        return new Promise(async (resolve, reject) => {
            if (this.addressID === undefined) {
                resolve(undefined);
            }

            if (typeof this.addressID !== 'number') {
                reject(new Error('Invalid address ID'));
            } else {
                resolve(Address.getAddressByID(this.addressID));
            }
        });
    }

    static async getAllProfiles(): Promise<Profile[]> {
        const profileDAO = new ProfileDAO();
        return await profileDAO.getAllProfiles();
    }

    static async getAllProfilesByDate(start: Date, end: Date): Promise<Profile[]> {
        const profileDAO = new ProfileDAO();
        return await profileDAO.getAllProfilesByDate(start, end);
    }

    static async getProfileByEmail(email: string): Promise<Profile | undefined> {
        const profileDAO = new ProfileDAO();
        return await profileDAO.getProfileByEmail(email);
    }

    static async getAllStaff(): Promise<Profile[]> {
        const profileDAO = new ProfileDAO();
        return await profileDAO.getAllStaff();
    }

    static async getAllCustomers(): Promise<Profile[]> {
        const profileDAO = new ProfileDAO();
        return await profileDAO.getAllCustomers();
    }

    static async getAllAdmins(): Promise<Profile[]> {
        const profileDAO = new ProfileDAO();
        return await profileDAO.getAllAdmins();
    }

}