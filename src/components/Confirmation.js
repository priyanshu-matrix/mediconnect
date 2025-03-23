import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Confirmation.css'; // You'll need to create this CSS file

const Confirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [timeLeft, setTimeLeft] = useState(10);
    
    // Extract URL parameters
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const quantity = parseInt(searchParams.get('quantity') || '0');
    const price = parseFloat(searchParams.get('price') || '0');
    
    const bookedMedicines = [
        { name: name || 'Unknown', quantity: quantity, price: quantity * price }
    ];
    
    // Set up redirection timer
    useEffect(() => {
        if (timeLeft <= 0) {
            navigate('/user-search');
            return;
        }
        
        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [timeLeft, navigate]);
    
    return (
        <div >
            <div className="confirmation-card" style={{color: 'black', textAlign: 'center', padding: '20px', margin: 'auto', width: '50%', marginTop: '50px'}}>
                <div className="success-checkmark">
                    <i className="checkmark">✓</i>
                </div>
                
                <h2>Order Confirmed!</h2>
                <p>Thank you for your order. Your medicine has been successfully booked.</p>
                
                <div className="medicine-details">
                    <h5>Medicine Details:</h5>
                    <ul>
                        {bookedMedicines.map((medicine, index) => (
                            <li key={index}>
                                <strong>Name:</strong> {medicine.name} <br />
                                <strong>Quantity:</strong> {medicine.quantity} <br />
                                <strong>Price:</strong> ₹{medicine.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="redirection-notice">
                    <p>You will be redirected to medicine search in {timeLeft} seconds...</p>
                    <button 
                        className="redirect-button" 
                        onClick={() => navigate('/user-search')}
                    >
                        Go to Search Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
