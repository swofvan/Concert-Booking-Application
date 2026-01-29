import React from 'react';
import logo from '../images/TixTrack_Logo.svg';
import Navbar from './Navbar';
import Footer from './footer';

function AboutUs() {
    return (
        <div style={{backgroundColor:'#e9f2ff', minHeight:'100vh'}}>
            <Navbar />
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        
                        {/* Logo/Brand Section */}

                        <img src={ logo } alt="TixTrack Logo" width={'200px'} className="img-fluid d-block mx-auto mt-5"/>
                        
                        <div className="text-center mb-5 mt-3">    
                            <p style={{ 
                                fontSize: '17px', 
                                color: '#666', 
                                marginBottom: '0'
                            }}>
                                Track Tickets, Capture Memories
                            </p>
                        </div>

                        {/* Main Content Card */}
                        <div className="card shadow-sm mb-4" style={{ 
                            borderRadius: '20px', 
                            border: 'none',
                            padding: '40px'
                        }}>
                            <div className="card-body text-center">
                                
                                {/* Who We Are */}
                                <h2 style={{ 
                                    fontSize: '32px', 
                                    fontWeight: '700', 
                                    color: '#1a1a2e', 
                                    marginBottom: '20px'
                                }}>
                                    Who We Are
                                </h2>
                                <p style={{ 
                                    fontSize: '18px', 
                                    color: '#555', 
                                    lineHeight: '1.8',
                                    marginBottom: '40px'
                                }}>
                                    TixTrack is your trusted companion for discovering and booking tickets to the most exciting concerts and live music events. We believe that live music has the power to bring people together, create lasting memories, and inspire joy.
                                </p>

                                {/* Divider */}
                                <div style={{ 
                                    width: '80px', 
                                    height: '4px', 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    margin: '0 auto 40px',
                                    borderRadius: '2px'
                                }}></div>

                                {/* Our Mission */}
                                <h2 style={{ 
                                    fontSize: '32px', 
                                    fontWeight: '700', 
                                    color: '#1a1a2e', 
                                    marginBottom: '20px'
                                }}>
                                    Our Mission
                                </h2>
                                <p style={{ 
                                    fontSize: '18px', 
                                    color: '#555', 
                                    lineHeight: '1.8',
                                    marginBottom: '40px'
                                }}>
                                    We're on a mission to make concert booking simple, secure, and seamless. From intimate acoustic sessions to massive festival stages, we connect music lovers with their favorite artists and help create unforgettable experiences.
                                </p>

                                {/* Divider */}
                                <div style={{ 
                                    width: '80px', 
                                    height: '4px', 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    margin: '0 auto 40px',
                                    borderRadius: '2px'
                                }}></div>

                                {/* Why Choose Us */}
                                <h2 style={{ 
                                    fontSize: '32px', 
                                    fontWeight: '700', 
                                    color: '#1a1a2e', 
                                    marginBottom: '30px'
                                }}>
                                    Why Choose TixTrack?
                                </h2>
                                
                                <div className="row mt-4">
                                    <div className="col-md-4 mb-4">
                                        <div style={{ 
                                            padding: '20px',
                                            borderRadius: '15px',
                                            backgroundColor: '#f8f9ff'
                                        }}>
                                            <div style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 15px',
                                                color: 'white',
                                                fontSize: '28px',
                                                fontWeight: 'bold'
                                            }}>
                                                ✓
                                            </div>
                                            <h5 style={{ 
                                                fontSize: '20px', 
                                                fontWeight: '600', 
                                                color: '#1a1a2e',
                                                marginBottom: '10px'
                                            }}>
                                                Easy Booking
                                            </h5>
                                            <p style={{ 
                                                fontSize: '16px', 
                                                color: '#666',
                                                marginBottom: '0'
                                            }}>
                                                Book tickets in just a few clicks
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-4">
                                        <div style={{ 
                                            padding: '20px',
                                            borderRadius: '15px',
                                            backgroundColor: '#f8f9ff'
                                        }}>
                                            <div style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 15px',
                                                color: 'white',
                                                fontSize: '28px',
                                                fontWeight: 'bold'
                                            }}>
                                                🔒
                                            </div>
                                            <h5 style={{ 
                                                fontSize: '20px', 
                                                fontWeight: '600', 
                                                color: '#1a1a2e',
                                                marginBottom: '10px'
                                            }}>
                                                Secure Payments
                                            </h5>
                                            <p style={{ 
                                                fontSize: '16px', 
                                                color: '#666',
                                                marginBottom: '0'
                                            }}>
                                                Your transactions are safe with us
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-4">
                                        <div style={{ 
                                            padding: '20px',
                                            borderRadius: '15px',
                                            backgroundColor: '#f8f9ff'
                                        }}>
                                            <div style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 15px',
                                                color: 'white',
                                                fontSize: '28px',
                                                fontWeight: 'bold'
                                            }}>
                                                🎫
                                            </div>
                                            <h5 style={{ 
                                                fontSize: '20px', 
                                                fontWeight: '600', 
                                                color: '#1a1a2e',
                                                marginBottom: '10px'
                                            }}>
                                                Digital Tickets
                                            </h5>
                                            <p style={{ 
                                                fontSize: '16px', 
                                                color: '#666',
                                                marginBottom: '0'
                                            }}>
                                                Get QR code tickets instantly
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUs;
