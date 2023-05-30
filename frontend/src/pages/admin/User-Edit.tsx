import { notSignedIn, protectRoute } from '../../components/redirects';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

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

const Page = () => {
    notSignedIn();
    protectRoute();

    const { search } = useLocation();
    const { email } = qs.parse(search, { ignoreQueryPrefix: true });

    const [userProfile, setUserProfile] = useState<User>({
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
    const [userVehicles, setUserVehicles] = useState<vehicle[]>([]);
    const [vehicle, setVehicle] = useState<vehicle>({
        registration_number: '',
        user_id: 0,
        make: '',
        model: '',
        colour: ''
    });
    const [showVehicleDetails, setShowVehicleDetails] = useState(false);

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
                    setUserProfile(response.user);
                    setPerson(response.person);
                    setBusiness(response.business);
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setUserProfile(prevProfile => ({
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
    const handleVehicleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setVehicle(prevVehicles => ({
            ...prevVehicles,
            [name]: value,
        }));
    }
    const handleVehicleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== 'Add New') {
            const vehicle = JSON.parse(event.target.value);
            setVehicle(vehicle);
            setShowVehicleDetails(true);
            return;
        } else {
            setShowVehicleDetails(false);
        }
    };
    

    const updateProfile = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        fetch("http://localhost:5000/api/v1/users/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: userProfile, person, business })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then((response) => {
                    setUserProfile(response.user);
                    setPerson(response.person);
                    setBusiness(response.business);

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
        .catch(error => {
            console.error("Failed to update user: " + error);
        });
    }
    const updateVehicle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        fetch("http://localhost:5000/api/v1/users/vehicles/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ vehicle, email })
        })
        .then(async res => {
            if (res.status === 200) {
                res.json().then((response) => {
                    setUserVehicles(response.vehicles);

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
                    console.error(`Error adding vehicle: ${response.error}`);
                })
            }
        })
        .catch(error => {
            console.error("Failed to add vehicle: " + error);
        });
    }

    return (
        <main>
            <h1>Admin User Edit</h1>

            <div className="popup">
                <div className="error"></div>
                <div className="success"></div>
            </div>

            <form onSubmit={updateProfile}>

                { userProfile.role !== null && userProfile.role === 'business' ? (
                    <>
                        <input type="text" name="businessName" value={business.name || ''} onChange={handleBusinessInputChange} placeholder="Business Name" required/>

                        <div className="compact">
                            <input type="text" name="slogan" value={business.slogan || ''} onChange={handleBusinessInputChange} placeholder="Slogan (Optional)"/>
                            <input type="text" name="description" value={business.description || ''} onChange={handleBusinessInputChange} placeholder="Description (Optional)"/>
                        </div>
                    </>
                ) : (
                    <div className="compact">
                        <input type="text" name="forename" value={person.forename || ''} onChange={handlePersonInputChange} placeholder="First Name" required/>
                        <input type="text" name="surname" value={person.surname || ''} onChange={handlePersonInputChange} placeholder="Lasr Name" required />
                    </div>
                )}

                <div className="compact">
                    <input type="text" name="telephone" value={userProfile.telephone || ''} onChange={handleInputChange} placeholder="Phone Number"/>
                    <select name="role" value={userProfile.role || ''} onChange={handleInputChange} placeholder="Role">
                        <option value="" hidden selected>Select Role</option>
                        <option value="Person">Person</option>
                        <option value="Business">Business</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Booking Clerk">Booking Clerk</option>
                        <option value="Invoice Clerk">Invoice Clerk</option>
                    </select>
                </div>

                <div className="break">
                    <p>Address</p>
                </div>
                <input type="text" name="addressLineOne" value={userProfile.addressLineOne || ''} onChange={handleInputChange} placeholder="Address" />

                <div className="compact">
                    <input type="text" name="addressLineTwo" value={userProfile.addressLineTwo || ''} onChange={handleInputChange} placeholder="Address 2 (Optional)" />
                    <input type="text" name="zip" value={userProfile.zip || ''} onChange={handleInputChange} placeholder="Postal Code"/>
                </div>

                <div className="compact">
                    <input type="text" name="city" value={userProfile.city || ''} onChange={handleInputChange} placeholder="City"/>
                    <select name="country" value={userProfile.country || ''} onChange={handleInputChange} placeholder="Country" >
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

                <input type="submit" value="Update" />
            </form>

            <h2>Vehicles</h2>
            <form onSubmit={updateVehicle}>
                <select name="vehicles" onChange={handleVehicleSelectChange}>
                    <option selected hidden>Please Select</option>
                    { userVehicles.length > 0 ? userVehicles.map((vehicle) => (
                        <option value={JSON.stringify(vehicle)} key={vehicle.registration_number}>{vehicle.make + " " + vehicle.model}</option>
                    )) : (<></>)}
                </select>
                { showVehicleDetails ? (
                    <div>
                        <input type="text" value={vehicle.registration_number} name="registration_number" placeholder="Registration" onChange={handleVehicleInputChange} disabled />
                        <input type="text" value={vehicle.make} name="make" placeholder="make" onChange={handleVehicleInputChange} required />
                        <input type="text" value={vehicle.model} name="model" placeholder="model" onChange={handleVehicleInputChange} required />
                        <input type="text" value={vehicle.colour} name="colour" placeholder="colour" onChange={handleVehicleInputChange} required />
                        <input type="submit" value="Update" />
                    </div>
                ) : (<></>)}
            </form>

            <p>TODO: Able to modify booking information</p>

        </main>
    )
}

export default Page;