import React from 'react';
import { 
  FileText, 
  Users, 
  Award,
  Building2,
  Flag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { useTourism } from '../contexts/TourismContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { events } = useTourism();
  
  // Transform events for calendar display
  const upcomingEvents = events
    .filter(event => new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5); // Get next 5 upcoming events

  // Stats data for first row
  const statsRow1 = [
    { 
      number: '6', 
      label: 'Federations', 
      icon: FileText, 
      color: 'bg-blue-100 text-blue-600',
      path: '/federations'
    },
    { 
      number: '6', 
      label: 'Clubs', 
      icon: Users, 
      color: 'bg-purple-100 text-purple-600',
      path: '/federations'
    },
    { 
      number: '43', 
      label: 'Club Players', 
      icon: Award, 
      color: 'bg-green-100 text-green-600',
      path: '/federations'
    },
    { 
      number: '78', 
      label: 'Sport Teams', 
      icon: Building2, 
      color: 'bg-orange-100 text-orange-600',
      path: '/national-teams'
    },
    { 
      number: '12', 
      label: 'Team Players', 
      icon: Flag, 
      color: 'bg-green-100 text-green-600',
      path: '/national-teams'
    },
    { 
      number: '23', 
      label: 'Officials & Players', 
      icon: Flag, 
      color: 'bg-green-100 text-green-600',
      path: '/sports-professionals'
    }
  ];

  // Stats data for second row
  const statsRow2 = [
    { 
      number: '09', 
      label: 'Isonga program', 
      icon: Award, 
      color: 'bg-red-100 text-red-600',
      path: '/isonga-programs'
    },
    { 
      number: '45', 
      label: 'Students', 
      icon: FileText, 
      color: 'bg-indigo-100 text-indigo-600',
      path: '/isonga-programs'
    },
    { 
      number: '12', 
      label: 'Infrastructure', 
      icon: Building2, 
      color: 'bg-green-100 text-green-600',
      path: '/infrastructure'
    },
    { 
      number: '23', 
      label: 'Documents', 
      icon: FileText, 
      color: 'bg-indigo-100 text-indigo-600',
      path: '/documents'
    },
    { 
      number: '6', 
      label: 'Appointments', 
      icon: CalendarIcon, 
      color: 'bg-yellow-100 text-yellow-600',
      path: '/appointments'
    },
    { 
      number: '6', 
      label: 'Employees', 
      icon: FileText, 
      color: 'bg-indigo-100 text-indigo-600',
      path: '/employee'
    }
  ];

  // Federation Performance Data
  const federationData = {
    labels: ['Football', 'Basketball', 'Volleyball', 'Rugby', 'Athletics', 'Swimming'],
    datasets: [
      {
        label: 'Active Athletes',
        data: [450, 320, 280, 220, 180, 150],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'International Events',
        data: [12, 8, 6, 5, 7, 4],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      }
    ]
  };

  // Sports Professionals Distribution
  const professionalsData = {
    labels: ['Coaches', 'Referees', 'Medical Staff', 'Technical Staff', 'Administrators'],
    datasets: [{
      data: [120, 85, 45, 65, 35],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
    }]
  };

  // National Teams Performance
  const teamsPerformanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'International Wins',
        data: [5, 7, 4, 8, 6, 9],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Rankings Improvement',
        data: [3, 5, 4, 6, 8, 7],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#fff' : '#000',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const renderUpcomingEventsCalendar = () => (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Upcoming Sports Tourism Events
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/sports-tourism')}
          className="text-sm"
        >
          View All Events
        </Button>
      </div>

      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <div 
              key={event.id}
              className={`flex items-center p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              {/* Date Display */}
              <div className="flex-shrink-0 w-16 text-center">
                <div className={`rounded-t-md ${
                  isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                } px-2 py-1`}>
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-blue-100' : 'text-blue-700'
                  }`}>
                    {format(new Date(event.startDate), 'MMM')}
                  </span>
                </div>
                <div className={`rounded-b-md ${
                  isDarkMode ? 'bg-blue-800' : 'bg-blue-50'
                } px-2 py-1`}>
                  <span className={`text-xl font-bold ${
                    isDarkMode ? 'text-blue-100' : 'text-blue-700'
                  }`}>
                    {format(new Date(event.startDate), 'd')}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="ml-4 flex-grow">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.name}
                </h4>
                <div className="flex items-center mt-1 space-x-4">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(new Date(event.startDate), 'h:mm a')}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {event.location.district}, {event.location.province}
                  </span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="flex-shrink-0 ml-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.category === 'Sports Events' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : event.category === 'Adventure Sports'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                  {event.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No upcoming events scheduled
          </div>
        )}
      </div>
    </div>
  );

  const AppointmentRequests = () => {
    const { isDarkMode } = useDarkMode();
    
    // Sample appointment requests data
    const requests = [
      {
        id: 1,
        name: "John Doe",
        purpose: "Sports Federation Meeting",
        date: "2024-03-20",
        time: "10:00 AM",
        status: "pending"
      },
      {
        id: 2,
        name: "Jane Smith",
        purpose: "Team Registration",
        date: "2024-03-21",
        time: "2:00 PM",
        status: "approved"
      },
      {
        id: 3,
        name: "Mike Johnson",
        purpose: "Tournament Planning",
        date: "2024-03-22",
        time: "11:30 AM",
        status: "pending"
      }
    ];

    return (
      <div className={`${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-sm p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Appointment Requests
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/appointments')}
            className={`text-sm ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
          >
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div 
              key={request.id}
              className={`p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
              } transition-colors cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {request.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {request.purpose}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  request.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {request.date}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {request.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`p-6 space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Stats Grid */}
      <div className="space-y-3">
        {/* First Row of Stats */}
        <div className="grid grid-cols-6 gap-3">
          {statsRow1.map((stat, index) => (
            <div 
              key={index} 
              className={`${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md`}
              onClick={() => navigate(stat.path)}
            >
              <div className={`${stat.color} p-2 rounded-full mb-2`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.number}
              </span>
              <span className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Second Row of Stats */}
        <div className="grid grid-cols-6 gap-3">
          {statsRow2.map((stat, index) => (
            <div 
              key={index} 
              className={`${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md`}
              onClick={() => navigate(stat.path)}
            >
              <div className={`${stat.color} p-2 rounded-full mb-2`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.number}
              </span>
              <span className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Events and Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderUpcomingEventsCalendar()}
        <AppointmentRequests />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Federation Performance */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-sm p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Federation Performance
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12.5%
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <Bar data={federationData} options={chartOptions} />
          </div>
        </div>

        {/* Sports Professionals Distribution */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-sm p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sports Professionals Distribution
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +8.3%
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <Doughnut 
              data={professionalsData} 
              options={{
                ...chartOptions,
                cutout: '60%',
              }} 
            />
          </div>
        </div>

        {/* National Teams Performance */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-sm p-6 lg:col-span-2`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              National Teams Performance Trend
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +15.2%
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={teamsPerformanceData} options={chartOptions} />
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-sm p-6 lg:col-span-2`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/50">
              <p className="text-sm text-blue-600 dark:text-blue-400">Active Athletes</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">2,845</p>
              <p className="text-xs text-blue-500">+12% from last month</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/50">
              <p className="text-sm text-green-600 dark:text-green-400">International Events</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">42</p>
              <p className="text-xs text-green-500">+8% from last month</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/50">
              <p className="text-sm text-purple-600 dark:text-purple-400">Professional Staff</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">350</p>
              <p className="text-xs text-purple-500">+5% from last month</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/50">
              <p className="text-sm text-orange-600 dark:text-orange-400">Rankings Improved</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">15</p>
              <p className="text-xs text-orange-500">+3 from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 