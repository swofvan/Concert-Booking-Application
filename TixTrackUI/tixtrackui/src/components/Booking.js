import axios from "axios";
import Navbar from "./Navbar";
import "../App.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function BookTickets() {

    const navigate = useNavigate();
    const { id } = useParams();  // get ID from URL
    const location = useLocation();
    
    const [concert, setConcert] = useState(
        location.state.concert || null
    );

    const [tickets, setTickets] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect(() => {

    //     axios.get(`http://127.0.0.1:8000/api/concerts/${id}`)
    //         .then((response) => {
    //             setConcert(response.data);
    //         })
    //         .catch((error) => {
    //             console.log("Error fetching concert:", error);
    //         });
    // }, [id, concert]);

     if (!concert) {
        return (
            <div style={{ backgroundColor: "#e9f2ff", minHeight: "100vh" }}>
                <Navbar />
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary"></div>
                    <p>Loading concert details...</p>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------- Ticket change handler,   Validation while typing (UX)

    const handleTicketChange = (e) => {
        const value = Number(e.target.value);

        if (value > 3) {
            setErrorMessage("You can book a maximum of 3 tickets only");
        } else if (value < 1) {
            setErrorMessage("Minimum 1 ticket is required");
        } else {
            setErrorMessage("");
        }

        setTickets(value);
    };

    const bookTickets = () => {

// ------------------------------------------------------- Validation before API call (Safety)

        if (tickets < 1 || tickets > 3) {
            setErrorMessage("Please select between 1 and 3 tickets");
            return;
        }

         setLoading(true);

        const token = localStorage.getItem("token");

        axios.post(
            "http://127.0.0.1:8000/create_booking/",
            {
                show: concert.id,
                tickets: tickets
            },
            {
                // headers: {
                //     Authorization: `Bearer ${token}`
                // }
                withCredentials : true
            }
        )
        .then((response) => {
            alert(`Booking created! Pay ₹${response.data.total_price}`);
            // redirect to payment page if needed
            // navigate(`/payment/${response.data.booking_id}`);
            navigate('/concerts')
        })
        .catch((error) => {
            alert(error.response.data.error || "Booking failed");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div style={{ backgroundColor: "#e9f2ff", minHeight: "100vh" }}>

            <Navbar />

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-3" 
                        style={{display:'flex', justifyContent:"center", alignItems:'center'}}>

                        <div className="card text-center" style={{ maxWidth:'600px'}}>
                            <img src={concert.image}
                                className="card-img-top"
                                alt={concert.concert_name}
                                style={{maxHeight: '500px'}}
                                />
                            <div className="card-body">
                                <h5 className="card-title">{concert.concert_name}</h5>
                                <p>{concert.artists}</p>
                                <p className="text-muted">{concert.date_time}</p>
                                <p>Price per ticket: ₹{concert.price}</p>
                                <label style={{display:'inline'}}>Number Of tickets: </label> 
                                &nbsp;
                                <input 
                                style={{display:'inline'}}
                                    min={'0'}
                                    type="number"
                                    value={tickets}
                                    onChange={handleTicketChange}
                                    className="form-control w-25 mx-auto my-3"
                                />
                                
                                {!errorMessage && (
                                    <p>Total Price: <b>₹{concert.price * tickets}</b></p>
                                )}

                                {errorMessage?
                                    <div className="alert alert-danger">
                                        {errorMessage}
                                    </div>
                                    : '' }

                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={bookTickets}
                                    disabled={loading || errorMessage}
                                >
                                    Book Tickets
                                </button>
                            </div>
                        </div>
        
                    </div>
                </div>
            </div>
                <br/><br/>
        </div>
    );
}

export default BookTickets;
