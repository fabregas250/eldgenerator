import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Dialog } from '../../../../components/ui/dialog';
import { PlayerStatsDisplay } from '../../../../components/scoreboards/PlayerStatsDisplay';
import { Users, RotateCcw } from 'lucide-react';

export default function VolleyballScoreboard({ match, teamAPlayers, teamBPlayers, onUpdate }) {
  const [matchData, setMatchData] = useState({
    status: 'NOT_STARTED', // NOT_STARTED, IN_PROGRESS, FINISHED
    currentSet: 1,
    teamAScore: 0,
    teamBScore: 0,
    teamASets: 0,
    teamBSets: 0,
    setScores: [], // [{teamA: 25, teamB: 23}, {teamA: 25, teamB: 20}, etc]
    serving: null, // 'A' or 'B'
    timeouts: {
      A: 2, // 2 timeouts per set
      B: 2
    },
    events: [] // {type: 'POINT'|'TIMEOUT'|'SET_WIN', team: 'A'|'B', player: {}, time: ''}
  });

  const [showPlayerStats, setShowPlayerStats] = useState(false);

  const addPoint = (team) => {
    setMatchData(prev => {
      const newScore = prev[`team${team}Score`] + 1;
      const isSetPoint = (newScore >= 25 && newScore - prev[`team${team === 'A' ? 'B' : 'A'}Score`] >= 2) ||
                        (prev.currentSet === 5 && newScore >= 15 && newScore - prev[`team${team === 'A' ? 'B' : 'A'}Score`] >= 2);

      if (isSetPoint) {
        return handleSetWin(team, prev);
      }

      return {
        ...prev,
        [`team${team}Score`]: newScore,
        serving: team,
        events: [...prev.events, {
          type: 'POINT',
          team,
          time: new Date().toISOString(),
          score: `${team === 'A' ? newScore : prev.teamAScore}-${team === 'B' ? newScore : prev.teamBScore}`
        }]
      };
    });
  };

  const handleSetWin = (team, prevData) => {
    const newSetScores = [...prevData.setScores, {
      teamA: prevData.teamAScore,
      teamB: prevData.teamBScore
    }];

    const newSets = prevData[`team${team}Sets`] + 1;
    const isMatchWin = newSets >= 3;

    return {
      ...prevData,
      [`team${team}Sets`]: newSets,
      setScores: newSetScores,
      status: isMatchWin ? 'FINISHED' : 'IN_PROGRESS',
      currentSet: isMatchWin ? prevData.currentSet : prevData.currentSet + 1,
      teamAScore: 0, // Reset scores for new set
      teamBScore: 0,
      timeouts: { // Reset timeouts for new set
        A: 2,
        B: 2
      },
      events: [...prevData.events, {
        type: 'SET_WIN',
        team,
        setNumber: prevData.currentSet,
        score: `${prevData.teamAScore}-${prevData.teamBScore}`,
        time: new Date().toISOString()
      }]
    };
  };

  const useTimeout = (team) => {
    if (matchData.timeouts[team] > 0) {
      setMatchData(prev => ({
        ...prev,
        timeouts: {
          ...prev.timeouts,
          [team]: prev.timeouts[team] - 1
        },
        events: [...prev.events, {
          type: 'TIMEOUT',
          team,
          time: new Date().toISOString()
        }]
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="grid grid-cols-3 gap-4">
          {/* Team A */}
          <div className="text-center">
            <h3 className="font-medium mb-2">{match.homeTeam}</h3>
            <div className="text-5xl font-bold mb-2">{matchData.teamAScore}</div>
            <div className="text-xl font-semibold">Sets: {matchData.teamASets}</div>
            <div className="mt-2">
              <span className="text-sm">Timeouts: {matchData.timeouts.A}</span>
              {matchData.serving === 'A' && (
                <span className="ml-2 inline-block w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
              )}
            </div>
          </div>

          {/* Center Info */}
          <div className="text-center">
            <div className="text-xl font-medium mb-2">Set {matchData.currentSet}</div>
            <div className="space-y-2">
              {matchData.setScores.map((set, index) => (
                <div key={index} className="text-sm">
                  Set {index + 1}: {set.teamA}-{set.teamB}
                </div>
              ))}
            </div>
          </div>

          {/* Team B */}
          <div className="text-center">
            <h3 className="font-medium mb-2">{match.awayTeam}</h3>
            <div className="text-5xl font-bold mb-2">{matchData.teamBScore}</div>
            <div className="text-xl font-semibold">Sets: {matchData.teamBSets}</div>
            <div className="mt-2">
              <span className="text-sm">Timeouts: {matchData.timeouts.B}</span>
              {matchData.serving === 'B' && (
                <span className="ml-2 inline-block w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-6">
        {/* Team A Controls */}
        <div className="space-y-4">
          <h3 className="font-medium">{match.homeTeam} Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => addPoint('A')} 
              className="w-full col-span-2 h-16 text-lg"
              disabled={matchData.status === 'FINISHED'}
            >
              Add Point
            </Button>
            <Button 
              onClick={() => useTimeout('A')} 
              variant="outline"
              disabled={matchData.timeouts.A === 0 || matchData.status === 'FINISHED'}
              className="w-full"
            >
              Timeout
            </Button>
            <Button 
              onClick={() => setMatchData(prev => ({ ...prev, serving: 'A' }))}
              variant={matchData.serving === 'A' ? 'default' : 'outline'}
              className="w-full"
            >
              Service
            </Button>
          </div>
        </div>

        {/* Team B Controls */}
        <div className="space-y-4">
          <h3 className="font-medium">{match.awayTeam} Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => addPoint('B')} 
              className="w-full col-span-2 h-16 text-lg"
              disabled={matchData.status === 'FINISHED'}
            >
              Add Point
            </Button>
            <Button 
              onClick={() => useTimeout('B')} 
              variant="outline"
              disabled={matchData.timeouts.B === 0 || matchData.status === 'FINISHED'}
              className="w-full"
            >
              Timeout
            </Button>
            <Button 
              onClick={() => setMatchData(prev => ({ ...prev, serving: 'B' }))}
              variant={matchData.serving === 'B' ? 'default' : 'outline'}
              className="w-full"
            >
              Service
            </Button>
          </div>
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">Match Events</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPlayerStats(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Player Stats
          </Button>
        </div>
        <div className="p-4">
          {matchData.events.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No events recorded yet
            </div>
          ) : (
            <div className="space-y-2">
              {matchData.events.map((event, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    {event.type === 'POINT' && '🏐'}
                    {event.type === 'TIMEOUT' && '⏰'}
                    {event.type === 'SET_WIN' && '🏆'}
                    <span>
                      {event.team === 'A' ? match.homeTeam : match.awayTeam}
                      {event.type === 'POINT' && ` (${event.score})`}
                      {event.type === 'SET_WIN' && ` wins set ${event.setNumber}`}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(event.time).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPlayerStats} onOpenChange={setShowPlayerStats}>
        <PlayerStatsDisplay
          players={[...teamAPlayers, ...teamBPlayers]}
          gameType="volleyball"
          events={matchData.events}
        />
      </Dialog>
    </div>
  );
} 