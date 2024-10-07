import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer
            className="footer"
            style={{
                background: 'linear-gradient(to right,#042B0B,#546955)',
                boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.5)', 
                padding: '0.5rem 0', 
                color: '#ffffff', 
                position: 'relative',
                bottom: 0,
                width: '100%', 
                fontSize: '0.875rem', 
            }}
        >
            <Container fluid>
                <div className="footer-content" style={{ textAlign: 'center' }}>
                    <p style={{ marginBottom: '0.5rem' }}>&copy; 2024 Opella. All rights reserved.</p>
                    <ul className="footer-links" style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        <li style={{ display: 'inline', margin: '0 10px' }}>
                            <a href="/about" style={{ color: '#ffffff', textDecoration: 'none' }}>About Us</a>
                        </li>
                        <li style={{ display: 'inline', margin: '0 10px' }}>
                            <a href="/privacy" style={{ color: '#ffffff', textDecoration: 'none' }}>Privacy Policy</a>
                        </li>
                        <li style={{ display: 'inline', margin: '0 10px' }}>
                            <a href="/terms" style={{ color: '#ffffff', textDecoration: 'none' }}>Terms of Service</a>
                        </li>
                        <li style={{ display: 'inline', margin: '0 10px' }}>
                            <a href="/faq" style={{ color: '#ffffff', textDecoration: 'none' }}>Help/FAQ</a>
                        </li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
