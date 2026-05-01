import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const bookingData = location.state;

    if (!bookingData) {
        return <div className="text-center mt-10">Invalid access. <Link to="/" className="text-blue-500">Go Home</Link></div>;
    }

    const handlePayment = async (status) => {
        setIsProcessing(true);
        if (status === 'fail') {
            setBookingError('Payment failed. Please try again.');
            setIsProcessing(false);
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = {
                userId: user.id,
                showId: bookingData.showId,
                seatNumbers: bookingData.seatNumbers,
                totalAmount: bookingData.totalAmount
            };

            await axiosInstance.post('/bookings/book', payload);
            setBookingSuccess(true);
            setBookingError('');
        } catch (error) {
            console.error("Booking error:", error);
            setBookingError(error.response?.data || 'Failed to book tickets.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md text-center mt-10 border-t-8 border-green-500">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">Your tickets for <strong>{bookingData.movieTitle}</strong> have been successfully booked.</p>
                <div className="bg-gray-100 p-4 rounded mb-6 text-left">
                    <p><strong>Seats:</strong> {bookingData.seatNumbers.join(', ')}</p>
                    <p><strong>Total Amount Paid:</strong> ₹{bookingData.totalAmount}</p>
                </div>
                <Link to="/" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Payment Details</h2>
            
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{bookingData.movieTitle}</h3>
                <p className="text-gray-600">Seats: {bookingData.seatNumbers.join(', ')}</p>
                <p className="text-xl font-bold mt-4">Total Amount: ₹{bookingData.totalAmount}</p>
            </div>

            {bookingError && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{bookingError}</div>}

            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => handlePayment('success')}
                    disabled={isProcessing}
                    className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Simulate Payment Success'}
                </button>
                <button 
                    onClick={() => handlePayment('fail')}
                    disabled={isProcessing}
                    className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                    Simulate Payment Failure
                </button>
            </div>
        </div>
    );
}
