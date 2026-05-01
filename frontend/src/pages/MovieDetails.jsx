import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movieRes = await axiosInstance.get(`/movies/${id}`);
                setMovie(movieRes.data);
                
                const showsRes = await axiosInstance.get(`/shows/movie/${id}`);
                setShows(showsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading movie details...</div>;
    if (!movie) return <div className="text-center mt-10">Movie not found.</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
            <img src={movie.posterUrl || "https://via.placeholder.com/300x450"} alt={movie.title} className="w-full md:w-1/3 object-cover" />
            <div className="p-8 md:w-2/3">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{movie.title}</h1>
                <p className="text-gray-600 mb-6">{movie.language} • {movie.duration} mins</p>
                <p className="text-gray-700 mb-8">{movie.description}</p>
                
                <h2 className="text-2xl font-semibold mb-4">Available Shows</h2>
                {shows.length === 0 ? (
                    <p className="text-gray-500">No shows available for this movie.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {shows.map(show => {
                            const showTime = new Date(show.showTime);
                            return (
                                <Link 
                                    key={show.id} 
                                    to={`/show/${show.id}/seats`}
                                    className="border border-gray-300 rounded p-4 hover:border-red-500 hover:shadow-md transition-all cursor-pointer block"
                                >
                                    <div className="text-lg font-bold text-gray-800">
                                        {showTime.toLocaleDateString()} at {showTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className="text-gray-600 text-sm mt-1">₹{show.price} • {show.availableSeats} seats left</div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
