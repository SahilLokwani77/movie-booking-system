import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

export default function SeatSelection() {
    const { showId } = useParams();
    const navigate = useNavigate();
    const [seats, setSeats] = useState([]);
    const [showDetails, setShowDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const showRes = await axiosInstance.get(`/shows/${showId}`);
                setShowDetails(showRes.data);
                
                const seatsRes = await axiosInstance.get(`/seats/show/${showId}`);
                setSeats(seatsRes.data);
            } catch (err) {
                console.error("Error fetching seats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showId]);

    const toggleSeat = (seat) => {
        if (seat.status === 'BOOKED') return;
        
        if (selectedSeats.includes(seat.seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat.seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seat.seatNumber]);
        }
    };

    const handleBook = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to book tickets");
            navigate('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat");
            return;
        }

        // Navigate to payment/confirmation with booking details
        const totalAmount = selectedSeats.length * showDetails.price;
        navigate('/booking-confirmation', { 
            state: { 
                showId: showDetails.id, 
                seatNumbers: selectedSeats, 
                totalAmount: totalAmount,
                movieTitle: showDetails.movie.title
            } 
        });
    };

    if (loading) return <div className="text-center mt-10">Loading seats...</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-2">Select Seats</h2>
            {showDetails && (
                <p className="text-gray-600 mb-8">{showDetails.movie.title} • ₹{showDetails.price} per seat</p>
            )}

            <div className="mb-8 p-4 bg-gray-200 text-center rounded text-gray-500 tracking-widest border-b-4 border-gray-400">
                SCREEN THIS WAY
            </div>

            <div className="grid grid-cols-5 gap-4 justify-center mb-8">
                {seats.map(seat => {
                    const isBooked = seat.status === 'BOOKED';
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    
                    let seatClass = "p-3 rounded text-center cursor-pointer font-bold transition-colors ";
                    if (isBooked) {
                        seatClass += "bg-gray-400 text-gray-100 cursor-not-allowed";
                    } else if (isSelected) {
                        seatClass += "bg-green-500 text-white shadow-lg transform scale-105";
                    } else {
                        seatClass += "bg-white border-2 border-gray-300 hover:border-green-400 text-gray-700";
                    }

                    return (
                        <div 
                            key={seat.id} 
                            className={seatClass}
                            onClick={() => toggleSeat(seat)}
                        >
                            {seat.seatNumber}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
                <div>
                    <p className="text-lg">Selected Seats: <span className="font-bold">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span></p>
                    {showDetails && (
                        <p className="text-2xl font-bold text-gray-800">Total: ₹{selectedSeats.length * showDetails.price}</p>
                    )}
                </div>
                <button 
                    onClick={handleBook}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded shadow-lg transition-colors"
                >
                    Proceed to Pay
                </button>
            </div>
        </div>
    );
}
