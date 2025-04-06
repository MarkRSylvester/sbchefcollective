'use client';

import EventInquiryForm from './components/EventInquiryForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-gray-900 mb-4">
            Plan Your Event
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about your vision, and we'll connect you with the perfect chef to create an unforgettable culinary experience.
          </p>
        </div>
        <EventInquiryForm />
      </div>
    </div>
  );
}