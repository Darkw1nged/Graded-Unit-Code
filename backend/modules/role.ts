import { getConnection } from '../database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';

/**
 * Represents a role for a user.
 */
export default class Role {
    /**
     * The roles id.
     */
    id: number;

    /**
     * The roles name.
     */
    name: string;

    /**
     * The constructor for the roles class.
     * @param id The roles id.
     * @param name The roles name.
     */
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    /**
     * Creates a new role.
     * @param roleID The id of the role.
     * @param name The name of the role.
     * @returns The role.
     * @throws 500 if the role could not be created.
     */
    static async create(id: number, name: string): Promise<void> {
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

    /**
     * Finds a role by its id.
     * @param id The id of the role.
     * @returns The role.
     * @throws 500 if the role does not exist.
     */
    static async findById(id: number): Promise<Role> {
        const connection = await getConnection() as PoolConnection;

        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM roles WHERE roleID=' + id);
        if (rows.length === 0) {
            throw new Error('500');
        }
        return new Role(rows[0].roleID, rows[0].name);
    }
}