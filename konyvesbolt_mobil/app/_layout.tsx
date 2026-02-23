function RootLayoutNav() {
  const { user } = useAuth(); 
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inTabsGroup = segments[0] === '(tabs)';
    if (!user && inTabsGroup) {
      router.replace('/LoginLogout');
    } 
    else if (user && segments[0] === 'LoginLogout') {
      router.replace('/(tabs)');
    }
  }, [user, segments, isReady]);

  return (
    <Stack>
      <Stack.Screen name="LoginLogout" options={{ headerShown: false, title: 'Belépés' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}