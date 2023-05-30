import { notSignedIn, protectRoute, managerArea } from '../../components/redirects';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/admin-staff.css'

interface User {
    email: string;
    role: string;
    telephone?: string;
    created_at: Date;
}

const Page = () => {
    notSignedIn();
    protectRoute();
    managerArea();

    const [users, SetUsers] = useState<User[]>([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/v1/users/staff', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    SetUsers(response.staff);
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
            <div className="data">
                <div className='title'>
                    <h1>Staff Members</h1>
                    <Link to="/admin/add/staff">Add Staff Member</Link>
                </div>
                <table>
                    <thead>
                        <tr className="heading">
                            <th>Email</th>
                            <th>Registered</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { users !== undefined && users.length > 0 ? users.map((users) => (
                            <tr className="user" key={users.email}>
                                <td>{users.email}</td>
                                <td>{new Date(users.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{users.role}</td>
                                <td>{users.telephone}</td>
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