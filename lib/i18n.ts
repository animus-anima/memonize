// Internationalization for Memonize
// Supports: English (en), French (fr)

export type Language = 'en' | 'fr';

export const translations = {
  en: {
    // App
    appName: 'Memonize',
    appTagline: 'Master 100 numbers with fun!',

    // Auth
    signIn: 'Sign In',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    yourName: 'Your name',
    yourPassword: 'Your password',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset Password',
    sendResetEmail: 'Send Reset Email',
    backToSignIn: 'Back to Sign In',
    continueWithGoogle: 'Continue with Google',
    or: 'or',
    checkEmailReset: 'Check your email for a password reset link!',
    fillAllFields: 'Please fill in all fields',
    enterYourName: 'Please enter your name',
    invalidCredentials: 'Invalid email or password',
    emailAlreadyUsed: 'Email already registered',
    weakPassword: 'Password must be at least 6 characters',
    invalidEmail: 'Invalid email address',
    errorOccurred: 'An error occurred',

    // Navigation
    back: 'Back',
    home: 'Home',
    settings: 'Settings',

    // Phases
    priming: 'Priming',
    encoding: 'Encoding',
    reference: 'Reference',
    retrieval: 'Retrieval',
    interleaving: 'Interleaving',
    overlearning: 'Overlearning',

    // Phase descriptions
    primingDesc: 'Explore all items to build your mental scaffold',
    encodingDesc: 'Create personal connections for each item',
    retrievalDesc: 'Test your recall - retrieval strengthens memory',
    interleavingDesc: 'Mix this category with others for deeper learning',
    overlearningDesc: 'Build speed and automaticity',

    // Categories
    places: 'Places',
    people: 'People',
    construction: 'Construction',
    instruments: 'Instruments',
    sports: 'Sports',
    body: 'Body',
    vehicles: 'Vehicles',
    weather: 'Weather',
    clothing: 'Clothing',
    celebrations: 'Celebrations',

    // Quiz
    numberToWord: 'Number → Word',
    wordToNumber: 'Word → Number',
    score: 'Score',
    categoryComplete: 'Category Complete!',
    finalScore: 'Final Score',
    practiceAgain: 'Practice Again',
    loading: 'Loading...',

    // Encoding
    whyFeelsLike: 'Why does {number} feel like {word}?',
    mnemonicPlaceholder: 'e.g., 8 looks like a snowman on a lake...',
    save: 'Save',

    // Interleaving
    randomMix: 'Random Mix',
    randomMixDesc: 'Items from all categories, randomly shuffled',
    neighbors: 'Neighbors',
    neighborsDesc: 'What comes before and after each item?',
    oddOneOut: 'Odd One Out',
    oddOneOutDesc: "Find the item that doesn't belong",

    // Speed
    bestSprint: 'Best Sprint',
    sprint60s: '60s Sprint',
    sprint60sDesc: 'How many can you get in one minute?',
    rapidFire: 'Rapid Fire',
    rapidFireDesc: 'Items appear every 2 seconds',

    // Progress
    explored: 'explored',
    categoryPrimed: 'Category primed',

    // Home
    yourProgress: 'Your Progress',
    categories: 'Categories',
    startLearning: 'Start Learning',
    continueWhere: 'Continue where you left off',

    // Settings
    language: 'Language',
    logout: 'Log out',
    resetProgress: 'Reset Progress',

    // Misc
    items: 'items',

    // Home screen
    letsLearn: "Let's Learn!",
    numberMemory: 'Number Memory',
    matchNumbers: 'Match 100 numbers with fun pictures!',
    chooseAdventure: 'Choose Your Adventure',
    pickTopic: 'Pick a Topic',
    seeAll100: 'See All 100',
    randomQuiz: 'Random Quiz!',

    // Phase names (child-friendly)
    discoverPhase: 'Discover',
    connectPhase: 'Connect',
    cheatSheetPhase: 'Cheat Sheet',
    quizTimePhase: 'Quiz Time',
    mixItUpPhase: 'Mix It Up',
    speedRunPhase: 'Speed Run',

    // Phase descriptions (child-friendly)
    discoverDesc: 'Look at all the pictures!',
    connectDesc: 'Make fun stories!',
    cheatSheetDesc: 'See all answers',
    quizTimeDesc: 'Test yourself!',
    mixItUpDesc: 'Random challenges!',
    speedRunDesc: 'Go super fast!',

    // Reference screen
    referenceTitle: 'Reference',
    quickLookup: 'Quick lookup - always accessible',
    searchPlaceholder: 'Search by number or word...',
    all: 'All',
    noItemsFound: 'No items found',
    tryDifferentSearch: 'Try a different search term',
    item: 'item',

    // Quiz screens
    randomQuizTitle: 'Random Quiz',
    mixedItems: 'Mixed items from all categories',
    progress: 'Progress',
    streak: 'Streak',
    quizComplete: 'Quiz Complete!',
    correct: 'correct',
    tryAgain: 'Try Again',
    neighborsTitle: 'Neighbors',
    whatSurrounds: 'What surrounds...',
    before: 'Before',
    after: 'After',
    typeTheWord: 'Type the word...',
    check: 'Check',
    next: 'Next',
    roundComplete: 'Round Complete!',
    perfectPairs: 'perfect pairs',
    playAgain: 'Play Again',
    oddOneOutTitle: 'Odd One Out',
    findOddOne: "Find the item that doesn't belong",
    whichNotIn: 'Which one is NOT in the',
    category: 'category',
    newRound: 'New Round',

    // Progress Overview
    storiesMade: 'Stories Made',
    masteryLevel: 'Mastery Level',
    keepExploring: 'Keep exploring!',
    greatStart: 'Great start!',
    amazingProgress: 'Amazing progress!',
    almostThere: 'Almost there!',
    youAreChampion: 'You are a champion!',

    // Speed screens
    sprintTitle: '60-Second Sprint',
    sprintSubtitle: 'How many can you get in one minute?',
    yourBest: 'Your Best',
    startSprint: 'Start Sprint',
    time: 'Time',
    timesUp: "Time's Up!",
    newRecord: 'New Record!',
    beatPreviousBest: 'You beat your previous best of',
    rapidFireTitle: 'Rapid Fire',
    rapidFireSubtitle: 'Items appear every 2 seconds.\nTap "I Know It" or "Skip" before time runs out!',
    start: 'Start',
    skip: 'Skip',
    iKnowIt: 'I Know It!',
    known: 'known',
    complete: 'Complete!',
    previousBest: 'Previous best',
  },

  fr: {
    // App
    appName: 'Memonize',
    appTagline: 'Maîtrise 100 nombres en t\'amusant !',

    // Auth
    signIn: 'Connexion',
    register: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    yourName: 'Ton nom',
    yourPassword: 'Ton mot de passe',
    createAccount: 'Créer un compte',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser',
    sendResetEmail: 'Envoyer le lien',
    backToSignIn: 'Retour à la connexion',
    continueWithGoogle: 'Continuer avec Google',
    or: 'ou',
    checkEmailReset: 'Vérifie tes emails pour le lien de réinitialisation !',
    fillAllFields: 'Remplis tous les champs',
    enterYourName: 'Entre ton nom',
    invalidCredentials: 'Email ou mot de passe invalide',
    emailAlreadyUsed: 'Email déjà utilisé',
    weakPassword: 'Le mot de passe doit avoir au moins 6 caractères',
    invalidEmail: 'Adresse email invalide',
    errorOccurred: 'Une erreur est survenue',

    // Navigation
    back: 'Retour',
    home: 'Accueil',
    settings: 'Paramètres',

    // Phases
    priming: 'Découverte',
    encoding: 'Encodage',
    reference: 'Référence',
    retrieval: 'Rappel',
    interleaving: 'Mélange',
    overlearning: 'Maîtrise',

    // Phase descriptions
    primingDesc: 'Explore tous les éléments pour construire ton schéma mental',
    encodingDesc: 'Crée des connexions personnelles pour chaque élément',
    retrievalDesc: 'Teste ta mémoire - le rappel renforce la mémorisation',
    interleavingDesc: 'Mélange cette catégorie avec d\'autres pour un apprentissage plus profond',
    overlearningDesc: 'Développe ta vitesse et ton automatisme',

    // Categories
    places: 'Lieux',
    people: 'Personnes',
    construction: 'Construction',
    instruments: 'Instruments',
    sports: 'Sports',
    body: 'Corps',
    vehicles: 'Véhicules',
    weather: 'Météo',
    clothing: 'Vêtements',
    celebrations: 'Fêtes',

    // Quiz
    numberToWord: 'Nombre → Mot',
    wordToNumber: 'Mot → Nombre',
    score: 'Score',
    categoryComplete: 'Catégorie terminée !',
    finalScore: 'Score final',
    practiceAgain: 'Recommencer',
    loading: 'Chargement...',

    // Encoding
    whyFeelsLike: 'Pourquoi {number} te fait penser à {word} ?',
    mnemonicPlaceholder: 'ex: 8 ressemble à un bonhomme de neige...',
    save: 'Sauvegarder',

    // Interleaving
    randomMix: 'Mélange aléatoire',
    randomMixDesc: 'Éléments de toutes les catégories, mélangés',
    neighbors: 'Voisins',
    neighborsDesc: 'Qu\'est-ce qui vient avant et après ?',
    oddOneOut: 'L\'intrus',
    oddOneOutDesc: 'Trouve l\'élément qui n\'appartient pas au groupe',

    // Speed
    bestSprint: 'Meilleur sprint',
    sprint60s: 'Sprint 60s',
    sprint60sDesc: 'Combien peux-tu en trouver en une minute ?',
    rapidFire: 'Tir rapide',
    rapidFireDesc: 'Les éléments apparaissent toutes les 2 secondes',

    // Progress
    explored: 'explorés',
    categoryPrimed: 'Catégorie découverte',

    // Home
    yourProgress: 'Ta progression',
    categories: 'Catégories',
    startLearning: 'Commencer',
    continueWhere: 'Continue là où tu t\'es arrêté',

    // Settings
    language: 'Langue',
    logout: 'Déconnexion',
    resetProgress: 'Réinitialiser la progression',

    // Misc
    items: 'éléments',

    // Home screen
    letsLearn: 'Apprends !',
    numberMemory: 'Mémoire des Nombres',
    matchNumbers: 'Associe 100 nombres à des images amusantes !',
    chooseAdventure: 'Choisis ton aventure',
    pickTopic: 'Choisis un thème',
    seeAll100: 'Voir les 100',
    randomQuiz: 'Quiz Aléatoire !',

    // Phase names (child-friendly)
    discoverPhase: 'Découvrir',
    connectPhase: 'Connecter',
    cheatSheetPhase: 'Aide-mémoire',
    quizTimePhase: 'Quiz',
    mixItUpPhase: 'Mélanger',
    speedRunPhase: 'Vitesse',

    // Phase descriptions (child-friendly)
    discoverDesc: 'Regarde toutes les images !',
    connectDesc: 'Invente des histoires amusantes !',
    cheatSheetDesc: 'Voir toutes les réponses',
    quizTimeDesc: 'Teste-toi !',
    mixItUpDesc: 'Défis aléatoires !',
    speedRunDesc: 'Va super vite !',

    // Reference screen
    referenceTitle: 'Référence',
    quickLookup: 'Recherche rapide - toujours accessible',
    searchPlaceholder: 'Chercher par nombre ou mot...',
    all: 'Tout',
    noItemsFound: 'Aucun élément trouvé',
    tryDifferentSearch: 'Essaie un autre terme de recherche',
    item: 'élément',

    // Quiz screens
    randomQuizTitle: 'Quiz Aléatoire',
    mixedItems: 'Éléments mélangés de toutes les catégories',
    progress: 'Progression',
    streak: 'Série',
    quizComplete: 'Quiz Terminé !',
    correct: 'correct',
    tryAgain: 'Réessayer',
    neighborsTitle: 'Voisins',
    whatSurrounds: 'Qu\'est-ce qui entoure...',
    before: 'Avant',
    after: 'Après',
    typeTheWord: 'Tape le mot...',
    check: 'Vérifier',
    next: 'Suivant',
    roundComplete: 'Manche Terminée !',
    perfectPairs: 'paires parfaites',
    playAgain: 'Rejouer',
    oddOneOutTitle: 'L\'Intrus',
    findOddOne: 'Trouve l\'élément qui n\'appartient pas',
    whichNotIn: 'Lequel N\'EST PAS dans la catégorie',
    category: 'catégorie',
    newRound: 'Nouvelle Manche',

    // Progress Overview
    storiesMade: 'Histoires créées',
    masteryLevel: 'Niveau de maîtrise',
    keepExploring: 'Continue à explorer !',
    greatStart: 'Bon début !',
    amazingProgress: 'Super progression !',
    almostThere: 'Presque là !',
    youAreChampion: 'Tu es un champion !',

    // Speed screens
    sprintTitle: 'Sprint de 60 Secondes',
    sprintSubtitle: 'Combien peux-tu en avoir en une minute ?',
    yourBest: 'Ton Meilleur',
    startSprint: 'Commencer le Sprint',
    time: 'Temps',
    timesUp: 'Temps écoulé !',
    newRecord: 'Nouveau Record !',
    beatPreviousBest: 'Tu as battu ton précédent record de',
    rapidFireTitle: 'Tir Rapide',
    rapidFireSubtitle: 'Les éléments apparaissent toutes les 2 secondes.\nAppuie sur "Je sais !" ou "Passer" avant la fin du temps !',
    start: 'Commencer',
    skip: 'Passer',
    iKnowIt: 'Je sais !',
    known: 'connus',
    complete: 'Terminé !',
    previousBest: 'Précédent record',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

// Helper to get translation with interpolation
export function t(
  key: TranslationKey,
  lang: Language,
  params?: Record<string, string | number>
): string {
  let text = translations[lang][key] || translations.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, String(value));
    });
  }

  return text;
}
