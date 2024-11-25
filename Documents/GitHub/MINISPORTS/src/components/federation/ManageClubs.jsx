import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/table';
import { Search, Eye, Edit, Trash2, Users, Plus, Filter } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import EditClubModal from './EditClubModal';
import AddClubPlayerForm from './AddClubPlayerForm';
import { Button } from '../ui/button';
import ActionMenu from '../ui/ActionMenu';

const ManageClubs = ({ onAdd, onEdit, onDelete, onViewDetails, onViewPlayers }) => {
  const { isDarkMode } = useDarkMode();
  
  // Sample data - Move this before any state declarations that use it
  const clubs = [
    {
      id: 1,
      name: 'ESPOIR BBC',
      federation: 'Fédération Rwandaise de Basketball',
      yearFounded: '1963',
      legalRepresentative: 'MUKUBWA ARSENE',
      address: 'KIGALI',
      division: '1',
      players: 17,
      staff: 4,
      details: {
        email: 'info@espoirbbc.rw',
        phone: '+250788123456',
        website: 'www.espoirbbc.rw',
        socialMedia: {
          twitter: '@espoirbbc',
          facebook: 'EspoirBBC',
          instagram: '@espoir_bbc'
        },
        facilities: ['Main Court', 'Training Court', 'Gym'],
        achievements: ['League Champions 2020', 'Cup Winners 2021']
      },
      playersList: [
        { id: 1, name: 'John Doe', position: 'Center', number: '15' },
        { id: 2, name: 'Jane Smith', position: 'Guard', number: '7' },
      ]
    }
  ];

  // Now declare states that depend on clubs
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFederation, setSelectedFederation] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('100');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  const [advancedSearch, setAdvancedSearch] = useState({
    name: '',
    federation: '',
    yearFounded: '',
    legalRepresentative: '',
    address: ''
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Federation options
  const federations = [
    'Fédération Rwandaise de Basketball',
    'Rwanda Football Federation',
    'Rwanda Volleyball Federation'
  ];

  // Generate years for dropdown (e.g., 1950 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  // Handle club operations
  const handleViewDetails = (club) => {
    setSelectedClub(club);
    setShowDetailsModal(true);
  };

  const handleEdit = (club) => {
    setSelectedClub(club);
    setShowEditModal(true);
  };

  const handleDeleteClick = (clubId) => {
    setSelectedClub(clubs.find(club => club.id === clubId));
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to delete the club
      await onDelete(selectedClub.id);
      setShowDeleteDialog(false);
      setSelectedClub(null);
      toast.success('Club deleted successfully');
    } catch (error) {
      toast.error('Failed to delete club');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPlayers = (club) => {
    setSelectedClub(club);
    setShowPlayersModal(true);
  };

  // Render club details modal content
  const renderClubDetails = () => {
    if (!selectedClub) return null;

    return (
      <div className="max-h-[70vh] overflow-y-auto pr-4">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Club Name</p>
                <p className="font-medium">{selectedClub.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Federation</p>
                <p className="font-medium">{selectedClub.federation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year Founded</p>
                <p className="font-medium">{selectedClub.yearFounded}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Legal Representative</p>
                <p className="font-medium">{selectedClub.legalRepresentative}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedClub.details?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedClub.details?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium">{selectedClub.details?.website}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{selectedClub.address}</p>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Facilities</h3>
            <ul className="list-disc list-inside space-y-2">
              {selectedClub.details?.facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <ul className="list-disc list-inside space-y-2">
              {selectedClub.details?.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Render players list modal content
  const renderPlayersList = () => {
    if (!selectedClub) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Players List
          </h3>
          <button 
            onClick={() => {
              setShowAddPlayerModal(true);
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Add Player
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Position</th>
              <th className="text-left py-2">Number</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedClub.playersList.map((player) => (
              <tr key={player.id}>
                <td className="py-2">{player.name}</td>
                <td className="py-2">{player.position}</td>
                <td className="py-2">{player.number}</td>
                <td className="py-2">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Add pagination calculations
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentItems = filteredClubs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClubs.length / entriesPerPage);

  // Add search handler
  const handleSearch = (value, field = 'name') => {
    if (field === 'all') {
      // Simple search across all fields
      const filtered = clubs.filter(club => 
        Object.values(club).some(val => 
          val?.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredClubs(filtered);
    } else {
      // Update advanced search state
      setAdvancedSearch(prev => ({
        ...prev,
        [field]: value
      }));

      // Apply all advanced search filters
      const filtered = clubs.filter(club => {
        return Object.entries(advancedSearch).every(([key, searchValue]) => {
          if (!searchValue) return true; // Skip empty filters
          return club[key]?.toString().toLowerCase().includes(searchValue.toLowerCase());
        });
      });
      setFilteredClubs(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      {/* Simplified Search and Add Button Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Club
        </Button>

        <div className="flex flex-col gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                onChange={(e) => handleSearch(e.target.value, 'all')}
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
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Club Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Search by name"
                    value={advancedSearch.name}
                    onChange={(e) => handleSearch(e.target.value, 'name')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Federation
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={advancedSearch.federation}
                    onChange={(e) => handleSearch(e.target.value, 'federation')}
                  >
                    <option value="">All Federations</option>
                    {federations.map((fed, index) => (
                      <option key={index} value={fed}>{fed}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Founded
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Search by year"
                    value={advancedSearch.yearFounded}
                    onChange={(e) => handleSearch(e.target.value, 'yearFounded')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Representative
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Search by representative"
                    value={advancedSearch.legalRepresentative}
                    onChange={(e) => handleSearch(e.target.value, 'legalRepresentative')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Search by address"
                    value={advancedSearch.address}
                    onChange={(e) => handleSearch(e.target.value, 'address')}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setAdvancedSearch({
                        name: '',
                        federation: '',
                        yearFounded: '',
                        legalRepresentative: '',
                        address: ''
                      });
                      setFilteredClubs(clubs);
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

      {/* Clubs Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px] text-xs">
                <input type="checkbox" className="rounded border-gray-300" />
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
            {currentItems.map((club) => (
              <TableRow key={club.id}>
                <TableCell className="text-xs">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="text-xs font-medium">{club.name}</TableCell>
                <TableCell className="text-xs">{club.acronym}</TableCell>
                <TableCell className="text-xs">{club.yearFounded}</TableCell>
                <TableCell className="text-xs">{club.legalRepresentative}</TableCell>
                <TableCell className="text-xs">{club.address}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleViewDetails(club)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClub(club);
                        setShowEditModal(true);
                      }}
                      className="p-1 rounded-lg hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(club.id)}
                      className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClubs.length)} of {filteredClubs.length} entries
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

      {/* Modals */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`${selectedClub?.name} Details`}
        className="max-w-4xl"
      >
        {renderClubDetails()}
      </Modal>

      <Modal
        isOpen={showPlayersModal}
        onClose={() => setShowPlayersModal(false)}
        title={`${selectedClub?.name} Players`}
      >
        {renderPlayersList()}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          if (!isSubmitting) {
            setShowDeleteDialog(false);
            setSelectedClub(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Club"
        message={
          <div className="space-y-2">
            <p>Are you sure you want to delete <span className="font-semibold">{selectedClub?.name}</span>?</p>
            <p className="text-sm text-gray-500">This action cannot be undone and will remove all associated data including players and staff.</p>
          </div>
        }
        isSubmitting={isSubmitting}
      />

      <EditClubModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClub(null);
        }}
        club={selectedClub}
        onSave={async (updatedData) => {
          try {
            await onEdit(updatedData);
            setShowEditModal(false);
            setSelectedClub(null);
            toast.success('Club updated successfully');
          } catch (error) {
            toast.error('Failed to update club');
          }
        }}
      />

      <Modal
        isOpen={showAddPlayerModal}
        onClose={() => setShowAddPlayerModal(false)}
        title="Add Player/Staff"
      >
        <AddClubPlayerForm
          onSubmit={async (data) => {
            try {
              // Handle player addition here
              console.log('Adding player:', data);
              setShowAddPlayerModal(false);
              toast.success('Player added successfully');
            } catch (error) {
              toast.error('Failed to add player');
            }
          }}
          onCancel={() => setShowAddPlayerModal(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default ManageClubs; 