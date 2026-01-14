import { NavLink, Link } from "react-router-dom";

import logo from "../images/TixTrack_Logo.svg";


function Navbar() {
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
                    <li className="nav-item active">
                        <NavLink to={'/'} className="nav-link">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={'/concerts'} className="nav-link">Concerts</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={'/'} className="nav-link">Link</NavLink>
                    </li>
                    </ul>
                    {/* <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form> */}
                    
                    {/* <Link to={'/'} className="btn text-white"
                        style={{ backgroundColor:'#7F01F4' }}
                        >SignUp</Link> */}


                    <Link to={'/register'} className="btn text-white"
                        style={{backgroundColor: '#7F01F4', height:'35px', width:'35px', borderRadius:'40px',display:'flex',alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
                            <i className="bi bi-person-fill"></i>
                    </Link>

                </div>
                </nav>
        </div>
    )
}

export default Navbar;