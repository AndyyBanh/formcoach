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
    <nav className='fixed w-full h-16 shadow-xl bg-zinc-50 z-50'>
      <div className='flex justify-between items-center h-full w-full px-6 max-w-7xl mx-auto'>
        <div>
          <Link href={isLoggedIn ? '/dashboard' : '/'} >
            <h2 className='text-2xl font-semibold'>Form Coach</h2>
          </Link>
          
        </div>
        <div>
          {isLoggedIn ? (
            <Button
              onClick={handleSignOut}
              className='bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
            >
              Logout
            </Button>
          ) : (
            <div className='flex items-center gap-3'>
              <Link href='/login'>
                <Button variant='ghost' size='sm'>
                  Login
                </Button>
              </Link>
              <Link href='/signup'>
                <Button variant='outline' size='sm' className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

    </nav>
  )
}

export default NavigationBar