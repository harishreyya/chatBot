'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-100 space-y-4">
      <h1 className="text-4xl font-bold text-blue-700">
        Welcome home, {session?.user?.email}!
      </h1>
     { session?.user?.email  && <button
        onClick={() =>
          signOut({ redirect: true, callbackUrl: '/auth/login' })
        }
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>}
    </main>
  );
}
