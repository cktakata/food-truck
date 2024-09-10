import React, { useState } from 'react';
import MapPane from './components/MapPane';
import FormPane from './components/FormPane';
import axios from 'axios';

const App = () => {
  const [markers, setMarkers] = useState([]);

  const handleSearch = async (searchParams) => {
    try {
      const response = await axios.get(
        'http://localhost:3000/csv/nearby-food-trucks',
        {
          params: searchParams,
        }
      );

      const data = response.data.data;
      const newMarkers = [
        {
          lat: parseFloat(searchParams.latitude),
          lng: parseFloat(searchParams.longitude),
          label: 'Home',
          icon: '/assets/Home.svg',
          scaledSize: new window.google.maps.Size(24, 24),
        },
        ...data.map((item) => ({
          lat: parseFloat(item.Latitude),
          lng: parseFloat(item.Longitude),
          label: item.Applicant,
          icon:
            item.FacilityType === 'Truck'
              ? '/assets/Food.svg'
              : '/assets/Pushcart.svg',
          scaledSize: new window.google.maps.Size(24, 24),
        })),
      ];

      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error fetching nearby food trucks:', error);
    }
  };

  return (
    <div className='flex h-screen'>
      <div className='w-2/3'>
        <MapPane markers={markers} />
      </div>
      <div className='w-1/3 border-l border-gray-200'>
        <FormPane onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default App;
