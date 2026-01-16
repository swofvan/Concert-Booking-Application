import axios from "axios";
import Navbar from "./Navbar";
import "../App.css";

import { useState, useEffect, useParams } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookTickets() {

    const location = useLocation();
    const navigate = useNavigate();

    const { concert } = location.state || {}; // concert object passed via Link state

    const { id } = useParams();  // get ID from URL
    
    const [concerts, setConcerts] = useState(null);

    const [tickets, setTickets] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch concert if not passed via state
        axios.get(`http://127.0.0.1:8000/api/concerts/${id}`)
            .then(res => setConcerts(res.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!concert) return <h3 className="text-center mt-5">Loading...</h3>;

    // // Prevent crash if someone opens /book directly
    // if (!concert) {
    //     return <h3 className="text-center mt-5">Invalid booking access</h3>;
    // }

    const bookTickets = () => {
        setLoading(true);

        const token = localStorage.getItem("token");

        axios.post(
            "http://127.0.0.1:8000/api/book/",
            {
                show: concert.id,
                tickets: tickets
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((response) => {
            alert(`Booking created! Pay ₹${response.data.total_price}`);
            // redirect to payment page if needed
            // navigate(`/payment/${response.data.booking_id}`);
        })
        .catch((error) => {
            alert(error.response?.data?.error || "Booking failed");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div style={{ backgroundColor: "#e9f2ff", minHeight: "100vh" }}>

            <Navbar />

            <div className="container mt-5">
                <div className="card p-4 text-center">

                    <h3>{concert.concert_name}</h3>
                    <p>{concert.artists}</p>
                    <p>{concert.venue}</p>
                    <p>Price per ticket: ₹{concert.price}</p>

                    <input
                        type="number"
                        min="1"
                        // max="3"
                        value={tickets}
                        onChange={(e) => setTickets(e.target.value)}
                        className="form-control w-25 mx-auto my-3"
                    />

                    <button
                        className="btn btn-primary"
                        onClick={bookTickets}
                        disabled={loading}
                    >
                        {loading ? "Booking..." : "Book Tickets"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default BookTickets;
