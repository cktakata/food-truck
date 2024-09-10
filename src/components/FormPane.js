import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const FormPane = ({ onSearch }) => {
  const [latitude, setLatitude] = useState(37.762024747895126);
  const [longitude, setLongitude] = useState(-122.43969849090182);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState('Truck');
  const [foodItems, setFoodItems] = useState([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState('');
  const [searchFoodItem, setSearchFoodItem] = useState('');

  // Fetch facility types once on component mount
  useEffect(() => {
    const fetchFacilityTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/csv/facility-types');
        console.log('Facility types fetched:', response.data.facilityTypes);
        setFacilityTypes(response.data.facilityTypes || []);
      } catch (error) {
        console.error('Error fetching facility types:', error);
      }
    };

    fetchFacilityTypes();
  }, []);

  // Debounced function to fetch food items
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFoodItems = useCallback(
    debounce(async (query) => {
      try {
        console.log('Fetching food items with query:', query);
        const response = await axios.get(`http://localhost:8000/csv/filter-food-items?food=${query}`);
        console.log('Food items response:', response.data);

        // Extract food items directly from the response
        const newFoodItems = response.data.data.flatMap((item) => item.FoodItems);

        console.log('Food items:', newFoodItems);
        setFoodItems([...new Set(newFoodItems)]); // Remove duplicates
      } catch (error) {
        console.error('Error fetching food items:', error);
        setFoodItems([]); // Clear food items on error
      }
    }, 300), // 300ms debounce delay
    []
  );

  // Trigger fetchFoodItems when searchFoodItem changes
  useEffect(() => {
    if (searchFoodItem) {
      fetchFoodItems(searchFoodItem);
    } else {
      // Clear food items immediately when searchFoodItem is empty
      setFoodItems([]);
    }
  }, [searchFoodItem, fetchFoodItems]);

  // Handle search button click
  const handleSearch = () => {
    console.log('Search', {
      latitude,
      longitude,
      facilityType: selectedFacilityType,
      foodItems: selectedFoodItem,
      limit: 5,
    });
    onSearch({
      latitude,
      longitude,
      facilityType: selectedFacilityType,
      foodItems: selectedFoodItem,
      limit: 5,
    });
  };

  // Handle when food item selection changes
  const handleFoodItemChange = (e) => {
    setSelectedFoodItem(e.target.value);
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Latitude
        </label>
        <input
          type='text'
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Longitude
        </label>
        <input
          type='text'
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Facility Type
        </label>
        <select
          value={selectedFacilityType}
          onChange={(e) => setSelectedFacilityType(e.target.value)}
          className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
        >
          {facilityTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Food Items
        </label>
        <input
          type='text'
          value={searchFoodItem}
          onChange={(e) => setSearchFoodItem(e.target.value)}
          className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
        />
        <select
          value={selectedFoodItem}
          onChange={handleFoodItemChange}
          className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
        >
          {foodItems.length > 0 ? (
            foodItems.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))
          ) : (
            <option value=''>No food items available</option>
          )}
        </select>
      </div>
      <button
        type='button'
        onClick={handleSearch}
        className='px-4 py-2 bg-blue-500 text-white rounded-md'
      >
        Search
      </button>
    </div>
  );
};

export default FormPane;
