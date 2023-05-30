import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';
import '../../style/booking-create.css';

interface User {
    email: string;
    role: string;
    telephone?: string;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    region?: string;
    zip?: string;
    country?: string;
    suspended?: boolean;
}

interface Person {
    UserID: number;
    forename: string;
    surname: string;
    middle_name?: string;
    family_name?: string;
    date_of_birth?: Date;
}

interface Business {
    UserID: number;
    name: string;
    slogan?: string;
    description?: string;
}

interface vehicle {
    registration_number: string;
    user_id: number;
    make: string;
    model: string;
    colour: string;
}

interface Extra {
    booking_id: number;
    mini_valet: boolean;
    full_valet: boolean;
    signature_valet: boolean;
}

interface Card {
    user_id: number;
    cardholder_name: string;
    card_number: string;
    expiry_date: string;
    cvv: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

const Page = () => {

    const { search } = useLocation();
    const { space, departureTime, arrivalTime } = qs.parse(search, { ignoreQueryPrefix: true });
    {
        if (departureTime === undefined || arrivalTime === undefined) {
            window.location.href = '/booking'
        }
    }
    const stringDepartureTime = departureTime as string;
    const stringArrivalTime = arrivalTime as string;

    const [products, setProducts] = useState<Product[]>([]);
    const diff = Math.abs(new Date(stringDepartureTime).getTime() - new Date(stringArrivalTime).getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const email = document.cookie.split('=')[2];
    const [isLoggedIn] = useState<boolean>(email !== undefined);
    const [user, setUser] = useState<User>({
        email: '',
        role: '',
        telephone: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        region: '',
        zip: '',
        country: '',
        suspended: false
    });
    const [person, setPerson] = useState<Person>({
        UserID: 0,
        forename: '',
        surname: '',
        middle_name: '',
        family_name: '',
        date_of_birth: new Date()
    });
    const [business, setBusiness] = useState<Business>({
        UserID: 0,
        name: '',
        slogan: '',
        description: ''
    });
    const [cardSelected, setCardSelected] = useState<boolean>(false);
    const [addNewCard, setAddNewCard] = useState<boolean>(false);
    const [userCards, setUserCards] = useState<Card[]>([]);
    const [card, setCard] = useState<Card>({
        user_id: 0,
        cardholder_name: '',
        card_number: '',
        expiry_date: '',
        cvv: ''
    });
    const [addNewVehicle, setAddNewVehicle] = useState<boolean>(false);
    const [userVehicles, setUserVehicles] = useState<vehicle[]>([]);
    const [vehicle, setVehicle] = useState<vehicle>({
        registration_number: '',
        user_id: 0,
        make: '',
        model: '',
        colour: ''
    });
    useEffect(() => {
        fetch("http://localhost:5000/api/v1/users/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
            .then(async res => {
                if (res.status === 200) {
                    res.json().then((response) => {
                        setUser(response.user);
                        setPerson(response.person);
                        setBusiness(response.business);
                        setUserCards(response.cards);
                        setUserVehicles(response.vehicles);
                    });
                } else {
                    const response = await res.json();
                    console.error(`Error fetching user: ${response.error}`);
                }
            })
            .catch(error => {
                console.error("Failed to fetch user: " + error);
            });
    }, [email]);

    const [extra, setExtra] = useState<Extra>({
        booking_id: 0,
        mini_valet: false,
        full_valet: false,
        signature_valet: false
    });
    const [discount, setDiscount] = useState<string>("");

    const [price, setPrice] = useState<number>(0);
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

    const [total, setTotal] = useState<number>(days * price);
    useEffect(() =>
        setTotal(days * price), [days, price]
    )

    useEffect(() => {
        if (products.some(product => product.id === "price_1NDSQwJIkbqsu1ayXMZupZ6d")) {
            setProducts(prevProducts => ([{
                id: "price_1NDSQwJIkbqsu1ayXMZupZ6d",
                name: "Space per Day",
                description: "The price per day for a parking space.",
                price: price,
                quantity: days
            }]));
        } else {
            setProducts(prevProducts => ([...prevProducts, {
                id: "price_1NDSQwJIkbqsu1ayXMZupZ6d",
                name: "Space per Day",
                description: "The price per day for a parking space.",
                price: price,
                quantity: days
            }]));
        }
    }, [days, price])

    const [isCash, setIsCash] = useState<boolean>(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setUser(prevProfile => ({
            ...prevProfile,
            [name]: value,
        }));
    }
    const handlePersonInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPerson(prevPerson => ({
            ...prevPerson,
            [name]: value,
        }));
    }
    const handleBusinessInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBusiness(prevBusiness => ({
            ...prevBusiness,
            [name]: value,
        }));
    }
    const handlePaymentClick = (isCard: boolean) => {
        if (isCard) {
            setAddNewCard(false);
            setCardSelected(true);
            setIsCash(false);
            return;
        }
        setAddNewCard(false);
        setCardSelected(false);
        setIsCash(true);
    }
    const handleCardSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === 'Add New') {
            setAddNewCard(true);
            return;
        } else {
            setAddNewCard(false);
        }

        const card = JSON.parse(event.target.value);
        setCard(card);
    }
    const handleCardInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCard(prevCard => ({
            ...prevCard,
            [name]: value,
        }));
    }
    const handleVehicleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === 'Add New') {
            setAddNewVehicle(true);
            return;
        } else {
            setAddNewVehicle(false);
        }

        const vehicle = JSON.parse(event.target.value);
        setVehicle(vehicle);
    }
    const handleVehicleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setVehicle(prevVehicle => ({
            ...prevVehicle,
            [name]: value,
        }));
    }
    const handleExtraInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setExtra(prevExtra => ({
            ...prevExtra,
            [name]: checked,
        }));

        if (name === "mini_valet") {
            if (checked) {
                setProducts(prevProducts => ([
                    ...prevProducts,
                    {
                        id: "price_1NDSQ4JIkbqsu1ayrsIYK4fY",
                        name: "Mini Valet",
                        description: "Our mini valet service includes a full exterior wash, interior vacuum, and tyre shine.",
                        price: miniValet,
                        quantity: 1
                    }
                ]));
                setTotal(total + parseInt(miniValet.toString()));
            } else {
                setProducts(prevProducts => ([
                    ...prevProducts.filter(product => product.id !== "price_1NDSQ4JIkbqsu1ayrsIYK4fY")
                ]));
                setTotal(total - parseInt(miniValet.toString()));
            }
        } else if (name === "full_valet") {
            if (checked) {
                setProducts(prevProducts => ([
                    ...prevProducts,
                    {
                        id: "price_1NDSPVJIkbqsu1ayRdY11B6i",
                        name: "Full Valet",
                        description: "Our full valet service includes a full exterior wash, interior vacuum, tyre shine, and interior wipe down.",
                        price: fullValet,
                        quantity: 1
                    }
                ]));
                setTotal(total + parseInt(fullValet.toString()));
            } else {
                setProducts(prevProducts => ([
                    ...prevProducts.filter(product => product.id !== "price_1NDSPVJIkbqsu1ayRdY11B6i")
                ]));
                setTotal(total - parseInt(fullValet.toString()));
            }
        } else if (name === "signature_valet") {
            if (checked) {
                setProducts(prevProducts => ([
                    ...prevProducts,
                    {
                        id: "price_1NDSOXJIkbqsu1ayTcJ15wCy",
                        name: "Signature Valet",
                        description: "Our signature valet service includes a full exterior wash, interior vacuum, tyre shine, interior wipe down, and wax.",
                        price: signatureValet,
                        quantity: 1
                    }
                ]));
                setTotal(total + parseInt(signatureValet.toString()));
            } else {
                setProducts(prevProducts => ([
                    ...prevProducts.filter(product => product.id !== "price_1NDSOXJIkbqsu1ayTcJ15wCy")
                ]));
                setTotal(total - parseInt(signatureValet.toString()));
            }
        }
    }
    const handleDiscountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setDiscount(value);
    }

    const nextPage = (page: number) => {
        if (page === 1) {
            document.getElementById("1")?.classList.add("hide");
            document.getElementById("2")?.classList.remove("hide");
            document.getElementById("3")?.classList.add("hide");
        } else if (page === 2) {
            document.getElementById("1")?.classList.add("hide");
            document.getElementById("2")?.classList.add("hide");
            document.getElementById("3")?.classList.remove("hide");
        }
    }

    const makeBooking = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await fetch("http://localhost:5000/api/v1/bookings/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                space,
                departureTime,
                arrivalTime,
                user: user,
                person: person,
                business: business,
                card: card,
                vehicle: vehicle,
                extra: extra,
                discount: discount,
                isLoggedIn: isLoggedIn,
                cost: total,
                cash: true
            })
        }).then(async res => {
            if (res.status === 200) {
                res.json().then(async (response) => {
                    const successMessage = document.querySelector('.success') as HTMLElement;
                    successMessage.innerHTML = response.message;
                    successMessage.classList.add('active');
                    document.querySelector('.error')?.classList.remove('active');

                    window.location.href = '/account?email=' + user.email;
                });
            } else {
                res.json().then((response) => {
                    const errorMessage = document.querySelector('.error') as HTMLElement;
                    errorMessage.innerHTML = response.message;
                    errorMessage.classList.add('active');
                    document.querySelector('.success')?.classList.remove('active');
                    console.error(`Error creating booking user: ${response.error}`);
                });
            }
        }).catch(error => {
            console.error("Failed to create booking: " + error);
        });
    }
    const stripeCall = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await fetch("http://localhost:5000/api/v1/bookings/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                space,
                departureTime,
                arrivalTime,
                user: user,
                person: person,
                business: business,
                card: card,
                vehicle: vehicle,
                extra: extra,
                discount: discount,
                isLoggedIn: isLoggedIn,
                cost: total,
                cash: false
            })
        }).then(async res => {
            if (res.status === 200) {
                res.json().then(async (response) => {
                    const successMessage = document.querySelector('.success') as HTMLElement;
                    successMessage.innerHTML = response.message;
                    successMessage.classList.add('active');
                    document.querySelector('.error')?.classList.remove('active');

                    if (response.booking_id === undefined) {
                        const errorMessage = document.querySelector('.error') as HTMLElement;
                        errorMessage.innerHTML = "There was an error creating your booking. Please try again later."
                        errorMessage.classList.add('active');
                        document.querySelector('.success')?.classList.remove('active');
                        return;
                    }

                    await fetch("http://localhost:5000/api/v1/checkout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            products,
                            email: user.email,
                            booking_id: await response.booking_id
                        })
                    }).then((res) => {
                        res.json().then((response) => {
                            if (response.url) {
                                window.location.assign(response.url);
                            }
                        })
                    })

                });
            } else {
                res.json().then((response) => {
                    const errorMessage = document.querySelector('.error') as HTMLElement;
                    errorMessage.innerHTML = response.message;
                    errorMessage.classList.add('active');
                    document.querySelector('.success')?.classList.remove('active');
                    console.error(`Error creating booking user: ${response.error}`);
                });
            }
        }).catch(error => {
            console.error("Failed to create booking: " + error);
        });
    }

    return (
        <div className="booking-page">

            <br /><br /><br />

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>

            <div id="1">
                <h3>Personal Details</h3>
                <form>
                    {!isLoggedIn ? (
                        <input type="text" name="email" value={user.email} onChange={handleInputChange} placeholder='Email' />
                    ) : (
                        <input type="text" name="email" value={user.email} onChange={handleInputChange} disabled />
                    )}

                    {user.role !== null && user.role === 'business' ? (
                        <>
                            <input type="text" name="businessName" value={business.name || ''} onChange={handleBusinessInputChange} placeholder="Business Name" required />

                            <div className="compact">
                                <input type="text" name="slogan" value={business.slogan || ''} onChange={handleBusinessInputChange} placeholder="Slogan (Optional)" />
                                <input type="text" name="description" value={business.description || ''} onChange={handleBusinessInputChange} placeholder="Description (Optional)" />
                            </div>
                        </>
                    ) : (
                        <div className="compact">
                            <input type="text" name="forename" value={person.forename || ''} onChange={handlePersonInputChange} placeholder="First Name" required />
                            <input type="text" name="surname" value={person.surname || ''} onChange={handlePersonInputChange} placeholder="Last Name" required />
                        </div>
                    )}

                    <input type="text" name="telephone" value={user.telephone || ''} onChange={handleInputChange} placeholder="Phone Number" />

                    <div className="break">
                        <p>Address</p>
                    </div>

                    <input type="text" name="addressLineOne" value={user.addressLineOne || ''} onChange={handleInputChange} placeholder="Address" />

                    <div className="compact">
                        <input type="text" name="addressLineTwo" value={user.addressLineTwo || ''} onChange={handleInputChange} placeholder="Address 2 (Optional)" />
                        <input type="text" name="zip" value={user.zip || ''} onChange={handleInputChange} placeholder="Postal Code" />
                    </div>

                    <div className="compact">
                        <input type="text" name="city" value={user.city || ''} onChange={handleInputChange} placeholder="City" />
                        <select name="country" value={user.country || ''} onChange={handleInputChange} placeholder="Country" >
                            <option value="" hidden selected>Country</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Brunei ">Brunei </option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                            <option value="Cabo Verde">Cabo Verde</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Central African Republic">Central African Republic</option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czechia (Czech Republic)">Czechia (Czech Republic)</option>
                            <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">Dominican Republic</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Eswatini (fmr. 'Swaziland')">Eswatini (fmr. "Swaziland")</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Greece">Greece</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-Bissau">Guinea-Bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Holy See">Holy See</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran">Iran</option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Laos">Laos</option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libya">Libya</option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">Marshall Islands</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia">Micronesia</option>
                            <option value="Moldova">Moldova</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar (formerly Burma)">Myanmar (formerly Burma)</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="North Korea">North Korea</option>
                            <option value="North Macedonia">North Macedonia</option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Palestine State">Palestine State</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">Papua New Guinea</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Romania">Romania</option>
                            <option value="Russia">Russia</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                            <option value="Saint Lucia">Saint Lucia</option>
                            <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">Solomon Islands</option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Korea">South Korea</option>
                            <option value="South Sudan">South Sudan</option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syria">Syria</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Timor-Leste">Timor-Leste</option>
                            <option value="Togo">Togo</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States of America">United States of America</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Vietnam">Vietnam</option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                        </select>
                    </div>

                    <input value="Continue" onClick={() => nextPage(1)} />
                </form>
            </div>

            <div id="2" className='hide'>
                <h3> Vehicle Details + Extras</h3>
                <form>
                    <select name="vehicles" onChange={handleVehicleSelectChange} required>
                        <option selected hidden>Please Select</option>
                        {isLoggedIn ? (
                            <>
                                {userVehicles.map((vehicle) => (
                                    <option key={vehicle.registration_number} value={JSON.stringify(vehicle)}>{vehicle.make + " " + vehicle.model}</option>
                                ))}
                            </>
                        ) : (
                            <></>
                        )}
                        <option value="Add New">Add New</option>
                    </select>

                    {addNewVehicle ? (
                        <>
                            <input type="text" name="registration_number" placeholder='Registration' value={vehicle.registration_number || ''} onChange={handleVehicleInputChange} required />
                            <input type="text" name="make" placeholder='Make' value={vehicle.make || ''} onChange={handleVehicleInputChange} required />
                            <input type="text" name="model" placeholder='Model' value={vehicle.model || ''} onChange={handleVehicleInputChange} required />
                            <input type="text" name="colour" placeholder='Colour' value={vehicle.colour || ''} onChange={handleVehicleInputChange} required />
                        </>
                    ) : (
                        <></>
                    )}

                    <div className="compact">
                        <input type="checkbox" name="mini_valet" checked={extra.mini_valet || false} onChange={handleExtraInputChange} />
                        <label htmlFor="Valet">Mini Vallet</label>
                    </div>

                    <div className="compact">
                        <input type="checkbox" name="full_valet" checked={extra.full_valet || false} onChange={handleExtraInputChange} />
                        <label htmlFor="Valet">Full Vallet</label>
                    </div>

                    <div className="compact">
                        <input type="checkbox" name="signature_valet" checked={extra.signature_valet || false} onChange={handleExtraInputChange} />
                        <label htmlFor="Valet">Signiture Vallet</label>
                    </div>

                    <input value="Continue" onClick={() => nextPage(2)} />
                </form>
            </div>

            <div id="3" className='hide'>
                <h3>Payment Details</h3>
                <button onClick={() => handlePaymentClick(true)}>
                    Card
                </button>
                <button onClick={() => handlePaymentClick(false)}>
                    Cash
                </button>
                <form onSubmit={isCash ? makeBooking : stripeCall}>
                    {cardSelected ? (
                        <>
                            <select name="cards" onChange={handleCardSelectChange} required>
                                <option selected hidden>Please Select</option>
                                {isLoggedIn ? (
                                    <>
                                        {userCards !== undefined && userCards.map((card) => (
                                            <option key={card.cvv} value={JSON.stringify(card)}>{card.cardholder_name + " " + card.card_number}</option>
                                        ))}
                                    </>
                                ) : (
                                    <></>
                                )}
                                <option value="Add New">Add New</option>
                            </select>
                        </>
                    ) : (
                        <></>
                    )
                    }

                    {addNewCard ? (
                        <>
                            <input type="text" name="cardholder_name" placeholder="Cardholder Name" value={card.cardholder_name} onChange={handleCardInputChange} required />
                            <input type="text" name="card_number" placeholder="Card Number" value={card.card_number} onChange={handleCardInputChange} required />

                            <div className="compact">
                                {/* <input type="month" name="expiry"/> */}
                                <input type="text" name="expiry_date" placeholder="Expiry Date (MM/YY)" value={card.expiry_date} onChange={handleCardInputChange} required />
                                <input type="text" name="cvv" placeholder="CVV/CVC" value={card.cvv} onChange={handleCardInputChange} required />
                            </div>
                        </>
                    ) : (
                        <></>
                    )}

                    <input type="text" name="discount" placeholder='Discount' value={discount} onChange={handleDiscountInputChange} />

                    <input type="submit" value="Book Now" />
                </form>

                <h1>total: £{total}</h1>
            </div>

        </div>
    )
}

export default Page;