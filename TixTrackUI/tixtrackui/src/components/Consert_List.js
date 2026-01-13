import axios from "axios";
import Navbar from "./Navbar";
import '../App.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function Concert_list() {

    const [concert, setConcert] =useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/concerts')
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
                <div className='row mt-5'>
                <div className='col'>

                    <div className="card-deck">
                        
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

        </div>
        
    )
}

export default Concert_list;


{/* <table className="table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Concert</th>
                            <th>Artists</th>
                            <th>Category</th>
                            <th>Venue</th>
                            <th>Date & Time</th>
                            <th>Total Tickets</th>
                            <th>Price</th>
                        </tr>
                        </thead>

                        <tbody>
                        {concert.map(concert => (
                            <tr key={concert.id}>
                            <td>
                                <img
                                src={concert.image}
                                alt={concert.name}
                                width="60"
                                />
                            </td>
                            <td>{concert.concert_name}</td>
                            <td>{concert.artists}</td>
                            <td>{concert.category}</td>
                            <td>{concert.venue}</td>
                            <td>{new Date(concert.date_time).toLocaleString()}</td>
                            <td>{concert.total_tickets}</td>
                            <td>{concert.price}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table> */}