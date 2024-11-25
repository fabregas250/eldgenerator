import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

function LeaguesToBrowse() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const leagues = [
    { 
      id: 'rpl', 
      name: 'RPL', 
      logo: '/leagues/rpl.png', 
      bgColor: 'bg-[#00205B]',
      pattern: 'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)]'
    },
    { 
      id: 'rbl', 
      name: 'RBL', 
      logo: '/leagues/rbl.png', 
      bgColor: 'bg-[#00B2FF]',
      pattern: 'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)]'
    },
    { 
      id: 'frvb', 
      name: 'FRVB', 
      logo: '/leagues/frvb.png', 
      bgColor: 'bg-[#4B0082]',
      pattern: 'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)]'
    },
    { 
      id: 'trdr', 
      name: 'Tour Du Rwanda', 
      logo: '/leagues/trdr.png', 
      bgColor: 'bg-white',
      pattern: 'bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.05)_0%,_transparent_100%)]',
      textColor: 'text-[#1B2559]'
    },
    { 
      id: 'bal', 
      name: 'Rwanda Handball League', 
      logo: '/leagues/bal.png', 
      bgColor: 'bg-[#008000]',
      pattern: 'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)]'
    },
    { 
      id: 'npc', 
      name: 'NPC', 
      logo: '/leagues/npc.png', 
      bgColor: 'bg-[#808080]',
      pattern: 'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_100%)]'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Leagues To Browse</h2>
        <button className="text-gray-500 hover:text-gray-600 flex items-center text-base">
          View all
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {leagues.map((league) => (
            <CarouselItem 
              key={league.id} 
              className="pl-4 basis-1/6"
            >
              <div
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 ${league.bgColor}`}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 ${league.pattern}`}></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <img
                    src={league.logo}
                    alt={league.name}
                    className="w-16 h-16 object-contain mb-4"
                  />
                  <span className={`text-lg font-semibold ${league.textColor || 'text-white'}`}>
                    {league.name}
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <CarouselNext className="h-8 w-8 rounded-full bg-white shadow-md" />
        </div>
      </Carousel>
    </div>
  );
}

export default LeaguesToBrowse; 