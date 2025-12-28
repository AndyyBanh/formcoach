import { Button } from '@/components/ui/button'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='p-6'>
      <h1 className='text-3xl font-semibold tracking-wide'>Dashboard</h1>
      <div className='grid grid-cols-3 gap-6 mt-6'>
        <Card className='w-full p-6'>
          <CardHeader className=''>
            <CardTitle className='text-2xl'>Bicep Curl</CardTitle>
          </CardHeader>
          <CardDescription className='text-muted-foreground text-md'>
            Correct your bicep curl form, and keep track of reps.
          </CardDescription>
          <CardFooter className='flex justify-end'>
            <Link href='/workout/bicep-curl' className='w-full'>
              <Button className='w-full max-w-3xl'  >
                <p className='text-lg'>Start Workout</p>
              </Button>
            </Link>
            
          </CardFooter>
        </Card>
          
        <Card className='w-full p-6'> 
          <CardHeader>
            <CardTitle className='text-2xl'>Should Press</CardTitle>
          </CardHeader>
          <CardDescription className='text-muted-foreground text-xl'>
            Coming Soon...
          </CardDescription>
        </Card>

        <Card className='w-full p-6'>
          <CardHeader>
            <CardTitle className='text-2xl'>Squats</CardTitle>
          </CardHeader>
          <CardDescription className='text-muted-foreground text-xl'>
            Coming Soon...
          </CardDescription>

        </Card>

      </div>
    </div>
  )
}

export default page