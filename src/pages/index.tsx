import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth/authStore';

const HomePage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [hydrated, setHydrated] = useState(false);

  // Ensure Zustand hydration before executing redirects
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // Prevent running redirect logic until Zustand is ready

    if (token) {
      router.push('/dashboard'); // Use replace() to prevent back navigation to /
    } else {
      router.push('/auth/login');
    }
  }, [token, hydrated, router]);

  return null; // No UI needed for redirection
};

export default HomePage;
