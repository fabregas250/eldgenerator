import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

function SportsEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const sportsEvents = [
    {
      id: 1,
      title: 'BASKETBALL AFRICA LEAGUE 2024',
      subtitle: 'The biggest show in basketball is coming to Kigali',
      image: '/events/bal.jpg',
      startDate: '2024-03-25T10:00:00',
      endDate: '2024-04-10T18:00:00',
      category: 'BASKETBALL AFRICA LEAGUE 2024',
      time: '04:22'
    },
    {
      id: 2,
      title: 'VETERANS CLUB WORLD CUP 2024',
      subtitle: '150 football legends live in Kigali',
      image: '/events/vcwc.jpg',
      startDate: '2024-03-15T14:00:00',
      endDate: '2024-03-20T22:00:00',
      category: 'VETERANS CLUB WORLD CUP 2024',
      time: '04:22'
    },
    {
      id: 3,
      title: 'FIFA CONGRESS',
      subtitle: '73rd fifa congress',
      image: '/events/fifa.jpg',
      startDate: '2024-05-17T09:00:00',
      endDate: '2024-05-17T17:00:00',
      category: 'FIFA CONGRESS',
      time: '04:22'
    },
    {
      id: 4,
      title: 'RWANDA SUMMER GOLF',
      subtitle: 'Falcon & Country club presents Rwanda summer golf',
      image: '/events/golf.jpg',
      startDate: '2024-06-01T09:00:00',
      endDate: '2024-06-03T17:00:00',
      category: 'RWANDA SUMMER GOLF',
      time: '04:22'
    },
    {
      id: 5,
      title: 'WORLD TENNIS TOUR JUNIORS',
      subtitle: 'IPRC Kigali ecology club',
      image: '/events/tennis.jpg',
      startDate: '2024-04-22T09:00:00',
      endDate: '2024-04-24T17:00:00',
      category: 'WORLD TENNIS TOUR JUNIORS',
      time: '04:22'
    }
  ];

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now >= start && now <= end) {
      return 'LIVE';
    } else if (now < start) {
      return 'UPCOMING';
    } else {
      return 'PAST';
    }
  };

  useEffect(() => {
    const processedEvents = sportsEvents.map(event => ({
      ...event,
      status: getEventStatus(event.startDate, event.endDate)
    }));
    setEvents(processedEvents);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Sports Event</h2>
        <button 
          onClick={() => navigate('/events')} 
          className="text-red-500 hover:text-red-600 flex items-center text-base"
        >
          View all
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {events.map((event) => (
          <div key={event.id} className="relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90"></div>
              
              {/* Time badge */}
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {event.time}
              </div>
              
              {/* Text content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="text-xs mb-2">{event.category}</div>
                <h3 className="font-bold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-200">{event.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SportsEvents; 