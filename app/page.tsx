'use client';

import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import EventInquiryForm from './components/EventInquiryForm';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/images/S021.jpg)' }}
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
          <div className="flex flex-col md:flex-row gap-4 md:space-x-4">
            <Link 
              href="/chefs"
              className="btn btn-primary text-center"
            >
              Explore Our Chefs
            </Link>
            <Link 
              href="/menus"
              className="btn btn-outline text-center"
            >
              Browse Curated Menus
            </Link>
            <Link 
              href="/how-it-works"
              className="btn btn-outline text-center"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Event Planning Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className={`${playfair.className} text-4xl md:text-5xl text-gray-900 mb-4`}>
            Plan Your Event
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about your vision, and we'll connect you with the perfect chef to create an unforgettable culinary experience.
          </p>
        </div>
        <EventInquiryForm />
      </div>
    </div>
  );
}