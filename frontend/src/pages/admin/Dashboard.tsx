import '../../style/admin-dash.css'
import { notSignedIn, protectRoute } from '../../components/redirects';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
    email: string;
    telephone?: string;
    created_at: Date;
    suspended?: boolean;
}

const Page = () => {
    notSignedIn();
    protectRoute();

    const [users, SetUsers] = useState<User[]>([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    SetUsers(response.users);
                })
            } else {
                res.json().then(response => {
                    console.log(response.message);
                })
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    const [statistics, setStatistics] = useState({
        sales: 0,
        users: 0,
        bookings: 0
    });
    const [oldStatistics, setOldStatistics] = useState({
        sales: 0,
        users: 0,
        bookings: 0
    });
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/admin/dashboard/statistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: new Date() })
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(async response => {
                    await setStatistics(response);
                })
            } else {
                res.json().then(response => {
                    console.log(response.message);
                })
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });

        const date = new Date();
        date.setMonth(date.getMonth() - 1);

        fetch('http://localhost:5000/api/v1/admin/dashboard/statistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: new Date().setMonth(new Date().getMonth() - 1) })
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(async response => {
                    await setOldStatistics(response);
                })
            } else {
                res.json().then(response => {
                    console.log(response.message);
                })
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    const [spaces, setSpaces] = useState<number>(150);
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/prices', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setSpaces(response.spaces_available);
                })
            } else {
                res.json().then(response => {
                    console.log(response.message);
                })
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    function calculateDifference(currentStats: any, oldStats: any) {
        const percentageChange: Record<string, number> = {};

        for (const key in currentStats) {
            if (currentStats.hasOwnProperty(key)) {
                const currentValue = currentStats[key];
                const oldValue = oldStats ? oldStats[key] : 0;

                if (currentValue === oldValue) {
                    percentageChange[key] = 0;
                } else {
                    const change = currentValue - oldValue;
                    const percentage = (change / (oldValue || 1)) * 100;
                    percentageChange[key] = Math.round(percentage);
                }
            }
        }

        return percentageChange;
    }
    const changes = calculateDifference(statistics, oldStatistics);
    const compare = document.querySelectorAll(".compare");
    compare.forEach((div) => {
        const span = div.querySelector("span");
        if (span) {
            if (span.id === "users-value") {
                if (changes.users > 0) {
                    compare[1].classList.remove("even");
                    compare[1].classList.add("up");
                    span.innerText = "🠉 " + changes.users + "%";
                } else if (changes.users < 0) {
                    compare[1].classList.remove("even");
                    compare[1].classList.add("down");
                    span.innerText = "🠋 " + changes.users + "%";
                } else {
                    compare[1].classList.add("even");
                    span.innerText = "- 0%";
                }
            } else if (span.id === "bookings-value") {
                if (changes.bookings > 0) {
                    compare[2].classList.remove("even");
                    compare[2].classList.add("up");
                    span.innerText = "🠉 " + changes.bookings + "%";
                } else if (changes.bookings < 0) {
                    compare[2].classList.remove("even");
                    compare[2].classList.add("down");
                    span.innerText = "🠋 " + changes.bookings + "%";
                } else {
                    compare[2].classList.add("even");
                    span.innerText = "- 0%";
                }
            } else if (span.id === "sales-value") {
                if (changes.sales > 0) {
                    compare[0].classList.remove("even");
                    compare[0].classList.add("up");
                    span.innerText = "🠉 " + changes.sales + "%";
                } else if (changes.sales < 0) {
                    compare[0].classList.remove("even");
                    compare[0].classList.add("down");
                    span.innerText = "🠋 " + changes.sales + "%";
                } else {
                    compare[0].classList.add("even");
                    span.innerText = "- 0%";
                }
            }
        }
    });

    const deleteAccount = (email: string) => {
        fetch("http://localhost:5000/api/v1/users/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
        .then(async res => {
            if (res.status !== 200) {
                const response = await res.json();
                console.error(`Error deleting user: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to delete user: " + error);
        });
    }

    return (
        <main>
            <div className="stats">
                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Sales</p>
                            <h2>£{statistics.sales || 0}</h2>
                        </div>
                        <div className="bubble">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card" viewBox="0 0 16 16"> 
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/> 
                                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/> 
                            </svg>
                        </div>
                    </div>

                    <div className="compare">
                        <span id="sales-value"></span>
                        <p>Since last month</p>
                    </div>
                </div>
                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Members</p>
                            <h2>{statistics.users || 0}</h2>
                        </div>
                        <div className="bubble">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="compare">
                        <span id="users-value"></span>
                        <p>Since last month</p>
                    </div>
                </div>

                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Bookings</p>
                            <h2>{statistics.bookings || 0}</h2>
                        </div>
                        <div className="bubble">
                            <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <rect x="9" y="8" width="30" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
                                <path d="M18 4V10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M30 4V10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 19L32 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 27L28 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 35H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>

                    <div className="compare">
                        <span id="bookings-value"></span>
                        <p>Since last month</p>
                    </div>
                </div>

                <div className="item">
                    <div className="header">
                        <div className="values">
                            <p>Spaces Available </p>
                            <h2>{spaces || 150}</h2>
                        </div>
                        <div className="bubble">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,2,0V14h2a4,4,0,0,0,0-8Zm0,6H10V8h2a2,2,0,0,1,0,4ZM19,2H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="compare even">
                        <span> - 0%</span>
                        <p>Since last month</p>
                    </div>
                </div>
            </div>

            <div className="data">
                <h1>New Users</h1>
                <table>
                    <thead>
                        <tr className="heading">
                            <th>Email</th>
                            <th>Registered</th>
                            <th>Phone</th>
                            <th>Suspended</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { users.length > 0 ? users.map((users) => (
                            <tr className="user" key={users.email}>
                                <td>{users.email}</td>
                                <td>{new Date(users.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{users.telephone}</td>
                                <td>{users.suspended === false || !users.suspended ? "No" : "Yes" }</td>
                                <td>
                                    <Link to={"/admin/edit/user?email=" + users.email}>Edit</Link>
                                    <a onClick={() => deleteAccount(users.email)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr className="user">
                                <td colSpan={6}>No users were found.</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </main>
    );
};

export default Page;