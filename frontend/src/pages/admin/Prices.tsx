import { useEffect, useState } from 'react';
import { notSignedIn, protectRoute, managerArea } from '../../components/redirects';

const Page = () => {
    notSignedIn();
    protectRoute();
    managerArea();

    const [price, setPrice] = useState<number>(0);
    const [spaces, setSpaces] = useState<number>(150);
    const [miniValet, setMiniValet] = useState<number>(64);
    const [fullValet, setFullValet] = useState<number>(90);
    const [signatureValet, setSignatureValet] = useState<number>(120);
    

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/prices', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setPrice(response.price_per_day);
                    setSpaces(response.spaces_available);
                    setMiniValet(response.mini_valet);
                    setFullValet(response.full_valet);
                    setSignatureValet(response.signature_valet);
                });
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch('http://localhost:5000/api/v1/prices/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price_per_day: price,
                spaces_available: spaces,
                mini_valet: miniValet,
                full_valet: fullValet,
                signature_valet: signatureValet,
                email: document.cookie.split("=")[2]
            })
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then((response) => {
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
                    console.error(`Error updating user: ${response.error}`);
                })
            }
        })
        .catch(err => {
            console.error(`Error fetching discounts: ${err}`);
        });
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(parseInt(e.target.value));
    }
    const handleSpacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpaces(parseInt(e.target.value));
    }
    const handleMiniValetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMiniValet(parseInt(e.target.value));
    }
    const handleFullValetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullValet(parseInt(e.target.value));
    }
    const handleSignitureValetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignatureValet(parseInt(e.target.value));
    }


    return (
        <main>
            <h1>Admin Prices</h1>

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="">Price Per Day</label>
                <input type="number" name="price" value={price} onChange={handlePriceChange} />

                <label htmlFor="">Spaces avaiable</label>
                <input type="number" name="spaces" value={spaces} onChange={handleSpacesChange} />

                <label htmlFor="">Mini Valet</label>
                <input type="number" name="miniValet" value={miniValet} onChange={handleMiniValetChange} />

                <label htmlFor="">Full Valet</label>
                <input type="number" name="fullValet" value={fullValet} onChange={handleFullValetChange} />

                <label htmlFor="">Signiture Valet</label>
                <input type="number" name="signitureValet" value={signatureValet} onChange={handleSignitureValetChange} />

                <button type="submit">Update</button>
            </form>

        </main>
    )
}

export default Page;