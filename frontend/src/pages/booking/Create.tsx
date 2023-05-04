import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../style/booking-create.css'

const Page = () => {

    /**
     * TODO - On load check if token is valid
     */

    const access_token = document.cookie.split('; ').find(row => row.startsWith('access_token'))?.split('=')[1];
    const [userProfile, setUserProfile] = useState({
        email: '',
        businessName: '',
        forename: '',
        lastname: '',
        telephone: '',
        addressID: null,
        address: {
            addressLineOne: '',
            addressLineTwo: '',
            city: '',
            postcode: '',
            country: ''
        }
    })
    const isLoggedIn = document.cookie.includes('access_token');
    const [formValues, setFormValues] = useState({
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
        country: ''
    });
    let isCorporateUser = false;
    let pageNumber = 1;

    useEffect(() => {
        const fetchProfile = async () => {
            if (isLoggedIn) {
                fetch('http://localhost:5000/account/find', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues)
                })
                .then(async res =>{
                    if (res.status === 200) {
                        const response = await res.json();
                        await setUserProfile(response.user);
                        isCorporateUser = response.isCorporateUser;
                    } else {
                        const response = await res.json();
                        isCorporateUser = false;
                        console.error(`Error retrieving user profile: ${response.error}`);
                    }
                })
                .catch(err => {
                    console.error(`Error retrieving user profile: ${err}`);
                });
            }
        }
        fetchProfile();
    }, [isLoggedIn]);

    const nextPage = () => {
        document.getElementById('page-' + pageNumber)?.classList.add('hide');
        pageNumber++;
        document.getElementById('page-' + pageNumber)?.classList.remove('hide');
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    }

    return(
        <div className="booking-create">
            <div className="container">
                <h1 className="booking-number">Order #12121212</h1>
                <hr />
                <div className="information">
                    <ul>
                        { !isLoggedIn ? (
                            <li>Already have an account? <Link to="/account/login">Log in</Link></li>
                        ):(
                            <li></li>
                        )}
                        <li><a className="paypal" href="">Paypal Checkout</a></li>
                    </ul>
                </div>
                <div className="pages">
                    <div className="booking-person" id="page-1">
                        <form onSubmit={nextPage}>
                            <input type="email" placeholder='Email'  onChange={handleInputChange} value={userProfile.email || ''} required />

                            { isLoggedIn ? (
                                <>
                                    { userProfile.addressID !== null ? (
                                        <>
                                            { isCorporateUser ? (
                                                <input type="text" placeholder='Business Name' value={userProfile.businessName || ''} onChange={handleInputChange} required />
                                            ):(
                                                <div className="compact">
                                                    <input type="text" placeholder='First Name' value={userProfile.forename || ''} onChange={handleInputChange} required />
                                                    <input type="text" placeholder='Last Name' value={userProfile.lastname || ''} onChange={handleInputChange} required />
                                                </div>
                                            )}
                                            <input type="text" placeholder='Phone Number' value={userProfile.telephone || ''} onChange={handleInputChange} required />

                                            <div className="break">
                                                <p>Address</p>
                                            </div>

                                            <input type="text" placeholder='Address' value={userProfile.address.addressLineOne || ''}  onChange={handleInputChange} required />
                                            <div className="compact">
                                                <input type="text" placeholder='Address 2 (Optional)' value={userProfile.address.addressLineTwo || ''}  onChange={handleInputChange} required />
                                                <input type="text" placeholder='Postal Code' value={userProfile.address.postcode || ''}  onChange={handleInputChange} required />
                                            </div>
                                            <div className="compact">
                                                <input type="text" placeholder='City' value={userProfile.address.city || ''}  onChange={handleInputChange} required />
                                                <select name="location" id="" required>
                                                    <option value="Afghanistan" selected={userProfile.address.country === "Afghanistan"}>Afghanistan</option>
                                                    <option value="Albania" selected={userProfile.address.country === "Albania"}>Albania</option>
                                                    <option value="Algeria" selected={userProfile.address.country === "Algeria"}>Algeria</option>
                                                    <option value="Andorra" selected={userProfile.address.country === "Andorra"}>Andorra</option>
                                                    <option value="Angola" selected={userProfile.address.country === "Angola"}>Angola</option>
                                                    <option value="Antigua and Barbuda" selected={userProfile.address.country === "Antigua and Barbuda"}>Antigua and Barbuda</option>
                                                    <option value="Argentina" selected={userProfile.address.country === "Argentina"}>Argentina</option>
                                                    <option value="Armenia" selected={userProfile.address.country === "Armenia"}>Armenia</option>
                                                    <option value="Australia" selected={userProfile.address.country === "Australia"}>Australia</option>
                                                    <option value="Austria" selected={userProfile.address.country === "Austria"}>Austria</option>
                                                    <option value="Azerbaijan" selected={userProfile.address.country === "Azerbaijan"}>Azerbaijan</option>
                                                    <option value="Bahamas" selected={userProfile.address.country === "Bahamas"}>Bahamas</option>
                                                    <option value="Bahrain" selected={userProfile.address.country === "Bahrain"}>Bahrain</option>
                                                    <option value="Bangladesh" selected={userProfile.address.country === "Bangladesh"}>Bangladesh</option>
                                                    <option value="Barbados" selected={userProfile.address.country === "Barbados"}>Barbados</option>
                                                    <option value="Belarus" selected={userProfile.address.country === "Belarus"}>Belarus</option>
                                                    <option value="Belgium" selected={userProfile.address.country === "Belgium"}>Belgium</option>
                                                    <option value="Belize" selected={userProfile.address.country === "Belize"}>Belize</option>
                                                    <option value="Benin" selected={userProfile.address.country === "Benin"}>Benin</option>
                                                    <option value="Bhutan" selected={userProfile.address.country === "Bhutan"}>Bhutan</option>
                                                    <option value="Bolivia" selected={userProfile.address.country === "Bolivia"}>Bolivia</option>
                                                    <option value="Bosnia and Herzegovina" selected={userProfile.address.country === "Bosnia and Herzegovina"}>Bosnia and Herzegovina</option>
                                                    <option value="Botswana" selected={userProfile.address.country === "Botswana"}>Botswana</option>
                                                    <option value="Brazil" selected={userProfile.address.country === "Brazil"}>Brazil</option>
                                                    <option value="Brunei " selected={userProfile.address.country === "Brunei "}>Brunei </option>
                                                    <option value="Bulgaria" selected={userProfile.address.country === "Bulgaria"}>Bulgaria</option>
                                                    <option value="Burkina Faso" selected={userProfile.address.country === "Burkina Faso"}>Burkina Faso</option>
                                                    <option value="Burundi" selected={userProfile.address.country === "Burundi"}>Burundi</option>
                                                    <option value="Côte d'Ivoire" selected={userProfile.address.country === "Côte d'Ivoire"}>Côte d'Ivoire</option>
                                                    <option value="Cabo Verde" selected={userProfile.address.country === "Cabo Verde"}>Cabo Verde</option>
                                                    <option value="Cambodia" selected={userProfile.address.country === "Cambodia"}>Cambodia</option>
                                                    <option value="Cameroon" selected={userProfile.address.country === "Cameroon"}>Cameroon</option>
                                                    <option value="Canada" selected={userProfile.address.country === "Canada"}>Canada</option>
                                                    <option value="Central African Republic" selected={userProfile.address.country === "Central African Republic"}>Central African Republic</option>
                                                    <option value="Chad" selected={userProfile.address.country === "Chad"}>Chad</option>
                                                    <option value="Chile" selected={userProfile.address.country === "Chile"}>Chile</option>
                                                    <option value="China" selected={userProfile.address.country === "China"}>China</option>
                                                    <option value="Colombia" selected={userProfile.address.country === "Colombia"}>Colombia</option>
                                                    <option value="Comoros" selected={userProfile.address.country === "Comoros"}>Comoros</option>
                                                    <option value="Congo (Congo-Brazzaville)" selected={userProfile.address.country === "Congo (Congo-Brazzaville)"}>Congo (Congo-Brazzaville)</option>
                                                    <option value="Costa Rica" selected={userProfile.address.country === "Costa Rica"}>Costa Rica</option>
                                                    <option value="Croatia" selected={userProfile.address.country === "Croatia"}>Croatia</option>
                                                    <option value="Cuba" selected={userProfile.address.country === "Cuba"}>Cuba</option>
                                                    <option value="Cyprus" selected={userProfile.address.country === "Cyprus"}>Cyprus</option>
                                                    <option value="Czechia (Czech Republic)" selected={userProfile.address.country === "Czechia (Czech Republic)"}>Czechia (Czech Republic)</option>
                                                    <option value="Democratic Republic of the Congo" selected={userProfile.address.country === "Democratic Republic of the Congo"}>Democratic Republic of the Congo</option>
                                                    <option value="Denmark" selected={userProfile.address.country === "Denmark"}>Denmark</option>
                                                    <option value="Djibouti" selected={userProfile.address.country === "Djibouti"}>Djibouti</option>
                                                    <option value="Dominica" selected={userProfile.address.country === "Dominica"}>Dominica</option>
                                                    <option value="Dominican Republic" selected={userProfile.address.country === "Dominican Republic"}>Dominican Republic</option>
                                                    <option value="Ecuador" selected={userProfile.address.country === "Ecuador"}>Ecuador</option>
                                                    <option value="Egypt" selected={userProfile.address.country === "Egypt"}>Egypt</option>
                                                    <option value="El Salvador" selected={userProfile.address.country === "El Salvador"}>El Salvador</option>
                                                    <option value="Equatorial Guinea" selected={userProfile.address.country === "Equatorial Guinea"}>Equatorial Guinea</option>
                                                    <option value="Eritrea" selected={userProfile.address.country === "Eritrea"}>Eritrea</option>
                                                    <option value="Estonia" selected={userProfile.address.country === "Estonia"}>Estonia</option>
                                                    <option value="Eswatini (fmr. 'Swaziland')" selected={userProfile.address.country === "Eswatini (fmr. 'Swaziland')"}>Eswatini (fmr. "Swaziland")</option>
                                                    <option value="Ethiopia" selected={userProfile.address.country === "Ethiopia"}>Ethiopia</option>
                                                    <option value="Fiji" selected={userProfile.address.country === "Fiji"}>Fiji</option>
                                                    <option value="Finland" selected={userProfile.address.country === "Finland"}>Finland</option>
                                                    <option value="France" selected={userProfile.address.country === "France"}>France</option>
                                                    <option value="Gabon" selected={userProfile.address.country === "Gabon"}>Gabon</option>
                                                    <option value="Gambia" selected={userProfile.address.country === "Gambia"}>Gambia</option>
                                                    <option value="Georgia" selected={userProfile.address.country === "Georgia"}>Georgia</option>
                                                    <option value="Germany" selected={userProfile.address.country === "Germany"}>Germany</option>
                                                    <option value="Ghana" selected={userProfile.address.country === "Ghana"}>Ghana</option>
                                                    <option value="Greece" selected={userProfile.address.country === "Greece"}>Greece</option>
                                                    <option value="Grenada" selected={userProfile.address.country === "Grenada"}>Grenada</option>
                                                    <option value="Guatemala" selected={userProfile.address.country === "Guatemala"}>Guatemala</option>
                                                    <option value="Guinea" selected={userProfile.address.country === "Guinea"}>Guinea</option>
                                                    <option value="Guinea-Bissau" selected={userProfile.address.country === "Guinea-Bissau"}>Guinea-Bissau</option>
                                                    <option value="Guyana" selected={userProfile.address.country === "Guyana"}>Guyana</option>
                                                    <option value="Haiti" selected={userProfile.address.country === "Haiti"}>Haiti</option>
                                                    <option value="Holy See" selected={userProfile.address.country === "Holy See"}>Holy See</option>
                                                    <option value="Honduras" selected={userProfile.address.country === "Honduras"}>Honduras</option>
                                                    <option value="Hungary" selected={userProfile.address.country === "Hungary"}>Hungary</option>
                                                    <option value="Iceland" selected={userProfile.address.country === "Iceland"}>Iceland</option>
                                                    <option value="India" selected={userProfile.address.country === "India"}>India</option>
                                                    <option value="Indonesia" selected={userProfile.address.country === "Indonesia"}>Indonesia</option>
                                                    <option value="Iran" selected={userProfile.address.country === "Iran"}>Iran</option>
                                                    <option value="Iraq" selected={userProfile.address.country === "Iraq"}>Iraq</option>
                                                    <option value="Ireland" selected={userProfile.address.country === "Ireland"}>Ireland</option>
                                                    <option value="Israel" selected={userProfile.address.country === "Israel"}>Israel</option>
                                                    <option value="Italy" selected={userProfile.address.country === "Italy"}>Italy</option>
                                                    <option value="Jamaica" selected={userProfile.address.country === "Jamaica"}>Jamaica</option>
                                                    <option value="Japan" selected={userProfile.address.country === "Japan"}>Japan</option>
                                                    <option value="Jordan" selected={userProfile.address.country === "Jordan"}>Jordan</option>
                                                    <option value="Kazakhstan" selected={userProfile.address.country === "Kazakhstan"}>Kazakhstan</option>
                                                    <option value="Kenya" selected={userProfile.address.country === "Kenya"}>Kenya</option>
                                                    <option value="Kiribati" selected={userProfile.address.country === "Kiribati"}>Kiribati</option>
                                                    <option value="Kuwait" selected={userProfile.address.country === "Kuwait"}>Kuwait</option>
                                                    <option value="Kyrgyzstan" selected={userProfile.address.country === "Kyrgyzstan"}>Kyrgyzstan</option>
                                                    <option value="Laos" selected={userProfile.address.country === "Laos"}>Laos</option>
                                                    <option value="Latvia" selected={userProfile.address.country === "Latvia"}>Latvia</option>
                                                    <option value="Lebanon" selected={userProfile.address.country === "Lebanon"}>Lebanon</option>
                                                    <option value="Lesotho" selected={userProfile.address.country === "Lesotho"}>Lesotho</option>
                                                    <option value="Liberia" selected={userProfile.address.country === "Liberia"}>Liberia</option>
                                                    <option value="Libya" selected={userProfile.address.country === "Libya"}>Libya</option>
                                                    <option value="Liechtenstein" selected={userProfile.address.country === "Liechtenstein"}>Liechtenstein</option>
                                                    <option value="Lithuania" selected={userProfile.address.country === "Lithuania"}>Lithuania</option>
                                                    <option value="Luxembourg" selected={userProfile.address.country === "Luxembourg"}>Luxembourg</option>
                                                    <option value="Madagascar" selected={userProfile.address.country === "Madagascar"}>Madagascar</option>
                                                    <option value="Malawi" selected={userProfile.address.country === "Malawi"}>Malawi</option>
                                                    <option value="Malaysia" selected={userProfile.address.country === "Malaysia"}>Malaysia</option>
                                                    <option value="Maldives" selected={userProfile.address.country === "Maldives"}>Maldives</option>
                                                    <option value="Mali" selected={userProfile.address.country === "Mali"}>Mali</option>
                                                    <option value="Malta" selected={userProfile.address.country === "Malta"}>Malta</option>
                                                    <option value="Marshall Islands" selected={userProfile.address.country === "Marshall Islands"}>Marshall Islands</option>
                                                    <option value="Mauritania" selected={userProfile.address.country === "Mauritania"}>Mauritania</option>
                                                    <option value="Mauritius" selected={userProfile.address.country === "Mauritius"}>Mauritius</option>
                                                    <option value="Mexico" selected={userProfile.address.country === "Mexico"}>Mexico</option>
                                                    <option value="Micronesia" selected={userProfile.address.country === "Micronesia"}>Micronesia</option>
                                                    <option value="Moldova" selected={userProfile.address.country === "Moldova"}>Moldova</option>
                                                    <option value="Monaco" selected={userProfile.address.country === "Monaco"}>Monaco</option>
                                                    <option value="Mongolia" selected={userProfile.address.country === "Mongolia"}>Mongolia</option>
                                                    <option value="Montenegro" selected={userProfile.address.country === "Montenegro"}>Montenegro</option>
                                                    <option value="Morocco" selected={userProfile.address.country === "Morocco"}>Morocco</option>
                                                    <option value="Mozambique" selected={userProfile.address.country === "Mozambique"}>Mozambique</option>
                                                    <option value="Myanmar (formerly Burma)" selected={userProfile.address.country === "Myanmar (formerly Burma)"}>Myanmar (formerly Burma)</option>
                                                    <option value="Namibia" selected={userProfile.address.country === "Namibia"}>Namibia</option>
                                                    <option value="Nauru" selected={userProfile.address.country === "Nauru"}>Nauru</option>
                                                    <option value="Nepal" selected={userProfile.address.country === "Nepal"}>Nepal</option>
                                                    <option value="Netherlands" selected={userProfile.address.country === "Netherlands"}>Netherlands</option>
                                                    <option value="New Zealand" selected={userProfile.address.country === "New Zealand"}>New Zealand</option>
                                                    <option value="Nicaragua" selected={userProfile.address.country === "Nicaragua"}>Nicaragua</option>
                                                    <option value="Niger" selected={userProfile.address.country === "Niger"}>Niger</option>
                                                    <option value="Nigeria" selected={userProfile.address.country === "Nigeria"}>Nigeria</option>
                                                    <option value="North Korea" selected={userProfile.address.country === "North Korea"}>North Korea</option>
                                                    <option value="North Macedonia" selected={userProfile.address.country === "North Macedonia"}>North Macedonia</option>
                                                    <option value="Norway" selected={userProfile.address.country === "Norway"}>Norway</option>
                                                    <option value="Oman" selected={userProfile.address.country === "Oman"}>Oman</option>
                                                    <option value="Pakistan" selected={userProfile.address.country === "Pakistan"}>Pakistan</option>
                                                    <option value="Palau" selected={userProfile.address.country === "Palau"}>Palau</option>
                                                    <option value="Palestine State" selected={userProfile.address.country === "Palestine State"}>Palestine State</option>
                                                    <option value="Panama" selected={userProfile.address.country === "Panama"}>Panama</option>
                                                    <option value="Papua New Guinea" selected={userProfile.address.country === "Papua New Guinea"}>Papua New Guinea</option>
                                                    <option value="Paraguay" selected={userProfile.address.country === "Paraguay"}>Paraguay</option>
                                                    <option value="Peru" selected={userProfile.address.country === "Peru"}>Peru</option>
                                                    <option value="Philippines" selected={userProfile.address.country === "Philippines"}>Philippines</option>
                                                    <option value="Poland" selected={userProfile.address.country === "Poland"}>Poland</option>
                                                    <option value="Portugal" selected={userProfile.address.country === "Portugal"}>Portugal</option>
                                                    <option value="Qatar" selected={userProfile.address.country === "Qatar"}>Qatar</option>
                                                    <option value="Romania" selected={userProfile.address.country === "Romania"}>Romania</option>
                                                    <option value="Russia" selected={userProfile.address.country === "Russia"}>Russia</option>
                                                    <option value="Rwanda" selected={userProfile.address.country === "Rwanda"}>Rwanda</option>
                                                    <option value="Saint Kitts and Nevis" selected={userProfile.address.country === "Saint Kitts and Nevis"}>Saint Kitts and Nevis</option>
                                                    <option value="Saint Lucia" selected={userProfile.address.country === "Saint Lucia"}>Saint Lucia</option>
                                                    <option value="Saint Vincent and the Grenadines" selected={userProfile.address.country === "Saint Vincent and the Grenadines"}>Saint Vincent and the Grenadines</option>
                                                    <option value="Samoa" selected={userProfile.address.country === "Samoa"}>Samoa</option>
                                                    <option value="San Marino" selected={userProfile.address.country === "San Marino"}>San Marino</option>
                                                    <option value="Sao Tome and Principe" selected={userProfile.address.country === "Sao Tome and Principe"}>Sao Tome and Principe</option>
                                                    <option value="Saudi Arabia" selected={userProfile.address.country === "Saudi Arabia"}>Saudi Arabia</option>
                                                    <option value="Senegal" selected={userProfile.address.country === "Senegal"}>Senegal</option>
                                                    <option value="Serbia" selected={userProfile.address.country === "Serbia"}>Serbia</option>
                                                    <option value="Seychelles" selected={userProfile.address.country === "Seychelles"}>Seychelles</option>
                                                    <option value="Sierra Leone" selected={userProfile.address.country === "Sierra Leone"}>Sierra Leone</option>
                                                    <option value="Singapore" selected={userProfile.address.country === "Singapore"}>Singapore</option>
                                                    <option value="Slovakia" selected={userProfile.address.country === "Slovakia"}>Slovakia</option>
                                                    <option value="Slovenia" selected={userProfile.address.country === "Slovenia"}>Slovenia</option>
                                                    <option value="Solomon Islands" selected={userProfile.address.country === "Solomon Islands"}>Solomon Islands</option>
                                                    <option value="Somalia" selected={userProfile.address.country === "Somalia"}>Somalia</option>
                                                    <option value="South Africa" selected={userProfile.address.country === "South Africa"}>South Africa</option>
                                                    <option value="South Korea" selected={userProfile.address.country === "South Korea"}>South Korea</option>
                                                    <option value="South Sudan" selected={userProfile.address.country === "South Sudan"}>South Sudan</option>
                                                    <option value="Spain" selected={userProfile.address.country === "Spain"}>Spain</option>
                                                    <option value="Sri Lanka" selected={userProfile.address.country === "Sri Lanka"}>Sri Lanka</option>
                                                    <option value="Sudan" selected={userProfile.address.country === "Sudan"}>Sudan</option>
                                                    <option value="Suriname" selected={userProfile.address.country === "Suriname"}>Suriname</option>
                                                    <option value="Sweden" selected={userProfile.address.country === "Sweden"}>Sweden</option>
                                                    <option value="Switzerland" selected={userProfile.address.country === "Switzerland"}>Switzerland</option>
                                                    <option value="Syria" selected={userProfile.address.country === "Syria"}>Syria</option>
                                                    <option value="Tajikistan" selected={userProfile.address.country === "Tajikistan"}>Tajikistan</option>
                                                    <option value="Tanzania" selected={userProfile.address.country === "Tanzania"}>Tanzania</option>
                                                    <option value="Thailand" selected={userProfile.address.country === "Thailand"}>Thailand</option>
                                                    <option value="Timor-Leste" selected={userProfile.address.country === "Timor-Leste"}>Timor-Leste</option>
                                                    <option value="Togo" selected={userProfile.address.country === "Togo"}>Togo</option>
                                                    <option value="Tonga" selected={userProfile.address.country === "Tonga"}>Tonga</option>
                                                    <option value="Trinidad and Tobago" selected={userProfile.address.country === "Trinidad and Tobago"}>Trinidad and Tobago</option>
                                                    <option value="Tunisia" selected={userProfile.address.country === "Tunisia"}>Tunisia</option>
                                                    <option value="Turkey" selected={userProfile.address.country === "Turkey"}>Turkey</option>
                                                    <option value="Turkmenistan" selected={userProfile.address.country === "Turkmenistan"}>Turkmenistan</option>
                                                    <option value="Tuvalu" selected={userProfile.address.country === "Tuvalu"}>Tuvalu</option>
                                                    <option value="Uganda" selected={userProfile.address.country === "Uganda"}>Uganda</option>
                                                    <option value="Ukraine" selected={userProfile.address.country === "Ukraine"}>Ukraine</option>
                                                    <option value="United Arab Emirates" selected={userProfile.address.country === "United Arab Emirates"}>United Arab Emirates</option>
                                                    <option value="United Kingdom" selected={userProfile.address.country === "United Kingdom"}>United Kingdom</option>
                                                    <option value="United States of America" selected={userProfile.address.country === "United States of America"}>United States of America</option>
                                                    <option value="Uruguay" selected={userProfile.address.country === "Uruguay"}>Uruguay</option>
                                                    <option value="Uzbekistan" selected={userProfile.address.country === "Uzbekistan"}>Uzbekistan</option>
                                                    <option value="Vanuatu" selected={userProfile.address.country === "Vanuatu"}>Vanuatu</option>
                                                    <option value="Venezuela" selected={userProfile.address.country === "Venezuela"}>Venezuela</option>
                                                    <option value="Vietnam" selected={userProfile.address.country === "Vietnam"}>Vietnam</option>
                                                    <option value="Yemen" selected={userProfile.address.country === "Yemen"}>Yemen</option>
                                                    <option value="Zambia" selected={userProfile.address.country === "Zambia"}>Zambia</option>
                                                    <option value="Zimbabwe" selected={userProfile.address.country === "Zimbabwe"}>Zimbabwe</option>
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            { isCorporateUser ? (
                                                <input type="text" placeholder='Business Name' value={userProfile.businessName || ''} onChange={handleInputChange} required />
                                            ):(
                                                <div className="compact">
                                                    <input type="text" placeholder='First Name' value={userProfile.forename || ''} onChange={handleInputChange} required />
                                                    <input type="text" placeholder='Last Name' value={userProfile.lastname || ''} onChange={handleInputChange} required />
                                                </div>
                                            )}
                                            <input type="text" placeholder='Phone Number' value={userProfile.telephone || ''} onChange={handleInputChange} required />

                                            <div className="break">
                                                <p>Address</p>
                                            </div>

                                            <input type="text" placeholder='Address' value={userProfile.address.addressLineOne || ''}  onChange={handleInputChange} required />
                                            <div className="compact">
                                                <input type="text" placeholder='City' value={userProfile.address.addressLineTwo || ''} onChange={handleInputChange} required />
                                                <input type="text" placeholder='State' value={userProfile.address.postcode || ''} onChange={handleInputChange} required />
                                            </div>
                                            <div className="compact">
                                                <input type="text" placeholder='City' value={userProfile.address.city || ''}  onChange={handleInputChange} required />
                                                <select name="location" id="" required>
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
                                        </>
                                    )}

                                            

                                </>
                            ) : (
                                <>
                                    <div className="compact">
                                        <input type="text" placeholder='First Name' onChange={handleInputChange} required/>
                                        <input type="text" placeholder='Last Name' onChange={handleInputChange} required />
                                    </div>
                                    <input type="text" placeholder='Phone Number' onChange={handleInputChange} required />

                                    <div className="break">
                                        <p>Address</p>
                                    </div>

                                    <input type="text" placeholder='Address'  onChange={handleInputChange} required />
                                    <div className="compact">
                                        <input type="text" placeholder='Address 2 (Optional)'  onChange={handleInputChange} required />
                                        <input type="text" placeholder='Postal Code'  onChange={handleInputChange} required />
                                    </div>
                                    <div className="compact">
                                        <input type="text" placeholder='City'  onChange={handleInputChange} required />
                                        <select name="location" id="">
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
                                </>
                            )}

                            <input type="submit" value="Continue"  onChange={handleInputChange} required />
                        </form>
                    </div>

                    <div className="booking-information hide" id="page-2">
                        <div className="booking-information-header">
                            <h2>Booking Information</h2>
                        </div>
                    </div>
                    <div className="booking-payment hide" id="page-3">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;