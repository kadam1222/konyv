import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/auth/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => { setIsReady(true); }, []);

  useEffect(() => {
    if (!isReady) return;

    const inTabsGroup = segments[0] === '(tabs)';

    // Ha nincs user (nincs token), és a védett részre tévedne
    if (!user && inTabsGroup) {
      router.replace('/LoginLogout');
    } 
    // Ha bejelentkezett, ne lássa többé a logint, vigyük a főoldalra
    else if (user && segments[0] === 'LoginLogout') {
      router.replace('/(tabs)');
    }
  }, [user, segments, isReady]);

  return (
    <Stack>
      <Stack.Screen name="LoginLogout" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}