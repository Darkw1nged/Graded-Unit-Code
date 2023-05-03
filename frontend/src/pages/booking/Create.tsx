import React from 'react'
import { Link } from 'react-router-dom'
import '../../style/booking-create.css'

const Page = () => {

    /**
     * TODO - On load check if token is valid
     */

    const isLoggedIn = document.cookie.includes('access_token');
    let pageNumber = 1;
    let profile = {
        email: '',
        address: {
            addressLineOne: '',
            addressLineTwo: '',
            postcode: '',
            city: '',
            country: ''
        },
        telephone: '',
        isCorporateUser: false,
        forename: '',
        lastname: '',
        businessName: ''
    }    

    if (isLoggedIn) {
        fetch('http://localhost:5000/account/find', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === 200) {
                profile = response.profile;
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    const nextPage = () => {
        document.getElementById('booking-' + pageNumber)?.classList.add('hide');
        pageNumber++;
        document.getElementById('booking-' + pageNumber)?.classList.remove('hide');
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
                        { isLoggedIn ? (
                            <form onSubmit={nextPage}>
                                <input type="email" placeholder='Email' />
                                
                                { profile.isCorporateUser ? (
                                    <input type="text" placeholder='Business Name' value={profile.businessName}/>
                                ):(
                                    <div className="compact">
                                        <input type="text" placeholder='First Name' value={profile.forename}/>
                                        <input type="text" placeholder='Last Name' value={profile.lastname}/>
                                    </div>
                                )}
                                <input type="text" placeholder='Phone Number' value={profile.telephone}/>

                                <div className="break">
                                    <p>Address</p>
                                </div>

                                <input type="text" placeholder='Address' value={profile.address.addressLineOne} />
                                <div className="compact">
                                    <input type="text" placeholder='Address 2 (Optional)' value={profile.address.addressLineTwo} />
                                    <input type="text" placeholder='Postal Code' value={profile.address.postcode} />
                                </div>
                                <div className="compact">
                                    <input type="text" placeholder='City' value={profile.address.city} />
                                    <select name="location" id="">
                                        <option value="Afghanistan" selected={profile.address.country === "Afghanistan"}>Afghanistan</option>
                                        <option value="Albania" selected={profile.address.country === "Albania"}>Albania</option>
                                        <option value="Algeria" selected={profile.address.country === "Algeria"}>Algeria</option>
                                        <option value="Andorra" selected={profile.address.country === "Andorra"}>Andorra</option>
                                        <option value="Angola" selected={profile.address.country === "Angola"}>Angola</option>
                                        <option value="Antigua and Barbuda" selected={profile.address.country === "Antigua and Barbuda"}>Antigua and Barbuda</option>
                                        <option value="Argentina" selected={profile.address.country === "Argentina"}>Argentina</option>
                                        <option value="Armenia" selected={profile.address.country === "Armenia"}>Armenia</option>
                                        <option value="Australia" selected={profile.address.country === "Australia"}>Australia</option>
                                        <option value="Austria" selected={profile.address.country === "Austria"}>Austria</option>
                                        <option value="Azerbaijan" selected={profile.address.country === "Azerbaijan"}>Azerbaijan</option>
                                        <option value="Bahamas" selected={profile.address.country === "Bahamas"}>Bahamas</option>
                                        <option value="Bahrain" selected={profile.address.country === "Bahrain"}>Bahrain</option>
                                        <option value="Bangladesh" selected={profile.address.country === "Bangladesh"}>Bangladesh</option>
                                        <option value="Barbados" selected={profile.address.country === "Barbados"}>Barbados</option>
                                        <option value="Belarus" selected={profile.address.country === "Belarus"}>Belarus</option>
                                        <option value="Belgium" selected={profile.address.country === "Belgium"}>Belgium</option>
                                        <option value="Belize" selected={profile.address.country === "Belize"}>Belize</option>
                                        <option value="Benin" selected={profile.address.country === "Benin"}>Benin</option>
                                        <option value="Bhutan" selected={profile.address.country === "Bhutan"}>Bhutan</option>
                                        <option value="Bolivia" selected={profile.address.country === "Bolivia"}>Bolivia</option>
                                        <option value="Bosnia and Herzegovina" selected={profile.address.country === "Bosnia and Herzegovina"}>Bosnia and Herzegovina</option>
                                        <option value="Botswana" selected={profile.address.country === "Botswana"}>Botswana</option>
                                        <option value="Brazil" selected={profile.address.country === "Brazil"}>Brazil</option>
                                        <option value="Brunei " selected={profile.address.country === "Brunei "}>Brunei </option>
                                        <option value="Bulgaria" selected={profile.address.country === "Bulgaria"}>Bulgaria</option>
                                        <option value="Burkina Faso" selected={profile.address.country === "Burkina Faso"}>Burkina Faso</option>
                                        <option value="Burundi" selected={profile.address.country === "Burundi"}>Burundi</option>
                                        <option value="Côte d'Ivoire" selected={profile.address.country === "Côte d'Ivoire"}>Côte d'Ivoire</option>
                                        <option value="Cabo Verde" selected={profile.address.country === "Cabo Verde"}>Cabo Verde</option>
                                        <option value="Cambodia" selected={profile.address.country === "Cambodia"}>Cambodia</option>
                                        <option value="Cameroon" selected={profile.address.country === "Cameroon"}>Cameroon</option>
                                        <option value="Canada" selected={profile.address.country === "Canada"}>Canada</option>
                                        <option value="Central African Republic" selected={profile.address.country === "Central African Republic"}>Central African Republic</option>
                                        <option value="Chad" selected={profile.address.country === "Chad"}>Chad</option>
                                        <option value="Chile" selected={profile.address.country === "Chile"}>Chile</option>
                                        <option value="China" selected={profile.address.country === "China"}>China</option>
                                        <option value="Colombia" selected={profile.address.country === "Colombia"}>Colombia</option>
                                        <option value="Comoros" selected={profile.address.country === "Comoros"}>Comoros</option>
                                        <option value="Congo (Congo-Brazzaville)" selected={profile.address.country === "Congo (Congo-Brazzaville)"}>Congo (Congo-Brazzaville)</option>
                                        <option value="Costa Rica" selected={profile.address.country === "Costa Rica"}>Costa Rica</option>
                                        <option value="Croatia" selected={profile.address.country === "Croatia"}>Croatia</option>
                                        <option value="Cuba" selected={profile.address.country === "Cuba"}>Cuba</option>
                                        <option value="Cyprus" selected={profile.address.country === "Cyprus"}>Cyprus</option>
                                        <option value="Czechia (Czech Republic)" selected={profile.address.country === "Czechia (Czech Republic)"}>Czechia (Czech Republic)</option>
                                        <option value="Democratic Republic of the Congo" selected={profile.address.country === "Democratic Republic of the Congo"}>Democratic Republic of the Congo</option>
                                        <option value="Denmark" selected={profile.address.country === "Denmark"}>Denmark</option>
                                        <option value="Djibouti" selected={profile.address.country === "Djibouti"}>Djibouti</option>
                                        <option value="Dominica" selected={profile.address.country === "Dominica"}>Dominica</option>
                                        <option value="Dominican Republic" selected={profile.address.country === "Dominican Republic"}>Dominican Republic</option>
                                        <option value="Ecuador" selected={profile.address.country === "Ecuador"}>Ecuador</option>
                                        <option value="Egypt" selected={profile.address.country === "Egypt"}>Egypt</option>
                                        <option value="El Salvador" selected={profile.address.country === "El Salvador"}>El Salvador</option>
                                        <option value="Equatorial Guinea" selected={profile.address.country === "Equatorial Guinea"}>Equatorial Guinea</option>
                                        <option value="Eritrea" selected={profile.address.country === "Eritrea"}>Eritrea</option>
                                        <option value="Estonia" selected={profile.address.country === "Estonia"}>Estonia</option>
                                        <option value="Eswatini (fmr. 'Swaziland')" selected={profile.address.country === "Eswatini (fmr. 'Swaziland')"}>Eswatini (fmr. "Swaziland")</option>
                                        <option value="Ethiopia" selected={profile.address.country === "Ethiopia"}>Ethiopia</option>
                                        <option value="Fiji" selected={profile.address.country === "Fiji"}>Fiji</option>
                                        <option value="Finland" selected={profile.address.country === "Finland"}>Finland</option>
                                        <option value="France" selected={profile.address.country === "France"}>France</option>
                                        <option value="Gabon" selected={profile.address.country === "Gabon"}>Gabon</option>
                                        <option value="Gambia" selected={profile.address.country === "Gambia"}>Gambia</option>
                                        <option value="Georgia" selected={profile.address.country === "Georgia"}>Georgia</option>
                                        <option value="Germany" selected={profile.address.country === "Germany"}>Germany</option>
                                        <option value="Ghana" selected={profile.address.country === "Ghana"}>Ghana</option>
                                        <option value="Greece" selected={profile.address.country === "Greece"}>Greece</option>
                                        <option value="Grenada" selected={profile.address.country === "Grenada"}>Grenada</option>
                                        <option value="Guatemala" selected={profile.address.country === "Guatemala"}>Guatemala</option>
                                        <option value="Guinea" selected={profile.address.country === "Guinea"}>Guinea</option>
                                        <option value="Guinea-Bissau" selected={profile.address.country === "Guinea-Bissau"}>Guinea-Bissau</option>
                                        <option value="Guyana" selected={profile.address.country === "Guyana"}>Guyana</option>
                                        <option value="Haiti" selected={profile.address.country === "Haiti"}>Haiti</option>
                                        <option value="Holy See" selected={profile.address.country === "Holy See"}>Holy See</option>
                                        <option value="Honduras" selected={profile.address.country === "Honduras"}>Honduras</option>
                                        <option value="Hungary" selected={profile.address.country === "Hungary"}>Hungary</option>
                                        <option value="Iceland" selected={profile.address.country === "Iceland"}>Iceland</option>
                                        <option value="India" selected={profile.address.country === "India"}>India</option>
                                        <option value="Indonesia" selected={profile.address.country === "Indonesia"}>Indonesia</option>
                                        <option value="Iran" selected={profile.address.country === "Iran"}>Iran</option>
                                        <option value="Iraq" selected={profile.address.country === "Iraq"}>Iraq</option>
                                        <option value="Ireland" selected={profile.address.country === "Ireland"}>Ireland</option>
                                        <option value="Israel" selected={profile.address.country === "Israel"}>Israel</option>
                                        <option value="Italy" selected={profile.address.country === "Italy"}>Italy</option>
                                        <option value="Jamaica" selected={profile.address.country === "Jamaica"}>Jamaica</option>
                                        <option value="Japan" selected={profile.address.country === "Japan"}>Japan</option>
                                        <option value="Jordan" selected={profile.address.country === "Jordan"}>Jordan</option>
                                        <option value="Kazakhstan" selected={profile.address.country === "Kazakhstan"}>Kazakhstan</option>
                                        <option value="Kenya" selected={profile.address.country === "Kenya"}>Kenya</option>
                                        <option value="Kiribati" selected={profile.address.country === "Kiribati"}>Kiribati</option>
                                        <option value="Kuwait" selected={profile.address.country === "Kuwait"}>Kuwait</option>
                                        <option value="Kyrgyzstan" selected={profile.address.country === "Kyrgyzstan"}>Kyrgyzstan</option>
                                        <option value="Laos" selected={profile.address.country === "Laos"}>Laos</option>
                                        <option value="Latvia" selected={profile.address.country === "Latvia"}>Latvia</option>
                                        <option value="Lebanon" selected={profile.address.country === "Lebanon"}>Lebanon</option>
                                        <option value="Lesotho" selected={profile.address.country === "Lesotho"}>Lesotho</option>
                                        <option value="Liberia" selected={profile.address.country === "Liberia"}>Liberia</option>
                                        <option value="Libya" selected={profile.address.country === "Libya"}>Libya</option>
                                        <option value="Liechtenstein" selected={profile.address.country === "Liechtenstein"}>Liechtenstein</option>
                                        <option value="Lithuania" selected={profile.address.country === "Lithuania"}>Lithuania</option>
                                        <option value="Luxembourg" selected={profile.address.country === "Luxembourg"}>Luxembourg</option>
                                        <option value="Madagascar" selected={profile.address.country === "Madagascar"}>Madagascar</option>
                                        <option value="Malawi" selected={profile.address.country === "Malawi"}>Malawi</option>
                                        <option value="Malaysia" selected={profile.address.country === "Malaysia"}>Malaysia</option>
                                        <option value="Maldives" selected={profile.address.country === "Maldives"}>Maldives</option>
                                        <option value="Mali" selected={profile.address.country === "Mali"}>Mali</option>
                                        <option value="Malta" selected={profile.address.country === "Malta"}>Malta</option>
                                        <option value="Marshall Islands" selected={profile.address.country === "Marshall Islands"}>Marshall Islands</option>
                                        <option value="Mauritania" selected={profile.address.country === "Mauritania"}>Mauritania</option>
                                        <option value="Mauritius" selected={profile.address.country === "Mauritius"}>Mauritius</option>
                                        <option value="Mexico" selected={profile.address.country === "Mexico"}>Mexico</option>
                                        <option value="Micronesia" selected={profile.address.country === "Micronesia"}>Micronesia</option>
                                        <option value="Moldova" selected={profile.address.country === "Moldova"}>Moldova</option>
                                        <option value="Monaco" selected={profile.address.country === "Monaco"}>Monaco</option>
                                        <option value="Mongolia" selected={profile.address.country === "Mongolia"}>Mongolia</option>
                                        <option value="Montenegro" selected={profile.address.country === "Montenegro"}>Montenegro</option>
                                        <option value="Morocco" selected={profile.address.country === "Morocco"}>Morocco</option>
                                        <option value="Mozambique" selected={profile.address.country === "Mozambique"}>Mozambique</option>
                                        <option value="Myanmar (formerly Burma)" selected={profile.address.country === "Myanmar (formerly Burma)"}>Myanmar (formerly Burma)</option>
                                        <option value="Namibia" selected={profile.address.country === "Namibia"}>Namibia</option>
                                        <option value="Nauru" selected={profile.address.country === "Nauru"}>Nauru</option>
                                        <option value="Nepal" selected={profile.address.country === "Nepal"}>Nepal</option>
                                        <option value="Netherlands" selected={profile.address.country === "Netherlands"}>Netherlands</option>
                                        <option value="New Zealand" selected={profile.address.country === "New Zealand"}>New Zealand</option>
                                        <option value="Nicaragua" selected={profile.address.country === "Nicaragua"}>Nicaragua</option>
                                        <option value="Niger" selected={profile.address.country === "Niger"}>Niger</option>
                                        <option value="Nigeria" selected={profile.address.country === "Nigeria"}>Nigeria</option>
                                        <option value="North Korea" selected={profile.address.country === "North Korea"}>North Korea</option>
                                        <option value="North Macedonia" selected={profile.address.country === "North Macedonia"}>North Macedonia</option>
                                        <option value="Norway" selected={profile.address.country === "Norway"}>Norway</option>
                                        <option value="Oman" selected={profile.address.country === "Oman"}>Oman</option>
                                        <option value="Pakistan" selected={profile.address.country === "Pakistan"}>Pakistan</option>
                                        <option value="Palau" selected={profile.address.country === "Palau"}>Palau</option>
                                        <option value="Palestine State" selected={profile.address.country === "Palestine State"}>Palestine State</option>
                                        <option value="Panama" selected={profile.address.country === "Panama"}>Panama</option>
                                        <option value="Papua New Guinea" selected={profile.address.country === "Papua New Guinea"}>Papua New Guinea</option>
                                        <option value="Paraguay" selected={profile.address.country === "Paraguay"}>Paraguay</option>
                                        <option value="Peru" selected={profile.address.country === "Peru"}>Peru</option>
                                        <option value="Philippines" selected={profile.address.country === "Philippines"}>Philippines</option>
                                        <option value="Poland" selected={profile.address.country === "Poland"}>Poland</option>
                                        <option value="Portugal" selected={profile.address.country === "Portugal"}>Portugal</option>
                                        <option value="Qatar" selected={profile.address.country === "Qatar"}>Qatar</option>
                                        <option value="Romania" selected={profile.address.country === "Romania"}>Romania</option>
                                        <option value="Russia" selected={profile.address.country === "Russia"}>Russia</option>
                                        <option value="Rwanda" selected={profile.address.country === "Rwanda"}>Rwanda</option>
                                        <option value="Saint Kitts and Nevis" selected={profile.address.country === "Saint Kitts and Nevis"}>Saint Kitts and Nevis</option>
                                        <option value="Saint Lucia" selected={profile.address.country === "Saint Lucia"}>Saint Lucia</option>
                                        <option value="Saint Vincent and the Grenadines" selected={profile.address.country === "Saint Vincent and the Grenadines"}>Saint Vincent and the Grenadines</option>
                                        <option value="Samoa" selected={profile.address.country === "Samoa"}>Samoa</option>
                                        <option value="San Marino" selected={profile.address.country === "San Marino"}>San Marino</option>
                                        <option value="Sao Tome and Principe" selected={profile.address.country === "Sao Tome and Principe"}>Sao Tome and Principe</option>
                                        <option value="Saudi Arabia" selected={profile.address.country === "Saudi Arabia"}>Saudi Arabia</option>
                                        <option value="Senegal" selected={profile.address.country === "Senegal"}>Senegal</option>
                                        <option value="Serbia" selected={profile.address.country === "Serbia"}>Serbia</option>
                                        <option value="Seychelles" selected={profile.address.country === "Seychelles"}>Seychelles</option>
                                        <option value="Sierra Leone" selected={profile.address.country === "Sierra Leone"}>Sierra Leone</option>
                                        <option value="Singapore" selected={profile.address.country === "Singapore"}>Singapore</option>
                                        <option value="Slovakia" selected={profile.address.country === "Slovakia"}>Slovakia</option>
                                        <option value="Slovenia" selected={profile.address.country === "Slovenia"}>Slovenia</option>
                                        <option value="Solomon Islands" selected={profile.address.country === "Solomon Islands"}>Solomon Islands</option>
                                        <option value="Somalia" selected={profile.address.country === "Somalia"}>Somalia</option>
                                        <option value="South Africa" selected={profile.address.country === "South Africa"}>South Africa</option>
                                        <option value="South Korea" selected={profile.address.country === "South Korea"}>South Korea</option>
                                        <option value="South Sudan" selected={profile.address.country === "South Sudan"}>South Sudan</option>
                                        <option value="Spain" selected={profile.address.country === "Spain"}>Spain</option>
                                        <option value="Sri Lanka" selected={profile.address.country === "Sri Lanka"}>Sri Lanka</option>
                                        <option value="Sudan" selected={profile.address.country === "Sudan"}>Sudan</option>
                                        <option value="Suriname" selected={profile.address.country === "Suriname"}>Suriname</option>
                                        <option value="Sweden" selected={profile.address.country === "Sweden"}>Sweden</option>
                                        <option value="Switzerland" selected={profile.address.country === "Switzerland"}>Switzerland</option>
                                        <option value="Syria" selected={profile.address.country === "Syria"}>Syria</option>
                                        <option value="Tajikistan" selected={profile.address.country === "Tajikistan"}>Tajikistan</option>
                                        <option value="Tanzania" selected={profile.address.country === "Tanzania"}>Tanzania</option>
                                        <option value="Thailand" selected={profile.address.country === "Thailand"}>Thailand</option>
                                        <option value="Timor-Leste" selected={profile.address.country === "Timor-Leste"}>Timor-Leste</option>
                                        <option value="Togo" selected={profile.address.country === "Togo"}>Togo</option>
                                        <option value="Tonga" selected={profile.address.country === "Tonga"}>Tonga</option>
                                        <option value="Trinidad and Tobago" selected={profile.address.country === "Trinidad and Tobago"}>Trinidad and Tobago</option>
                                        <option value="Tunisia" selected={profile.address.country === "Tunisia"}>Tunisia</option>
                                        <option value="Turkey" selected={profile.address.country === "Turkey"}>Turkey</option>
                                        <option value="Turkmenistan" selected={profile.address.country === "Turkmenistan"}>Turkmenistan</option>
                                        <option value="Tuvalu" selected={profile.address.country === "Tuvalu"}>Tuvalu</option>
                                        <option value="Uganda" selected={profile.address.country === "Uganda"}>Uganda</option>
                                        <option value="Ukraine" selected={profile.address.country === "Ukraine"}>Ukraine</option>
                                        <option value="United Arab Emirates" selected={profile.address.country === "United Arab Emirates"}>United Arab Emirates</option>
                                        <option value="United Kingdom" selected={profile.address.country === "United Kingdom"}>United Kingdom</option>
                                        <option value="United States of America" selected={profile.address.country === "United States of America"}>United States of America</option>
                                        <option value="Uruguay" selected={profile.address.country === "Uruguay"}>Uruguay</option>
                                        <option value="Uzbekistan" selected={profile.address.country === "Uzbekistan"}>Uzbekistan</option>
                                        <option value="Vanuatu" selected={profile.address.country === "Vanuatu"}>Vanuatu</option>
                                        <option value="Venezuela" selected={profile.address.country === "Venezuela"}>Venezuela</option>
                                        <option value="Vietnam" selected={profile.address.country === "Vietnam"}>Vietnam</option>
                                        <option value="Yemen" selected={profile.address.country === "Yemen"}>Yemen</option>
                                        <option value="Zambia" selected={profile.address.country === "Zambia"}>Zambia</option>
                                        <option value="Zimbabwe" selected={profile.address.country === "Zimbabwe"}>Zimbabwe</option>
                                    </select>
                                </div>
                                <input type="submit" value="Continue" />
                            </form>
                        ):(
                            <form onSubmit={nextPage}>
                                <input type="email" placeholder='Email' />
                                <div className="compact">
                                    <input type="text" placeholder='First Name' />
                                    <input type="text" placeholder='Last Name' />
                                </div>
                                <input type="text" placeholder='Phone Number' />

                                <div className="break">
                                    <p>Address</p>
                                </div>

                                <input type="text" placeholder='Address' />
                                <div className="compact">
                                    <input type="text" placeholder='Address 2 (Optional)' />
                                    <input type="text" placeholder='Postal Code' />
                                </div>
                                <div className="compact">
                                    <input type="text" placeholder='City' />
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
                                <input type="submit" value="Continue" />
                            </form>
                        )}


                    </div>
                    <div className="booking-information">
                        <div className="booking-information-header">
                            <h2>Booking Information</h2>
                        </div>
                    </div>
                    <div className="booking-payment">

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;