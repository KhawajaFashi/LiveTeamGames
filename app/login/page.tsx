import Image from 'next/image';
export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col items-center mb-8">
                        <Image src="/clutivity_logo.png" alt="Cluetivity Logo" width={160} height={80} />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" required className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-[#009FE3] py-2" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-[#009FE3] py-2" />
                        </div>
                        <div className="flex items-center justify-between mt-2 mb-6">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="accent-pink-500" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-gray-700 hover:underline">Forgot Password?</a>
                        </div>
                        <button type="submit" className="w-full bg-[#009FE3] text-white font-semibold py-2 rounded mt-2">Sign In</button>
                    </form>
                </div>
            </div>
            {/* Right: Branding */}
            <div className="flex-1 flex flex-col justify-center items-center bg-[#03132A] text-white">
                <h1 className="text-4xl font-bold mb-4">CLUETIVITY</h1>
                <div className="text-lg font-medium">FLEXIBLE, POWERFUL, FAST</div>
            </div>
        </div>
    );
}
