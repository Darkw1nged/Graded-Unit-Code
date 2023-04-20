import { Request, Response } from 'express';
import { getConnection } from './database';
import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import User from './modules/user';
import Corporate from './modules/corporate';

class BookingService {

    /**
     * Seaches for available bookings.
     * @param req The request.
     * @param res The response.
     * @returns An array of available bookings.
     * @throws 400 if any required parameters are missing or invalid.
     */
    static async searchBookings(req: Request, res: Response) {
      // get data from request
      const { departureTime, arrivalTime } = req.body;
    
      // Check if all required parameters are present
      if (!departureTime || !arrivalTime) {
        res.status(400).json({
          message: 'Missing required parameters',
          status: 400
        });
        return;
      }
    
      // Check if departure time is in the past
      if (departureTime < new Date()) {
        res.status(400).json({
          message: 'Departure time must be in the future',
          status: 400
      });
        return;
      }
    
      // Check if arrivial time is in the past
      if (arrivalTime < new Date()) {
        res.status(400).json({
          message: 'Arrival time must be in the future',
          status: 400
        });
        return;
      }
    
      // Check if departure time is after arrival time
      if (departureTime > arrivalTime) {
        res.status(400).json({
          message: 'Departure time must be before arrival time',
          status: 400
        });
        return;
      }
    
      // Get a connection from the pool
      const connection = await getConnection() as PoolConnection; 
    
      // Search for available bookings
      try {
        // Currently there is 150 parking spaces available
        const availableSpaces = 150;
    
        // We need to check if there is any available spaces for the given time period
        const [rows] = await connection.query<RowDataPacket[]>(
          'SELECT COUNT(*) as count FROM bookings WHERE (bookedFrom <= ? AND bookedTo >= ?) OR (bookedFrom <= ? AND bookedTo >= ?)',
          [departureTime, departureTime, arrivalTime, arrivalTime]
        );
    
        // Check if there is any available spaces
        if (rows[0].count >= availableSpaces) {
          res.status(200).json({
            message: 'No available spaces',
            status: 200,
            data:
              {
                availableSpaces: 0,
                bookings: []
              }
          });
          return;
        }
    
        // If there are available spaces, return the number of spaces available
        const spacesAvailable = availableSpaces - rows[0].count;
        res.status(200).json({
          message: `${spacesAvailable} spaces available`,
          status: 200,
          data:
            {
              availableSpaces: spacesAvailable,
              bookings: []
            }
        });
      } finally {
        connection.release();
      }
    }

    /**
     * Creates a new booking.
     * @param req The request.
     * @param res The response.
     * @returns The booking's details.
     * @throws 400 if any required parameters are missing or invalid.
     * @throws 500 if the booking could not be created.
     */
    static async createBooking(req: Request, res: Response) {
      // TODO: Implement method
    }

    /**
     * Retrieves a booking by its ID.
     * @param req The request.
     * @param res The response.
     * @returns The booking's details.
     * @throws 404 if the booking ID is invalid or the booking does not exist.
     * @throws 500 if the booking could not be retrieved.
     */
    static async getBookingById(req: Request, res: Response) {
      // TODO: Implement method
    }

    /**
     * Retrieves all bookings for a given user.
     * @param user The user.
     * @param corporate The corporatation.
     * @returns An array of bookings.
     * @throws 404 if the user ID is invalid or the user does not exist.
     * @throws 500 if the bookings could not be retrieved.
     */
    static async getBookings(user?: User, corporate?: Corporate) {
      // TODO: Implement method
    }

    /**
     * Updates a booking by its ID.
     * @param req The request.
     * @param res The response.
     * @returns The updated booking's details.
     * @throws 400 if any parameters are missing or invalid.
     * @throws 404 if the booking ID is invalid or the booking does not exist.
     * @throws 500 if the booking could not be updated.
     */
    static async updateBooking(req: Request, res: Response) {
      // TODO: Implement method
    }

    /**
     * Cancels a booking by its ID.
     * @param req The request.
     * @param res The response.
     * @returns The cancelled booking's details.
     * @throws 404 if the booking ID is invalid or the booking does not exist.
     * @throws 500 if the booking could not be cancelled.
     */
    static async cancelBooking(req: Request, res: Response) {
      // TODO: Implement method
    }

}

export default BookingService;
