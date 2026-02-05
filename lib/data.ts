// Table de Rappel - 100 items organized in 10 categories
// Pedagogically optimized for children (ages 8+)
// - Concrete, familiar concepts
// - Logical sequencing within categories
// - Unique emojis for each item
// - Mnemonic hints included

export interface TableItem {
  number: number;
  word: string;
  emoji: string;
  category: string;
  categoryId: string;
  hint?: string; // Optional mnemonic hint
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  range: string;
  startNum: number;
  endNum: number;
  color: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'places',
    name: 'Lieux',
    nameEn: 'Places',
    range: '1-10',
    startNum: 1,
    endNum: 10,
    color: '#3B82F6',
    description: 'Beautiful places to visit and explore!',
  },
  {
    id: 'people',
    name: 'Personnes',
    nameEn: 'People',
    range: '11-20',
    startNum: 11,
    endNum: 20,
    color: '#EC4899',
    description: 'People through all stages of life!',
  },
  {
    id: 'construction',
    name: 'Bâtiments',
    nameEn: 'Buildings',
    range: '21-30',
    startNum: 21,
    endNum: 30,
    color: '#F97316',
    description: 'Amazing buildings and structures!',
  },
  {
    id: 'instruments',
    name: 'Musique',
    nameEn: 'Music',
    range: '31-40',
    startNum: 31,
    endNum: 40,
    color: '#8B5CF6',
    description: 'Musical instruments that make beautiful sounds!',
  },
  {
    id: 'sports',
    name: 'Sports',
    nameEn: 'Sports & Activities',
    range: '41-50',
    startNum: 41,
    endNum: 50,
    color: '#10B981',
    description: 'Fun sports and activities to stay healthy!',
  },
  {
    id: 'body',
    name: 'Corps',
    nameEn: 'Body',
    range: '51-60',
    startNum: 51,
    endNum: 60,
    color: '#EF4444',
    description: 'Parts of your amazing body!',
  },
  {
    id: 'vehicles',
    name: 'Véhicules',
    nameEn: 'Vehicles',
    range: '61-70',
    startNum: 61,
    endNum: 70,
    color: '#6366F1',
    description: 'Ways to travel and explore the world!',
  },
  {
    id: 'weather',
    name: 'Météo',
    nameEn: 'Weather',
    range: '71-80',
    startNum: 71,
    endNum: 80,
    color: '#0EA5E9',
    description: 'Weather and things in the sky!',
  },
  {
    id: 'clothing',
    name: 'Vêtements',
    nameEn: 'Clothing',
    range: '81-90',
    startNum: 81,
    endNum: 90,
    color: '#F59E0B',
    description: 'Clothes and accessories we wear!',
  },
  {
    id: 'celebrations',
    name: 'Fêtes',
    nameEn: 'Celebrations',
    range: '91-100',
    startNum: 91,
    endNum: 100,
    color: '#F43F5E',
    description: 'Happy moments and celebrations!',
  },
];

export const tableItems: TableItem[] = [
  // ═══════════════════════════════════════════════════════════════
  // PLACES (1-10) - Natural and urban locations
  // ═══════════════════════════════════════════════════════════════
  { number: 1, word: 'Ville', emoji: '🏙️', category: 'Lieux', categoryId: 'places', hint: '1 looks like a tall building in a city' },
  { number: 2, word: 'Montagne', emoji: '🏔️', category: 'Lieux', categoryId: 'places', hint: '2 looks like a mountain peak' },
  { number: 3, word: 'Plage', emoji: '🏖️', category: 'Lieux', categoryId: 'places', hint: '3 waves on the beach' },
  { number: 4, word: 'Forêt', emoji: '🌲', category: 'Lieux', categoryId: 'places', hint: '4 corners like tree branches' },
  { number: 5, word: 'Jardin', emoji: '🌺', category: 'Lieux', categoryId: 'places', hint: '5 petals on a flower' },
  { number: 6, word: 'Rivière', emoji: '🏞️', category: 'Lieux', categoryId: 'places', hint: '6 curves like a winding river' },
  { number: 7, word: 'Île', emoji: '🏝️', category: 'Lieux', categoryId: 'places', hint: '7 days on a paradise island' },
  { number: 8, word: 'Lac', emoji: '💧', category: 'Lieux', categoryId: 'places', hint: '8 looks like a figure-8 lake' },
  { number: 9, word: 'Désert', emoji: '🏜️', category: 'Lieux', categoryId: 'places', hint: '9 looks like a curvy sand dune' },
  { number: 10, word: 'Prairie', emoji: '🌻', category: 'Lieux', categoryId: 'places', hint: '10 = perfect 10, a perfect meadow' },

  // ═══════════════════════════════════════════════════════════════
  // PEOPLE (11-20) - Life stages progression (birth → elderly)
  // ═══════════════════════════════════════════════════════════════
  { number: 11, word: 'Bébé', emoji: '👶', category: 'Personnes', categoryId: 'people', hint: '11 = two little legs of a baby' },
  { number: 12, word: 'Enfant', emoji: '👦', category: 'Personnes', categoryId: 'people', hint: '12 months = 1 year old child' },
  { number: 13, word: 'Adolescent', emoji: '🧒', category: 'Personnes', categoryId: 'people', hint: '13 = teenager age!' },
  { number: 14, word: 'Femme', emoji: '👩', category: 'Personnes', categoryId: 'people', hint: '14 February = Valentine\'s Day for women' },
  { number: 15, word: 'Homme', emoji: '👨', category: 'Personnes', categoryId: 'people', hint: '15 = quinze, sounds like "keen" man' },
  { number: 16, word: 'Couple', emoji: '💑', category: 'Personnes', categoryId: 'people', hint: '16 = sweet sixteen, first love' },
  { number: 17, word: 'Famille', emoji: '👪', category: 'Personnes', categoryId: 'people', hint: '17 = 1+7=8, infinity of family love' },
  { number: 18, word: 'Groupe', emoji: '👨‍👩‍👧‍👦', category: 'Personnes', categoryId: 'people', hint: '18 = adult group (18+ years)' },
  { number: 19, word: 'Grand-père', emoji: '👴', category: 'Personnes', categoryId: 'people', hint: '19 looks like a cane and a person' },
  { number: 20, word: 'Grand-mère', emoji: '👵', category: 'Personnes', categoryId: 'people', hint: '20 = wise 20/20 vision of grandma' },

  // ═══════════════════════════════════════════════════════════════
  // BUILDINGS (21-30) - From small to grand structures
  // ═══════════════════════════════════════════════════════════════
  { number: 21, word: 'Maison', emoji: '🏠', category: 'Bâtiments', categoryId: 'construction', hint: '21 = blackjack, winning home!' },
  { number: 22, word: 'Immeuble', emoji: '🏢', category: 'Bâtiments', categoryId: 'construction', hint: '22 floors in a tall building' },
  { number: 23, word: 'Pont', emoji: '🌉', category: 'Bâtiments', categoryId: 'construction', hint: '23 = Michael Jordan bridges sports' },
  { number: 24, word: 'Tour', emoji: '🗼', category: 'Bâtiments', categoryId: 'construction', hint: '24 hours, tower clock' },
  { number: 25, word: 'Château', emoji: '🏰', category: 'Bâtiments', categoryId: 'construction', hint: '25 = quarter century, royal castle' },
  { number: 26, word: 'Église', emoji: '⛪', category: 'Bâtiments', categoryId: 'construction', hint: '26 letters, church hymn book' },
  { number: 27, word: 'Temple', emoji: '🛕', category: 'Bâtiments', categoryId: 'construction', hint: '27 = 3x3x3, sacred cube temple' },
  { number: 28, word: 'Musée', emoji: '🏛️', category: 'Bâtiments', categoryId: 'construction', hint: '28 days in February, art month' },
  { number: 29, word: 'Hôtel', emoji: '🏨', category: 'Bâtiments', categoryId: 'construction', hint: '29 = February 29, special stay' },
  { number: 30, word: 'Stade', emoji: '🏟️', category: 'Bâtiments', categoryId: 'construction', hint: '30 thousand fans in stadium' },

  // ═══════════════════════════════════════════════════════════════
  // MUSIC (31-40) - Musical instruments (strings → wind → percussion)
  // ═══════════════════════════════════════════════════════════════
  { number: 31, word: 'Guitare', emoji: '🎸', category: 'Musique', categoryId: 'instruments', hint: '31 days to learn guitar' },
  { number: 32, word: 'Piano', emoji: '🎹', category: 'Musique', categoryId: 'instruments', hint: '32 teeth like piano keys' },
  { number: 33, word: 'Violon', emoji: '🎻', category: 'Musique', categoryId: 'instruments', hint: '33 = double 3, two bows crossing' },
  { number: 34, word: 'Batterie', emoji: '🥁', category: 'Musique', categoryId: 'instruments', hint: '34 = 3-4 beat rhythm on drums' },
  { number: 35, word: 'Saxophone', emoji: '🎷', category: 'Musique', categoryId: 'instruments', hint: '35 = jazz age, saxophone era' },
  { number: 36, word: 'Trompette', emoji: '🎺', category: 'Musique', categoryId: 'instruments', hint: '36 = 6x6, fanfare trumpet' },
  { number: 37, word: 'Flûte', emoji: '🪈', category: 'Musique', categoryId: 'instruments', hint: '37 = lucky 7, magical flute' },
  { number: 38, word: 'Accordéon', emoji: '🪗', category: 'Musique', categoryId: 'instruments', hint: '38 = squeeze 3 and 8 together' },
  { number: 39, word: 'Tambourin', emoji: '🪘', category: 'Musique', categoryId: 'instruments', hint: '39 = shake it up before 40!' },
  { number: 40, word: 'Harpe', emoji: '🪕', category: 'Musique', categoryId: 'instruments', hint: '40 strings on a heavenly harp' },

  // ═══════════════════════════════════════════════════════════════
  // SPORTS (41-50) - Sports and physical activities
  // ═══════════════════════════════════════════════════════════════
  { number: 41, word: 'Yoga', emoji: '🧘', category: 'Sports', categoryId: 'sports', hint: '41 = 4+1=5, 5 breaths in yoga' },
  { number: 42, word: 'Sieste', emoji: '😴', category: 'Sports', categoryId: 'sports', hint: '42 = answer to everything, rest!' },
  { number: 43, word: 'Massage', emoji: '💆', category: 'Sports', categoryId: 'sports', hint: '43 = relax after exercise' },
  { number: 44, word: 'Natation', emoji: '🏊', category: 'Sports', categoryId: 'sports', hint: '44 = 4 swimming strokes' },
  { number: 45, word: 'Gymnastique', emoji: '🤸', category: 'Sports', categoryId: 'sports', hint: '45 degree angle in gymnastics' },
  { number: 46, word: 'Football', emoji: '⚽', category: 'Sports', categoryId: 'sports', hint: '46 = close to 45, soccer kick' },
  { number: 47, word: 'Course', emoji: '🏃', category: 'Sports', categoryId: 'sports', hint: '47 = run fast like agent 47' },
  { number: 48, word: 'Basket', emoji: '🏀', category: 'Sports', categoryId: 'sports', hint: '48 minutes in NBA game' },
  { number: 49, word: 'Danse', emoji: '💃', category: 'Sports', categoryId: 'sports', hint: '49 = 7x7, dance moves' },
  { number: 50, word: 'Tennis', emoji: '🎾', category: 'Sports', categoryId: 'sports', hint: '50 = half century, tennis match' },

  // ═══════════════════════════════════════════════════════════════
  // BODY (51-60) - Body parts (top to bottom)
  // ═══════════════════════════════════════════════════════════════
  { number: 51, word: 'Tête', emoji: '🧠', category: 'Corps', categoryId: 'body', hint: '51 = head is #1 at the top' },
  { number: 52, word: 'Yeux', emoji: '👀', category: 'Corps', categoryId: 'body', hint: '52 weeks, eyes see all year' },
  { number: 53, word: 'Oreilles', emoji: '👂', category: 'Corps', categoryId: 'body', hint: '53 = 5+3=8, ear shape like 8' },
  { number: 54, word: 'Nez', emoji: '👃', category: 'Corps', categoryId: 'body', hint: '54 = nose in the middle (5-4)' },
  { number: 55, word: 'Bouche', emoji: '👄', category: 'Corps', categoryId: 'body', hint: '55 = double 5, lips shape' },
  { number: 56, word: 'Dents', emoji: '🦷', category: 'Corps', categoryId: 'body', hint: '56 = 5+6=11, space between teeth' },
  { number: 57, word: 'Langue', emoji: '👅', category: 'Corps', categoryId: 'body', hint: '57 varieties of taste' },
  { number: 58, word: 'Main', emoji: '✋', category: 'Corps', categoryId: 'body', hint: '58 = 5+8=13, unlucky without hands' },
  { number: 59, word: 'Doigt', emoji: '☝️', category: 'Corps', categoryId: 'body', hint: '59 = almost 60, pointing forward' },
  { number: 60, word: 'Pied', emoji: '🦶', category: 'Corps', categoryId: 'body', hint: '60 seconds to run, feet moving' },

  // ═══════════════════════════════════════════════════════════════
  // VEHICLES (61-70) - Ways to travel (land → water → air)
  // ═══════════════════════════════════════════════════════════════
  { number: 61, word: 'Voiture', emoji: '🚗', category: 'Véhicules', categoryId: 'vehicles', hint: '61 = Route 66 minus 5' },
  { number: 62, word: 'Moto', emoji: '🏍️', category: 'Véhicules', categoryId: 'vehicles', hint: '62 = 2 wheels, fast!' },
  { number: 63, word: 'Bus', emoji: '🚌', category: 'Véhicules', categoryId: 'vehicles', hint: '63 passengers on a bus' },
  { number: 64, word: 'Camion', emoji: '🚚', category: 'Véhicules', categoryId: 'vehicles', hint: '64 = big truck, 64-bit power' },
  { number: 65, word: 'Train', emoji: '🚂', category: 'Véhicules', categoryId: 'vehicles', hint: '65 = retirement, train journey' },
  { number: 66, word: 'Vélo', emoji: '🚴', category: 'Véhicules', categoryId: 'vehicles', hint: '66 = Route 66 on a bike' },
  { number: 67, word: 'Tracteur', emoji: '🚜', category: 'Véhicules', categoryId: 'vehicles', hint: '67 = farm work, tractor time' },
  { number: 68, word: 'Bateau', emoji: '⛵', category: 'Véhicules', categoryId: 'vehicles', hint: '68 = sailing the seas' },
  { number: 69, word: 'Avion', emoji: '✈️', category: 'Véhicules', categoryId: 'vehicles', hint: '69 = flying high (6 upside = 9)' },
  { number: 70, word: 'Fusée', emoji: '🚀', category: 'Véhicules', categoryId: 'vehicles', hint: '70 = blast off to space!' },

  // ═══════════════════════════════════════════════════════════════
  // WEATHER (71-80) - Sky and weather (day → night → conditions)
  // ═══════════════════════════════════════════════════════════════
  { number: 71, word: 'Soleil', emoji: '☀️', category: 'Météo', categoryId: 'weather', hint: '71 = sunny day #1' },
  { number: 72, word: 'Lune', emoji: '🌙', category: 'Météo', categoryId: 'weather', hint: '72 hours = 3 nights of moon' },
  { number: 73, word: 'Étoile', emoji: '⭐', category: 'Météo', categoryId: 'weather', hint: '73 = lucky star number' },
  { number: 74, word: 'Nuage', emoji: '☁️', category: 'Météo', categoryId: 'weather', hint: '74 = clouds float at 7,400m' },
  { number: 75, word: 'Pluie', emoji: '🌧️', category: 'Météo', categoryId: 'weather', hint: '75 = 75% chance of rain' },
  { number: 76, word: 'Neige', emoji: '❄️', category: 'Météo', categoryId: 'weather', hint: '76 = cold like 1776 winter' },
  { number: 77, word: 'Vent', emoji: '🌬️', category: 'Météo', categoryId: 'weather', hint: '77 = lucky 7s blown by wind' },
  { number: 78, word: 'Orage', emoji: '⛈️', category: 'Météo', categoryId: 'weather', hint: '78 = stormy 7-8 weather' },
  { number: 79, word: 'Éclair', emoji: '⚡', category: 'Météo', categoryId: 'weather', hint: '79 = lightning fast, almost 80!' },
  { number: 80, word: 'Arc-en-ciel', emoji: '🌈', category: 'Météo', categoryId: 'weather', hint: '80 = 8 colors, round rainbow' },

  // ═══════════════════════════════════════════════════════════════
  // CLOTHING (81-90) - Clothes (top to bottom, then accessories)
  // ═══════════════════════════════════════════════════════════════
  { number: 81, word: 'Chapeau', emoji: '🎩', category: 'Vêtements', categoryId: 'clothing', hint: '81 = hat on top, #1 accessory' },
  { number: 82, word: 'Chemise', emoji: '👔', category: 'Vêtements', categoryId: 'clothing', hint: '82 = shirt with 2 sleeves' },
  { number: 83, word: 'Pantalon', emoji: '👖', category: 'Vêtements', categoryId: 'clothing', hint: '83 = pants with 3 pockets?' },
  { number: 84, word: 'Robe', emoji: '👗', category: 'Vêtements', categoryId: 'clothing', hint: '84 = elegant dress for 4 seasons' },
  { number: 85, word: 'Short', emoji: '🩳', category: 'Vêtements', categoryId: 'clothing', hint: '85 = short pants for hot 85°' },
  { number: 86, word: 'Chaussures', emoji: '👟', category: 'Vêtements', categoryId: 'clothing', hint: '86 = shoes, 8+6=14 lace holes' },
  { number: 87, word: 'Bottes', emoji: '👢', category: 'Vêtements', categoryId: 'clothing', hint: '87 = tall boots for winter 87' },
  { number: 88, word: 'Lunettes', emoji: '👓', category: 'Vêtements', categoryId: 'clothing', hint: '88 = two circles like glasses!' },
  { number: 89, word: 'Montre', emoji: '⌚', category: 'Vêtements', categoryId: 'clothing', hint: '89 = watch time, almost 90!' },
  { number: 90, word: 'Sac', emoji: '🎒', category: 'Vêtements', categoryId: 'clothing', hint: '90 = backpack for school at 9:00' },

  // ═══════════════════════════════════════════════════════════════
  // CELEBRATIONS (91-100) - Happy moments and celebrations
  // ═══════════════════════════════════════════════════════════════
  { number: 91, word: 'Coeur', emoji: '❤️', category: 'Fêtes', categoryId: 'celebrations', hint: '91 = heart beats 91 times/min' },
  { number: 92, word: 'Câlin', emoji: '🤗', category: 'Fêtes', categoryId: 'celebrations', hint: '92 = warm hug for 9+2=11 seconds' },
  { number: 93, word: 'Bisou', emoji: '😘', category: 'Fêtes', categoryId: 'celebrations', hint: '93 = sweet kiss, 9x3=27 smooches' },
  { number: 94, word: 'Mariage', emoji: '💒', category: 'Fêtes', categoryId: 'celebrations', hint: '94 = wedding bells ring' },
  { number: 95, word: 'Cadeau', emoji: '🎁', category: 'Fêtes', categoryId: 'celebrations', hint: '95 = gift! Almost 100!' },
  { number: 96, word: 'Fleur', emoji: '🌸', category: 'Fêtes', categoryId: 'celebrations', hint: '96 = flowers bloom, 9+6=15 petals' },
  { number: 97, word: 'Gâteau', emoji: '🎂', category: 'Fêtes', categoryId: 'celebrations', hint: '97 = birthday cake with candles' },
  { number: 98, word: 'Ballon', emoji: '🎈', category: 'Fêtes', categoryId: 'celebrations', hint: '98 balloons at the party!' },
  { number: 99, word: 'Fête', emoji: '🎉', category: 'Fêtes', categoryId: 'celebrations', hint: '99 = party time! Almost 100!' },
  { number: 100, word: 'Champion', emoji: '🏆', category: 'Fêtes', categoryId: 'celebrations', hint: '100 = WINNER! Perfect score!' },
];

// Helper functions
export function getItemsByCategory(categoryId: string): TableItem[] {
  return tableItems.filter((item) => item.categoryId === categoryId);
}

export function getItemByNumber(num: number): TableItem | undefined {
  return tableItems.find((item) => item.number === num);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

export function getRandomItems(count: number, categoryId?: string): TableItem[] {
  const source = categoryId ? getItemsByCategory(categoryId) : tableItems;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getNeighbors(num: number): { prev: TableItem | null; next: TableItem | null } {
  return {
    prev: num > 1 ? getItemByNumber(num - 1) ?? null : null,
    next: num < 100 ? getItemByNumber(num + 1) ?? null : null,
  };
}
