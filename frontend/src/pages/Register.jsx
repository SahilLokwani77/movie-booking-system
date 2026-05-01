import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/auth/register', { username, email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
            {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300">
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-red-600 hover:underline">Login</Link>
            </p>
        </div>
    );
}
