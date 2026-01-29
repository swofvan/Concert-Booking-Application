import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/TixTrack_Logo_white.svg';

function Footer() {
    return (
        <footer style={{ 
            backgroundColor: '#1a1a2e', 
            color: 'white',
            padding: '40px 0 20px',
            marginTop: 'auto'
        }}>
            <div className="px-5">
                <div className="row">
                    
                    {/* Brand Section */}
                    <div className="col-md-4  mt-4">
                        <img src={ logo } alt="TixTrack Logo" width={'150px'} className="img-fluid"/>
                                                
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#aaa',
                            width: '75%',
                            lineHeight: '1.6',
                            marginBottom: '0',
                            marginTop: '20px',
                        }}>
                            Your gateway to unforgettable live experiences. Book tickets to the hottest concerts and events.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-3 mb-4">
                        <h5 style={{ 
                            fontSize: '18px', 
                            fontWeight: '700', 
                            marginBottom: '20px',
                            color: 'white'
                        }}>
                            Quick Links
                        </h5>
                        <ul className="navbar-nav mx-auto mt-2 mt-lg-0">
                            <li className="nav-item">
                                <NavLink 
                                    to="/"
                                    className="nav-link text-secondary"
                                    style={{ fontSize: '16px' }}
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    to="/concerts"
                                    className="nav-link text-secondary"
                                    style={{ fontSize: '16px' }}
                                >
                                    Concerts
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/aboutus"
                                    className="nav-link text-secondary"
                                    style={{ fontSize: '16px' }}
                                    >
                                    About Us
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-md-2 mb-4">
                        <h5 style={{ 
                            fontSize: '18px', 
                            fontWeight: '700', 
                            marginBottom: '20px',
                            color: 'white'
                        }}>
                            Support
                        </h5>
                        <ul style={{ 
                            listStyle: 'none', 
                            padding: '0',
                            margin: '0'
                        }}>
                            <li style={{ marginBottom: '10px' }}>
                                <NavLink to="/help" style={{ 
                                    color: '#aaa', 
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.3s'
                                }}>
                                    Help Center
                                </NavLink>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <NavLink to="/faq" style={{ 
                                    color: '#aaa', 
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.3s'
                                }}>
                                    FAQ
                                </NavLink>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <NavLink to="/contact" style={{ 
                                    color: '#aaa', 
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    transition: 'color 0.3s'
                                }}>
                                    Contact Us
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-3 mb-4">
                        <h5 style={{ 
                            fontSize: '18px', 
                            fontWeight: '700', 
                            marginBottom: '20px',
                            color: 'white'
                        }}>
                            Contact
                        </h5>
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#aaa',
                            marginBottom: '10px',
                            lineHeight: '1.6'
                        }}>
                            📧 support@tixtrack.com
                        </p>
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#aaa',
                            marginBottom: '0',
                            lineHeight: '1.6'
                        }}>
                            📞 +91 1800 123 4567
                        </p>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="row mt-4 pt-3" style={{ 
                    borderTop: '1px solid #333'
                }}>
                    <div className="col-md-6 mb-2">
                        <p style={{ 
                            fontSize: '14px', 
                            color: '#888',
                            marginBottom: '0'
                        }}>
                            © 2026 TixTrack. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6 text-md-right mb-2">
                        <NavLink to="/privacy" style={{ 
                            color: '#888', 
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginLeft: '20px'
                        }}>
                            Privacy Policy
                        </NavLink>
                        <NavLink to="/terms" style={{ 
                            color: '#888', 
                            textDecoration: 'none',
                            fontSize: '14px',
                            marginLeft: '20px'
                        }}>
                            Terms of Service
                        </NavLink>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
