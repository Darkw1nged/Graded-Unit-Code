import { getConnection } from '../database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';

class RoleDAO {
    async create(id: number, name: string): Promise<void> {
        const connection = await getConnection() as PoolConnection;

        try {
            await connection.query(
            'INSERT INTO roles (roleID, name) VALUES (?, ?);',
            [id, name]
            );
        } finally {
            connection.release();
        }
    }

    async findById(id: number): Promise<Role> {
        const connection = await getConnection() as PoolConnection;

        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM roles WHERE roleID=' + id);
        if (rows.length === 0) {
            throw new Error('500');
        }
        return new Role(rows[0].roleID, rows[0].name);
    }
}

export default class Role {

    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    getId(): number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    async save(): Promise<void> {
        const dao = new RoleDAO();
        await dao.create(this.id, this.name);
    }
    
    static async findById(id: number): Promise<Role> {
        const dao = new RoleDAO();
        return dao.findById(id);
    }
}