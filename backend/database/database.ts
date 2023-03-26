import * as mysql from 'mysql2';;

/**
 * Create a pool of MySQL connections
 * @type {Pool}
 */
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: '99Bootboy!',
  port: 3306, // default MySQL port
});

/**
 * Create tables if they do not exist
 */

/**
 * Create the users table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    forename VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    postcode VARCHAR(255),
    telephone VARCHAR(255),
    mobile VARCHAR(255)
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating users table', err);
    }
  },
);

/**
 * Create the roles table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating roles table', err);
    }
  },
);

/**
 * Create the vehicles table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS vehicles (
    registration VARCHAR(255) PRIMARY KEY,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    colour VARCHAR(255) NOT NULL,
    occupents INT NOT NULL,
    hire_date DATE NOT NULL
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating vehicles table', err);
    }
  },
);

/**
 * Create the flights table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departure_flight_number VARCHAR(255) NOT NULL,
    return_flight_number VARCHAR(255) NOT NULL,
    departure_flight_time VARCHAR(255) NOT NULL,
    return_flight_time VARCHAR(255) NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    destination_airport VARCHAR(255) NOT NULL
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating flights table', err);
    }
  },
);

/**
 * Create the payments table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_type VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expiry_date DATE NOT NULL,
    security_number VARCHAR(255) NOT NULL,
    date_paid DATE NOT NULL
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating payments table', err);
    }
  },
);

/**
 * Create the bookings table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS bookings (
    space_number INT PRIMARY KEY,
    discount INT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    booked BOOLEAN NOT NULL
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating parking_space table', err);
    }
  },
);

/**
 * Create the sessions table
 * @param {Error} err - Any error encountered while creating the table
 * @param {*} results - Results from creating the table
 * @param {*} fields - Fields used to create the table
 */
pool.query(
  `CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
  )`,
  (err, results, fields) => {
    if (err) {
      console.log('Error creating sessions table', err);
    }
  },
);


/**
 * A promise representing a pool of connections to a MySQL database.
 *
 * @typedef {Promise} PoolPromise
 */

/**
 * A promise representing a pool of connections to a MySQL database.
 *
 * @type {PoolPromise}
 * @exports default
 */
export default pool.promise();
