import { useState } from 'react';
import '../style/contact.css'

const Page = () => {

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }
  

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch('http://localhost:5000/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })
    .then(response => response.json())
    .then(response => {
      if (response.status === 'sent') {
        const successMessage = document.querySelector('.success') as HTMLElement;
        successMessage.innerHTML = response.message;
        successMessage.classList.add('active');

        document.querySelector('.error')?.classList.remove('active');

        setFormValues({
          name: '',
          email: '',
          message: ''
        });

      } else {
        const errorMessage = document.querySelector('.error') as HTMLElement;
        errorMessage.innerHTML = response.message;
        errorMessage.classList.add('active');

        document.querySelector('.success')?.classList.remove('active');
      }
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  return (
    <div className="contact-container">
      <div className="popup">
        <div className="error">
          <p></p>
        </div>
        <div className="success">
          <p></p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <h1>Contact Us</h1>
        <hr />
        
        <div className="form-inline">
          <input type="text" name="name" placeholder="Name" value={formValues.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleInputChange} required />
        </div>

        <label htmlFor="message">Message</label>
        <textarea name="message" cols={30} rows={10} value={formValues.message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e)}  required></textarea>
        <input type="submit" value="Send Message" />
      </form>
    </div>
  )
};
  
export default Page;
