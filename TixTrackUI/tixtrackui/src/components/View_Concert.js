
import Navbar from "./Navbar";
import {useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";


import Footer from "./footer";


function View_Concert() {

    const { concertid } = useParams();
    // const location = useLocation();
    // const concert = location.state?.concert;

    const [concert, setConcert] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!concertid) {
            setLoading(false);
            return;
        }

        axios.get(`http://127.0.0.1:8000/api/concerts/${concertid}/`)
            .then((response) => {
                setConcert(response.data);
            })
            .catch((error) => {
                console.log("Error fetching concert:", error);
            })
            .finally(() => {
                setLoading(false); 
            });
    }, [concertid]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!concert) {
        return (
            <div className="text-center mt-5">
                <p>Concert not available</p>
            </div>
        );
    }

    return(
        <div style={{backgroundColor:'#e9f2ff', minHeight:'100vh'}}>
            
            <Navbar/>

            <div className="container">
                <div className='row mt-5'>
                <div className='col-md-7'>

                    <img src={concert.image} alt={concert.concert_name} 
                        style={{width:'100%', height:'450px'}}></img>

                </div>
                <div className='col-md-5'>

                    <div className="card" 
                        style={{borderRadius:'10px'}}>
                        <div className="card-body">
                            <ul className="list-group list-group-flush" id="concertdetails">
                                <li className="list-group-item">
                                    <h1 className="card-title d-inline">{ concert.concert_name }</h1>
                                </li>
                                <li className="list-group-item"><i className="bi bi-person-video"></i> &nbsp; {concert.artists}</li>
                                <li className="list-group-item"><i className="bi bi-bookmark"></i> &nbsp; {concert.category}</li>
                                <li className="list-group-item"><i className="bi bi-geo-alt"></i> &nbsp; {concert.venue}</li>
                                <li className="list-group-item"><i className="bi bi-calendar3"></i> &nbsp; {new Date(concert.date_time).toLocaleString()}</li>
                                <li className="list-group-item"><i className="bi bi-ticket-detailed"></i> &nbsp; {concert.total_tickets}</li>
                            </ul>
                            <hr/>
                            
                            <h3 className="d-inline"> &nbsp; ₹{concert.price}</h3>
                            {/* <Link to={`/booking/${concert.id}`} className="btn text-white float-right" style={{backgroundColor: '#1E052F'}}>Book Tickets</Link> */}
                            <Link 
                                to={`/booking/${concert.id}`} 
                                state={{ concert }}                          // pass the object
                                className="btn text-white float-right" 
                                style={{backgroundColor: '#1E052F'}}>
                                    Book Tickets
                                </Link>
                        </div>
                    </div>

                </div>
                </div>
            </div>
            <br/><br/>  
            <Footer />

        </div>
        
    )
}

export default View_Concert;