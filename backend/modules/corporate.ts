import { getConnection } from '../database';
import { RowDataPacket, PoolConnection } from 'mysql2/promise';
import Profile from './profile';
import Role from './role';
import User from './user';

export class CorporateDAO {

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
                return new Corporate(profileRow.businessName, email, profileRow.password, roleID, profileRow.telephone, addressID);
            } else if (role.name === 'Personal') {
                return new User(profileRow.forename, profileRow.lastname, email, profileRow.password, roleID, profileRow.telephone, addressID);
            } else {
                throw new Error(`Profile with email ${email} has an invalid role.`);
            }
        } finally {
            connection.release();
        }
    }

    async create(corporate: Corporate): Promise<void> {
        const connection = await getConnection() as PoolConnection;
    
        try {
            await connection.query(
                'INSERT INTO profiles (businessName, email, password, roleID, telephone, addressID) VALUES (?, ?, ?, ?, ?, ?);',
                [corporate.name, corporate.email, corporate.password, corporate.roleID, corporate.telephone, corporate.addressID]
            );
        }
        finally {
            connection.release();
        }
    }

    async update(corporate: Corporate): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.query(
                'UPDATE profiles SET password = ?, roleID = ?, telephone = ?, addressID = ? WHERE email = ?;',
                [corporate.password, corporate.roleID, corporate.telephone, corporate.addressID, corporate.email]
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

export default class Corporate extends Profile {

    name: string;

    constructor(
        name: string,
        email: string,
        password: string,
        roleID: number,
        telephone: string,
        addressID?: number
    ) {
        super(email, password, roleID, telephone, addressID);
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }
    
    static async findByEmail(email: string): Promise<Profile | null> {
        const profile = await new CorporateDAO().findByEmail(email);
        if (profile instanceof Corporate) {
            return profile;
        }
        return null;
    }

    async updatePassword(password: string): Promise<void> {
        await super.updatePassword(password);
    }

    async create(): Promise<void> {
        await new CorporateDAO().create(this);
    }

    async save(): Promise<void> {
        await new CorporateDAO().update(this);
    }

    async delete(): Promise<void> {
        await new CorporateDAO().delete(this.email);
    }

}