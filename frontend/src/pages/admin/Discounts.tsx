import { notSignedIn, protectRoute, managerArea } from '../../components/redirects';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Discount {
    discount_name: string;
    discount_code: string;
    discount_amount: number;
    disabled: boolean;
}

const Page = () => {
    notSignedIn();
    protectRoute();
    managerArea();

    const [discounts, setDiscounts] = useState<Discount[]>([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/discounts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setDiscounts(response.discounts);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }, []);

    const deleteDiscount = (discount_code: string) => {
        fetch("http://localhost:5000/api/v1/discounts/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ discount_code })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setDiscounts(response.discounts);
                });
            }
        })
        .catch(error => {
            console.error("Failed to delete user: " + error);
        });
    }

    return (
        <main>
            
            <div className="data">
                <div className="title">
                    <h1>Discounts</h1>
                    <Link to="/admin/add/discount">Add Discount</Link>
                </div>

                <table>
                    <thead>
                        <tr className="heading">
                            <th>Name</th>
                            <th>Code</th>
                            <th>Amount</th>
                            <th>Disabled</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        { discounts.length > 0 ? discounts.map((discount) => (
                            <tr className="user" key={discount.discount_code}>
                                <td>{discount.discount_name}</td>
                                <td>{discount.discount_code}</td>
                                <td>{discount.discount_amount}%</td>
                                <td>{discount.disabled ? "Yes" : "No"}</td>
                                <td>
                                    <Link to={"/admin/edit/discount?discount_code=" + discount.discount_code}>Edit</Link>
                                    <a onClick={() => deleteDiscount(discount.discount_code)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr className="user">
                                <td colSpan={5}>No discounts were found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </main>
    )
}

export default Page;