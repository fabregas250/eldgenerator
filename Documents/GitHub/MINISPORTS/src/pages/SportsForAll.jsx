import React, { useState, useEffect, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Edit, Download, Trash2, AlertTriangle } from 'lucide-react';
import AddMassSportModal from '../components/AddMassSportModal';
import EditMassSportModal from '../components/EditMassSportModal';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

function SportsForAll() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useTheme();
  const [massSportsData, setMassSportsData] = useState([
    {
      id: 1,
      date: '2024-03-20',
      location: 'Kigali Arena',
      round: 'Quarter Finals',
      purpose: 'Community Engagement',
      femaleCount: 150,
      maleCount: 200,
      total: 350,
      organizers: 'Ministry of Sports',
      guestOfHonor: 'Minister of Sports'
    },
    {
      id: 2,
      date: '2024-03-21',
      location: 'Amahoro Stadium',
      round: 'Finals',
      purpose: 'Youth Development',
      femaleCount: 200,
      maleCount: 250,
      total: 450,
      organizers: 'Rwanda Sports Council',
      guestOfHonor: 'Governor'
    },
    // Add more mock data as needed
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [sportToDelete, setSportToDelete] = useState(null);

  // Enhanced search function
  const filteredData = massSportsData.filter(sport => 
    Object.entries(sport).some(([key, value]) => {
      // Skip searching through id and total fields
      if (key === 'id' || key === 'total') return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Calculate the actual numbers for the entries display
  const totalEntries = filteredData.length;
  const firstEntry = totalEntries === 0 ? 0 : startIndex + 1;
  const lastEntry = Math.min(startIndex + entriesPerPage, totalEntries);

  // Handle delete
  const handleDelete = (sport) => {
    setSportToDelete(sport);
    setIsDeleteModalOpen(true);
  };

  // Handle download
  const handleDownload = (sport) => {
    // Implement your download logic here
    toast.success('Downloading mass sport event data...');
  };

  // Handle edit
  const handleEdit = (sport) => {
    setSelectedSport(sport);
    setIsEditModalOpen(true);
  };

  // Handle add new sport
  const handleAddSport = (newSport) => {
    setMassSportsData(prev => [
      ...prev,
      { id: Date.now(), ...newSport }
    ]);
    setIsAddModalOpen(false);
    toast.success('New mass sport event added successfully');
  };

  // Add this function to handle the edit submission
  const handleEditSubmit = (updatedSport) => {
    setMassSportsData(prev => 
      prev.map(sport => 
        sport.id === updatedSport.id ? updatedSport : sport
      )
    );
    setIsEditModalOpen(false);
    toast.success('Mass sport event updated successfully');
  };

  // Add this function to handle the delete confirmation
  const handleDeleteConfirm = () => {
    setMassSportsData(prev => prev.filter(sport => sport.id !== sportToDelete.id));
    setIsDeleteModalOpen(false);
    toast.success('Mass sport event deleted successfully');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Manage Mass Sports</h1>
        
        {/* Top Controls - Simplified */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 pl-10"
              placeholder="Search..."
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Mass Sport
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {paginatedData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Round</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No OF Female</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No OF Male</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizers</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest of Honor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((sport) => (
                  <tr key={sport.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{sport.date}</td>
                    <td className="px-4 py-3 text-sm">{sport.location}</td>
                    <td className="px-4 py-3 text-sm">{sport.round}</td>
                    <td className="px-4 py-3 text-sm">{sport.purpose}</td>
                    <td className="px-4 py-3 text-sm">{sport.femaleCount}</td>
                    <td className="px-4 py-3 text-sm">{sport.maleCount}</td>
                    <td className="px-4 py-3 text-sm">{sport.total}</td>
                    <td className="px-4 py-3 text-sm">{sport.organizers}</td>
                    <td className="px-4 py-3 text-sm">{sport.guestOfHonor}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleEdit(sport)}
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleDownload(sport)}
                        >
                          <Download className="h-4 w-4 text-gray-500" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleDelete(sport)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No mass sports matching "${searchTerm}"`
                  : "No mass sports available"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Updated with more accurate display */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {totalEntries > 0 ? (
              `Showing ${firstEntry} to ${lastEntry} of ${totalEntries} entries`
            ) : (
              'No entries to show'
            )}
          </div>
          {totalEntries > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {totalPages <= 7 ? (
                  // Show all pages if total pages are 7 or less
                  [...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={currentPage === i + 1 ? "bg-blue-600 text-white" : ""}
                    >
                      {i + 1}
                    </Button>
                  ))
                ) : (
                  // Show pagination with ellipsis for more than 7 pages
                  <>
                    {[...Array(3)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "bg-blue-600 text-white" : ""}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <span className="px-2 py-1">...</span>
                    {[...Array(3)].map((_, i) => (
                      <Button
                        key={totalPages - 2 + i}
                        variant={currentPage === totalPages - 2 + i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages - 2 + i)}
                        className={currentPage === totalPages - 2 + i ? "bg-blue-600 text-white" : ""}
                      >
                        {totalPages - 2 + i}
                      </Button>
                    ))}
                  </>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <AddMassSportModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSport}
      />

      <EditMassSportModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditSubmit}
        sportData={selectedSport}
      />

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDeleteModalOpen(false)}
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <Dialog.Title className="text-lg font-medium">
                      Confirm Deletion
                    </Dialog.Title>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this mass sport event? This action cannot be undone.
                  </p>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteConfirm}
                    >
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default SportsForAll; 