import { useEffect, useState } from 'react';
import { notSignedIn, protectRoute, managerArea } from '../../components/redirects';
import jsPDF from 'jspdf';


interface Booking {
    id: number;
    user_id: number;
    vehicle_registration_number: string;
    extras_id?: number;
    discount_id?: number;
    space: number;
    date_booked: Date;
    booked_from: Date;
    booked_until: Date;
    cost: number;
    paid: boolean;
}

const ExportPage = () => {
    notSignedIn();
    protectRoute();
    managerArea();

    const [dailyBookings, setDailyBookings] = useState<Booking[]>([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/admin/analytics/bookings/daily", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setDailyBookings(response.bookings);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }, []);

    const [monthlyBookings, setMonthlyBookings] = useState<Booking[]>([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/admin/analytics/bookings/monthly", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setMonthlyBookings(response.bookings);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }, []);

    const generateDailyBookingReport = async () => {
        const data: { [key: string]: string; }[] = [];

        await Promise.all(
            dailyBookings.map(async (booking) => {
                try {
                    const response = await fetch("http://localhost:5000/api/v1/bookings/fetch-details", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user_id: booking.user_id,
                            vehicle_registration: booking.vehicle_registration_number,
                        }),
                    });

                    if (response.status === 200) {
                        const { user, person, business, vehicle } = await response.json();

                        data.push({
                            "Customer": `${person.forename} ${person.surname}`,
                            "Contact": `${user.email} ${user.telephone}`,
                            "Vehicle Reg": vehicle.registration_number,
                            "Vehicle Model": vehicle.model,
                            "Arrival": new Date(booking.booked_from).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                            "Departure": new Date(booking.booked_until).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        });
                    } else {
                        throw new Error('Failed to fetch user and vehicle details');
                    }
                } catch (error) {
                    console.error(`Error fetching user and vehicle details: ${error}`);
                    throw error;
                }
            })
        );

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });
        doc.text('Daily Bookings Report', 10, 10);
        doc.line(10, 12, 200, 12);
        doc.table(5, 15, data, ['Customer', 'Contact', 'Vehicle Reg', 'Vehicle Model', 'Arrival', 'Departure'], { autoSize: false });
        doc.output('dataurlnewwindow');
    };
    const generateMonthlyBookingsReport = async () => {
        const data: { [key: string]: string }[] = [];
        const bookingsPerDay: { [key: string]: number } = {};
        const incomePerDay: { [key: string]: number } = {};

        monthlyBookings.forEach((booking) => {
            const date = new Date(booking.booked_from).toLocaleDateString('en-GB');

            if (bookingsPerDay[date]) {
                bookingsPerDay[date]++;
            } else {
                bookingsPerDay[date] = 1;
            }

            if (incomePerDay[date]) {
                incomePerDay[date] += booking.cost;
            } else {
                incomePerDay[date] = booking.cost;
            }
        });

        for (const date in bookingsPerDay) {
            if (bookingsPerDay.hasOwnProperty(date)) {
                const formattedIncome = incomePerDay[date].toLocaleString('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });

                data.push({
                    Date: date,
                    Bookings: bookingsPerDay[date].toString(),
                    Income: '£' + formattedIncome,
                });
            }
        }

        // Generate the PDF report using jsPDF
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
        });
        doc.text('Monthly Bookings Report', 10, 10);
        doc.line(10, 12, 200, 12);
        doc.table(5, 15, data, ['Date', 'Bookings', 'Income'], { autoSize: false });
        doc.output('dataurlnewwindow');
    };
    const generateMonthlyTurnoverReport = async () => {
        const data: { [key: string]: string }[] = [];

        monthlyBookings.forEach((booking, index) => {
            const formattedPrice = booking.cost.toLocaleString('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            data.push({
                'Booking Number': `#${index + 1}`,
                'Date of Booking': new Date(booking.booked_from).toLocaleDateString('en-GB'),
                Price: formattedPrice,
            });
        });

        const totalTurnover = monthlyBookings.reduce((sum, booking) => sum + booking.cost, 0);
        const formattedTotalTurnover = totalTurnover.toLocaleString('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        data.push({
            'Booking Number': '',
            'Date of Booking': 'Total Turnover:',
            Price: formattedTotalTurnover,
        });
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        doc.text('Monthly Turnover Report', 10, 10);
        doc.line(10, 12, 200, 12);
        doc.table(10, 20, data, ['Booking Number', 'Date of Booking', 'Price'], { autoSize: false });
        doc.output('dataurlnewwindow');
    };

    return (
        <main>
            <main>
                <h1>Daily report</h1>
                <button onClick={generateDailyBookingReport}>Generate Daily Booking Report</button>

                <h1>Monthly Report</h1>
                <button onClick={generateMonthlyBookingsReport}>Generate Monthly Bookings Report</button>

                <h1>Monthly turnover</h1>
                <button onClick={generateMonthlyTurnoverReport}>Generate Monthly Turnover Report</button>

            </main>
        </main>
    )
}

export default ExportPage;