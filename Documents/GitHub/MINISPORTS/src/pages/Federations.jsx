import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Search, Plus, Filter, X, MapPin, Users, Building2, Eye, Edit, Trash2, History, AlertCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddFederationForm from '../components/forms/AddFederationForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import ManageClubs from '../components/federation/ManageClubs';
import AddClubForm from '../components/federation/AddClubForm';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import ViewPlayerModal from '../components/players/ViewPlayerModal';
import EditPlayerModal from '../components/players/EditPlayerModal';
import TransferHistoryModal from '../components/players/TransferHistoryModal';
import AddClubPlayerForm from '../components/federation/AddClubPlayerForm';

const Federations = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('Manage Federations and associations');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // To track which form to show
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddFederationModalOpen, setIsAddFederationModalOpen] = useState(false);
  const [isAddClubModalOpen, setIsAddClubModalOpen] = useState(false);
  const [playersStaffData] = useState([
    {
      id: 1,
      name: 'Jean Baptiste NSHUTI',
      type: 'Player',
      federation: 'Fédération Rwandaise de Football Association',
      club: 'APR FC',
      dateOfBirth: '19 Feb 2018',
      nationality: 'Rwandan',
    },
    {
      id: 2,
      name: 'Marie Claire UMUHOZA',
      type: 'Staff',
      federation: 'Rwanda Basketball Federation',
      club: 'Patriots BBC',
      dateOfBirth: '15 Mar 1985',
      nationality: 'Rwandan',
    }
  ]);

  // Initial data
  const initialFederations = [
    {
      id: '#1',
      name: 'Rwanda Football Federation',
      acronym: 'FERWAFA',
      yearFounded: '1972',
      legalRepresentative: 'Jean Damascène SEKAMANA',
      address: 'Remera, Kigali',
    },
    {
      id: '#2',
      name: 'Rwanda Basketball Federation',
      acronym: 'FERWABA',
      yearFounded: '1980',
      legalRepresentative: 'Desire MUGWIZA',
      address: 'Remera, Kigali',
    }
  ];

  const [federations, setFederations] = useState(initialFederations);

  // Define all available tabs
  const tabs = [
    'Manage Federations and associations',
    'Manage Clubs',
    'Manage Players/Staff',
    'Player/Staff Transfer',
    'Players Map'
  ];

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Inactive', 'Suspended'],
    type: ['Federation', 'Association'],
    location: ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern']
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load federations. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddFederation = (federationData) => {
    console.log('Adding new federation:', federationData);
    // Add your federation creation logic here
    setIsAddFederationModalOpen(false);
    toast.success('Federation added successfully');
  };

  const handleEdit = (federation) => {
    setFederationToEdit(federation);
    setEditModalOpen(true);
  };

  const handleDelete = async (federation) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Federation deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete federation'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (federation) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(federations.map(federation => federation.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Stats cards data
  const statsCards = [
    { icon: Building2, label: 'Total Federations', value: '12', color: 'bg-blue-100 text-blue-600' },
    { icon: Users, label: 'Total Players', value: '2,450', color: 'bg-green-100 text-green-600' },
    { icon: Users, label: 'Total Staff', value: '156', color: 'bg-purple-100 text-purple-600' },
    { icon: MapPin, label: 'Locations', value: '32', color: 'bg-orange-100 text-orange-600' },
  ];

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setShowAddModal(false);
    setShowDeleteDialog(false);
    
    setModalType(null);
  };

  // Add handlers for club operations
  const handleAddClub = () => {
    setIsAddClubModalOpen(true);
  };

  const handleEditClub = (clubData) => {
    console.log('Editing club:', clubData);
    // Add your club editing logic here
    toast.success('Club updated successfully');
  };

  const handleDeleteClub = (clubId) => {
    console.log('Deleting club:', clubId);
    // Add your club deletion logic here
    toast.success('Club deleted successfully');
  };

  // Add these new states at the top with other states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredFederations, setFilteredFederations] = useState(initialFederations);

  // Add this function to handle search and filtering
  const handleSearch = (searchValue) => {
    const filtered = initialFederations.filter(federation => 
      federation.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      federation.acronym.toLowerCase().includes(searchValue.toLowerCase()) ||
      federation.legalRepresentative.toLowerCase().includes(searchValue.toLowerCase()) ||
      federation.address.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredFederations(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Add pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFederations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFederations.length / itemsPerPage);

  // Add these state declarations with the other states at the top of the component
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [federationToEdit, setFederationToEdit] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [federationToDelete, setFederationToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Add handleEditSubmit function
  const handleEditSubmit = async (updatedData) => {
    try {
      // Here you would typically make an API call to update the federation
      const updatedFederations = federations.map(fed => 
        fed.id === federationToEdit.id ? { ...fed, ...updatedData } : fed
      );
      setFederations(updatedFederations);
      setFilteredFederations(updatedFederations);
      setEditModalOpen(false);
      setFederationToEdit(null);
      toast.success('Federation updated successfully');
    } catch (error) {
      toast.error('Failed to update federation');
    }
  };

  // Add these functions after the other handler functions

  const handleDeleteClick = (federation) => {
    setFederationToDelete(federation);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Here you would typically make an API call to delete the federation
      const updatedFederations = federations.filter(fed => fed.id !== federationToDelete.id);
      setFederations(updatedFederations);
      setFilteredFederations(updatedFederations);
      setDeleteModalOpen(false);
      setFederationToDelete(null);
      toast.success('Federation deleted successfully');
    } catch (error) {
      toast.error('Failed to delete federation');
    }
  };

  const handleBulkDeleteConfirm = async () => {
    try {
      // Here you would typically make an API call to delete multiple federations
      const updatedFederations = federations.filter(fed => !selectedRows.includes(fed.id));
      setFederations(updatedFederations);
      setFilteredFederations(updatedFederations);
      setSelectedRows([]);
      setBulkDeleteModalOpen(false);
      toast.success(`${selectedRows.length} federations deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete federations');
    }
  };

  // Add these state handlers
  const [filteredPlayersStaff, setFilteredPlayersStaff] = useState(playersStaffData);
  const [playerFilters, setPlayerFilters] = useState({
    search: '',
    type: '',
    federation: '',
    club: ''
  });

  // Add these filter handlers
  const handlePlayerSearch = (value) => {
    applyPlayersFilter({ ...playerFilters, search: value });
  };

  const handleTypeFilter = (value) => {
    applyPlayersFilter({ ...playerFilters, type: value });
  };

  const handleFederationFilter = (value) => {
    applyPlayersFilter({ ...playerFilters, federation: value });
  };

  const handleClubFilter = (value) => {
    applyPlayersFilter({ ...playerFilters, club: value });
  };

  const applyPlayersFilter = (filters) => {
    setPlayerFilters(filters);
    
    let filtered = playersStaffData.filter(person => {
      const matchesSearch = !filters.search || 
        person.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = !filters.type || person.type === filters.type;
      const matchesFederation = !filters.federation || person.federation === filters.federation;
      const matchesClub = !filters.club || person.club === filters.club;

      return matchesSearch && matchesType && matchesFederation && matchesClub;
    });

    setFilteredPlayersStaff(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Add these states near the other state declarations at the top
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState({
    type: '',
    federation: '',
    club: ''
  });

  // Add this handler function
  const handleAdvancedSearch = (value, field) => {
    setAdvancedSearch(prev => ({
      ...prev,
      [field]: value
    }));

    // Apply filters
    const filtered = playersStaffData.filter(person => {
      const matchesType = !advancedSearch.type || person.type === advancedSearch.type;
      const matchesFederation = !advancedSearch.federation || person.federation === advancedSearch.federation;
      const matchesClub = !advancedSearch.club || person.club === advancedSearch.club;

      return matchesType && matchesFederation && matchesClub;
    });

    setFilteredPlayersStaff(filtered);
    setCurrentPage(1);
  };

  // Add this handler for clearing filters
  const handleClearFilters = () => {
    setAdvancedSearch({
      type: '',
      federation: '',
      club: ''
    });
    setFilteredPlayersStaff(playersStaffData);
    setCurrentPage(1);
  };

  // Add this transfer-related data near your other initial data
  const [transferData] = useState({
    federations: [
      {
        id: 1,
        name: 'Fédération Rwandaise de Football Association',
        clubs: [
          {
            id: 1,
            name: 'APR FC',
            players: [
              { id: 1, name: 'Jean Baptiste NSHUTI', type: 'Player', position: 'Forward' },
              { id: 2, name: 'Eric NSABIMANA', type: 'Player', position: 'Midfielder' },
            ]
          },
          {
            id: 2,
            name: 'Rayon Sports FC',
            players: [
              { id: 3, name: 'Thierry MANZI', type: 'Player', position: 'Defender' },
              { id: 4, name: 'Herve RUGWIRO', type: 'Staff', role: 'Coach' },
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Rwanda Basketball Federation',
        clubs: [
          {
            id: 3,
            name: 'Patriots BBC',
            players: [
              { id: 5, name: 'Kenneth GASANA', type: 'Player', position: 'Guard' },
              { id: 6, name: 'Olivier SHYAKA', type: 'Staff', role: 'Assistant Coach' },
            ]
          }
        ]
      }
    ]
  });

  // Change these states for transfer form
  const [selectedTransferFederation, setSelectedTransferFederation] = useState('');
  const [selectedFromClub, setSelectedFromClub] = useState('');
  const [selectedToClub, setSelectedToClub] = useState('');
  const [selectedTransferPlayer, setSelectedTransferPlayer] = useState('');
  const [transferMonth, setTransferMonth] = useState('');
  const [transferYear, setTransferYear] = useState('');
  const [transferComments, setTransferComments] = useState('');

  // Add this state for transfer confirmation
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);
  const [transferDataToConfirm, setTransferDataToConfirm] = useState(null);

  // Add these handler functions
  const handleTransferFederationChange = (federationId) => {
    setSelectedTransferFederation(federationId);
    setSelectedFromClub('');
    setSelectedToClub('');
    setSelectedTransferPlayer('');
  };

  const handleFromClubChange = (clubId) => {
    setSelectedFromClub(clubId);
    setSelectedTransferPlayer('');
    // Reset "to club" if same as "from club"
    if (clubId === selectedToClub) {
      setSelectedToClub('');
    }
  };

  const handleToClubChange = (clubId) => {
    // Prevent selecting same club as source
    if (clubId !== selectedFromClub) {
      setSelectedToClub(clubId);
    }
  };

  // Update the handleTransferSubmit function
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedTransferPlayer) {
      toast.error('Please select a player/staff');
      return;
    }
    if (!selectedFromClub) {
      toast.error('Please select source club');
      return;
    }
    if (!selectedToClub) {
      toast.error('Please select destination club');
      return;
    }
    if (!transferMonth || !transferYear) {
      toast.error('Please select transfer date');
      return;
    }

    // Get the selected federation
    const federation = transferData.federations.find(f => f.id.toString() === selectedTransferFederation);
    // Get the source club
    const fromClub = federation?.clubs.find(c => c.id.toString() === selectedFromClub);
    // Get the destination club
    const toClub = federation?.clubs.find(c => c.id.toString() === selectedToClub);
    // Get the player
    const player = fromClub?.players.find(p => p.id.toString() === selectedTransferPlayer);

    // Prepare transfer data for confirmation
    const confirmData = {
      federation: federation?.name,
      fromClub: fromClub?.name,
      toClub: toClub?.name,
      player: player?.name,
      date: `${new Date(2000, parseInt(transferMonth) - 1).toLocaleString('default', { month: 'long' })} ${transferYear}`,
      comments: transferComments
    };

    // Show confirmation dialog
    setTransferDataToConfirm(confirmData);
    setShowTransferConfirm(true);
  };

  // Update the processTransfer function
  const processTransfer = async () => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to process the transfer
      console.log('Processing transfer:', transferDataToConfirm);

      toast.success('Transfer processed successfully');
      
      // Reset form
      setSelectedTransferFederation('');
      setSelectedFromClub('');
      setSelectedToClub('');
      setSelectedTransferPlayer('');
      setTransferMonth('');
      setTransferYear('');
      setTransferComments('');
      setShowTransferConfirm(false);
      setTransferDataToConfirm(null);
    } catch (error) {
      toast.error('Failed to process transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these states for player modals
  const [showPlayerDetailsModal, setShowPlayerDetailsModal] = useState(false);
  const [showPlayerEditModal, setShowPlayerEditModal] = useState(false);
  const [showTransferHistoryModal, setShowTransferHistoryModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Add these states for dynamic data
  const [availableFederations, setAvailableFederations] = useState([]);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editDataToConfirm, setEditDataToConfirm] = useState(null);

  // Add this function to fetch clubs when federation changes
  const handleFederationChange = async (federationId) => {
    // Simulate API call to fetch clubs for selected federation
    const federation = transferData.federations.find(f => f.id.toString() === federationId);
    if (federation) {
      setAvailableClubs(federation.clubs);
    } else {
      setAvailableClubs([]);
    }
  };

  // Update the handleEditPlayer function
  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    // Simulate fetching federations data
    setAvailableFederations(transferData.federations);
    // Get clubs for player's current federation
    const federation = transferData.federations.find(f => f.name === player.federation);
    if (federation) {
      setAvailableClubs(federation.clubs);
    }
    setShowPlayerEditModal(true);
  };

  // Add confirmation handler for edit
  const handleEditConfirm = async (updatedData) => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to update the player
      console.log('Updating player:', updatedData);
      
      // Update local data
      const updatedPlayersStaff = playersStaffData.map(p => 
        p.id === selectedPlayer.id ? { ...p, ...updatedData } : p
      );
      setPlayersStaffData(updatedPlayersStaff);
      setFilteredPlayersStaff(updatedPlayersStaff);
      
      setShowEditConfirm(false);
      setShowPlayerEditModal(false);
      setSelectedPlayer(null);
      setEditDataToConfirm(null);
      toast.success('Player updated successfully');
    } catch (error) {
      toast.error('Failed to update player');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these handler functions with the other handlers
  const handleViewPlayerDetails = (player) => {
    setSelectedPlayer(player);
    setShowPlayerDetailsModal(true);
  };

  const handleViewTransferHistory = (player) => {
    setSelectedPlayer(player);
    setShowTransferHistoryModal(true);
  };

  // Add this state with the other state declarations at the top
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);

  // Add these states for NIDA integration
  const [isLoadingNIDA, setIsLoadingNIDA] = useState(false);
  const [nidaData, setNidaData] = useState(null);

  // Add these states for ID validation
  const [idType, setIdType] = useState('nid'); // 'nid' or 'passport'
  const [idNumber, setIdNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [idError, setIdError] = useState('');

  // Update the handleNIDLookup function to include validation
  const handleNIDLookup = async (number, type) => {
    // Reset error state
    setIdError('');

    // Validate ID format
    if (type === 'nid') {
      if (!/^\d{16}$/.test(number)) {
        setIdError('National ID must be exactly 16 digits');
        return;
      }
    } else {
      // Passport validation
      if (!/^[A-Z0-9]{6,9}$/.test(number)) {
        setIdError('Invalid passport format');
        return;
      }
      
      // Validate passport expiry
      if (!passportExpiry) {
        setIdError('Passport expiry date is required');
        return;
      }
      
      const expiryDate = new Date(passportExpiry);
      if (expiryDate < new Date()) {
        setIdError('Passport has expired');
        return;
      }
    }

    setIsLoadingNIDA(true);
    try {
      // Simulate API call to NIDA/Immigration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample response
      const response = {
        documentNumber: number,
        names: "NSHUTI Jean Baptiste",
        dateOfBirth: "1995-02-19",
        gender: "Male",
        nationality: "Rwandan",
        placeOfBirth: "Kigali",
        photo: "base64_encoded_photo_string"
      };

      setNidaData(response);
      toast.success('ID data fetched successfully');
    } catch (error) {
      toast.error('Failed to fetch ID data');
      setNidaData(null);
    } finally {
      setIsLoadingNIDA(false);
    }
  };

  // Add this handler function with the other handlers
  const handleAddPlayer = async (formData) => {
    try {
      // Here you would make your API call to add the player
      console.log('Adding new player:', formData);
      
      setIsAddPlayerModalOpen(false);
      setNidaData(null);
      setIdType('nid');
      setIdNumber('');
      setPassportExpiry('');
      setIdError('');
      toast.success('Player added successfully');
    } catch (error) {
      toast.error('Failed to add player');
    }
  };

  // Render appropriate content based on active tab
  const renderContent = () => {
    if (activeTab === 'Manage Federations and associations') {
      return (
        <div className="space-y-6">
          {/* Add Federation Button and Search Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Button
              onClick={() => setIsAddFederationModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Federation
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search federations..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  className="border rounded px-2 py-1"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Federation Management Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px] text-xs">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedRows.length === currentItems.length}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="min-w-[180px] text-xs">Name</TableHead>
                    <TableHead className="w-[80px] text-xs">Acronym</TableHead>
                    <TableHead className="w-[100px] text-xs">Year Founded</TableHead>
                    <TableHead className="min-w-[180px] text-xs">Legal Representative</TableHead>
                    <TableHead className="min-w-[120px] text-xs">Address</TableHead>
                    <TableHead className="w-[80px] text-xs">Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((federation) => (
                    <TableRow key={federation.id}>
                      <TableCell className="text-xs">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedRows.includes(federation.id)}
                          onChange={() => handleSelectRow(federation.id)}
                        />
                      </TableCell>
                      <TableCell className="text-xs font-medium">{federation.name}</TableCell>
                      <TableCell className="text-xs">{federation.acronym}</TableCell>
                      <TableCell className="text-xs">{federation.yearFounded}</TableCell>
                      <TableCell className="text-xs">{federation.legalRepresentative}</TableCell>
                      <TableCell className="text-xs">{federation.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          <ActionMenu
                            onEdit={() => handleEdit(federation)}
                            onDelete={() => handleDeleteClick(federation)}
                            onDownload={() => handleDownload(federation)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex items-center text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredFederations.length)} of {filteredFederations.length} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'Manage Clubs':
        return <ManageClubs 
          onAdd={handleAddClub} 
          onEdit={handleEditClub} 
          onDelete={handleDeleteClub} 
        />;
      
      case 'Manage Players/Staff':
        return (
          <div className="space-y-6">
            {/* Simplified Search and Add Button Section */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <Button
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Player/Staff
              </Button>

              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Quick search..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                      onChange={(e) => handlePlayerSearch(e.target.value, 'all')}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {showAdvancedSearch ? 'Hide Filters' : 'Show Filters'}
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Search Panel */}
                {showAdvancedSearch && (
                  <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={playerFilters.type}
                          onChange={(e) => handleTypeFilter(e.target.value)}
                        >
                          <option value="">All Types</option>
                          <option value="Player">Player</option>
                          <option value="Staff">Staff</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Federation
                        </label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={playerFilters.federation}
                          onChange={(e) => handleFederationFilter(e.target.value)}
                        >
                          <option value="">All Federations</option>
                          {federations.map(fed => (
                            <option key={fed.id} value={fed.name}>{fed.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Club
                        </label>
                        <select
                          className="w-full border rounded-lg px-3 py-2"
                          value={playerFilters.club}
                          onChange={(e) => handleClubFilter(e.target.value)}
                        >
                          <option value="">All Clubs</option>
                          <option value="APR FC">APR FC</option>
                          <option value="Patriots BBC">Patriots BBC</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setPlayerFilters({
                              search: '',
                              type: '',
                              federation: '',
                              club: ''
                            });
                            setFilteredPlayersStaff(playersStaffData);
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Players/Staff Table */}
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px] text-xs">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableHead>
                    <TableHead className="min-w-[200px] text-xs">Name</TableHead>
                    <TableHead className="w-[100px] text-xs">Type</TableHead>
                    <TableHead className="min-w-[200px] text-xs">Federation</TableHead>
                    <TableHead className="w-[120px] text-xs">Club</TableHead>
                    <TableHead className="w-[120px] text-xs">Age/Date of birth</TableHead>
                    <TableHead className="w-[100px] text-xs">Nationality</TableHead>
                    <TableHead className="w-[120px] text-xs">Operation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayersStaff.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>{person.type}</TableCell>
                      <TableCell>{person.federation}</TableCell>
                      <TableCell>{person.club}</TableCell>
                      <TableCell>{person.dateOfBirth}</TableCell>
                      <TableCell>{person.nationality}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewPlayerDetails(person)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditPlayer(person)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(person)}
                            className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewTransferHistory(person)}
                            className="p-1 rounded-lg hover:bg-gray-100"
                            title="View Transfer History"
                          >
                            <History className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Add pagination here similar to other sections */}
            </div>
          </div>
        );
      
      case 'Player/Staff Transfer':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Player/Staff Transfer Form</h2>
              
              <form onSubmit={handleTransferSubmit} className="space-y-6">
                {/* Federation Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Federation
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={selectedTransferFederation}
                    onChange={(e) => handleTransferFederationChange(e.target.value)}
                    required
                  >
                    <option value="">Select Federation</option>
                    {transferData.federations.map(fed => (
                      <option key={fed.id} value={fed.id}>{fed.name}</option>
                    ))}
                  </select>
                </div>

                {/* Source Club Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Club From
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={selectedFromClub}
                      onChange={(e) => handleFromClubChange(e.target.value)}
                      required
                      disabled={!selectedTransferFederation}
                    >
                      <option value="">Select Club</option>
                      {selectedTransferFederation && 
                        transferData.federations
                          .find(f => f.id.toString() === selectedTransferFederation)
                          ?.clubs.map(club => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                          ))
                      }
                    </select>
                  </div>

                  {/* Player/Staff Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Player/Staff
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={selectedTransferPlayer}
                      onChange={(e) => setSelectedTransferPlayer(e.target.value)}
                      required
                      disabled={!selectedFromClub}
                    >
                      <option value="">Select Player</option>
                      {selectedFromClub &&
                        transferData.federations
                          .find(f => f.id.toString() === selectedTransferFederation)
                          ?.clubs.find(c => c.id.toString() === selectedFromClub)
                          ?.players.map(player => (
                            <option key={player.id} value={player.id}>
                              {player.name} ({player.type})
                            </option>
                          ))
                      }
                    </select>
                  </div>
                </div>

                {/* Destination Club and Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Club To
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={selectedToClub}
                      onChange={(e) => handleToClubChange(e.target.value)}
                      required
                      disabled={!selectedFromClub}
                    >
                      <option value="">Select Club</option>
                      {selectedTransferFederation &&
                        transferData.federations
                          .find(f => f.id.toString() === selectedTransferFederation)
                          ?.clubs
                          .filter(club => club.id.toString() !== selectedFromClub)
                          .map(club => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                          ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={transferMonth}
                      onChange={(e) => setTransferMonth(e.target.value)}
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = i + 1;
                        return (
                          <option key={month} value={month}>
                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={transferYear}
                      onChange={(e) => setTransferYear(e.target.value)}
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 5 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Comments
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows={4}
                    value={transferComments}
                    onChange={(e) => setTransferComments(e.target.value)}
                    placeholder="Enter any additional comments about the transfer..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Process Transfer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );
      
      case 'Players Map':
        return (
          <div className="space-y-6">
            {/* Players Map Component */}
            {/* Add map visualization component here */}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render appropriate form in modal based on modalType
  const renderForm = () => {
    return (
      <AddFederationForm
        onSubmit={(data) => {
          // Handle form submission
          console.log('New federation:', data);
          setShowAddModal(false);
          toast.success('Federation added successfully');
        }}
        onCancel={() => setShowAddModal(false)}
      />
    );
  };

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Navigation Tabs */}
      <div className="mb-6 overflow-x-auto">
        <nav className="flex space-x-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Content */}
      {renderContent()}

      {/* Modals and Dialogs */}
      <>
        <Modal
          isOpen={isAddFederationModalOpen}
          onClose={() => setIsAddFederationModalOpen(false)}
          title="Add Federation"
        >
          <AddFederationForm
            onSubmit={handleAddFederation}
            onCancel={() => setIsAddFederationModalOpen(false)}
          />
        </Modal>

        <Modal
          isOpen={isAddClubModalOpen}
          onClose={() => setIsAddClubModalOpen(false)}
          title="Add Club"
          className="max-h-[90vh]"
        >
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <AddClubForm
              onSubmit={(data) => {
                console.log('New club:', data);
                setIsAddClubModalOpen(false);
                toast.success('Club added successfully');
              }}
              onCancel={() => setIsAddClubModalOpen(false)}
            />
          </div>
        </Modal>

        {/* Edit Federation Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Federation"
          className="max-w-4xl"
        >
          <div className="max-h-[80vh] overflow-y-auto">
            <AddFederationForm
              initialData={federationToEdit}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditModalOpen(false)}
              isEditing={true}
            />
          </div>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="py-4">
                Are you sure you want to delete <span className="font-semibold">{federationToDelete?.name}</span>?
                This action cannot be undone and will remove all associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete Federation
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={bulkDeleteModalOpen} onOpenChange={setBulkDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Confirm Bulk Deletion
              </DialogTitle>
              <DialogDescription className="py-4">
                Are you sure you want to delete {selectedRows.length} federations?
                This action cannot be undone and will remove all associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setBulkDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDeleteConfirm}
              >
                Delete {selectedRows.length} Federations
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transfer Confirmation Dialog */}
        <Dialog open={showTransferConfirm} onOpenChange={setShowTransferConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Confirm Transfer
              </DialogTitle>
              <DialogDescription className="py-4">
                <div className="space-y-4">
                  <p>Please confirm the following transfer details:</p>
                  {transferDataToConfirm && (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Federation:</span> {transferDataToConfirm.federation}</p>
                      <p><span className="font-semibold">Player/Staff:</span> {transferDataToConfirm.player}</p>
                      <p><span className="font-semibold">From:</span> {transferDataToConfirm.fromClub}</p>
                      <p><span className="font-semibold">To:</span> {transferDataToConfirm.toClub}</p>
                      <p><span className="font-semibold">Transfer Date:</span> {transferDataToConfirm.date}</p>
                      {transferDataToConfirm.comments && (
                        <div>
                          <p className="font-semibold">Comments:</p>
                          <p className="text-gray-600">{transferDataToConfirm.comments}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowTransferConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={processTransfer}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Transfer'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <ViewPlayerModal
          isOpen={showPlayerDetailsModal}
          onClose={() => {
            setShowPlayerDetailsModal(false);
            setSelectedPlayer(null);
          }}
          player={selectedPlayer}
        />

        <EditPlayerModal
          isOpen={showPlayerEditModal}
          onClose={() => {
            setShowPlayerEditModal(false);
            setSelectedPlayer(null);
            setEditDataToConfirm(null);
          }}
          player={selectedPlayer}
          federations={availableFederations}
          clubs={availableClubs}
          onFederationChange={handleFederationChange}
          onSave={(updatedData) => {
            setEditDataToConfirm(updatedData);
            setShowEditConfirm(true);
          }}
        />

        <TransferHistoryModal
          isOpen={showTransferHistoryModal}
          onClose={() => {
            setShowTransferHistoryModal(false);
            setSelectedPlayer(null);
          }}
          player={selectedPlayer}
        />

        {/* Edit Confirmation Dialog */}
        <Dialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Confirm Changes
              </DialogTitle>
              <DialogDescription className="py-4">
                <div className="space-y-4">
                  <p>Please confirm the following changes:</p>
                  {editDataToConfirm && (
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {editDataToConfirm.name}</p>
                      <p><span className="font-semibold">Type:</span> {editDataToConfirm.type}</p>
                      <p><span className="font-semibold">Federation:</span> {editDataToConfirm.federation}</p>
                      <p><span className="font-semibold">Club:</span> {editDataToConfirm.club}</p>
                      <p><span className="font-semibold">Date of Birth:</span> {editDataToConfirm.dateOfBirth}</p>
                      <p><span className="font-semibold">Nationality:</span> {editDataToConfirm.nationality}</p>
                      {editDataToConfirm.position && (
                        <p><span className="font-semibold">Position:</span> {editDataToConfirm.position}</p>
                      )}
                      {editDataToConfirm.jerseyNumber && (
                        <p><span className="font-semibold">Jersey Number:</span> {editDataToConfirm.jerseyNumber}</p>
                      )}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleEditConfirm(editDataToConfirm)}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Confirm Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Modal
          isOpen={isAddPlayerModalOpen}
          onClose={() => {
            setIsAddPlayerModalOpen(false);
            setNidaData(null);
            setIdType('nid');
            setIdNumber('');
            setPassportExpiry('');
            setIdError('');
          }}
          title="Add Player/Staff"
          className="max-w-4xl"
        >
          <div className="max-h-[70vh] overflow-y-auto pr-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddPlayer(e.target);
            }} className="space-y-6">
              {/* ID Type Selection */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="idType"
                        value="nid"
                        checked={idType === 'nid'}
                        onChange={(e) => {
                          setIdType(e.target.value);
                          setIdNumber('');
                          setIdError('');
                        }}
                        className="mr-2"
                      />
                      National ID
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="idType"
                        value="passport"
                        checked={idType === 'passport'}
                        onChange={(e) => {
                          setIdType(e.target.value);
                          setIdNumber('');
                          setIdError('');
                        }}
                        className="mr-2"
                      />
                      Passport
                    </label>
                  </div>

                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        {idType === 'nid' ? 'National ID Number' : 'Passport Number'}
                      </label>
                      <input
                        type="text"
                        className={`w-full border rounded-lg px-3 py-2 ${idError ? 'border-red-500' : ''}`}
                        placeholder={idType === 'nid' ? 'Enter 16-digit ID number' : 'Enter passport number'}
                        value={idNumber}
                        onChange={(e) => {
                          setIdNumber(e.target.value);
                          setIdError('');
                        }}
                      />
                    </div>

                    {idType === 'passport' && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Passport Expiry Date
                        </label>
                        <input
                          type="date"
                          className={`w-full border rounded-lg px-3 py-2 ${idError ? 'border-red-500' : ''}`}
                          value={passportExpiry}
                          onChange={(e) => {
                            setPassportExpiry(e.target.value);
                            setIdError('');
                          }}
                          min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                        />
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={() => handleNIDLookup(idNumber, idType)}
                      disabled={isLoadingNIDA || !idNumber || (idType === 'passport' && !passportExpiry)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoadingNIDA ? 'Checking...' : 'Verify'}
                    </Button>
                  </div>

                  {/* Error Message */}
                  {idError && (
                    <div className="text-red-500 text-sm mt-1">
                      {idError}
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information - Readonly when NIDA data is available */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    value={nidaData?.names || ''}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    value={nidaData?.dateOfBirth || ''}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    value={nidaData?.gender || ''}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nationality</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    value={nidaData?.nationality || ''}
                    readOnly
                    required
                  />
                </div>
              </div>

              {/* Sports Information - Editable fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Player">Player</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Federation</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Federation</option>
                    {federations.map(fed => (
                      <option key={fed.id} value={fed.id}>{fed.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Club</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Club</option>
                    {/* Add club options based on selected federation */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Position/Role</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter position or role"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              {/* Photo Preview if available from NIDA */}
              {nidaData?.photo && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Photo</label>
                  <img
                    src={`data:image/jpeg;base64,${nidaData.photo}`}
                    alt="ID Photo"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddPlayerModalOpen(false);
                    setNidaData(null);
                    setIdType('nid');
                    setIdNumber('');
                    setPassportExpiry('');
                    setIdError('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!nidaData || isLoadingNIDA}
                >
                  Add Player/Staff
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default Federations; 