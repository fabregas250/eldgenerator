import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Search, Plus, Filter, X } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddTrainingForm from '../components/forms/AddTrainingForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { AlertCircle } from 'lucide-react';

const Training = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('All 87');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editDataToConfirm, setEditDataToConfirm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  // Initial data
  const initialTrainings = [
    {
      id: '#1',
      title: 'FERWAFA Training',
      period: '2/04/22- 2/03/24',
      status: 'On going',
      organiser: 'MINISPORTS',
      participants: 56,
      venue: 'Amahoro Stadium',
      type: 'Technical'
    },
    {
      id: '#2',
      title: 'Coaching Workshop',
      period: '15/05/22- 20/05/22',
      status: 'Completed',
      organiser: 'FERWABA',
      participants: 30,
      venue: 'BK Arena',
      type: 'Professional'
    }
  ];

  // Filter configuration
  const filterConfig = {
    status: ['On going', 'Completed', 'Cancelled'],
    organiser: ['MINISPORTS', 'FERWAFA', 'FERWABA'],
    type: ['Technical', 'Professional', 'Physical']
  };

  const getTrainingsCount = () => {
    return filteredTrainings.length;
  };

  const tabs = [
    `All ${getTrainingsCount()}`
    
  ];

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTrainings(initialTrainings);
        setFilteredTrainings(initialTrainings);
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load trainings. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTraining = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Training added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add training'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (training) => {
    setSelectedTraining(training);
    setShowAddModal(true);
  };

  const handleEditConfirm = async (updatedData) => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to update the training
      console.log('Updating training:', updatedData);
      
      // Update local data
      const updatedTrainings = trainings.map(t => 
        t.id === selectedTraining.id ? { ...t, ...updatedData } : t
      );
      setTrainings(updatedTrainings);
      setFilteredTrainings(updatedTrainings);
      
      setShowEditConfirm(false);
      setShowAddModal(false);
      setSelectedTraining(null);
      setEditDataToConfirm(null);
      toast.success('Training updated successfully');
    } catch (error) {
      toast.error('Failed to update training');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (training) => {
    setTrainingToDelete(training);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to delete the training
      console.log('Deleting training:', trainingToDelete);
      
      // Update local data
      const updatedTrainings = trainings.filter(t => t.id !== trainingToDelete.id);
      setTrainings(updatedTrainings);
      setFilteredTrainings(updatedTrainings);
      
      setShowDeleteConfirm(false);
      setTrainingToDelete(null);
      toast.success('Training deleted successfully');
    } catch (error) {
      toast.error('Failed to delete training');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (training) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(trainings.map(training => training.id));
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

  const handleSearch = (searchValue) => {
    const filtered = initialTrainings.filter(training => 
      training.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.organiser.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.venue.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.type.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.status.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.period.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTrainings(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5" />
          <span>Add Training</span>
        </Button>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search trainings..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
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

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px] text-[11px]">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 w-3 h-3"
                  checked={selectedRows.length === trainings.length}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[60px] text-[11px]">ID</TableHead>
              <TableHead className="min-w-[150px] text-[11px]">TRAINING TITLE</TableHead>
              <TableHead className="min-w-[120px] text-[11px]">TRAINING PERIOD</TableHead>
              <TableHead className="w-[80px] text-[11px]">STATUS</TableHead>
              <TableHead className="min-w-[140px] text-[11px]">TRAINING ORGANISER</TableHead>
              <TableHead className="min-w-[120px] text-[11px]">VENUE</TableHead>
              <TableHead className="w-[80px] text-[11px]">PARTICIPANTS</TableHead>
              <TableHead className="w-[70px] text-[11px]">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((training) => (
              <TableRow key={training.id}>
                <TableCell className="text-[11px]">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 w-3 h-3"
                    checked={selectedRows.includes(training.id)}
                    onChange={() => handleSelectRow(training.id)}
                  />
                </TableCell>
                <TableCell className="text-[11px]">{training.id}</TableCell>
                <TableCell className="text-[11px] font-medium">{training.title}</TableCell>
                <TableCell className="text-[11px]">{training.period}</TableCell>
                <TableCell>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    training.status === 'On going' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {training.status}
                  </span>
                </TableCell>
                <TableCell className="text-[11px]">{training.organiser}</TableCell>
                <TableCell className="text-[11px]">{training.venue}</TableCell>
                <TableCell className="text-[11px]">{training.participants}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <ActionMenu
                      onEdit={() => handleEdit(training)}
                      onDelete={() => handleDelete(training)}
                      onDownload={() => handleDownload(training)}
                      iconSize={14} // Smaller icons
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Update pagination text size */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t gap-2">
          <div className="text-[11px] text-gray-500 whitespace-nowrap">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTrainings.length)} of {filteredTrainings.length} entries
          </div>
          <div className="flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] px-2 py-1 h-7"
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
                className="text-[11px] px-2 py-1 h-7"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] px-2 py-1 h-7"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Training"
        message={`Are you sure you want to delete ${selectedTraining?.title}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedTraining(null);
          }
        }}
        title={selectedTraining ? "Edit Training" : "Add Training"}
      >
        <AddTrainingForm
          initialData={selectedTraining}
          onSubmit={(data) => {
            if (selectedTraining) {
              // For edit, show confirmation first
              setEditDataToConfirm(data);
              setShowEditConfirm(true);
            } else {
              // For add, process directly
              handleAddTraining(data);
            }
          }}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedTraining(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

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
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                    <p><span className="font-semibold">Title:</span> {editDataToConfirm.title}</p>
                    <p><span className="font-semibold">Period:</span> {editDataToConfirm.period.startDate} to {editDataToConfirm.period.endDate}</p>
                    <p><span className="font-semibold">Organiser:</span> {editDataToConfirm.organiser}</p>
                    <p><span className="font-semibold">Venue:</span> {editDataToConfirm.venue}</p>
                    <p><span className="font-semibold">Participants:</span> {editDataToConfirm.participants}</p>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Training
            </DialogTitle>
            <DialogDescription className="py-4">
              <div className="space-y-4">
                <p>Are you sure you want to delete this training?</p>
                {trainingToDelete && (
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                    <p><span className="font-semibold">Title:</span> {trainingToDelete.title}</p>
                    <p><span className="font-semibold">Period:</span> {trainingToDelete.period}</p>
                    <p><span className="font-semibold">Organiser:</span> {trainingToDelete.organiser}</p>
                  </div>
                )}
                <p className="text-sm text-red-600">This action cannot be undone.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Training'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training; 