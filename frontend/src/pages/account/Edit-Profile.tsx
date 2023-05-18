import { redirectIfNotLoggedIn } from "../../components/redirects";
import '../../style/edit-profile.css';
import { useEffect, useState } from 'react';

const changePage = () => {
    const page = document.getElementById("page-1");
    const page2 = document.getElementById("page-2");
    const page3 = document.getElementById("page-3");

    if (page == null || page2 == null || page3 == null) {
        return;
    }

    const account = document.getElementById("page-account");
    const vehicles = document.getElementById("page-vehicles");
    const payments = document.getElementById("page-payments");

    if (account == null || vehicles == null || payments == null) {
        return;
    }

    account.addEventListener("click", () => {
        page.classList.remove("hide")
        page2.classList.add("hide")
        page3.classList.add("hide")
    });

    vehicles.addEventListener("click", () => {
        page.classList.add("hide")
        page2.classList.remove("hide")
        page3.classList.add("hide")
    });

    payments.addEventListener("click", () => {
        page.classList.add("hide")
        page2.classList.add("hide")
        page3.classList.remove("hide")
    });
}

interface Vehicle {
    registration: string;
    make: string;
    model: string;
    colour: string;
}

interface Payment {
    cardholder_name: string;
    card_number: string;
    card_expiry: string;
    cvv: string;
}

const Page = () => {
    redirectIfNotLoggedIn();

    const access_token = document.cookie.split("access_token=")[1]?.split(";")[0];
    const [userProfile, setUserProfile] = useState({
        email: '',
        businessName: '',
        forename: '',
        lastname: '',
        telephone: '',
        addressID: null,
    })    
    const [userAddress, setUserAddress] = useState({
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        postcode: '',
        country: ''
    })
    const [vehicle, setVehicle] = useState({
        registration: '',
        make: '',
        model: '',
        colour: ''
    })
    const [payment, setPayment] = useState({
        cardholder_name: '',
        card_number: '',
        card_expiry: '',
        cvv: ''
    })

    const [userPayments, setUserPayments] = useState<Payment[]>([]);
    const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
    const isLoggedIn = document.cookie.includes('access_token');
    const [formValues] = useState({
        access_token: access_token,
        email: '',
        buissnessName: '',
        forename: '',
        lastname: '',
        telephone: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        postcode: '',
        country: '',
        Registration: '',
        Make: '',
        Model: '',
        Colour: ''
    });
    let isCorporateUser = false;

    useEffect(() => {
        const getUser = async () => {
            fetch("http://localhost:5000/account/find", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formValues)
            })
            .then(async res =>{
                if (res.status === 200) {
                    const response = await res.json();
                    await setUserProfile(response.user);
                    await setUserAddress(response.address);
                    await setUserVehicles(response.vehicles);
                    await setUserPayments(response.payments);
                    isCorporateUser = response.isCorporateUser;
                } else {
                    const response = await res.json();
                    isCorporateUser = false;
                    console.error(`Error retrieving user profile: ${response.error}`);
                }
            })
            .catch(error => {
                console.error("Failed to fetch profile: " + error);
            });
        }

        getUser();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserProfile(prevProfile => ({
            ...prevProfile,
            [name]: value,
        }));
    }    
    const handleAddressInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setUserAddress(prevAddress => ({
            ...prevAddress,
            [name]: value,
        }));
    }
    const handleVehicleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setVehicle(prevVehicle => ({
            ...prevVehicle,
            [name]: value,
        }));
    }
    const handlePaymentInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPayment(prevPayment => ({
            ...prevPayment,
            [name]: value,
        }));
    }

    const processForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch("http://localhost:5000/account/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: access_token,
                userProfile: userProfile,
                userAddress: userAddress
            })
        })
        .then(async res =>{
            if (res.status === 200) {
                const response = await res.json();
                console.log(response);
            } else {
                const response = await res.json();
                console.error(`Error updating user profile: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to update profile: " + error);
        });
    }

    const addVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch("http://localhost:5000/account/add-vehicle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: access_token,
                vehicle: vehicle
            })
        })
        .then(async res =>{
            if (res.status === 200) {
                const response = await res.json();
                console.log(response);
                window.location.reload()
            } else {
                const response = await res.json();
                console.error(`Error adding vehicle: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to add vehicle: " + error);
        });
    }

    const addPayment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch("http://localhost:5000/account/add-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: access_token,
                payment: payment
            })
        })
        .then(async res =>{
            if (res.status === 200) {
                const response = await res.json();
                console.log(response);
                window.location.reload()
            } else {
                const response = await res.json();
                console.error(`Error adding payment: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to add payment: " + error);
        });
    }

    const deleteVehicle = (vehicle: Vehicle) => async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();

        fetch("http://localhost:5000/account/delete-vehicle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: access_token,
                vehicle: vehicle
            })
        })
        .then(async res =>{
            if (res.status === 200) {
                const response = await res.json();
                console.log(response);
                window.location.reload()
            } else {
                const response = await res.json();
                console.error(`Error deleting vehicle: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to delete vehicle: " + error);
        });
    }

    const deletePayment = (payment: Payment) => async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();

        fetch("http://localhost:5000/account/delete-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: access_token,
                payment: payment
            })
        })
        .then(async res =>{
            if (res.status === 200) {
                const response = await res.json();
                console.log(response);
                window.location.reload()
            } else {
                const response = await res.json();
                console.error(`Error deleting payment: ${response.error}`);
            }
        })
        .catch(error => {
            console.error("Failed to delete payment: " + error);
        });
    }

    return (
        <div className="edit-profile-page">
            <div className="container">
                <div className="page-navigation">
                    <ul>
                        <li>
                            <button onClick={changePage} id="page-account">Account</button>
                            <button onClick={changePage} id="page-vehicles">Vehicles</button>
                            <button onClick={changePage} id="page-payments">Payments</button>
                        </li>
                    </ul>
                </div>
                <div className="page-content">
                    <div className="account-information" id="page-1">

                        <div className="form">
                            <h1>Account Settings</h1>
                            <form onSubmit={processForm}>

                                <div className="compact">
                                    <input type="text" name="forename" value={userProfile.forename || ''} onChange={handleInputChange} placeholder="First Name"/>
                                    <input type="text" name="lastname" value={userProfile.lastname || ''} onChange={handleInputChange} placeholder="Last Name"/>
                                </div>
                                <input type="text" name="telephone" value={userProfile.telephone || ''} onChange={handleInputChange} placeholder="Phone Number"/>
                                <input type="password" name="password" placeholder="Current Password" required/>

                                <div className="compact">
                                    <input type="password" name="newPassword" placeholder="New Password"/>
                                    <input type="password" name="CnfNewPassword" placeholder="Confirm Password"/>
                                </div>
                                

                                <div className="break">
                                    <p>Address</p>
                                </div>

                                <input type="text" name="addressLineOne" value={userAddress?.addressLineOne ?? ''} onChange={handleAddressInputChange} placeholder="Address" />

                                <div className="compact">
                                    <input type="text" name="addressLineTwo" value={userAddress?.addressLineTwo ?? ''} onChange={handleAddressInputChange} placeholder="Address 2 (Optional)" />
                                    <input type="text" name="postcode" value={userAddress?.postcode ?? ''} onChange={handleAddressInputChange} placeholder="Postal Code"/>
                                </div>

                                <div className="compact">
                                    <input type="text" name="city" value={userAddress?.city ?? ''} onChange={handleAddressInputChange} placeholder="City"/>
                                    <select name="country" value={userAddress?.country ?? ''} onChange={handleAddressInputChange} placeholder="Country" >
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

                                <input type="submit" value="Update" />
                            </form>

                            <button>Convert to corporate</button>
                        </div>

                    </div>

                    <div className="vehicle-information hide" id="page-2">

                        <div className="form">
                            <h1>Vehicles</h1>

                                <form onSubmit={addVehicle}>
                                    <div className="compact">
                                        <input type="text" name="registration" value={vehicle.registration} onChange={handleVehicleInputChange} placeholder="Registration" required/>
                                        <input type="text" name="make" value={vehicle.make} onChange={handleVehicleInputChange} placeholder="Make" required/>
                                    </div>

                                    <div className="compact">
                                        <input type="text" name="model" value={vehicle.model} onChange={handleVehicleInputChange} placeholder="Model" required/>
                                        <input type="text" name="colour" value={vehicle.colour} onChange={handleVehicleInputChange} placeholder="Colour" required/>
                                    </div>

                                    <input type="submit" value="Add" />
                                </form>
                        </div>

                        <div className="table">
                            <h2>Saved Vehicles</h2>

                            <table>
                                <thead>
                                    <tr className="heading">
                                        <th>Registration</th>
                                        <th>Make</th>
                                        <th>Model</th>
                                        <th>Colour</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { userVehicles !== undefined && userVehicles.length > 0 ? userVehicles.map(vehicle => (
                                        <tr className="item">
                                            <td>{vehicle.registration}</td>
                                            <td>{vehicle.make}</td>
                                            <td>{vehicle.model}</td>
                                            <td>{vehicle.colour}</td>
                                            
                                            <td>
                                                <a href="" onClick={deleteVehicle(vehicle)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="item">
                                            <td colSpan={5}>No vehicles found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>


                    </div>

                    <div className="payment-information hide" id="page-3">
                        <div className="form">
                            <h1>Payment Information</h1>

                            <form onSubmit={addPayment}>
                                <input type="text" name="cardholder_name" placeholder="Cardholder Name" value={payment.cardholder_name} onChange={handlePaymentInputChange} required />
                                <input type="text" name="card_number" placeholder="Card Number" value={payment.card_number} onChange={handlePaymentInputChange} required />

                                <div className="compact"> 
                                    {/* <input type="month" name="expiry"/> */}
                                    <input type="text" name="card_expiry" placeholder="Expiry Date (MM/YY)" value={payment.card_expiry} onChange={handlePaymentInputChange} required />
                                    <input type="text" name="cvv" placeholder="CVV/CVC" value={payment.cvv} onChange={handlePaymentInputChange} required />
                                </div>

                                <input type="submit" value="Add" />
                            </form>
                        </div>

                        <div className="table">
                            <h2>Saved Cards</h2>
                            
                            <table>
                                <thead>
                                    <tr className="heading">
                                        <th>Cardholder</th>
                                        <th>Card Number</th>
                                        <th>Expiry Date</th>
                                        <th>Security Code</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    { userPayments !== undefined && userPayments.length > 0 ? userPayments.map(payment => (
                                        <tr className="item">
                                            <td>{payment.cardholder_name}</td>
                                            <td>{payment.card_number}</td>
                                            <td>{payment.card_expiry}</td>
                                            <td>{payment.cvv}</td>
                                            <td>
                                                <a href="" onClick={deletePayment(payment)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> 
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> 
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> 
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="item">
                                            <td colSpan={5}>No cards found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;