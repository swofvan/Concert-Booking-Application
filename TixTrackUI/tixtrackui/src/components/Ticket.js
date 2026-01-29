import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

import logo from "../images/TixTrack_Logo.svg";

import checkAuth from "./auth/checkAuth";

import { useSelector } from "react-redux";


const Ticket = () => {
    const { bookingId } = useParams();
    const [qrCode, setQrCode] = useState(null);
    const [concert, setConcert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    
    var user = useSelector(store=>store.auth.user);

    // const token = localStorage.getItem("token");

    
    useEffect(() => {
        axios.get(`http://localhost:8000/bookingqrcode/${bookingId}/`,
            {
                headers: {
                // 'Authorization':"Bearer "+ user.token 
                Authorization: "Token " + user.token
                } 
            })
        .then(response => {
            setQrCode(response.data.qr_code);
            
            const concertId = response.data.concert_id;
            return axios.get(`http://localhost:8000/api/concerts/${concertId}/`, 
                {
                    headers: {
                        // 'Authorization':"Bearer "+ user.token,
                        Authorization: "Token " + user.token
                    }
                });
        })

        .then(response => setConcert(response.data))

        .catch(err => {
            console.error(err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Session expired or you are not authorized. Please login.");
            }

            else {
                    setError("Failed to load ticket or concert details.");
                }
            })

            .finally(() =>
                setLoading(false)
            );
    }, [bookingId, user.token]);

    // ------------------------------------------------------- Download PDF ticket

    const downloadPdf = () => {
        axios.get(
            `http://localhost:8000/download_ticket/${bookingId}/`,
            {
                headers: {
                    Authorization: "Token " + user.token
                },
                responseType: "blob"
            }
        )
        .then(response => {
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );

            const link = document.createElement("a");
            link.href = url;
            link.download = `ticket_${bookingId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(err => {
            console.error(err);
            alert("Failed to download ticket PDF");
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

  return (
    <div style={{backgroundColor:'#e9f2ff', minHeight:'100vh'}}>
        <Navbar/>
        <br/>
        
        <div className="container my-4">
                <div className="card mx-auto shadow" style={{ maxWidth: "500px", borderRadius: "15px" }}>
                    <div className="card-body p-4 text-center">
                        
                        <img src={ logo } alt="TixTrack Logo" width={'147px'} className="img-fluid d-block mx-auto"/>

                        <br/>
                        <img src={qrCode} alt="QR Code" style={{ width: "150px", height: "150px" }} />
                        <p>Booking ID: {bookingId}</p>
                        <p className="mt-3 text-muted small">Scan this QR code at the concert</p>
                        
                        {concert && (
                            <ul className="list-group list-group-flush" id="concertdetails">
                                <li className="list-group-item">
                                    <h1 className="card-title d-inline">{concert.concert_name}</h1>
                                </li>
                                <li className="list-group-item text-left"><i className="bi bi-person-video"></i> &nbsp; {concert.artists}</li>
                                <li className="list-group-item text-left"><i className="bi bi-bookmark"></i> &nbsp; {concert.category}</li>
                                <li className="list-group-item text-left"><i className="bi bi-geo-alt"></i> &nbsp; {concert.venue}</li>
                                <li className="list-group-item text-left"><i className="bi bi-calendar3"></i> &nbsp; {new Date(concert.date_time).toLocaleString()}</li>
                            </ul>
                        )}

                    </div>
                </div>
                <br/>
                <div className="text-center">
                    {/* <a
                        href={`http://localhost:8000/download_ticket/${bookingId}/`}
                        className="btn btn-primary mt-3"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download PDF
                    </a> */}
                    <button
                        className="btn btn-primary mt-3"
                        onClick={downloadPdf}
                    >
                        Download PDF
                    </button>
                </div>
            </div>
            
                <br/>
        </div>
    );
};

export default checkAuth(Ticket);
