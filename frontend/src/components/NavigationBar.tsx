'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { toast } from 'sonner';

const NavigationBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Successfully logged out!');
    router.push('/');
  }

  return (
    <nav className='fixed w-full h-24 shadow-xl bg-white z-50'>
      <div className='flex justify-between items-center h-full w-full px-4'>
        <div>
          <Link href={isLoggedIn ? '/dashboard' : '/'} >
            <h2 className='text-3xl font-semibold uppercase '>Form Coach</h2>
          </Link>
          
        </div>
        <div>
          {isLoggedIn ? (
            <Button
              onClick={handleSignOut}
            >
              Logout
            </Button>
          ) : (
            // when user not logged in show nothing on right side
            <div>
            </div>
          )}
        </div>
      </div>

    </nav>
  )
}

export default NavigationBar