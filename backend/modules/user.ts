import { getConnection } from '../database';
import { RowDataPacket, PoolConnection } from 'mysql2/promise';
import Profile from './profile';
import Role from './role';
import Corporate from './corporate';

export class UserDAO {

    async findByEmail(email: string): Promise<Profile | null> {
        const connection = await getConnection() as PoolConnection;

        try {
            const [rows] = await connection.query<RowDataPacket[]>(
                `SELECT * FROM profiles WHERE email = ?`,
                [email]
            );
    
            if (rows.length === 0) {
                return null;
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

    async create(user: User): Promise<void> {
        const connection = await getConnection() as PoolConnection;
    
        try {
            await connection.query(
                'INSERT INTO profiles (forename, lastname, email, password, roleID, telephone, addressID) VALUES (?, ?, ?, ?, ?, ?, ?);',
                [user.forename, user.lastname, user.email, user.password, user.roleID, user.telephone, user.addressID]
            );
        }
        finally {
            connection.release();
        }
    }

    async update(user: User): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.query(
                'UPDATE profiles SET password = ?, roleID = ?, telephone = ?, addressID = ? WHERE email = ?;',
                [user.password, user.roleID, user.telephone, user.addressID, user.email]
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

export default class User extends Profile {

    forename: string;
    lastname: string;

    constructor(
        forename: string,
        lastname: string,
        email: string,
        password: string,
        roleID: number,
        telephone: string,
        addressID?: number
    ) {
        super(email, password, roleID, telephone, addressID);
        this.forename = forename;
        this.lastname = lastname;
    }

    getForename(): string {
        return this.forename;
    }

    setForename(forename: string) {
        this.forename = forename;
    }

    getLastname(): string {
        return this.lastname;
    }

    setLastname(lastname: string) {
        this.lastname = lastname;
    }

    getFullName(): string {
        return `${this.forename} ${this.lastname}`;
    }

    static async findByEmail(email: string): Promise<Profile | null> {
        const profile = await new UserDAO().findByEmail(email);
        if (profile instanceof User) {
            return profile;
        }
        return null;
    }

    async updatePassword(password: string): Promise<void> {
        await super.updatePassword(password);
    }

    async create(): Promise<void> {
        await new UserDAO().create(this);
    }

    async save(): Promise<void> {
        await new UserDAO().update(this);
    }

    async delete(): Promise<void> {
        await new UserDAO().delete(this.email);
    }

}
