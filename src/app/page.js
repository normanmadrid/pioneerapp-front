'use client';

import { useState } from 'react';

export default function RestaurantSearch() {
  const [prompt, setPrompt] = useState('')
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('')


  const handleSearch = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/search-restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError('Failed to fetch restaurants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Find a Restaurant</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your request, e.g. 'cheap sushi near downtown LA'"
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">
        Search Restaurants
      </button>

      {loading && <p>Loading...</p>}

      <ul className="mt-4 space-y-2">
        {restaurants.map((r, idx) => (
          <li key={idx} className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{r.name}</h2>
            <p>{r.address}</p>
            <p><strong>Cuisine:</strong> {r.cuisine}</p>
            <p><strong>Rating:</strong> {r.rating ?? 'N/A'}</p>
            <p><strong>Price:</strong> {r.price ?? 'N/A'}</p>
            <p><strong>Hours:</strong> {JSON.stringify(r.hours, null, 2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
