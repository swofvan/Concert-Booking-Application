import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import logo from "../images/TixTrack_Logo.svg";
import axios from "axios";

import { removeUser } from "./store/authSlice";

import "../App.css";
import Cookies from "js-cookie"; 



function Navbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const user = useSelector(state => state.auth.user);
    const token = user?.token;   // ------------------------------- get token from redux store

    function logoutuser() {

        // const csrftoken = Cookies.get("csrftoken");    // --------------------------------- get CSRF token from cookie

        if (!token) {
            console.error("No token found, cannot logout");
            dispatch(removeUser());
            navigate('/login');
            return;
        }

        axios.post('http://127.0.0.1:8000/logout/', {}, {

            headers: {
                Authorization: `Token ${token}`,
            }

        })
        .then(response => {
            console.log(response.data.message);             // ------------------------- optional: show logout message
        })
        .catch(err => {
            console.error("Logout failed", err);      // ------------------------- handle errors
        })
        .finally(() => {     
            dispatch(removeUser());                    // -------------------------------- redux + localStorage clear
            navigate('/login');                        // ------------------------- redirect to login
        });
    }

    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-white">

                <NavLink to={'/'} className="navbar-brand">
                        <img src={ logo } alt="TixTrack Logo" width={'147px'} className="img-fluid"/>
                </NavLink>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    
                    <ul className="navbar-nav mx-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <NavLink to={'/'} className="nav-link">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={'/concerts'} className="nav-link">Concerts</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={'/aboutus'} className="nav-link">About us</NavLink>
                    </li>
                    </ul>

                    {user ? (
                        
                        <Link
                            onClick={logoutuser} 
                            className="btn text-white"
                            title="Logout"
                            style={{
                                backgroundColor: '#7F01F4',
                                height: '35px',
                                width: '35px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            <i className="bi bi-person-fill"></i>
                        </Link>

                    ) : (
                        
                        <Link
                            to="/register"
                            className="btn text-white"
                            title="Login"
                            style={{
                                backgroundColor: '#6c757d',
                                height: '35px',
                                width: '35px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}
                        >
                            <i className="bi bi-person"></i>
                        </Link>
                    )}

                </div>
                </nav>
        </div>
    )
}

export default Navbar;