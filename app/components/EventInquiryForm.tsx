'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Form field types
type EventInquiryFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  eventAddress: string;
  budget: string;
  dietaryNeeds: string;
  cuisinePreference: string[];
  vibeWords: string[];
  mustHaves: string;
  optionalServices: string[];
  notes: string;
};

// Form options
const EVENT_TYPES = [
  'Dinner Party',
  'Boutique Wedding',
  'Retreat',
  'Holiday Gathering',
  'Corporate Event',
  'Other'
];

const BUDGET_RANGES = [
  'Under $75 per person',
  '$75-100 per person',
  '$100-150 per person',
  '$150-200 per person',
  '$200-300 per person',
  '$300+ per person'
];

const CUISINE_OPTIONS = [
  'California / Farm-to-Table',
  'Mediterranean',
  'Mexican',
  'Paella',
  'Pasta & Salads',
  'Sushi',
  'Seafood',
  'Greek',
  'Asian-Inspired',
  'Pizza',
  'BBQ',
  'Brunch',
  'Holiday',
  'Cocktail Party',
  'Vegetarian / Plant-Based',
  'No Preference'
];

const VIBE_OPTIONS = [
  'Elegant',
  'Casual',
  'Romantic',
  'Family-Friendly',
  'Cozy & Intimate',
  'Luxurious',
  'Seasonal / Farm-Fresh',
  'Coastal / Beachy',
  'Creative & Bold',
  'Wellness-Focused',
  'Rustic',
  'Festive & Fun',
  'Sophisticated',
  'Minimalist',
  'No Preference'
];

const OPTIONAL_SERVICES = [
  'Wine Pairing',
  'Cocktail Service',
  'Table Decor',
  'Live Cooking Demo',
  'Kitchen Clean-Up',
  'Leftovers Packaging'
];

export default function EventInquiryForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<EventInquiryFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: EventInquiryFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement form submission to Airtable
      console.log('Form data:', data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register('firstName', { required: 'First name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register('lastName', { required: 'Last name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                  message: 'Invalid phone number'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <select
            id="eventType"
            {...register('eventType', { required: 'Event type is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select an event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.eventType && (
            <p className="mt-1 text-sm text-red-600">{errors.eventType.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              {...register('eventDate', { required: 'Event date is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.eventDate && (
              <p className="mt-1 text-sm text-red-600">{errors.eventDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
              Event Time
            </label>
            <input
              type="time"
              id="eventTime"
              {...register('eventTime', { required: 'Event time is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.eventTime && (
              <p className="mt-1 text-sm text-red-600">{errors.eventTime.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
              Number of Guests
            </label>
            <input
              type="number"
              id="guestCount"
              min="1"
              {...register('guestCount', { 
                required: 'Guest count is required',
                min: {
                  value: 1,
                  message: 'Must have at least 1 guest'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.guestCount && (
              <p className="mt-1 text-sm text-red-600">{errors.guestCount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget Range
            </label>
            <select
              id="budget"
              {...register('budget', { required: 'Budget range is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a budget range</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="eventAddress" className="block text-sm font-medium text-gray-700">
            Event Address
          </label>
          <textarea
            id="eventAddress"
            {...register('eventAddress', { required: 'Event address is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.eventAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.eventAddress.message}</p>
          )}
        </div>

        {/* Preferences */}
        <div>
          <label htmlFor="cuisinePreference" className="block text-sm font-medium text-gray-700">
            Cuisine Preferences
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Have something specific in mind? Tell us about favorite dishes, regional styles (like Baja, Thai, or Tuscan), or anything you'd love to include or avoid.
          </p>
          <select
            id="cuisinePreference"
            multiple
            {...register('cuisinePreference')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {CUISINE_OPTIONS.map((cuisine) => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vibeWords" className="block text-sm font-medium text-gray-700">
            Event Vibe
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Tell us more about the atmosphere or feeling you want to create—whether it's candlelit and romantic or barefoot on the beach with friends.
          </p>
          <select
            id="vibeWords"
            multiple
            {...register('vibeWords')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {VIBE_OPTIONS.map((vibe) => (
              <option key={vibe} value={vibe}>{vibe}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dietaryNeeds" className="block text-sm font-medium text-gray-700">
            Dietary Needs
          </label>
          <textarea
            id="dietaryNeeds"
            {...register('dietaryNeeds')}
            rows={3}
            placeholder="Please tell us about any allergies, ingredient restrictions, or preferences."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="mustHaves" className="block text-sm font-medium text-gray-700">
            Must-Have Ingredients
          </label>
          <textarea
            id="mustHaves"
            {...register('mustHaves')}
            rows={2}
            placeholder="e.g., lobster, chocolate, specific ingredients you'd like included"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Optional Services
          </label>
          <div className="mt-2 space-y-2">
            {OPTIONAL_SERVICES.map((service) => (
              <div key={service} className="flex items-center">
                <input
                  type="checkbox"
                  value={service}
                  {...register('optionalServices')}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">{service}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            placeholder="Any other details or special requests you'd like to share?"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </div>
    </form>
  );
} 