import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/useAppStore';
import { onAuthStateChange, createUserProfile } from '@/lib/firebaseClient';
import '../global.css';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, authLoading, setUser, setAuthLoading, loadFromCloud } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Create profile if new user
        await createUserProfile(firebaseUser);
        // Load progress from cloud
        await loadFromCloud();
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Not logged in and not on auth page -> redirect to login
      router.replace('/auth' as any);
    } else if (user && inAuthGroup) {
      // Logged in but on auth page -> redirect to home
      router.replace('/' as any);
    }
  }, [user, authLoading, segments]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bgPrimary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.accentPrimary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: Colors.bgPrimary }}>
        <AuthGuard>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.bgPrimary },
              animation: 'slide_from_right',
            }}
          />
        </AuthGuard>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}
