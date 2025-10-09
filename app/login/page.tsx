"use client";
import Image from 'next/image';
import { useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/user/signin', {
                email,
                password,
            });
            if (response.status === 200) {
                router.push('/dashboard');
            } else {
                setError('Incorrect email or password');
            }
        } catch (err) {
            setError('Incorrect email or password');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center mb-8">
                        <Image src="/stats.png" alt="LiveTeamGames Logo" width={160} height={80} />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
                    {error && (
                        <div className="mb-4 text-red-600 text-center text-sm font-medium">{error}</div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-[#009FE3] py-2"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-[#009FE3] py-2 pr-16"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#009FE3] font-semibold px-2 py-1 focus:outline-none"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 mb-6">
                            <a href="#" className="text-sm text-gray-700 hover:underline">Forgot Password?</a>
                        </div>
                        <button type="submit" className="w-full bg-[#009FE3] text-white font-semibold py-2 rounded mt-2">Sign In</button>
                    </form>
                </div>
            </div>
            {/* Right: Branding */}
            <div className="flex-1 flex flex-col justify-center items-center bg-[#03132A] text-white">
                <h1 className="text-4xl font-bold mb-4">LiveTeamGames</h1>
                <div className="text-lg font-medium">FLEXIBLE, POWERFUL, FAST</div>
            </div>
        </div>
    );
}
