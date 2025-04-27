import { Playfair_Display } from 'next/font/google';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function ChefsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className={`${playfair.className} text-5xl md:text-6xl text-gray-900 mb-4`}>
            Meet Our Chefs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our curated collective of talented chefs brings diverse culinary expertise and passion to your table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Chef Isabella Martinez */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img 
                src="/assets/images/chefs/chef-isabella.jpg" 
                alt="Chef Isabella Martinez"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h2 className={`${playfair.className} text-2xl text-gray-900 mb-2`}>
                Chef Isabella Martinez
              </h2>
              <p className="text-sm text-primary-600 mb-3">Mediterranean, Farm-to-Table</p>
              <p className="text-gray-600 mb-4">
                With over 15 years of culinary experience, Chef Isabella brings Mediterranean flavors to life using locally-sourced ingredients.
              </p>
              <button 
                onClick={() => window.location.href = '/?inquiry=event'} 
                className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition duration-200"
              >
                Book Chef Isabella
              </button>
            </div>
          </div>

          {/* Chef James Chen */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img 
                src="/assets/images/chefs/chef-james.jpg" 
                alt="Chef James Chen"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h2 className={`${playfair.className} text-2xl text-gray-900 mb-2`}>
                Chef James Chen
              </h2>
              <p className="text-sm text-primary-600 mb-3">Pan-Asian, Modern Fusion</p>
              <p className="text-gray-600 mb-4">
                A master of Asian fusion cuisine, Chef James combines traditional techniques with contemporary California flair.
              </p>
              <button 
                onClick={() => window.location.href = '/?inquiry=event'} 
                className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition duration-200"
              >
                Book Chef James
              </button>
            </div>
          </div>

          {/* Chef Sarah Williams */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img 
                src="/assets/images/chefs/chef-sarah.jpg" 
                alt="Chef Sarah Williams"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h2 className={`${playfair.className} text-2xl text-gray-900 mb-2`}>
                Chef Sarah Williams
              </h2>
              <p className="text-sm text-primary-600 mb-3">French, New American</p>
              <p className="text-gray-600 mb-4">
                Classically trained in French cuisine, Chef Sarah creates elegant dishes that celebrate Santa Barbara's finest ingredients.
              </p>
              <button 
                onClick={() => window.location.href = '/?inquiry=event'} 
                className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition duration-200"
              >
                Book Chef Sarah
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/?inquiry=event"
            className="inline-block bg-primary-600 text-white py-3 px-8 rounded-lg hover:bg-primary-700 transition duration-200"
          >
            Plan Your Event
          </Link>
        </div>
      </div>
    </div>
  );
} 