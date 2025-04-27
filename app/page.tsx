'use client';

import { Playfair_Display } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import EventInquiryForm from './components/EventInquiryForm';
import { useState } from 'react';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  const [showMenuModal, setShowMenuModal] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Link 
              href="/chefs"
              className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src="/assets/images/chefs-hero.jpg" 
                  alt="Meet Our Chefs" 
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Meet Our Chefs</h3>
                  <p className="text-white/90">Discover the talented culinary artists behind our exceptional dining experiences</p>
                </div>
              </div>
            </Link>

            <button 
              onClick={() => setShowMenuModal(true)}
              className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src="/assets/images/menus-hero.jpg" 
                  alt="Explore Our Menus" 
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Curated Menu Collections</h3>
                  <p className="text-white/90">Browse our thoughtfully crafted menus featuring local ingredients and global inspirations</p>
                </div>
              </div>
            </button>
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