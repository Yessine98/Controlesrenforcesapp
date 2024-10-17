import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/gradients.css';  
import useLogin from '../hooks/useLogin'; 
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // Error state
  const { login, loading } = useLogin();
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const socket = io('http://localhost:8080');

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const credentials = { email, password };
      const user = await login(credentials);
      dispatch({ type: 'LOGIN', payload: user });
      socket.emit('registerUser', user.id);
      console.log('User logged in:', user);
      navigate(user.role === 'AQ' ? '/aq/home' : '/cq/home');
    } catch (err) {
      console.error(err);
      setLoginError('Email or password is incorrect.'); // Set the error message
    }
  };

  useEffect(() => {
    socket.connect(); // Ensure the socket connection is established

    return () => {
        socket.disconnect(); // Cleanup on unmount
    };
  }, []);

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{minHeight: '100vh' , paddingBottom: '0'}}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-4' style={{ maxWidth: '600px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-4">Login</h2>
          <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form1' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          {loginError && <p className="text-danger text-center">{loginError}</p>} {/* Show error message */}
          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </MDBBtn>
          <div className="text-center">
            <Link to="/forgot-password" style={{ color: 'green' }}>Forgot Password?</Link>
            <p>Don't have an account? <Link to="/register" style={{ color: 'green' }}>Register here</Link></p>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
