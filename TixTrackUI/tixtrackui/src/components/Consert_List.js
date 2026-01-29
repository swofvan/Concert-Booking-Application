import axios from "axios";
import Navbar from "./Navbar";
import '../App.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import Footer from "./footer";


function Concert_list() {
    const token = localStorage.getItem("token");


    const [concert, setConcert] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/concerts")
            .then(response => {
                setConcert(response.data);
            })
            .catch(error => {
                console.log("Error fetching concerts:", error);
            })
    }, [])

    return(
        <div style={{backgroundColor:'#e9f2ff', minHeight:'100vh'}}>

            <Navbar/>

            <div className="container" id="concertlist">
                <div className='row mt-50'>
                <div className='col'>

                    <div className="card-deck mt-5" style={{gap:'20px', justifyContent:'center', display:'flex', flexWrap:'wrap'}}>
                        
                        {concert.map(concert =>(

                        <div className="card text-center" key={concert.id} style={{maxWidth:'250px'}}>

                            <Link to={`/concerts/${concert.id}`} className="card-link" state={{ concert }}>
                             
                                                                                    {/* state is useing for pass the full object */}

                            <img src={concert.image} alt={concert.name}  className="img-fluid" style={{minHeight:'350px'}} />
                            <div className="card-body">
                            <h5 className="card-title">{concert.concert_name}</h5>
                            <p className="card-text">{concert.artists}</p>
                            <p className="card-text"><small className="text-secondary">{concert.venue}</small></p>
                            </div>

                            </Link>
    
                        </div>

                        ))}
                        
                    </div>
                    

                </div>
                </div>
            </div>

            <br/><br/>

            <Footer/>

        </div>
        
    )
}

export default Concert_list;