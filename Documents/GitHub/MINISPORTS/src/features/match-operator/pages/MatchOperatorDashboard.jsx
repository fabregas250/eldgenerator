import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Plus, Timer, Users2, Settings2, BarChart, Calendar } from 'lucide-react';
import { CreateMatchModal } from '../components/CreateMatchModal';
import { MatchScoreboard } from '../components/MatchScoreboard';
import { useNavigate } from 'react-router-dom';

export function MatchOperatorDashboard() {
  const [matches, setMatches] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    upcomingMatches: 0,
    completedMatches: 0
  });
  const navigate = useNavigate();

  // Quick Actions
  const quickActions = [
    {
      title: "Create Match",
      icon: Plus,
      color: "bg-blue-500",
      onClick: () => setShowCreateModal(true)
    },
    {
      title: "Manage Teams",
      icon: Users2,
      color: "bg-purple-500",
      onClick: () => navigate('/match-operator/teams')
    },
    {
      title: "Schedule Match",
      icon: Calendar,
      color: "bg-green-500",
      onClick: () => console.log("Schedule")
    },
    {
      title: "Settings",
      icon: Settings2,
      color: "bg-gray-500",
      onClick: () => console.log("Settings")
    }
  ];

  // Stats Cards
  const statsCards = [
    {
      title: "Total Matches",
      value: stats.totalMatches,
      icon: BarChart,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Live Matches",
      value: stats.liveMatches,
      icon: Timer,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      title: "Upcoming",
      value: stats.upcomingMatches,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Completed",
      value: stats.completedMatches,
      icon: BarChart,
      color: "text-gray-500",
      bgColor: "bg-gray-50"
    }
  ];

  // Temporary data
  const tempMatches = [
    {
      id: 1,
      competition: 'RPL | Match - 8',
      gameType: 'football',
      homeTeam: {
        name: 'APR FC',
        logo: '/teams/apr.png',
        score: 2
      },
      awayTeam: {
        name: 'Amagaju',
        logo: '/teams/amagaju.png',
        score: 1
      },
      status: 'LIVE',
      venue: 'Amahoro Stadium',
      startTime: new Date().toISOString()
    },
    {
      id: 2,
      competition: 'RBL Game - 4',
      gameType: 'basketball',
      homeTeam: {
        name: 'REG',
        logo: '/teams/reg.png',
        score: 78
      },
      awayTeam: {
        name: 'Patriots',
        logo: '/teams/patriots.png',
        score: 72
      },
      status: 'LIVE',
      venue: 'BK Arena',
      startTime: new Date().toISOString()
    },
    {
      id: 3,
      competition: 'FRVB League',
      gameType: 'volleyball',
      homeTeam: {
        name: 'Gisagara VC',
        logo: '/teams/gisagara.png',
        score: 2
      },
      awayTeam: {
        name: 'UTB VC',
        logo: '/teams/utb.png',
        score: 1
      },
      status: 'UPCOMING',
      venue: 'Petit Stade',
      startTime: new Date(Date.now() + 86400000).toISOString() // Tomorrow
    }
  ];

  useEffect(() => {
    // Use temporary data instead of API call
    setMatches(tempMatches);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Update stats whenever matches change
    setStats({
      totalMatches: matches.length,
      liveMatches: matches.filter(m => m.status === 'LIVE').length,
      upcomingMatches: matches.filter(m => m.status === 'UPCOMING').length,
      completedMatches: matches.filter(m => m.status === 'COMPLETED').length
    });
  }, [matches]);

  const renderMatchCard = (match) => (
    <div 
      key={match.id}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedMatch(match)}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">{match.competition}</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          match.status === 'LIVE' ? 'bg-red-100 text-red-600' :
          match.status === 'UPCOMING' ? 'bg-blue-100 text-blue-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {match.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={match.homeTeam.logo} alt="" className="w-8 h-8" />
            <span className="font-medium">{match.homeTeam.name}</span>
          </div>
          <span className="text-xl font-bold">{match.homeTeam.score}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={match.awayTeam.logo} alt="" className="w-8 h-8" />
            <span className="font-medium">{match.awayTeam.name}</span>
          </div>
          <span className="text-xl font-bold">{match.awayTeam.score}</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">{match.venue}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Match Operator Dashboard</h1>
          <p className="text-gray-500">Manage and monitor all sports matches</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-opacity flex items-center justify-between`}
          >
            <span className="font-medium">{action.title}</span>
            <action.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${stat.bgColor} flex items-center justify-between`}
          >
            <div>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Matches Tabs */}
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger value="live">Live Matches</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches
              .filter(match => match.status === 'LIVE')
              .map(renderMatchCard)}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches
              .filter(match => match.status === 'UPCOMING')
              .map(renderMatchCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches
              .filter(match => match.status === 'COMPLETED')
              .map(renderMatchCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showCreateModal && (
        <CreateMatchModal 
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onMatchCreated={(matchData) => {
            const newMatch = {
              id: matches.length + 1,
              ...matchData,
              status: 'UPCOMING',
              homeTeam: {
                name: matchData.homeTeam,
                logo: '/teams/default.png',
                score: 0
              },
              awayTeam: {
                name: matchData.awayTeam,
                logo: '/teams/default.png',
                score: 0
              }
            };
            setMatches(prev => [...prev, newMatch]);
            setShowCreateModal(false);
          }}
        />
      )}

      {selectedMatch && (
        <MatchScoreboard
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onUpdate={(updates) => {
            setMatches(prev => prev.map(match => 
              match.id === selectedMatch.id ? { ...match, ...updates } : match
            ));
          }}
        />
      )}
    </div>
  );
}

export default MatchOperatorDashboard; 