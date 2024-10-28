import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';
import { useNavigate ,Link} from 'react-router-dom';
import '../styles/gradients.css';  
import useRegister from '../hooks/useRegister'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, loading, error, success } = useRegister();
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!username || !email || !password || !role) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const userData = { username, email, password, role };
      await register(userData);
      if (success) {
        alert("Account created successfully!");
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image pt-4 mt-1' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{ maxWidth: '600px', marginTop: '100px' }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Créer un compte</h2>
          <MDBInput wrapperClass='mb-4' label='Nom et Prénom' size='lg' id='form1' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form2' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Mot de passe' size='lg' id='form3' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <MDBInput wrapperClass='mb-4' label='Répéter le mot de passe' size='lg' id='form4' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <div className='mb-4'>
            <MDBDropdown>
              <MDBDropdownToggle caret={true} size='lg' className='w-100 gradient-custom-4'>
                {role || 'Sélectionner un rôle'}
              </MDBDropdownToggle>
              <MDBDropdownMenu className='w-100'>
                <MDBDropdownItem link onClick={() => setRole('AQ')}>AQ</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setRole('CQ')}>CQ</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
          <div className='d-flex flex-row justify-content-center mb-4'>
            <MDBCheckbox name='flexCheck' id='flexCheckDefault' label="J'accepte toutes les déclarations des Conditions d'utilisation" />
          </div>
          {/* Display error or success message */}
          {error && <p className="text-danger text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}
          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' onClick={handleRegister} disabled={loading}>
            {loading ? 'Registering...' : " S'inscrire"}
          </MDBBtn>
          <div className="text-center">
            <p>Vous avez déjà un compte ? <Link to="/login" style={{ color: 'green' }}>Connectez-vous ici</Link></p>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Register;
