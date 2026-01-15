import axios from "axios";
import { useState } from "react";
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

    function loginUser(e) {

        e.preventDefault();
        
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage("Email and password are required");
            return;
        }

        axios.post('http://127.0.0.1:8000/login/', {
            email: email,
            password: password
        },
        {
            withCredentials: true
        }
        // { headers: {
        //     Authorization: `Bearer ${user.token}`} }
        )
        
        .then(response => {
            
            setErrorMessage('');

            const user = {
                email: response.data.email,
                username: response.data.username,
            };

            dispatch(setUser(user));   // ------------------------  redux + localStorage
            navigate("/");  
        })
        .catch(error => {
            if (error.response.data.errors) {
                setErrorMessage(Object.values(error.response.data.errors).join(' '));
            } else if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to login user. Please contact admin');
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
                            <i class="bi bi-house-door"></i>
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