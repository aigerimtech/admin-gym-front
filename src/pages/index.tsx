import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth/authStore';

const HomePage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (token) {
      router.push('/dashboard'); 
    } else {
      router.push('/auth/login');
    }
  }, [token, hydrated, router]);

  return null; 
};

export default HomePage;