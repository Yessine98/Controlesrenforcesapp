import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/user/forgot-password', { email });
      setMessage(response.data.message); // Display the new success message
      setError(''); // Clear any previous error messages
    } catch (err) {
      setError('Error sending notification to admin.'); // Adjust error message
      setMessage(''); // Clear any previous success messages
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image pt-5' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)', minHeight: '100vh' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-4' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-4">Forgot Password</h2>
          <p className="text-center mb-4">Enter your email address, and we will notify the admin.</p>
          <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form1' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          {message && <p className="text-success text-center">{message}</p>}
          {error && <p className="text-danger text-center">{error}</p>}
          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleForgotPassword}>
            Send Notification
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ForgotPassword;
