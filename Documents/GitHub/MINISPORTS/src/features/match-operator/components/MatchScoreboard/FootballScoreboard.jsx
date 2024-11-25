import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { TimerDisplay } from '../../../../components/scoreboards/TimerDisplay';
import { PlayerStatsDisplay } from '../../../../components/scoreboards/PlayerStatsDisplay';
import { TeamStatsDisplay } from '../../../../components/scoreboards/TeamStatsDisplay';
import { Dialog } from '../../../../components/ui/dialog';
import { Timer, Users, ChevronRight } from 'lucide-react';

export default function FootballScoreboard({ match, teamAPlayers, teamBPlayers, onUpdate }) {
  const [matchData, setMatchData] = useState({
    status: 'NOT_STARTED', // NOT_STARTED, FIRST_HALF, HALF_TIME, SECOND_HALF, FULL_TIME
    currentTime: '00:00',
    teamAScore: 0,
    teamBScore: 0,
    events: [] // {type: 'GOAL'|'YELLOW_CARD'|'RED_CARD', team: 'A'|'B', player: {}, minute: ''}
  });

  const [showPlayerStats, setShowPlayerStats] = useState(false);

  const addEvent = (type, team, player = null) => {
    setMatchData(prev => ({
      ...prev,
      events: [...prev.events, {
        type,
        team,
        player,
        minute: prev.currentTime,
        timestamp: new Date().toISOString()
      }],
      ...(type === 'GOAL' && {
        [`team${team}Score`]: prev[`team${team}Score`] + 1
      })
    }));
  };

  const renderScoreboard = () => (
    <div className="bg-gray-50 p-6 rounded-xl mb-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Team A */}
        <div className="text-center">
          <h3 className="font-medium mb-2">{match.homeTeam}</h3>
          <div className="text-5xl font-bold mb-2">{matchData.teamAScore}</div>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addEvent('GOAL', 'A')}
            >
              ⚽ Goal
            </Button>
          </div>
        </div>

        {/* Match Info */}
        <div className="text-center">
          <TimerDisplay
            initialTime="00:00"
            isCountdown={false}
            onTimeUpdate={(time) => setMatchData(prev => ({ ...prev, currentTime: time }))}
            disabled={matchData.status === 'FULL_TIME'}
          />
          <div className="mt-2 text-sm text-gray-500">
            {matchData.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Team B */}
        <div className="text-center">
          <h3 className="font-medium mb-2">{match.awayTeam}</h3>
          <div className="text-5xl font-bold mb-2">{matchData.teamBScore}</div>
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addEvent('GOAL', 'B')}
            >
              ⚽ Goal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Team A Controls */}
      <div className="space-y-4">
        <h3 className="font-medium">{match.homeTeam} Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            onClick={() => addEvent('YELLOW_CARD', 'A')}
          >
            🟨 Yellow Card
          </Button>
          <Button
            variant="destructive"
            onClick={() => addEvent('RED_CARD', 'A')}
          >
            🟥 Red Card
          </Button>
        </div>
      </div>

      {/* Team B Controls */}
      <div className="space-y-4">
        <h3 className="font-medium">{match.awayTeam} Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            onClick={() => addEvent('YELLOW_CARD', 'B')}
          >
            🟨 Yellow Card
          </Button>
          <Button
            variant="destructive"
            onClick={() => addEvent('RED_CARD', 'B')}
          >
            🟥 Red Card
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
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
                  {event.type === 'GOAL' && '⚽'}
                  {event.type === 'YELLOW_CARD' && '🟨'}
                  {event.type === 'RED_CARD' && '🟥'}
                  <span>
                    {event.team === 'A' ? match.homeTeam : match.awayTeam}
                    {event.player && ` - ${event.player.name}`}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{event.minute}'</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderScoreboard()}
      {renderControls()}
      {renderEvents()}

      <Dialog open={showPlayerStats} onOpenChange={setShowPlayerStats}>
        <PlayerStatsDisplay
          players={[...teamAPlayers, ...teamBPlayers]}
          gameType="football"
          events={matchData.events}
        />
      </Dialog>
    </div>
  );
} 