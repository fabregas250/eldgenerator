import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../../../../components/ui/dialog';
import FootballScoreboard from './FootballScoreboard';
import BasketballScoreboard from './BasketballScoreboard';
import VolleyballScoreboard from './VolleyballScoreboard';
import { TeamSetup } from '../TeamSetup';

export function MatchScoreboard({ match, onClose, onUpdate }) {
  const [isTeamsReady, setIsTeamsReady] = useState(false);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);

  const handleTeamSetupComplete = (teamAData, teamBData) => {
    setTeamAPlayers(teamAData.players);
    setTeamBPlayers(teamBData.players);
    setIsTeamsReady(true);
  };

  const renderScoreboard = () => {
    const props = {
      match,
      teamAPlayers,
      teamBPlayers,
      onUpdate,
      onClose
    };

    switch (match.gameType) {
      case 'football':
        return <FootballScoreboard {...props} />;
      case 'basketball':
        return <BasketballScoreboard {...props} />;
      case 'volleyball':
        return <VolleyballScoreboard {...props} />;
      default:
        return <div>Unsupported game type</div>;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {!isTeamsReady ? (
          <TeamSetup
            match={match}
            onComplete={handleTeamSetupComplete}
          />
        ) : (
          renderScoreboard()
        )}
      </DialogContent>
    </Dialog>
  );
} 