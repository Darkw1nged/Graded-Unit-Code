import { redirectIfNotLoggedIn } from '../../components/redirects';
import { useEffect, useState } from 'react';

interface Profile {
    forename: string;
    lastname: string;
    email: string;
    role: string;
    bookings: number;
    created_at: string;
    telephone: string;
}

const Page = () => {
    redirectIfNotLoggedIn();

    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/admin/get/staff', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setProfiles(response);
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

    return (
        <main>
            <div className="users">
                <h1>New Users</h1>
                <table>
                    <thead>
                        <tr className="heading">
                            <th>Name</th>
                            <th>Registered</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { profiles.map((profile) => (
                                <tr className="user" key={profile.email}>
                                    <td>{profile.forename + ' ' + profile.lastname}</td>
                                    <td>{new Date(profile.created_at).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{profile.email}</td>
                                    <td>{profile.telephone}</td>
                                    <td>
                                        <a href="">Edit</a>
                                        <a href="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </main>
    )
};

export default Page;