const STORAGE_KEY = 'tm_packages';

const defaultPackages = [
  {
    id: '1',
    name: '7-Day Swiss Alps Adventure',
    destination: 'Swiss Alps, Switzerland',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Experience the breathtaking beauty of the Swiss Alps with our guided 7-day adventure tour through majestic mountains, crystal-clear lakes, and charming villages.',
    price: 120000,
    originalPrice: 150000,
    duration: '7 days',
    durationDays: 7,
    rating: 4.8,
    featured: true,
    highlights: ['Mountain hiking', 'Lake cruises', 'Chocolate tasting', 'Ski resorts'],
    inclusions: ['7 nights accommodation', 'Daily breakfast', 'Airport transfers', 'Professional guide'],
    difficulty: 'Moderate',
    active: true
  },
  {
    id: '2',
    name: '10-Day Bali Beach Retreat',
    destination: 'Bali, Indonesia',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518544801976-3e7231347b02?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508182311256-e3f7d50b9b64?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Relax on the pristine beaches of Bali with our all-inclusive 10-day retreat package featuring luxury accommodations, cultural experiences, and water activities.',
    price: 95000,
    originalPrice: 120000,
    duration: '10 days',
    durationDays: 10,
    rating: 4.9,
    featured: true,
    highlights: ['Beachfront resorts', 'Temple visits', 'Rice terraces', 'Spa treatments'],
    inclusions: ['10 nights accommodation', 'All meals', 'Airport transfers', 'Spa treatments'],
    difficulty: 'Easy',
    active: true
  },
  {
    id: '3',
    name: '5-Day Paris Cultural Tour',
    destination: 'Paris, France',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Explore the romantic city of Paris with our guided 5-day cultural tour including the Eiffel Tower, Louvre Museum, and charming Montmartre district.',
    price: 110000,
    originalPrice: 130000,
    duration: '5 days',
    durationDays: 5,
    rating: 4.2,
    featured: false,
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River cruise'],
    inclusions: ['5 nights accommodation', 'Daily breakfast', 'Airport transfers', 'City tour'],
    difficulty: 'Easy',
    active: true
  },
  {
    id: '4',
    name: '8-Day African Safari',
    destination: 'Kenya & Tanzania',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Witness the majestic wildlife of Africa on this unforgettable 8-day safari experience through the Maasai Mara National Reserve and Amboseli National Park.',
    price: 180000,
    originalPrice: 220000,
    duration: '8 days',
    durationDays: 8,
    rating: 4.7,
    featured: true,
    highlights: ['Wildlife viewing', 'Hot air balloon ride', 'Cultural visits', 'Luxury lodges'],
    inclusions: ['8 nights accommodation', 'All meals', 'Park fees', 'Professional guide'],
    difficulty: 'Challenging',
    active: true
  },
  {
    id: '5',
    name: '6-Day Tokyo Exploration',
    destination: 'Tokyo, Japan',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Immerse yourself in the vibrant culture and technology of Tokyo with our 6-day tour including visits to traditional temples, modern districts, and world-class restaurants.',
    price: 135000,
    originalPrice: 160000,
    duration: '6 days',
    durationDays: 6,
    rating: 4.5,
    featured: false,
    highlights: ['Shibuya Crossing', 'Traditional temples', 'Sushi making class', 'Bullet train ride'],
    inclusions: ['6 nights accommodation', 'Daily breakfast', 'Airport transfers', 'City tour'],
    difficulty: 'Easy',
    active: true
  },
  {
    id: '6',
    name: '9-Day Greek Islands Cruise',
    destination: 'Greek Islands, Greece',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1526481280698-8fcc13fd79d0?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Discover the stunning beauty of the Greek islands with crystal clear waters, ancient ruins, and charming villages perched on cliffs during our 9-day cruise.',
    price: 110000,
    originalPrice: 140000,
    duration: '9 days',
    durationDays: 9,
    rating: 4.6,
    featured: false,
    highlights: ['Santorini sunset', 'Ancient ruins', 'Boat tours', 'Local cuisine'],
    inclusions: ['9 nights cruise', 'All meals', 'Excursions', 'Onboard activities'],
    difficulty: 'Easy',
    active: true
  },
  {
    id: '7',
    name: '5-Day Golden Triangle Tour',
    destination: 'Delhi, Agra & Jaipur, India',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1564507593976-8a5f0f1d2b5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564507593976-8a5f0f1d2b5a?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Experience the iconic Golden Triangle of India - Delhi, Agra, and Jaipur - with visits to the Taj Mahal, Red Fort, and Amber Fort.',
    price: 55000,
    originalPrice: 65000,
    duration: '5 days',
    durationDays: 5,
    rating: 4.8,
    featured: true,
    highlights: ['Taj Mahal', 'Red Fort', 'Amber Fort', 'Cultural shows'],
    inclusions: ['4 nights accommodation', 'All meals', 'Airport transfers', 'Professional guide'],
    difficulty: 'Easy',
    active: true
  },
  {
    id: '8',
    name: '7-Day Kerala Backwaters & Beaches',
    destination: 'Kerala, India',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1566391564231-f7a7c5d6c5d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Discover the tranquil backwaters of Kerala with houseboat cruises, Ayurvedic treatments, and beautiful beaches of Kovalam and Varkala.',
    price: 65000,
    originalPrice: 75000,
    duration: '7 days',
    durationDays: 7,
    rating: 4.7,
    featured: true,
    highlights: ['Houseboat stay', 'Ayurvedic spa', 'Backwater cruises', 'Beach relaxation'],
    inclusions: ['6 nights accommodation', 'All meals', 'Airport transfers', 'Spa treatments'],
    difficulty: 'Easy',
    active: true
  },
  {
    id: '9',
    name: '10-Day Rajasthan Royal Experience',
    destination: 'Rajasthan, India',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1599867907778-619b638b64f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599867907778-619b638b64f9?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Experience the royal heritage of Rajasthan with visits to magnificent palaces, forts, and vibrant markets in Jaipur, Udaipur, and Jodhpur.',
    price: 95000,
    originalPrice: 110000,
    duration: '10 days',
    durationDays: 10,
    rating: 4.9,
    featured: true,
    highlights: ['Amber Fort', 'City Palace', 'Lake Pichola', 'Desert safari'],
    inclusions: ['9 nights accommodation', 'All meals', 'Airport transfers', 'Cultural performances'],
    difficulty: 'Moderate',
    active: true
  },
  {
    id: '10',
    name: '4-Day Goa Beach Holiday',
    destination: 'Goa, India',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1565788422034-5f4d0c9a2a4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1200&q=80'
    ],
    description:
      'Enjoy the sun, sand, and nightlife of Goa with its beautiful beaches, Portuguese heritage, and vibrant culture.',
    price: 42000,
    originalPrice: 50000,
    duration: '4 days',
    durationDays: 4,
    rating: 4.5,
    featured: false,
    highlights: ['Beach parties', 'Water sports', 'Portuguese churches', 'Local markets'],
    inclusions: ['3 nights accommodation', 'Breakfast', 'Airport transfers', 'Water sports'],
    difficulty: 'Easy',
    active: true
  }
];

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeToStorage(packages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  } catch {
    // ignore
  }
}

export function getAllPackages() {
  const stored = readFromStorage();
  if (stored && stored.length) return stored;
  writeToStorage(defaultPackages);
  return defaultPackages;
}

export function savePackages(packages) {
  const safe = Array.isArray(packages) ? packages : [];
  writeToStorage(safe);
  return safe;
}

export function getPackageById(id) {
  const all = getAllPackages();
  return all.find((p) => String(p.id) === String(id)) || null;
}

export function upsertPackage(pkg) {
  const all = getAllPackages();
  const idx = all.findIndex((p) => String(p.id) === String(pkg.id));
  let next;
  if (idx === -1) {
    next = [...all, pkg];
  } else {
    next = [...all];
    next[idx] = { ...all[idx], ...pkg };
  }
  savePackages(next);
  return pkg;
}

export function deletePackage(id) {
  const all = getAllPackages();
  const next = all.filter((p) => String(p.id) !== String(id));
  savePackages(next);
  return next;
}
