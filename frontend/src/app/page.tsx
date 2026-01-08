import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <section className="h-screen flex items-center justify-center px-4 pt-15">
        <div className="flex flex-col items-center max-w-6xl mx-auto">
        <h1 className="text-5xl uppercase font-bold text-center">The future of working out</h1> 
        <p className="mt-4 text-2xl text-center">Ensure you're not leaving gains on the table.</p>
        
        <div className="mt-5">
          <Link href='/signup'>
            <Button variant='outline' size='lg' className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      </section>
     
      <section className="min-h-3/4 flex items-center justify-center px-4 py-15">
        <div className="flex flex-col justify-center items-center w-full max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold tracking-wider">The Problem</h2>
          <p className="text-xl md:text-2xl mx-auto mt-2 text-center text-gray-700">Without proper form, your fitness journey will be filled with obstacles</p>
          
          <div className="flex flex-wrap justify-center mt-8 gap-6 w-full">
            <Card className="shadow-xl flex-1 min-w-[250px] max-w-[320px]">
              <div className="p-5">
                <CardTitle className="text-xl mb-2">Risk of Injury</CardTitle>
                <CardDescription>
                  <p>Improper form puts you at higher risk of serious injury.</p>
                </CardDescription>
              </div>
            </Card>
            <Card className="shadow-xl flex-1 min-w-[250px] max-w-[320px]">
              <div className="p-5">
                <CardTitle className="text-xl mb-2">Slower Progress</CardTitle>
                <CardDescription>
                  <p>Without proper form, you're leaving gains on table.</p>
                </CardDescription>
              </div>
            </Card>
            <Card className="shadow-xl flex-1 min-w-[250px] max-w-[320px]">
              <div className="p-5">
                <CardTitle className="text-xl mb-2">Expensive Coaches</CardTitle>
                <CardDescription>
                  <p>Professional trainers cost around $50-150 per session. Making professional guidance out of reach.</p>
                </CardDescription>
              </div>
            </Card>
          </div>   

          <div className="mt-16 bg-blue-50 rounded-2xl p-8 border border-blue-100 shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">70% of gym-goers</span> report feeling uncertain about their form, 
                and <span className="font-semibold text-gray-900">45% have experienced</span> an injury due to improper technique. 
                It's time for a better solution.
              </p>
            </div>
          </div>    
        </div>
      </section>
        

      <section className="min-h-3/4 flex items-center justify-center px-4 py-15">
        <div className="">
          <h2 className="text-4xl font-bold tracking-wider">Our Solution</h2>
        </div>
        <div>
          
        </div>
      </section>
        
     </div>
     
  
  );
}
