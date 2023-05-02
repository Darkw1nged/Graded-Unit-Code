import { getConnection } from '../database';
import { RowDataPacket, PoolConnection } from 'mysql2/promise';
import Role from './role';
import Corporate from './corporate';
import User from './user';
import Address from './address';

export class ProfileDAO {

    async findByEmail(email: string): Promise<Profile> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT * FROM profiles WHERE email = ?`,
                [email]
            );
    
            if (rows.length === 0) {
                throw new Error(`User with email ${email} not found.`);
            }
    
            const profileRow = rows[0];
            const roleID = profileRow.roleID;
            const addressID = profileRow.addressID;
    
            const role = await Role.findById(roleID);
    
            if (role.name === 'Corporate') {
                return new Corporate(profileRow.name, email, profileRow.password, roleID, profileRow.telephone, addressID);
            } else if (role.name === 'Personal') {
                return new User(profileRow.forename, profileRow.lastname, email, profileRow.password, roleID, profileRow.telephone, addressID);
            } else {
                throw new Error(`Profile with email ${email} has an invalid role.`);
            }
        } finally {
            connection.release();
        }
    }

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
    
    async save(): Promise<void> {
        const profileDAO = new ProfileDAO();
        await profileDAO.create(this);
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
                const address = new Address('', '', '', '', '');
                resolve(address.getAddressByID(this.addressID));
            }
        });
    }

    setAddress(address: Address): void {
        // Implement this method to set the `addressID` field of this Profile instance
        // based on the `id` field of the given `address` object.
        // You can use the `save()` method from your AddressRepository to save the `address` object in the database
        // and get its `id` value.
        // After you get the `id` value, set the `addressID` field of this Profile instance.
    }

    findByEmail(email: string): Promise<Profile> {
        const profileDAO = new ProfileDAO();
        return profileDAO.findByEmail(email);
    }

}