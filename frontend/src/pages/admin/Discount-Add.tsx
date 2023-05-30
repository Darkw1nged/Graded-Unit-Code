import { notSignedIn, protectRoute, managerArea } from '../../components/redirects';
import { useState } from 'react';

interface Discount {
    discount_name: string;
    discount_code: string;
    discount_amount: string;
}

const Page = () => {
    notSignedIn();
    protectRoute();
    managerArea();

    const [discount, setDiscount] = useState<Discount>({
        discount_name: "",
        discount_code: "",
        discount_amount: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setDiscount(prevDiscount => ({
            ...prevDiscount,
            [name]: value,
        }));
    }

    const AddDiscount = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        fetch("http://localhost:5000/api/v1/discounts/add", {
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

                    window.location.href = "/admin/discounts";
                });
            } else {
                res.json().then(response => {
                    const errorMessage = document.querySelector('.error') as HTMLElement;
                    errorMessage.innerHTML = response.message;
                    errorMessage.classList.add('active');
                    document.querySelector('.success')?.classList.remove('active');
                    console.error(`Error adding vehicle: ${response.error}`);
                })
            }
        })
        .catch(err => {
            console.error(`Error adding discount: ${err}`);
        });
    }

    return (
        <main>
            <h1>Add Discount</h1>

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>

            <form onSubmit={AddDiscount}>
                <input type="text" name="discount_name" placeholder="Name" value={discount.discount_name} onChange={handleInputChange} />
                <input type="text" name="discount_code" placeholder="Code" value={discount.discount_code} onChange={handleInputChange} />
                <input type="text" name="discount_amount" placeholder="Percentage" value={discount.discount_amount} onChange={handleInputChange} />

                <input type="submit" value="Add Discount" />
            </form>

        </main>
    )
}

export default Page;