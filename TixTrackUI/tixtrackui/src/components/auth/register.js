import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../Navbar";
import "../../App.css";

function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();


    function registerUser(e) {
        
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.trim().length < 3) {
            setErrorMessage("Name must contain at least 3 characters");
            return;
        }

        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Password must contain at least 8 characters");
            return;
        }

        if (/^\d+$/.test(password)) {
            setErrorMessage("Password cannot be entirely numeric");
            return;
        }

        if (password.toLowerCase().includes(name.toLowerCase())) {
            setErrorMessage("Password too similar to name");
            return;
        }

        if (password !== password2) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setErrorMessage("");

        const user = {
            username: name,
            email: email,
            password1: password,
            password2: password2
        };

        axios.post("http://127.0.0.1:8000/register/",user,{
                headers: {
                    "Content-Type": "application/json"
                }
            })

            .then(response => {
                setErrorMessage('');
                alert(`${name} registered successfully`);
                navigate('/login');
            })
            .catch(error => {
                if (error.response.data) {
                    setErrorMessage(Object.values(error.response.data).join(''));
                }
                else {
                    setErrorMessage("Failed to connect to server");
                }
            });
}

    return (

        <div style={{backgroundColor:'#e9f2ff', minHeight:'100vh'}}>
            
            <Navbar/>
            
            <div className="container" id="concertlist">
                <div className='row mt-5'>
                    <div className='col-md-6 offset-3' id="registerformbg">
                        
                        <Link to={'/'} className="btn btn-outline-secondary">
                            <i className="bi bi-house-door"></i>
                        </Link>

                        <h2 className="text-center">Signup</h2>
                        <form method="POST" className="mt-4" onSubmit={registerUser}>
                            {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                            <div className="form-group">
                                <input type="text"
                                className="form-control"
                                value={name}
                                name="name"
                                placeholder="Your Name"
                                onInput={(event)=>setName(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input type="email"
                                className="form-control"
                                value={email}

                                onInput={(event)=>setEmail(event.target.value)}
                                placeholder="Email id"
                                />
                            </div>
                            <div className="form-group">
                                <input type="password"
                                className="form-control"
                                value={password}
                                onInput={(event)=>setPassword(event.target.value)}
                                placeholder="Password"
                                />
                            </div>
                            <div className="form-group">
                                <input type="password"
                                className="form-control"
                                value={password2}
                                onInput={(event)=>setPassword2(event.target.value)}
                                placeholder="Confirm Password"
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block">
                                    SignUp
                                    </button>
                            </div>
                            
                        </form>

                        <Link to={'/login'} className="text-primary"
                            style={{ textAlign: 'center', display: 'block', marginTop: '10px' }}>
                            Are you already registered? <b>Login</b>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;