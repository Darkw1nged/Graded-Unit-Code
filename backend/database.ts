import * as mysql from 'mysql2/promise';
import { PoolConnection } from 'mysql2/promise';
import Role from './modules/role';

/**
 * Create a pool of MySQL connections
 * @type {Pool}
 * @description This is the pool of MySQL connections that will be used to connect to the database.
 * @see {@link https://www.npmjs.com/package/mysql2#using-connection-pools}
 */
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: '99Bootboy!',
  port: 3306,
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
const createUsersTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        roleID INT NOT NULL,
        forename VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        addressID INT,
        telephone VARCHAR(255),
        mobile VARCHAR(255),
        FOREIGN KEY (roleID) REFERENCES roles(roleID), 
        FOREIGN KEY (addressID) REFERENCES addresses(addressID) 
      )
    `);
  } catch (err) {
    console.log('Error creating users table', err);
  } finally {
    connection.release();
  }
};

/** 
 * Create the corporate table
 * @description This is the table that will store all of the corporate users of the system.
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
const createCorporateTable = async () => {
  const connection = await getConnection() as PoolConnection;
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS corporate (
        email VARCHAR(255) NOT NULL PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        roleID INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        telephone VARCHAR(255) NOT NULL,
        addressID INT,
        FOREIGN KEY (addressID) REFERENCES addresses(addressID)
      )
    `);
  } catch (err) {
    console.log('Error creating corporate table', err);
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
  Role.create(1, 'personal');
  Role.create(2, 'Corporate');
  Role.create(3, 'Invoices_Clerk');
  Role.create(4, 'Bookings_Clerk');
  Role.create(5, 'Manager');
  Role.create(6, 'Admin');
};

const createDefaultUsers = async () => {
  // Create a default user
}

console.log('--- Database Setup ---');
console.log('(1/3) Creating tables...')
// Call the functions to create the tables
createRolesTable();
createAddressesTable();
createUsersTable();
createCorporateTable();
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