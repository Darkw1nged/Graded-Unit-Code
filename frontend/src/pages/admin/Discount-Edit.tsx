import { notSignedIn, protectRoute, managerArea } from '../../components/redirects';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

interface Discount {
    discount_name: string;
    discount_code: string;
    discount_amount: string;
    disabled: boolean;
}

const Page = () => {
    notSignedIn();
    protectRoute();
    managerArea();

    const { search } = useLocation();
    const { discount_code } = qs.parse(search, { ignoreQueryPrefix: true });

    const [discount, setDiscount] = useState<Discount>({
        discount_name: "",
        discount_code: "",
        discount_amount: "",
        disabled: false,
    });
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/discounts/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ discount_code })
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setDiscount(response.discount);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discount: ${err}`);
        });
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setDiscount(prevDiscount => ({
            ...prevDiscount,
            [name]: value,
        }));
    }

    const EditDiscount = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        fetch("http://localhost:5000/api/v1/discounts/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                discount,
                email: document.cookie.split("=")[2]
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    const successMessage = document.querySelector('.success') as HTMLElement;
                    successMessage.innerHTML = response.message;
                    successMessage.classList.add('active');
                    document.querySelector('.error')?.classList.remove('active');
                });
            } else {
                res.json().then(response => {
                    const errorMessage = document.querySelector('.error') as HTMLElement;
                    errorMessage.innerHTML = response.message;
                    errorMessage.classList.add('active');
                    document.querySelector('.success')?.classList.remove('active');
                    console.error(`Error editing discount: ${response.error}`);
                })
            }
        })
        .catch(err => {
            console.error(`Error editing discount: ${err}`);
        });
    }

    return (
        <main>
            <h1>Discount Edit</h1>

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>

            <form onSubmit={EditDiscount}>
                <input type="text" name="discount_name" id="discount_name" value={discount.discount_name} onChange={handleInputChange} />
                <input type="text" name="discount_code" id="discount_code" value={discount.discount_code} onChange={handleInputChange} />
                <input type="text" name="discount_amount" id="discount_amount" value={discount.discount_amount} onChange={handleInputChange} />
                <label htmlFor="disabled">Disabled</label>
                <input type="checkbox" name="disabled" checked={discount.disabled} onChange={handleInputChange} />
                <button type="submit">Edit Discount</button>
            </form>
        </main>
    )
}

export default Page;