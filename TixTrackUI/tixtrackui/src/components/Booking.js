import axios from "axios";
import Navbar from "./Navbar";
import "../App.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// function BookTickets() {

//     const navigate = useNavigate();
//     const { concertId } = useParams();     // ----------------------------- get ID from URL

//     const [concert, setConcert] = useState(null);

//     const [tickets, setTickets] = useState(0);
//     const [loading, setLoading] = useState(false);

//     const [errorMessage, setErrorMessage] = useState('');

//     useEffect(() => {
//         if (!concertId) {
//             setLoading(false);
//             return;
//         }

//         axios.get(`http://127.0.0.1:8000/api/concerts/${concertId}/`)
//             .then((response) => {
//                 setConcert(response.data);
//             })
//             .catch(() => {
//                 alert("Failed to load concert details");
//                 navigate("/concerts");
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     }, [concertId, navigate]);



//      if (!concert) {
//         return (
//             <div style={{ backgroundColor: "#e9f2ff", minHeight: "100vh" }}>
//                 <Navbar />
//                 <div className="text-center mt-5">
//                     <div className="spinner-border text-primary"></div>
//                     <p>Loading concert details...</p>
//                 </div>
//             </div>
//         );
//     }

//     // ------------------------------------------------------- Ticket change handler,   Validation while typing (UX)

//     const handleTicketChange = (e) => {
//         const value = Number(e.target.value);

//         if (value < 1 || value > 3) {
//             setErrorMessage("You can book between 1 and 3 tickets only");
//         } else {
//             setErrorMessage("");
//         }

//         setTickets(value);
//     };

// // ------------------------------------------------------- Validation before API call (Safety)

//     const bookTickets = () => {

//         if (tickets < 1 || tickets > 3) {
//             setErrorMessage("Please select between 1 and 3 tickets");
//             return;
//         }

//         const token = localStorage.getItem("token");

//         if (!token) {
//             alert("Please login to book tickets");
//             navigate("/login");
//             return;
//         }

//         setLoading(true);

//         axios.post(
//             "http://127.0.0.1:8000/create_booking/",
//             {
//                 show_id: concert.id,
//                 tickets: tickets
//             },
//             {
                
//                     withCredentials: true,
//                 headers: {
//                     // Authorization: `Token ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         )
//         .then((response) => {
//             alert('Booking created!');
//             // navigate(`/payment/${response.data.booking_id}`);
//             navigate('/concerts')
//         })
//         .catch((error) => {
//             alert(error.response?.data?.error || "Booking failed");
//         })
//         .finally(() => {
//             setLoading(false);
//         });
//     };



function BookTickets() {

    const navigate = useNavigate();
    const { concertId } = useParams();

    const [concert, setConcert] = useState(null);
    const [tickets, setTickets] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isTicketInvalid = tickets < 1 || tickets > 3 || (concert && tickets > concert.available_tickets);

     useEffect(() => {
        
        axios.get(// `http://127.0.0.1:8000/api/concerts/${concertId}/`,
            `http://localhost:8000/api/concerts/${concertId}/`,
            {
                withCredentials: true
            })

        .then(response => 
            setConcert(response.data))

        .catch(err => {

            if (err.response?.status === 401 || err.response?.status === 403) {
            
            alert("Please login to access this page.");
            navigate("/login");
            }
            else {
                alert("Failed to load concert details");
                navigate("/concerts");
            }
        });
    }, [concertId, navigate]);

    // ------------------------------------------------------- Validation when tickets or concert change

    useEffect(() => {
        if (!concert) return;

        if (tickets < 1 || tickets > 3) {
            setErrorMessage("You can book between 1 and 3 tickets only");
        }
        else if (tickets > concert.available_tickets) {
            setErrorMessage(`Only ${concert.available_tickets} tickets available`);
        }
        else {
            setErrorMessage("");
        }
    }, [tickets, concert]);

    // ------------------------------------------------------- Loading state

    if (!concert) {
        return <p>Loading...</p>;
    }
    

    const handleTicketChange = (e) => {
        const value = Number(e.target.value);

        if (value < 1 || value > 3) {
            setErrorMessage("You can book between 1 and 3 tickets only");
        }
        else if (value > concert.available_tickets) {
            setErrorMessage(`Only ${concert.available_tickets} tickets available`);
        } 
        else {
            setErrorMessage("");
        }

        setTickets(value);
    };

    const bookTickets = () => {

        if (tickets < 1 || tickets > 3) {
            setErrorMessage("Please select between 1 and 3 tickets");
            return;
        }

        if (tickets > concert.available_tickets) {
            setErrorMessage(`Only ${concert.available_tickets} tickets available`);
            return;
        }

        setLoading(true);

        axios.post(
            // "http://127.0.0.1:8000/create_booking/",
            "http://localhost:8000/create_booking/",
            {
                show: concert.id,     
                tickets: tickets
            },
            {
                withCredentials: true  
            }
        )
        .then((response) => {
            alert("Booking created successfully!");
            const bookingId = response.data.id;        
            navigate(`/ticket/${bookingId}`);
        })
        // .catch(err => {
        //     alert(err.response?.data?.error || "Booking failed");
        // })
        .catch(err => {
            if (err.response?.status === 401 || err.response?.status === 403) {
                // User not logged in or session expired
                alert("Session expired or not authorized. Please login again.");
                navigate("/login");
            } else {
                alert(err.response?.data?.error || "Booking failed");
            }
        })

        .finally(() => setLoading(false));
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
                                        min='0'
                                        type="number"
                                        value={tickets}
                                        onChange={handleTicketChange}
                                        className="form-control w-25 mx-auto my-3"
                                    />

                                    {!errorMessage && tickets > 0 && (
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
                                        // disabled={loading || errorMessage}
                                        disabled={loading || isTicketInvalid}
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
