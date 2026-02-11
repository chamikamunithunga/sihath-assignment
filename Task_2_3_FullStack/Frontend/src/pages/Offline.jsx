import React from 'react';
import { Link } from 'react-router-dom';

const Offline = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <div className="text-6xl mb-4">📶</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">You are Offline</h1>
                <p className="text-gray-600 mb-6">
                    It seems you've lost your internet connection. Don't worry, you can still view pages you've visited previously.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-200"
                    >
                        Try Again
                    </button>
                    <Link
                        to="/"
                        className="block w-full border border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-4 rounded transition duration-200"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Offline;
