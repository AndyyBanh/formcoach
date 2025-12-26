import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <div className="flex flex-col items-center">
        <h1 className="text-5xl uppercase font-bold">The future of working out</h1> 
        <p>Ensure your not leaving gains on the table.</p>
        
        <div className="mt-4">
          <Link href='/signup'>
            <Button variant='outline' size='lg'>
              Get Started
            </Button>
          </Link>
          
        </div>
        
     </div>
     
    </div>
  );
}
