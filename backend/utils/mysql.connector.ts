import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;
/**
 * Initializes the MySQL connection pool.
 */
export const init = () => {
    try {
        pool = createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
            connectionLimit: process.env.MYSQL_CONNECTION_LIMIT ? parseInt(process.env.MYSQL_CONNECTION_LIMIT) : 4,
            waitForConnections: true
        });

        console.log('[server]: Connection pool created');
    } catch (error) {
        console.log('[server]: Error creating connection pool');
        console.log(error);
    }
};

/**
 * Retrieves the MySQL connection pool.
 * @returns {Pool} The MySQL connection pool.
 */
export const getPool = () => {
    return pool;
}