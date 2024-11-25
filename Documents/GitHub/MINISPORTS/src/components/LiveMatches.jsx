import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { matchOperatorService } from '../features/match-operator/services/matchOperatorService';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

function LiveMatches() {
  const [liveMatches, setLiveMatches] = useState([]);
  const navigate = useNavigate();
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  // Set up real-time updates
  useEffect(() => {
    // Initial fetch
    fetchLiveMatches();

    // Set up polling for updates every 30 seconds
    const interval = setInterval(fetchLiveMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      const matches = await matchOperatorService.getMatches();
      const livematches = matches.filter(match => match.status === 'LIVE');
      setLiveMatches(livematches);
    } catch (error) {
      console.error('Error fetching live matches:', error);
    }
  };

  const getScoreDisplay = (match) => {
    switch (match.gameType) {
      case 'basketball':
        return `${match.homeTeam.score} - ${match.awayTeam.score}`;
      case 'volleyball':
        return `${match.homeTeam.score} - ${match.awayTeam.score}`;
      case 'football':
        return `${match.homeTeam.score} - ${match.awayTeam.score}`;
      default:
        return '0 - 0';
    }
  };

  const getSportIcon = (gameType) => {
    switch (gameType) {
      case 'basketball':
        return '🏀';
      case 'volleyball':
        return '🏐';
      case 'football':
        return '⚽';
      default:
        return '🎮';
    }
  };

  if (liveMatches.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Live Matches</h3>
        <p className="text-gray-500">There are no matches being played right now.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Live Matches</h2>
        <button 
          onClick={() => navigate('/match-operator')} 
          className="text-gray-500 hover:text-gray-600 flex items-center text-base"
        >
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
          {liveMatches.map((match) => (
            <CarouselItem 
              key={match.id} 
              className="pl-4 basis-1/4"
            >
              <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    {match.competition}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    LIVE {getSportIcon(match.gameType)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={match.homeTeam.logo} 
                        alt={match.homeTeam.name} 
                        className="w-8 h-8 object-contain"
                      />
                      <span className="font-medium">{match.homeTeam.name}</span>
                    </div>
                    <span className="text-xl font-bold">{match.homeTeam.score}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={match.awayTeam.logo} 
                        alt={match.awayTeam.name} 
                        className="w-8 h-8 object-contain"
                      />
                      <span className="font-medium">{match.awayTeam.name}</span>
                    </div>
                    <span className="text-xl font-bold">{match.awayTeam.score}</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">{match.venue}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute -right-4 top-1/2 transform -translate-y-1/2" />
      </Carousel>
    </div>
  );
}

export default LiveMatches; 