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

const Trainings = () => {
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
  const [trainings, setTrainings] = useState(initialTrainings);
  const [filteredTrainings, setFilteredTrainings] = useState(initialTrainings);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    `All ${getTrainingsCount()}`,
    'Manage Training',
    'Add new',
    'Manage Discipline',
    'Manage function'
  ];

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

  const handleDelete = async (training) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Training deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete training'
      });
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

      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Manage Training
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search trainings..."
              className={`pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            disabled={isSubmitting}
          >
            <Plus className="h-5 w-5" />
            <span>Add Training</span>
          </button>
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
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedRows.length === trainings.length}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>TRAINING TITLE</TableHead>
              <TableHead>TRAINING PERIOD</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>TRAINING ORGANISER</TableHead>
              <TableHead>VENUE</TableHead>
              <TableHead>PARTICIPANTS</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((training) => (
              <TableRow key={training.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(training.id)}
                    onChange={() => handleSelectRow(training.id)}
                  />
                </TableCell>
                <TableCell>{training.id}</TableCell>
                <TableCell>{training.title}</TableCell>
                <TableCell>{training.period}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    training.status === 'On going' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {training.status}
                  </span>
                </TableCell>
                <TableCell>{training.organiser}</TableCell>
                <TableCell>{training.venue}</TableCell>
                <TableCell>{training.participants}</TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(training)}
                    onDelete={() => handleDelete(training)}
                    onDownload={() => handleDownload(training)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Add pagination controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTrainings.length)} of {filteredTrainings.length} entries
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
          onSubmit={handleAddTraining}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedTraining(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Trainings; 