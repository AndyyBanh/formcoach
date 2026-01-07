import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <div className="flex flex-col items-center">
        <h1 className="text-5xl uppercase font-bold">The future of working out</h1> 
        <p className="mt-2 text-2xl">Ensure your not leaving gains on the table.</p>
        
        <div className="mt-4">
          <Link href='/signup'>
            <Button variant='outline' size='lg' className="bg-blue-500 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="mt-50 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold tracking-wider">The Problem</h2>
          <p className="text-lg mx-auto">Without proper form, your fitness journey will be filled with obstacles</p>
          <div className="flex mt-5 space-x-3.5 max-w-3xl">
            <Card className="shadow-xl">
              <div className="p-5">
                <CardTitle className="text-xl">Risk of Injury</CardTitle>
                <CardDescription>
                  <p>Improper form puts you at higher risk of serious injury.</p>
                </CardDescription>
              </div>
            </Card>
            <Card className="shadow-xl">
              <div className="p-5">
                <CardTitle className="text-xl">Slower Progress</CardTitle>
                <CardDescription>
                  <p>Without proper form, you're leaving gains on table.</p>
                </CardDescription>
              </div>
            </Card>
            <Card className="shadow-xl">
              <div className="p-5">
                <CardTitle className="text-xl">Expensive Coaches</CardTitle>
                <CardDescription>
                  <p>Professional trainers cost around $50-150 per session. Making professional guidance out of reach.</p>
                </CardDescription>
              </div>
            </Card>
          </div>   

          <div className="mt-15 bg-blue-50 rounded-2xl p-8 border border-blue-100 shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">70% of gym-goers</span> report feeling uncertain about their form, 
                and <span className="font-semibold text-gray-900">45% have experienced</span> an injury due to improper technique. 
                It's time for a better solution.
              </p>
            </div>
          </div>    
        </div>
        
     </div>
     
    </div>
  );
}
