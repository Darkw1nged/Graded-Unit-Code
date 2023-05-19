import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import qs from 'qs';
import { redirectIfNotLoggedIn, redirectIfNoAdmins } from '../../components/redirects';

interface Profile {
    businessName: string;
    forename: string;
    lastname: string;
    email: string;
    role: string;
    bookings: number;
    created_at: string;
    telephone: string;
}

interface Address {
    addressLineOne: string;
    addressLineTwo: string;
    postcode: string;
    city: string;
    country: string;
}

interface Vehicle {
    registration: string;
    make: string;
    model: string;
    colour: string;
}

const Page = () => {
    redirectIfNotLoggedIn();
    redirectIfNoAdmins();
    
    const { search } = useLocation();
    const { email } = qs.parse(search, { ignoreQueryPrefix: true });
    const [profile, setProfile] = useState<Profile>({
        businessName: '',
        forename: '',
        lastname: '',
        email: '',
        role: '',
        bookings: 0,
        created_at: '',
        telephone: ''
    });
    const [userAddress, setUserAddress] = useState<Address>({
        addressLineOne: '',
        addressLineTwo: '',
        postcode: '',
        city: '',
        country: ''
    });
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/admin/get/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setProfile(response.customer);
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

    useEffect(() => {
        fetch('http://localhost:5000/admin/get/customer-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setUserAddress(response.address);
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

    useEffect(() => {
        fetch('http://localhost:5000/admin/get/customer-vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    setVehicles(response.vehicles);
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleAddressInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setUserAddress(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const [showVehicleDetails, setShowVehicleDetails] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>({
        registration: '',
        make: '',
        model: '',
        colour: ''
    });
    const handleVehicleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== 'Add New') {
            const vehicle = JSON.parse(event.target.value);
            setSelectedVehicle(vehicle);
            setShowVehicleDetails(true);
            return;
        } else {
            setShowVehicleDetails(false);
        }
    };
    const handleVehicleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setSelectedVehicle(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateProfile = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('http://localhost:5000/admin/update/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                profile,
                userAddress
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    console.log(response.message);
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
    }

    const updateVehicle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch('http://localhost:5000/admin/update/customer-vehicle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selectedVehicle
            }),
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(response => {
                    console.log(response.message);
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
    }

    return (
        <main>
            <div className="container">
                <h1>Personal Details</h1>
                <form onSubmit={updateProfile}>
                    { profile.businessName ? (
                        <input type="text" name="businessName" value={profile.businessName || ''} onChange={handleInputChange} placeholder='Buisness Name' />
                    ):(
                        <div className="compact">
                            <input type="text" name="forename" value={profile.forename || ''} onChange={handleInputChange} placeholder="First Name"/>
                            <input type="text" name="lastname" value={profile.lastname || ''} onChange={handleInputChange} placeholder="Last Name"/>
                        </div>
                    )}
                    <input type="text" name="telephone" value={profile.telephone || ''} onChange={handleInputChange} placeholder="Phone Number"/>

                    <div className="break">
                        <p>Address</p>
                    </div>

                    <input type="text" name="addressLineOne" value={userAddress?.addressLineOne || ''} onChange={handleAddressInputChange} placeholder="Address" />

                    <div className="compact">
                        <input type="text" name="addressLineTwo" value={userAddress?.addressLineTwo || ''} onChange={handleAddressInputChange} placeholder="Address 2 (Optional)" />
                        <input type="text" name="postcode" value={userAddress?.postcode || ''} onChange={handleAddressInputChange} placeholder="Postal Code"/>
                    </div>

                    <div className="compact">
                        <input type="text" name="city" value={userAddress?.city || ''} onChange={handleAddressInputChange} placeholder="City"/>
                        <select name="country" value={userAddress?.country || ''} onChange={handleAddressInputChange} placeholder="Country" >
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

                <h1>Vehicles</h1>
                <form onSubmit={updateVehicle}>
                    <select name="vehicles" onChange={handleVehicleSelectChange}>
                    <option hidden>Please Select</option>
                        {vehicles.map((vehicle) => (
                            <option value={JSON.stringify(vehicle)} key={vehicle.registration}>{vehicle.make + " " + vehicle.model}</option>
                        ))}
                    </select>

                    { showVehicleDetails ? (
                        <div>
                            <input type="text" value={selectedVehicle.registration} name="registration" placeholder="Registration" onChange={handleVehicleInputChange} required />
                            <input type="text" value={selectedVehicle.make} name="make" placeholder="Make" onChange={handleVehicleInputChange} required />
                            <input type="text" value={selectedVehicle.model} name="model" placeholder="Model" onChange={handleVehicleInputChange} required />
                            <input type="text" value={selectedVehicle.colour} name="colour" placeholder="Colour" onChange={handleVehicleInputChange} required />
                            <input type="submit" value="Update" />
                        </div>
                    ) : (<></>)}
                </form>

            </div>
        </main>
    )
}

export default Page;