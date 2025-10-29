import React, { useMemo, useState, useEffect } from 'react';
import { Chip, TextField, MenuItem, Select, FormControl, InputLabel, Pagination, Box } from '@mui/material';
import { Search, LocationOn, Star } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [searchParams] = useSearchParams();

  // Global slideshow tick (every 5 seconds) to rotate card images without per-card intervals
  const [slideshowTick, setSlideshowTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlideshowTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const s = searchParams.get('sort') || '';
    const cat = searchParams.get('category') || '';

    if (q) setSearchTerm(q);
    if (s) setSortBy(s);
    if (cat) setSelectedCategory(cat);
    setCurrentPage(1);
  }, [searchParams]);

  // Data: 26 famous tourism destinations (unique images per destination)
  const allDestinations = [
    {
      id: 1,
      name: 'Swiss Alps',
      country: 'Switzerland',
      category: 'Mountain',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // alpine lake
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // snowy peaks
        'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80', // cogwheel/train
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', // valley
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80' // village
      ],
      description: 'Breathtaking mountains, lakes, and charming villages.',
      price: 120000,
      rating: 4.8,
      duration: '7 days',
      featured: true,
      highlights: ['Mountain hiking', 'Lake cruises', 'Chocolate tasting', 'Ski resorts'],
      bestTime: 'June to September',
      currency: 'CHF'
    },
    {
      id: 2,
      name: 'Bali Beaches',
      country: 'Indonesia',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1518544801976-3e7231347b02?auto=format&fit=crop&w=1200&q=80', // temple by sea
        'https://images.unsplash.com/photo-1508182311256-e3f7d50b9b64?auto=format&fit=crop&w=1200&q=80', // rice terraces
        'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?auto=format&fit=crop&w=1200&q=80', // beach sunset
        'https://images.unsplash.com/photo-1500530855697-0177331693ae?auto=format&fit=crop&w=1200&q=80', // cliffs
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80' // boat in turquoise water
      ],
      description: 'Pristine beaches, temples, and relaxing spa retreats.',
      price: 95000,
      rating: 4.9,
      duration: '10 days',
      featured: true,
      highlights: ['Beachfront resorts', 'Temple visits', 'Rice terraces', 'Spa treatments'],
      bestTime: 'April to October',
      currency: 'IDR'
    },
    {
      id: 3,
      name: 'Paris',
      country: 'France',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', // Eiffel Tower from Seine
        'https://images.unsplash.com/photo-1543352634-873f17a7a088?auto=format&fit=crop&w=1200&q=80', // Louvre Pyramid
        'https://images.unsplash.com/photo-1526481280698-8fcc13fd79d0?auto=format&fit=crop&w=1200&q=80', // Notre Dame / rooftops
        'https://images.unsplash.com/photo-1522098543979-ffc7f79d6831?auto=format&fit=crop&w=1200&q=80', // Montmartre street
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80' // Arc/Champs vibes
      ],
      description: 'The city of lights, art, and gastronomy.',
      price: 110000,
      rating: 4.7,
      duration: '5 days',
      featured: false,
      highlights: ['Eiffel Tower', 'Louvre', 'Seine cruise', 'Cafés'],
      bestTime: 'April to June, Sep to Nov',
      currency: 'EUR'
    },
    {
      id: 4,
      name: 'Santorini',
      country: 'Greece',
      category: 'Island',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80', // blue domes
        'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80', // cliffs
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', // beach coast
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // caldera view
        'https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=1200&q=80' // sunset alley
      ],
      description: 'Whitewashed cliffs and magical sunsets over the Aegean.',
      price: 105000,
      rating: 4.6,
      duration: '6 days',
      featured: false,
      highlights: ['Oia sunset', 'Caldera cruise', 'Local wines'],
      bestTime: 'May to October',
      currency: 'EUR'
    },
    {
      id: 5,
      name: 'Tokyo',
      country: 'Japan',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1518544882033-7e2ad3550d4e?auto=format&fit=crop&w=1200&q=80', // Shibuya
        'https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?auto=format&fit=crop&w=1200&q=80', // Asakusa vibe
        'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80', // Tokyo night
        'https://images.unsplash.com/photo-1505063342033-7e7f28a1e1b2?auto=format&fit=crop&w=1200&q=80', // alley neon
        'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=1200&q=80' // Skytree skyline
      ],
      description: 'Neon vibes, ancient temples, and world-class cuisine.',
      price: 130000,
      rating: 4.8,
      duration: '7 days',
      featured: false,
      highlights: ['Shibuya Crossing', 'Asakusa', 'Sushi tour'],
      bestTime: 'March to May, Oct to Nov',
      currency: 'JPY'
    },
    {
      id: 6,
      name: 'Goa',
      country: 'India',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1500530855697-0177331693ae?auto=format&fit=crop&w=1200&q=80', // coast
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // water
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', // rocks
        'https://images.unsplash.com/photo-1506089068820-83b3edc2f016?auto=format&fit=crop&w=1200&q=80', // palms
        'https://images.unsplash.com/photo-1533713690745-6f19a0c8f6e2?auto=format&fit=crop&w=1200&q=80' // beach shack
      ],
      description: 'Laid-back beaches and vibrant nightlife on the Konkan coast.',
      price: 35000,
      rating: 4.5,
      duration: '4 days',
      featured: false,
      highlights: ['Baga beach', 'Fort Aguada', 'Spice plantation'],
      bestTime: 'Nov to Feb',
      currency: 'INR'
    },
    {
      id: 7,
      name: 'Dubai',
      country: 'UAE',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80', // skyline
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // burj khalifa
        'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80', // desert safari
        'https://images.unsplash.com/photo-1583267749013-7e8a9a1bea93?auto=format&fit=crop&w=1200&q=80', // marina
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80' // city at dusk
      ],
      description: 'Skyscrapers, desert safaris, and luxury shopping.',
      price: 90000,
      rating: 4.4,
      duration: '4 days',
      featured: false,
      highlights: ['Burj Khalifa', 'Desert safari', 'Dubai Mall'],
      bestTime: 'Nov to Mar',
      currency: 'AED'
    },
    {
      id: 8,
      name: 'Kerala Backwaters',
      country: 'India',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1563714193017-0f4d7a8e12a0?auto=format&fit=crop&w=1200&q=80', // houseboat
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', // palm canals
        'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // tea hills
        'https://images.unsplash.com/photo-1526481280698-8fcc13fd79d0?auto=format&fit=crop&w=1200&q=80', // traditional
        'https://images.unsplash.com/photo-1568454537842-d933aa8f7bb3?auto=format&fit=crop&w=1200&q=80' // canoe
      ],
      description: 'Serene houseboat cruises and lush green landscapes.',
      price: 48000,
      rating: 4.6,
      duration: '5 days',
      featured: false,
      highlights: ['Alleppey houseboat', 'Munnar hills', 'Ayurveda'],
      bestTime: 'Sep to Mar',
      currency: 'INR'
    },
    {
      id: 9,
      name: 'Agra',
      country: 'India',
      category: 'Cultural',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal%2C_Agra%2C_India_edit3.jpg', // Taj classic
        'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80', // red fort vibes
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', // Yamuna side
        'https://images.unsplash.com/photo-1543164904-8b717b7cbf9b?auto=format&fit=crop&w=1200&q=80', // details marble
        'https://images.unsplash.com/photo-1585475964746-1dfeadfde94e?auto=format&fit=crop&w=1200&q=80' // Mehtab Bagh view
      ],
      description: 'Experience the architectural marvel of the Taj Mahal and rich Mughal heritage.',
      price: 45000,
      rating: 4.8,
      duration: '3 days',
      featured: true,
      highlights: ['Taj Mahal sunrise', 'Agra Fort', 'Local cuisine', 'Cultural performances'],
      bestTime: 'Oct to Mar',
      currency: 'INR'
    },

    // New
    {
      id: 10,
      name: 'New York City',
      country: 'USA',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1200&q=80', // Brooklyn Bridge
        'https://images.unsplash.com/photo-1462206092226-f46025ffe607?auto=format&fit=crop&w=1200&q=80', // NYC skyline
        'https://images.unsplash.com/photo-1445633814773-5f11d66609e5?auto=format&fit=crop&w=1200&q=80', // Times Square
        'https://images.unsplash.com/photo-1468436139062-9752d9094e9a?auto=format&fit=crop&w=1200&q=80', // Central Park
        'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80' // Statue of Liberty
      ],
      description: 'Iconic skyline, Broadway shows, museums, and Central Park.',
      price: 140000,
      rating: 4.7,
      duration: '6 days',
      featured: false,
      highlights: ['Times Square', 'Statue of Liberty'],
      bestTime: 'Apr to Jun, Sep to Nov',
      currency: 'USD'
    },
    {
      id: 11,
      name: 'London',
      country: 'United Kingdom',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80', // Big Ben
        'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80', // Tower Bridge
        'https://images.unsplash.com/photo-1464297162577-f5295c892194?auto=format&fit=crop&w=1200&q=80', // City skyline
        'https://images.unsplash.com/photo-1445251836269-d158eaa028a6?auto=format&fit=crop&w=1200&q=80', // Buckingham
        'https://images.unsplash.com/photo-1439120421136-bbbb0e6a9a7d?auto=format&fit=crop&w=1200&q=80' // London Eye/Thames
      ],
      description: 'Royal palaces, world-class museums, and vibrant neighborhoods.',
      price: 125000,
      rating: 4.6,
      duration: '5 days',
      featured: false,
      highlights: ['Tower Bridge', 'British Museum'],
      bestTime: 'May to Sep',
      currency: 'GBP'
    },
    {
      id: 12,
      name: 'Rome',
      country: 'Italy',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1526481280698-8fcc13fd79d0?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // Colosseum
        'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Roman streets
        'https://images.unsplash.com/photo-1473952204133-1e4d5d7e918b?auto=format&fit=crop&w=1200&q=80', // Trevi Fountain
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80', // Vatican area
        'https://images.unsplash.com/photo-1526488830780-8f00c2b1f8a4?auto=format&fit=crop&w=1200&q=80' // Forum
      ],
      description: 'Ancient ruins, Renaissance art, and irresistible cuisine.',
      price: 115000,
      rating: 4.7,
      duration: '5 days',
      featured: false,
      highlights: ['Colosseum', 'Vatican Museums'],
      bestTime: 'Apr to Jun, Sep to Oct',
      currency: 'EUR'
    },
    {
      id: 13,
      name: 'Barcelona',
      country: 'Spain',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1473952204133-1e4d5d7e918b?auto=format&fit=crop&w=1200&q=80', // Sagrada Familia interior
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Park Guell
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Gothic Quarter
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // Casa Batlló vibe
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80' // Beach
      ],
      description: 'Gaudí architecture, beaches, and a buzzing food scene.',
      price: 110000,
      rating: 4.6,
      duration: '5 days',
      featured: false,
      highlights: ['Sagrada Família', 'Park Güell'],
      bestTime: 'May to Jun, Sep',
      currency: 'EUR'
    },
    {
      id: 14,
      name: 'Amsterdam',
      country: 'Netherlands',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', // canals
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80', // canal houses
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // bikes bridge
        'https://images.unsplash.com/photo-1470214203634-3f63122b0c50?auto=format&fit=crop&w=1200&q=80', // museumplein
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80' // night canal
      ],
      description: 'Canals, museums, bikes, and charming streets.',
      price: 108000,
      rating: 4.5,
      duration: '4 days',
      featured: false,
      highlights: ['Van Gogh Museum', 'Canal cruise'],
      bestTime: 'Apr to Sep',
      currency: 'EUR'
    },
    {
      id: 15,
      name: 'Prague',
      country: 'Czechia',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80', // charles bridge
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80', // old town
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', // vltava
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', // rooftops
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80' // castle view
      ],
      description: 'Fairytale old town, castle, and medieval charm.',
      price: 90000,
      rating: 4.6,
      duration: '4 days',
      featured: false,
      highlights: ['Charles Bridge', 'Prague Castle'],
      bestTime: 'Apr to Jun, Sep',
      currency: 'CZK'
    },
    {
      id: 16,
      name: 'Istanbul',
      country: 'Turkey',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80', // Blue Mosque area
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80', // Bosphorus
        'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80', // markets
        'https://images.unsplash.com/photo-1473952204133-1e4d5d7e918b?auto=format&fit=crop&w=1200&q=80', // Hagia Sophia interior vibe
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80' // rooftops
      ],
      description: 'Where East meets West: mosques, bazaars, and Bosphorus views.',
      price: 98000,
      rating: 4.7,
      duration: '5 days',
      featured: false,
      highlights: ['Hagia Sophia', 'Grand Bazaar'],
      bestTime: 'Apr to Jun, Sep to Oct',
      currency: 'TRY'
    },
    {
      id: 17,
      name: 'Cairo',
      country: 'Egypt',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Pyramids desert
        'https://images.unsplash.com/photo-1533681701819-44b0eaf2f2e3?auto=format&fit=crop&w=1200&q=80', // Sphinx
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', // Cairo skyline
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // museum vibe
        'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80' // Nile evening
      ],
      description: 'Pyramids of Giza, Sphinx, and the Nile’s ancient heritage.',
      price: 85000,
      rating: 4.5,
      duration: '4 days',
      featured: false,
      highlights: ['Pyramids', 'Egyptian Museum'],
      bestTime: 'Oct to Apr',
      currency: 'EGP'
    },
    {
      id: 18,
      name: 'Cape Town',
      country: 'South Africa',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1582661705204-7b3b3a9bf5dc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1558980664-10e7170b5a16?auto=format&fit=crop&w=1200&q=80', // Table Mountain
        'https://images.unsplash.com/photo-1526481280698-8fcc13fd79d0?auto=format&fit=crop&w=1200&q=80', // Camps Bay
        'https://images.unsplash.com/photo-1544989164-31dc3c645987?auto=format&fit=crop&w=1200&q=80', // V&A Waterfront
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // penguins boulders
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' // Chapman’s Peak
      ],
      description: 'Dramatic coastlines, Table Mountain, and vineyards.',
      price: 105000,
      rating: 4.7,
      duration: '6 days',
      featured: false,
      highlights: ['Table Mountain', 'Cape Point'],
      bestTime: 'Oct to Mar',
      currency: 'ZAR'
    },
    {
      id: 19,
      name: 'Maldives',
      country: 'Maldives',
      category: 'Island',
      image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80', // water villas
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', // reef edge
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // lagoon
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', // hammock
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80' // beach sandbar
      ],
      description: 'Turquoise lagoons, coral reefs, and overwater villas.',
      price: 160000,
      rating: 4.9,
      duration: '5 days',
      featured: true,
      highlights: ['Snorkeling', 'Private villas'],
      bestTime: 'Nov to Apr',
      currency: 'MVR'
    },
    {
      id: 20,
      name: 'Phuket',
      country: 'Thailand',
      category: 'Beach',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // longtail boats
        'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // karst
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // turquoise bay
        'https://images.unsplash.com/photo-1526481280698-8fcc13fd79d0?auto=format&fit=crop&w=1200&q=80', // old town street
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80' // beach sunset
      ],
      description: 'Andaman Sea beaches, island-hopping, and Thai cuisine.',
      price: 78000,
      rating: 4.6,
      duration: '5 days',
      featured: false,
      highlights: ['Phi Phi Islands', 'Old Town'],
      bestTime: 'Nov to Apr',
      currency: 'THB'
    },
    {
      id: 21,
      name: 'Bangkok',
      country: 'Thailand',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // skyline
        'https://images.unsplash.com/photo-1491884662610-dfcd28f30cf5?auto=format&fit=crop&w=1200&q=80', // temple
        'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // market
        'https://images.unsplash.com/photo-1473952204133-1e4d5d7e918b?auto=format&fit=crop&w=1200&q=80', // grand palace vibe
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80' // streets
      ],
      description: 'Vibrant street life, dazzling temples, and markets.',
      price: 82000,
      rating: 4.5,
      duration: '4 days',
      featured: false,
      highlights: ['Grand Palace', 'Floating market'],
      bestTime: 'Nov to Feb',
      currency: 'THB'
    },
    {
      id: 22,
      name: 'Singapore',
      country: 'Singapore',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // gardens by the bay
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80', // skyline
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', // marina bay
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // helix bridge
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80' // streets
      ],
      description: 'Futuristic skyline, gardens, and incredible food.',
      price: 125000,
      rating: 4.7,
      duration: '4 days',
      featured: false,
      highlights: ['Marina Bay', 'Gardens by the Bay'],
      bestTime: 'Feb to Apr',
      currency: 'SGD'
    },
    {
      id: 23,
      name: 'Sydney',
      country: 'Australia',
      category: 'City',
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad05?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1506976785307-8732e854ad05?auto=format&fit=crop&w=1200&q=80', // opera house
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // harbour
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80', // skyline
        'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=1200&q=80', // coastal walk
        'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80' // bondi
      ],
      description: 'Harbour city with beaches, Opera House, and coastal walks.',
      price: 150000,
      rating: 4.7,
      duration: '6 days',
      featured: false,
      highlights: ['Opera House', 'Bondi to Coogee'],
      bestTime: 'Sep to Nov, Mar to May',
      currency: 'AUD'
    },
    {
      id: 24,
      name: 'Great Barrier Reef',
      country: 'Australia',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', // corals
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // surface water
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', // reef lagoon
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80', // boat glass bottom
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80' // islands
      ],
      description: 'World’s largest coral reef with vibrant marine life.',
      price: 145000,
      rating: 4.8,
      duration: '5 days',
      featured: true,
      highlights: ['Snorkeling', 'Glass-bottom boat'],
      bestTime: 'Jun to Oct',
      currency: 'AUD'
    },
    {
      id: 25,
      name: 'Machu Picchu',
      country: 'Peru',
      category: 'Mountain',
      image: 'https://images.unsplash.com/photo-1509112756314-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1509112756314-d120267933ba?auto=format&fit=crop&w=1200&q=80', // classic
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80', // terraces
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', // andes trails
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', // valley
        'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?auto=format&fit=crop&w=1200&q=80' // intipunku vibe
      ],
      description: 'Incan citadel in the Andes with stunning vistas.',
      price: 135000,
      rating: 4.9,
      duration: '5 days',
      featured: true,
      highlights: ['Sun Gate', 'Sacred Valley'],
      bestTime: 'Apr to Oct',
      currency: 'PEN'
    },
    {
      id: 26,
      name: 'Grand Canyon',
      country: 'USA',
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // classic rim
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80', // overlook
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80', // aerial
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', // river bend
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80' // sunrise rim
      ],
      description: 'Majestic canyon landscapes carved by the Colorado River.',
      price: 98000,
      rating: 4.8,
      duration: '3 days',
      featured: false,
      highlights: ['South Rim', 'Helicopter tour'],
      bestTime: 'Mar to May, Sep to Nov',
      currency: 'USD'
    }
  ];

  const categories = ['All', 'Mountain', 'Beach', 'City', 'Island', 'Nature', 'Cultural'];

  // Derived list
  const filtered = useMemo(() => {
    let list = allDestinations;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory && selectedCategory !== 'All') {
      list = list.filter(d => d.category === selectedCategory);
    }
    if (sortBy === 'priceAsc') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'priceDesc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'ratingDesc') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [allDestinations, searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetToFirstPage = (setter) => (v) => {
    setter(v);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">All Destinations</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Box className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border flex-1">
            <Search className="text-text-muted" />
            <TextField
              placeholder="Search by name, country, or description"
              variant="standard"
              fullWidth
              value={searchTerm}
              onChange={(e) => resetToFirstPage(setSearchTerm)(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={selectedCategory || 'All'}
              onChange={(e) => resetToFirstPage(setSelectedCategory)(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="sortby-label">Sort by</InputLabel>
            <Select
              labelId="sortby-label"
              label="Sort by"
              value={sortBy}
              onChange={(e) => resetToFirstPage(setSortBy)(e.target.value)}
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
              <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Featured chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allDestinations.filter(d => d.featured).map((d) => (
          <Chip key={d.id} label={`Featured: ${d.name}`} color="primary" variant="outlined" />
        ))}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="text-center text-text-muted py-20">No destinations match your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((d) => (
            <div key={d.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={(() => {
                    const arr = (d.images && d.images.length) ? Array.from(new Set(d.images)) : null;
                    return arr && arr.length ? arr[slideshowTick % arr.length] : d.image;
                  })()}
                  alt={d.name}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const arr = (d.images && d.images.length) ? Array.from(new Set(d.images)) : [];
                    const next = arr.length > 1 ? arr[(slideshowTick + 1) % arr.length] : null;
                    const coverOk = d.image && (!arr.length || !arr.includes(d.image));
                    e.currentTarget.src = next || (coverOk ? d.image : 'https://images.unsplash.com/photo-1503342217505-b0a15cf70489?auto=format&fit=crop&w=1200&q=80');
                  }}
                />
                {d.featured && (
                  <div className="absolute top-3 right-3 bg-brand text-white px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{d.name}</h3>
                    <div className="flex items-center text-sm text-text-muted">
                      <LocationOn fontSize="inherit" className="mr-1" />
                      {d.country} • {d.duration}
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">₹{d.price.toLocaleString()}</div>
                </div>

                <p className="text-text-muted mt-2 line-clamp-2">{d.description}</p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-amber-500">
                    <Star fontSize="small" />
                    <span className="ml-1 font-medium">{d.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex gap-2">
                    {d.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="bg-brand/10 text-brand text-xs px-2 py-1 rounded">{h}</span>
                    ))}
                  </div>
                </div>

                <button className="mt-4 w-full bg-brand text-white py-2 rounded-lg hover:bg-brand-dark transition-colors">
                  View Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <Pagination
          page={currentPage}
          count={totalPages}
          onChange={(_, p) => setCurrentPage(p)}
          color="primary"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default Destinations;