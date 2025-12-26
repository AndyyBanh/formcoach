'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { validateEmail } from '@/lib/utils'
import { signup } from '@/service/authService';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner';

const page = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !validateEmail(email)) {
            setError('Invalid email');
            toast.error('Invalid email.');
            return;
        }

        // if no password or password length less than 8 characters error
        if (!password || password.length < 8) {
            setError('Invalid password');
            toast.error('Invalid password.');
            return;
        }

        if (confirmPassword !== password) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const response = await signup(email, password);
            toast.success('Account succesfully created!');
            router.push('/login');
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
                toast.error('Something went wrong. Please try again.');
            }
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Card className='w-full max-w-sm'>
            <form onSubmit={handleSignUp}>
                <div className='flex flex-col py-2.5 px-3.5'>
                    <div className='flex flex-col items-center justify-center'>
                        <CardTitle className=''>Create an account</CardTitle>
                        <CardDescription>Enter appropiate information to create an account</CardDescription>
                    </div>
                    
                    <CardContent className='mt-2.5'>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input 
                                    id='email' 
                                    type='text' 
                                    placeholder='johndoe@gmail.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='password'>Password</FieldLabel>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                                <Input 
                                    id='password' 
                                    type='password' 
                                    placeholder='••••••••' 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}   
                                    required 
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
                                <FieldDescription>
                                    Enter the same password.
                                </FieldDescription>
                                <Input 
                                    id='confirmPassword' 
                                    type='password' 
                                    placeholder='••••••••' 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}  
                                    required  
                                />
                            </Field>
                            <Field>
                                <div className='flex items-center justify-between'>
                                    <Button type='submit' className='hover:bg-gray-700'>
                                        Submit
                                    </Button>
                                    <Link href='/login'>
                                        <Button variant='outline' type='button'>
                                            Login
                                        </Button>
                                    </Link>
                                </div>
                            </Field>
                        </FieldSet>
                    </CardContent>
                </div>
            </form>
        </Card>
    </div>
  )
}

export default page