import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { TimerDisplay } from '../../../../components/scoreboards/TimerDisplay';
import { PlayerStatsDisplay } from '../../../../components/scoreboards/PlayerStatsDisplay';
import { Dialog } from '../../../../components/ui/dialog';
import { Users } from 'lucide-react';

export default function BasketballScoreboard({ match, teamAPlayers, teamBPlayers, onUpdate }) {
  const [matchData, setMatchData] = useState({
    status: 'NOT_STARTED', // NOT_STARTED, Q1, Q2, Q3, Q4, OVERTIME, FINISHED
    currentTime: '10:00', // Basketball uses countdown
    quarter: 1,
    teamAScore: 0,
    teamBScore: 0,
    teamAFouls: 0,
    teamBFouls: 0,
    teamATimeouts: 4,
    teamBTimeouts: 4,
    events: [] // {type: 'POINT'|'FOUL'|'TIMEOUT', team: 'A'|'B', player: {}, points: number, time: ''}
  });

  const [showPlayerStats, setShowPlayerStats] = useState(false);

  const addEvent = (type, team, points = null, player = null) => {
    setMatchData(prev => ({
      ...prev,
      events: [...prev.events, {
        type,
        team,
        player,
        points,
        time: prev.currentTime,
        quarter: prev.quarter,
        timestamp: new Date().toISOString()
      }],
      ...(type === 'POINT' && {
        [`team${team}Score`]: prev[`team${team}Score`] + points
      }),
      ...(type === 'FOUL' && {
        [`team${team}Fouls`]: prev[`team${team}Fouls`] + 1
      })
    }));
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
            <div className="flex flex-col gap-2">
              <div className="text-sm">Fouls: {matchData.teamAFouls}</div>
              <div className="text-sm">Timeouts: {matchData.teamATimeouts}</div>
            </div>
          </div>

          {/* Match Info */}
          <div className="text-center">
            <div className="text-xl font-medium mb-2">Quarter {matchData.quarter}</div>
            <TimerDisplay
              initialTime="10:00"
              isCountdown={true}
              onTimeUpdate={(time) => setMatchData(prev => ({ ...prev, currentTime: time }))}
              disabled={matchData.status === 'FINISHED'}
            />
          </div>

          {/* Team B */}
          <div className="text-center">
            <h3 className="font-medium mb-2">{match.awayTeam}</h3>
            <div className="text-5xl font-bold mb-2">{matchData.teamBScore}</div>
            <div className="flex flex-col gap-2">
              <div className="text-sm">Fouls: {matchData.teamBFouls}</div>
              <div className="text-sm">Timeouts: {matchData.teamBTimeouts}</div>
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
            <Button onClick={() => addEvent('POINT', 'A', 3)}>3 Points</Button>
            <Button onClick={() => addEvent('POINT', 'A', 2)}>2 Points</Button>
            <Button onClick={() => addEvent('POINT', 'A', 1)}>Free Throw</Button>
            <Button variant="destructive" onClick={() => addEvent('FOUL', 'A')}>
              Add Foul
            </Button>
          </div>
        </div>

        {/* Team B Controls */}
        <div className="space-y-4">
          <h3 className="font-medium">{match.awayTeam} Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => addEvent('POINT', 'B', 3)}>3 Points</Button>
            <Button onClick={() => addEvent('POINT', 'B', 2)}>2 Points</Button>
            <Button onClick={() => addEvent('POINT', 'B', 1)}>Free Throw</Button>
            <Button variant="destructive" onClick={() => addEvent('FOUL', 'B')}>
              Add Foul
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
                    {event.type === 'POINT' && '🏀'}
                    {event.type === 'FOUL' && '❌'}
                    {event.type === 'TIMEOUT' && '⏰'}
                    <span>
                      {event.team === 'A' ? match.homeTeam : match.awayTeam}
                      {event.type === 'POINT' && ` (${event.points} pts)`}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">Q{event.quarter} - {event.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPlayerStats} onOpenChange={setShowPlayerStats}>
        <PlayerStatsDisplay
          players={[...teamAPlayers, ...teamBPlayers]}
          gameType="basketball"
          events={matchData.events}
        />
      </Dialog>
    </div>
  );
} 