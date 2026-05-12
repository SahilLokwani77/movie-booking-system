import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/movies')
            .then(res => {
                setMovies(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-10">Loading movies...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Now Showing</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map(movie => (
                    <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        <img src={movie.posterUrl || "https://via.placeholder.com/300x450"} alt={movie.title} className="w-full h-80 object-cover" />
                        <div className="p-4">
                            <h2 className="text-xl font-bold text-gray-800 truncate">{movie.title}</h2>
                            <p className="text-gray-600 text-sm mt-1">{movie.language} • {movie.duration} mins</p>
                            <Link to={`/movie/${movie.id}`} className="mt-4 block text-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">
                                Book Tickets
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
