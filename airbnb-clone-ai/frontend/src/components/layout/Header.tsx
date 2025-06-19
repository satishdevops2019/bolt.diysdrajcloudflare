// frontend/src/components/layout/Header.tsx
'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Import for potential redirection on logout

const Header = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to homepage after logout
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-16 flex items-center">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-600 transition-colors">
          AirbnbClone
        </Link>
        <div className="flex items-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 w-24 bg-gray-300 rounded"></div>
            </div>
          ) : isAuthenticated && user ? (
            <>
              <span className="mr-2 sm:mr-4 text-gray-700">Welcome, {user.username}!</span>
              {/* Add dashboard/profile link if needed */}
              {/* <Link href="/dashboard" className="text-gray-600 hover:text-red-500 mr-3 sm:mr-4">
                Dashboard
              </Link> */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-red-500 mr-3 sm:mr-4 font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
