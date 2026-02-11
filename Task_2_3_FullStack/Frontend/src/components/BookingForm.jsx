import React from 'react';

export default function BookingForm({ onSubmit }) {
    return (
        <form className="space-y-4 max-w-md bg-white p-6 rounded-lg shadow-sm border" onSubmit={onSubmit} aria-label="Booking form">
            <fieldset>
                <legend className="text-lg font-bold mb-4">Book Your Spot</legend>
                <div>
                    <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        id="booking-name"
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-urban-green-500 focus:border-urban-green-500"
                        placeholder="Your Name"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        id="booking-email"
                        type="email"
                        className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-urban-green-500 focus:border-urban-green-500"
                        placeholder="you@example.com"
                        required
                        aria-required="true"
                    />
                </div>
                <button type="submit" className="w-full bg-urban-green-600 text-white py-2 px-4 rounded hover:bg-urban-green-700 transition-colors">
                    Confirm Booking
                </button>
            </fieldset>
        </form>
    );
}
