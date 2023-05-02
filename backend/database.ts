import * as mysql from 'mysql2/promise';
import { PoolConnection } from 'mysql2/promise';
import Role from './modules/role';
import config from './config';

/**
 * Create a pool of MySQL connections
 * @type {Pool}
 * @description This is the pool of MySQL connections that will be used to connect to the database.
 * @see {@link https://www.npmjs.com/package/mysql2#using-connection-pools}
 */
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
});

export const getConnection = () => {
  return new Promise((resolve, reject) => {
    resolve(pool.getConnection());
  });
};

/**
 * Create the roles table
 * @description This is the table that will store all of the roles of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
*/
const createRolesTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        roleID INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
  } catch (err) {
    console.log('Error creating roles table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the addresses table
 * @description This is the table that will store all of the addresses of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const createAddressesTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS addresses (
        addressID INT PRIMARY KEY AUTO_INCREMENT,
        addressLineOne VARCHAR(255) NOT NULL,
        addressLineTwo VARCHAR(255),
        postcode VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL
      )
    `);
  } catch (err) {
    console.log('Error creating addresses table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the users table
 * @description This is the table that will store all of the users of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const craeteProfilesTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE profiles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        forename VARCHAR(255),
        lastname VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        telephone VARCHAR(255),
        address_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles (id),
        FOREIGN KEY (address_id) REFERENCES addresses (id)
      );
    `);
  } catch (err) {
    console.log('Error creating users table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the sessions table
 * @description This is the table that will store all of the sessions of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const createSessionsTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        expiresAt DATETIME NOT NULL,
        FOREIGN KEY (email) REFERENCES users(email)
      )
    `);
  } catch (err) {
    console.log('Error creating sessions table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the vehicles table
 * @description This is the table that will store all of the vehicles of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const createVehiclesTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vehicles (
        registration VARCHAR(255) PRIMARY KEY,
        make VARCHAR(255) NOT NULL,
        model VARCHAR(255) NOT NULL,
        colour VARCHAR(255) NOT NULL,
        occupants INT NOT NULL,
        hire_date DATE NOT NULL
      )
    `);
  } catch (err) {
    console.log('Error creating vehicles table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the flights table
 * @description This is the table that will store all of the flights of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const createFlightsTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS flights (
        id INT PRIMARY KEY AUTO_INCREMENT,
        departure_flight_number VARCHAR(255) NOT NULL,
        return_flight_number VARCHAR(255) NOT NULL,
        departure_flight_time VARCHAR(255) NOT NULL,
        return_flight_time VARCHAR(255) NOT NULL,
        departure_date DATE NOT NULL,
        return_date DATE NOT NULL,
        destination_airport VARCHAR(255) NOT NULL
      )
    `);
  } catch (err) {
    console.log('Error creating flights table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the bookings table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const createBookingsTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        bookingID INT AUTO_INCREMENT PRIMARY KEY,
        userEmail VARCHAR(255) NOT NULL, 
        space_number INT NOT NULL,
        dateBooked DATE NOT NULL,
        bookedFrom DATE NOT NULL,
        bookedTo DATE NOT NULL,
        discount INT NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        booked BOOLEAN NOT NULL
      )
    `);
  } catch (err) {
    console.log('Error creating bookings table', err);
  } finally {
    connection.release();
  }
};

/**
 * Create the payments table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 * @deprecated Using stripe instead
 */
const createPaymentsTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        paymentID INT AUTO_INCREMENT PRIMARY KEY,
        bookingID INT NOT NULL,
        payment_method VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (bookingID) REFERENCES bookings(bookingID)
      )
    `);
  } catch (err) {
    console.log('Error creating payments table', err);
  } finally {
    connection.release();
  }
};

const createDefaultRoles = async () => {
  new Role(1, "Personal").save();
  new Role(2, "Corporate").save();
  new Role(3, "Invoices_Clerk").save();
  new Role(4, "Bookings_Clerk").save();
  new Role(5, "Manager").save();
  new Role(6, "Admin").save();
};

const createDefaultUsers = async () => {
  // Create a default users
}

console.log('--- Database Setup ---');
console.log('(1/3) Creating tables...')
// Call the functions to create the tables
createRolesTable();
createAddressesTable();
craeteProfilesTable();
createSessionsTable();
createVehiclesTable();
createFlightsTable();
createBookingsTable();
createPaymentsTable();

console.log('(2/3) Creating default roles...');
// Create the default roles
// createDefaultRoles();

console.log('(3/3) Creating default users...');
// Create the default users
createDefaultUsers();

console.log('--- Database Setup Complete ---');