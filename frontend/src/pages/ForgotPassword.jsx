import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state

    try {
      const response = await axios.post(`${apiUrl}/user/forgot-password`, { email });
      setMessage(response.data.message); // Display the success message
      setError(''); // Clear any previous error messages
      setEmail(''); // Clear the email input after successful submission
    } catch (err) {
      setError('Error sending notification to admin.'); // Adjust error message
      setMessage(''); // Clear any previous success messages
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image pt-5' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)', minHeight: '100vh' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-4' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-4">Mot de passe oublié ?</h2>
          <p className="text-center mb-4">Entrez votre adresse e-mail, et nous notifierons l'admin.</p>
          <MDBInput 
            wrapperClass='mb-4' 
            label='Email' 
            size='lg' 
            id='form1' 
            type='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          {message && <p className="text-success text-center">{message}</p>}
          {error && <p className="text-danger text-center">{error}</p>}
          <MDBBtn 
            className='mb-4 w-100 gradient-custom-4' 
            size='lg' 
            onClick={handleForgotPassword}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Envoi...' : 'Envoyer la notification'}
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ForgotPassword;
