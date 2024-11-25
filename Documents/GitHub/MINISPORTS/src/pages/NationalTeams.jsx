import React, { useState, Fragment, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, X, Search, AlertTriangle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Modal from '../components/ui/Modal';
import AddNationalTeamForm from '../components/forms/AddNationalTeamForm';
import toast from 'react-hot-toast';

function NationalTeams() {
  // Basic state declarations
  const [activeTab, setActiveTab] = useState('Manage National Teams');
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  // Teams state
  const [teams, setTeams] = useState([
    {
      id: '#1',
      teamName: 'AMAVUBI CAN Qualifier',
      month: 'MARCH 2021',
      status: 'Active',
      federation: 'RWANDA FOOTBALL ASSOCIATION FEDERATION',
      players: 23
    }
  ]);

  // Players state
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: 'Michel Rusheshangoga',
      appearances: 0,
      teamName: 'AMAVUBI CAN Qualifier',
      federation: 'Rwanda Football Federation (FERWAFA)',
      club: 'APR FC'
    }
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeamData, setSelectedTeamData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTeam, setViewTeam] = useState(null);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isViewPlayerModalOpen, setIsViewPlayerModalOpen] = useState(false);
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
  const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Player management states
  const [selectedFederation, setSelectedFederation] = useState('');
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [availableTeams, setAvailableTeams] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [availableGames, setAvailableGames] = useState([]);

  // Federation options
  const federations = [
    "Rwanda Football Federation (FERWAFA)",
    "Rwanda Basketball Federation (FERWABA)",
    "Rwanda Volleyball Federation (FRVB)",
    "Rwanda Athletics Federation (RAF)",
    "Rwanda Paralympic Committee (NPC)",
    "Rwanda National Olympic and Sports Committee (RNOSC)"
  ];

  // Clubs data
  const clubs = [
    { id: 1, name: 'APR FC' },
    { id: 2, name: 'Rayon Sports FC' },
    { id: 3, name: 'Police FC' },
    { id: 4, name: 'AS Kigali' }
  ];

  // Search filters for players
  const [playerSearchFilters, setPlayerSearchFilters] = useState({
    name: '',
    team: '',
    federation: '',
    appearances: ''
  });

  // Filter players based on search criteria
  const filteredPlayers = players.filter(player => {
    const matchesName = player.name.toLowerCase().includes(playerSearchFilters.name.toLowerCase());
    const matchesTeam = !playerSearchFilters.team || player.teamName.toLowerCase().includes(playerSearchFilters.team.toLowerCase());
    const matchesFederation = !playerSearchFilters.federation || player.federation.toLowerCase().includes(playerSearchFilters.federation.toLowerCase());
    const matchesAppearances = !playerSearchFilters.appearances || player.appearances.toString().includes(playerSearchFilters.appearances);

    return matchesName && matchesTeam && matchesFederation && matchesAppearances;
  });

  // Tabs configuration
  const tabs = [
    'Manage National Teams',
    'Manage Players',
    'Players & Appearances'
  ];

  // Table columns configuration
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'teamName', header: 'TEAM NAME' },
    { key: 'month', header: 'MONTH' },
    { key: 'status', header: 'STATUS' },
    { key: 'federation', header: 'FEDERATION' },
    { key: 'players', header: 'PLAYERS' }
  ];

  // Handle team operations
  const handleView = (team) => {
    setViewTeam(team);
    setIsViewModalOpen(true);
  };

  const handleEdit = (team) => {
    setSelectedTeamData(team);
    setShowAddModal(true);
  };

  const handleDelete = (team) => {
    setSelectedTeamData(team);
    setShowDeleteDialog(true);
  };

  const handleAddTeam = async (data) => {
    try {
      if (selectedTeamData) {
        setTeams(prev => prev.map(team => 
          team.id === selectedTeamData.id ? { ...team, ...data } : team
        ));
        toast.success('Team updated successfully');
      } else {
        const newTeam = {
          id: `#${teams.length + 1}`,
          ...data,
          status: 'Active'
        };
        setTeams(prev => [...prev, newTeam]);
        toast.success('Team added successfully');
      }
      setShowAddModal(false);
      setSelectedTeamData(null);
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const confirmDelete = async () => {
    try {
      setTeams(prev => prev.filter(team => team.id !== selectedTeamData.id));
      setShowDeleteDialog(false);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  // Render team details
  const renderTeamDetails = (team) => {
    if (!team) return null;

    const details = [
      { label: 'Team Name', value: team.teamName },
      { label: 'Month', value: team.month },
      { label: 'Status', value: team.status },
      { label: 'Federation', value: team.federation },
      { label: 'Players', value: team.players }
    ];

    return (
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <span className="text-gray-500">{detail.label}:</span>
            <span className="font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render actions for each team
  const renderActions = (team) => (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleView(team)}
        className="p-1 h-7 w-7"
        title="View Details"
      >
        <Eye className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEdit(team)}
        className="p-1 h-7 w-7"
        title="Edit Team"
      >
        <Edit className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleDelete(team)}
        className="p-1 h-7 w-7"
        title="Delete Team"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );

  // Player operation handlers
  const handleViewPlayer = (player) => {
    setSelectedPlayer(player);
    setIsViewPlayerModalOpen(true);
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setIsEditPlayerModalOpen(true);
  };

  const handleDeletePlayer = (player) => {
    setSelectedPlayer(player);
    setIsDeletePlayerModalOpen(true);
  };

  const handleEditPlayerSubmit = (e) => {
    e.preventDefault();
    const updatedPlayer = {
      ...selectedPlayer,
      federation: selectedFederation,
      teamName: availableTeams.find(t => t.id === selectedTeamForPlayer)?.teamName,
      club: clubs.find(c => c.id === selectedClub)?.name,
      games: availableGames
    };

    setPlayers(prev => prev.map(player => 
      player.id === selectedPlayer.id ? updatedPlayer : player
    ));
    setIsEditPlayerModalOpen(false);
    toast.success('Player updated successfully');
  };

  const handleDeletePlayerConfirm = () => {
    setPlayers(prev => prev.filter(player => player.id !== selectedPlayer.id));
    setIsDeletePlayerModalOpen(false);
    toast.success('Player deleted successfully');
  };

  // Render player details in view modal
  const renderPlayerDetails = (player) => {
    if (!player) return null;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{player.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Team</label>
              <p className="font-medium">{player.teamName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Federation</label>
              <p className="font-medium">{player.federation}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Club</label>
              <p className="font-medium">{player.club}</p>
            </div>
          </div>
        </div>

        {/* Games Section */}
        <div>
          <h3 className="text-lg font-medium border-b pb-2">Games</h3>
          {player.games && player.games.length > 0 ? (
            <div className="space-y-2 mt-4">
              {player.games.map((game, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{game}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No games assigned</p>
          )}
        </div>
      </div>
    );
  };

  // Update renderContent function to properly handle all tabs
  const renderContent = () => {
    switch (activeTab) {
      case 'Manage National Teams':
        return (
          <div className="transition-all duration-200 ease-in-out">
            {/* Teams Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map(col => (
                      <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        {col.header}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{team.id}</td>
                      <td className="px-4 py-3">{team.teamName}</td>
                      <td className="px-4 py-3">{team.month}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          team.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {team.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{team.federation}</td>
                      <td className="px-4 py-3">{team.players}</td>
                      <td className="px-4 py-3">
                        {renderActions(team)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Manage Players':
        return (
          <div className="transition-all duration-200 ease-in-out">
            {/* Add Player Button */}
            <div className="mb-6">
              <Button
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add National Team Player
              </Button>
            </div>

            {/* Players Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Player Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Federation</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Club</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Games</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {players.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{player.name}</td>
                      <td className="px-4 py-3">{player.teamName}</td>
                      <td className="px-4 py-3">{player.federation}</td>
                      <td className="px-4 py-3">{player.club}</td>
                      <td className="px-4 py-3">
                        {player.games?.join(', ') || 'No games assigned'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewPlayer(player)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditPlayer(player)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePlayer(player)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Player Modal */}
            <Modal
              isOpen={isAddPlayerModalOpen}
              onClose={() => setIsAddPlayerModalOpen(false)}
              title="Add National Team Player"
            >
              <form onSubmit={handleAddPlayerSubmit} className="space-y-6">
                {/* Federation Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Federation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedFederation}
                    onChange={(e) => setSelectedFederation(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Select Federation</option>
                    {federations.map(fed => (
                      <option key={fed.id} value={fed.name}>{fed.name}</option>
                    ))}
                  </select>
                </div>

                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Team <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTeamForPlayer}
                    onChange={(e) => {
                      setSelectedTeamForPlayer(e.target.value);
                      const team = teams.find(t => t.id === e.target.value);
                      setAvailableGames(team?.games || []);
                    }}
                    className="w-full border rounded-lg p-2"
                    required
                    disabled={!selectedFederation}
                  >
                    <option value="">Select Team</option>
                    {teams.filter(team => team.federation === selectedFederation)
                      .map(team => (
                        <option key={team.id} value={team.id}>{team.teamName}</option>
                      ))}
                  </select>
                </div>

                {/* Club Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Club <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                    disabled={!selectedTeamForPlayer}
                  >
                    <option value="">Select Club</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>

                {/* Player Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Player Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter player name"
                    required
                    className="w-full"
                  />
                </div>

                {/* Games Section */}
                <div>
                  <h3 className="text-md font-medium mb-3">Games</h3>
                  {availableGames.length > 0 ? (
                    <div className="space-y-2">
                      {availableGames.map((game, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{game.game}</p>
                            <p className="text-sm text-gray-500">{game.stadium}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No games found</p>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddPlayerModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Player
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        );

      case 'Players & Appearances':
        return (
          <div className="transition-all duration-200 ease-in-out">
            {/* Search Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Search By</h2>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Player/Staff Name:</label>
                  <Input
                    type="text"
                    value={playerSearchFilters.name}
                    onChange={(e) => setPlayerSearchFilters(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Search by name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Team:</label>
                  <Input
                    type="text"
                    value={playerSearchFilters.team}
                    onChange={(e) => setPlayerSearchFilters(prev => ({
                      ...prev,
                      team: e.target.value
                    }))}
                    placeholder="Search by team"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Federation:</label>
                  <Input
                    type="text"
                    value={playerSearchFilters.federation}
                    onChange={(e) => setPlayerSearchFilters(prev => ({
                      ...prev,
                      federation: e.target.value
                    }))}
                    placeholder="Search by federation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Appearances:</label>
                  <Input
                    type="number"
                    value={playerSearchFilters.appearances}
                    onChange={(e) => setPlayerSearchFilters(prev => ({
                      ...prev,
                      appearances: e.target.value
                    }))}
                    placeholder="Search by appearances"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Players & Appearances Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name of Player / Staff</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Number of Appearances</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{player.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            player.appearances > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {player.appearances} {player.appearances === 1 ? 'Appearance' : 'Appearances'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                        No players found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add Player submit handler
  const handleAddPlayerSubmit = (e) => {
    e.preventDefault();
    // Add your player submission logic here
    setIsAddPlayerModalOpen(false);
    toast.success('Player added successfully');
  };

  // Add EditPlayerModal component
  const EditPlayerModal = () => (
    <Transition appear show={isEditPlayerModalOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={() => setIsEditPlayerModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-bold">
                  Edit National Team Player
                </Dialog.Title>
                <button
                  onClick={() => setIsEditPlayerModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditPlayerSubmit} className="space-y-6">
                {/* Federation Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Federation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedFederation}
                    onChange={(e) => {
                      setSelectedFederation(e.target.value);
                      setSelectedTeamForPlayer('');
                      setSelectedClub('');
                      const teams = teams.filter(team => team.federation === e.target.value);
                      setAvailableTeams(teams);
                    }}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Select Federation</option>
                    {federations.map(fed => (
                      <option key={fed} value={fed}>{fed}</option>
                    ))}
                  </select>
                </div>

                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Team <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTeamForPlayer}
                    onChange={(e) => {
                      setSelectedTeamForPlayer(e.target.value);
                      setSelectedClub('');
                      const team = teams.find(t => t.id === e.target.value);
                      setAvailableGames(team?.games || []);
                    }}
                    className="w-full border rounded-lg p-2"
                    required
                    disabled={!selectedFederation}
                  >
                    <option value="">Select Team</option>
                    {availableTeams.map(team => (
                      <option key={team.id} value={team.id}>{team.teamName}</option>
                    ))}
                  </select>
                </div>

                {/* Club Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Club <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                    disabled={!selectedTeamForPlayer}
                  >
                    <option value="">Select Club</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>

                {/* Player/Staff Information */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Player / Staff <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={selectedPlayer?.name || ''}
                    onChange={(e) => setSelectedPlayer(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter player/staff name"
                    className="w-full"
                    required
                  />
                </div>

                {/* Games Section */}
                <div>
                  <h3 className="text-md font-medium mb-3">Games</h3>
                  {availableGames.length > 0 ? (
                    <div className="space-y-2">
                      {availableGames.map((game, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{game.game}</p>
                            <p className="text-sm text-gray-500">{game.stadium}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No games found</p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditPlayerModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update Player
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  // Update useEffect to set initial values when editing
  useEffect(() => {
    if (selectedPlayer && isEditPlayerModalOpen) {
      setSelectedFederation(selectedPlayer.federation);
      const team = teams.find(t => t.teamName === selectedPlayer.teamName);
      if (team) {
        setSelectedTeamForPlayer(team.id);
        setAvailableGames(team.games || []);
      }
      const club = clubs.find(c => c.name === selectedPlayer.club);
      if (club) {
        setSelectedClub(club.id);
      }
    }
  }, [selectedPlayer, isEditPlayerModalOpen]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage National Team</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add National Team</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {renderContent()}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedTeamData(null);
        }}
        title={selectedTeamData ? "Edit Team" : "Add National Team"}
      >
        <AddNationalTeamForm
          initialData={selectedTeamData}
          onSubmit={handleAddTeam}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedTeamData(null);
          }}
        />
      </Modal>

      {/* View Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    View Team Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderTeamDetails(viewTeam)}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Team"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this team? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Player Modal */}
      <Transition appear show={isViewPlayerModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewPlayerModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Player Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewPlayerModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderPlayerDetails(selectedPlayer)}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button onClick={() => setIsViewPlayerModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add EditPlayerModal */}
      <EditPlayerModal />

      {/* Delete Player Confirmation Modal */}
      <Transition appear show={isDeletePlayerModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDeletePlayerModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <Dialog.Title className="text-lg font-medium">
                    Delete Player
                  </Dialog.Title>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete {selectedPlayer?.name}? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeletePlayerModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeletePlayerConfirm}
                  >
                    Delete Player
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default NationalTeams; 