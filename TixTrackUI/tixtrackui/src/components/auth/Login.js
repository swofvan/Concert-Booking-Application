import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../Navbar";


function Login() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // --------------------------------------------------------------------------------- Make a GET request once to fetch CSRF cookie
    
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/", {

            withCredentials: true
             
        })
            .catch(err =>
                console.log("CSRF fetch failed", err));
    }, []);


    function loginUser(e) {

        e.preventDefault();

        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage("Email and password are required");
            return;
        }

        // const csrftoken = Cookies.get("csrftoken");   // --------------------------------- get CSRF token from cookie

    axios.post(
        "http://localhost:8000/login/",
        {
            email,
            password
        },
        // {
        //     withCredentials: true   // REQUIRED for Django session
        // }
    )
    .then(res => {

        // const token = res.data.token;

        // localStorage.setItem("token", token);

        const user = {
            email: res.data.email,
            username: res.data.username,
            is_superuser: res.data.is_superuser,
            token: res.data.token
        };

        //  Save user in redux + localStorage
        dispatch(setUser(user));

        //  ADMIN Django pages
        if (user.is_superuser) {
            window.location.href = "http://localhost:8000/";
        }
        //  NORMAL USER  React app
        else {
            navigate("/");
        }
    })
    .catch(error => {
        console.log(error);

        if (error.response?.data?.error) {
            setErrorMessage(error.response.data.error);
        } else {
            setErrorMessage("Login failed");
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

                        <h2 className="text-center">Login</h2>
                        <form className="mt-4" onSubmit={loginUser} method="POST">
                            
                            {errorMessage ?
                                <div className="alert alert-danger">
                                    {errorMessage}
                                </div> : ''}
                            
                            <div className="form-group">
                                <input type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email id"
                                />
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </div>
                            <div className="form-group">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block">
                                    Login
                                    </button>
                            </div>
                            
                        </form>

                        <Link to={'/register'} className="text-primary"
                            style={{ textAlign: 'center', display: 'block', marginTop: '10px' }}>
                            Don't have an account? <b>Signup</b>
                        </Link>
                        
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login;