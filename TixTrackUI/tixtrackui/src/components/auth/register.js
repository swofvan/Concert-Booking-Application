import axios from "axios";
import { useState } from "react";
import { useNavigate, Links, Link } from "react-router-dom";

import Navbar from "../Navbar";
import "../../App.css"

function isNumeric(str) {
    return /^\d+$/.test(str);
}

function isTooSimilar(password, name, email) {
    const lower = password.toLowerCase();
    return (
        lower.includes(name.toLowerCase()) ||
        lower.includes(email.split("@")[0].toLowerCase())
    );
}

function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    setErrorMessage("");

    // Name validation
    if (name.trim().length < 3) {
        setErrorMessage("Name must contain at least 3 characters");
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setErrorMessage("Please enter a valid email address");
        return;
    }

    // Password length
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

    // Confirm password
    if (password !== passwordConf) {
        setErrorMessage("Passwords do not match");
        return;
    }


    function registerUser(e) {
        
        e.preventDefault();

        const user = {
            name : name,
            email : email,
            password : password,
            confirm_password : passwordConf
        }

        setErrorMessage("");
        


        axios.post('http://127.0.0.1:8000/register',user)
            .then(response => {
                setErrorMessage('');
                alert(`${name} registered successfully`);
                navigate('/');
            })
            .catch(error => {
                if(error.response.data.errors) {
                    setErrorMessage(Object.values(error.response.data.errors).join(''))
                }
                else{
                    setErrorMessage("Failed to connect to server")
                }
            })
    }

    return (

        <div style={{backgroundColor:'#e9f2ff', minHeight:'100vh'}}>
            
            <Navbar/>
            
            <div className="container" id="concertlist">
                <div className='row mt-5'>
                    <div className='col-md-6 offset-3' id="registerformbg">

                        <form>
                            {errorMessage?<div className="alert alert-danger">{errorMessage}</div>:''}
                            <div className="form-group">
                                <input type="text"
                                className="form-control"
                                value={name}
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
                                value={passwordConf}
                                onInput={(event)=>setPasswordConf(event.target.value)}
                                placeholder="Confirm Password"
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary float-right"
                                    onClick={registerUser}>
                                    SignUp
                                    </button>
                            </div>

                            <Link to={'/'} className="btn btn-secondary">Cancel</Link>
                            
                        </form>
                        
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Register;