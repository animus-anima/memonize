// Firebase Client for Memonize
// Handles authentication and Firestore data sync

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyACdRWd-wImGMaY7s8N9B0fs_txICUl1TU",
  authDomain: "memonize-ac94e.firebaseapp.com",
  projectId: "memonize-ac94e",
  storageBucket: "memonize-ac94e.firebasestorage.app",
  messagingSenderId: "143709126749",
  appId: "1:143709126749:web:3f1429c64f0a1e234bcdb4",
  measurementId: "G-D5XBVS68M9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ===== Authentication Functions =====

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function registerWithEmail(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  await createUserProfile(userCredential.user);
  return userCredential;
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  return signOut(auth);
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}

// ===== User Profile Functions =====

export async function createUserProfile(user: User) {
  try {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        email: user.email,
        displayName: user.displayName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        provider: user.providerData[0]?.providerId || 'unknown',
      });
    }
  } catch (error) {
    console.warn('Failed to create user profile (offline?):', error);
    // Don't throw - allow app to continue working offline
  }
}

export async function getUserProfile(userId: string) {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.warn('Failed to get user profile (offline?):', error);
    return null;
  }
}

// ===== Progress Sync Functions =====

// Single unified schema for all user data
export interface UserProgressData {
  // Category progress (priming, encoding counts, accuracy)
  categoryProgress: Record<string, {
    categoryId: string;
    primingCompleted: boolean;
    encodingCount: number;
    retrievalAccuracy: number;
    lastPracticed: string | null;
  }>;
  // User's personal mnemonics for each number (0-99)
  userMnemonics: Record<string, {
    number: number;
    mnemonic: string;
    createdAt: string;
  }>;
  // Quiz history
  quizHistory: Array<{
    timestamp: string;
    phase: string;
    categoryId: string | null;
    totalQuestions: number;
    correctAnswers: number;
    timeSpentMs: number;
  }>;
  // Speed drill records
  speedRecords: Array<{
    timestamp: string;
    count: number;
    timeMs: number;
    mode: string;
  }>;
  // Stats
  currentStreak: number;
  longestStreak: number;
  // Settings
  showEmoji: boolean;
  currentPhase: string;
  // Metadata
  updatedAt?: any;
}

export async function saveUserProgress(userId: string, data: Partial<UserProgressData>): Promise<boolean> {
  try {
    // Save directly to user document for simpler schema
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      progress: {
        ...data,
        updatedAt: serverTimestamp(),
      },
    }, { merge: true });
    console.log('Progress saved to cloud');
    return true;
  } catch (error) {
    console.warn('Failed to save progress:', error);
    return false;
  }
}

export async function loadUserProgress(userId: string): Promise<UserProgressData | null> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.progress as UserProgressData || null;
    }
    return null;
  } catch (error) {
    console.warn('Failed to load progress:', error);
    return null;
  }
}

export { db, auth };
