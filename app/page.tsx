'use client';

import { Playfair_Display } from 'next/font/google';
import EventInquiryForm from './components/EventInquiryForm';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/S021.jpg)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center text-white">
          <h1 className={`${playfair.className} text-5xl mb-4`}>
            Welcome to Santa Barbara Chef Collective
          </h1>
          <h2 className={`${playfair.className} text-2xl mb-6 text-gray-200`}>
            Where culinary artistry meets personalized hospitality.
          </h2>
          <p className="max-w-2xl text-lg mb-8 text-gray-100">
            We believe every meal is an experience—whether it's an intimate dinner, an unforgettable event, 
            or a weekly infusion of fresh, locally-sourced meals delivered right to your door. At SBCC, 
            we connect you with the finest local chefs who craft customized menus to match your unique tastes, 
            dietary needs, and personal style. Whether you're planning a special celebration or simply want to 
            elevate your everyday meals, we're here to turn your culinary dreams into reality. Let's create 
            something unforgettable together.
          </p>
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all">
              Explore Our Chefs
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all">
              Browse Curated Menus
            </button>
            <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all">
              Learn How It Works
            </button>
          </div>
        </div>
      </section>
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