import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertCircle, History, Eye, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddSportsProfessionalForm from '../components/forms/AddSportsProfessionalForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { DataTable } from '../components/ui/DataTable';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import EditSportsProfessionalModal from '../components/professionals/EditSportsProfessionalModal';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from '../components/ui/dialog';

const SportsProfessionals = () => {
  // Initial data - Move this before state declarations
  const initialProfessionals = [
    {
      id: '#1',
      avatar: '/avatars/jackson.jpg',
      name: 'Jackson NTARINDWA',
      username: '@jackson.ntarindwa',
      phone: '0784704515',
      function: 'Coach',
      subFunction: 'Amavubi',
      status: 'Active',
      nationality: 'Rwandan',
      region: 'Cameroon',
      count: '+1'
    }
  ];

  // Add this sample data near your other initial data
  const [federationsData] = useState([
    {
      id: 1,
      name: 'Rwanda Football Federation',
      clubs: [
        { id: 1, name: 'APR FC' },
        { id: 2, name: 'Rayon Sports FC' }
      ]
    },
    {
      id: 2,
      name: 'Rwanda Basketball Federation',
      clubs: [
        { id: 3, name: 'Patriots BBC' },
        { id: 4, name: 'REG BBC' }
      ]
    }
  ]);

  // Add this initial data for disciplines
  const initialDisciplines = [
    {
      id: 1,
      name: 'ANP Sport Feminin',
      type: 'Sports',
    },
    {
      id: 2,
      name: 'Archery and Shooting Sports',
      type: 'Sports',
    },
    {
      id: 3,
      name: 'ARPST',
      type: 'Sports',
    },
    {
      id: 4,
      name: 'Association des Educateurs Sportifs (AEPS)',
      type: 'Sports',
    },
    {
      id: 5,
      name: 'Association des Journalistes sportifs',
      type: 'Sports',
    }
  ];

  // Add this initial data for functions
  const initialFunctions = [
    {
      id: 1,
      function: 'Vice President',
      discipline: 'Federation Rwandaise de Karate (FERWAKA)'
    },
    {
      id: 2,
      function: 'Vice President',
      discipline: 'Federation Rwandaise de Kungfu wushu'
    },
    // ... add all other functions
    {
      id: 20,
      function: 'international referee',
      discipline: 'Rwanda Football Federation-FERWAFA'
    }
  ];

  // Now declare states
  const [activeTab, setActiveTab] = useState(`All ${initialProfessionals.length}`);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [professionals, setProfessionals] = useState(initialProfessionals);
  const [filteredProfessionals, setFilteredProfessionals] = useState(initialProfessionals);
  const [showEditModal, setShowEditModal] = useState(false);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [disciplines, setDisciplines] = useState(initialDisciplines);
  const [filteredDisciplines, setFilteredDisciplines] = useState(initialDisciplines);
  const [disciplineSearchTerm, setDisciplineSearchTerm] = useState('');
  const [disciplineEntriesPerPage, setDisciplineEntriesPerPage] = useState(100);
  const [disciplineCurrentPage, setDisciplineCurrentPage] = useState(1);
  const [showAddDisciplineModal, setShowAddDisciplineModal] = useState(false);
  const [showDisciplineConfirm, setShowDisciplineConfirm] = useState(false);
  const [disciplineToConfirm, setDisciplineToConfirm] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState({
    type: '',
    federation: '',
    club: ''
  });
  const [showEditDisciplineModal, setShowEditDisciplineModal] = useState(false);
  const [showDeleteDisciplineModal, setShowDeleteDisciplineModal] = useState(false);
  const [disciplineToEdit, setDisciplineToEdit] = useState(null);
  const [disciplineToDelete, setDisciplineToDelete] = useState(null);
  const [functions, setFunctions] = useState(initialFunctions);
  const [filteredFunctions, setFilteredFunctions] = useState(initialFunctions);
  const [functionSearchTerm, setFunctionSearchTerm] = useState('');
  const [functionEntriesPerPage, setFunctionEntriesPerPage] = useState(100);
  const [functionCurrentPage, setFunctionCurrentPage] = useState(1);
  const [showAddFunctionModal, setShowAddFunctionModal] = useState(false);
  const [showEditFunctionModal, setShowEditFunctionModal] = useState(false);
  const [functionToEdit, setFunctionToEdit] = useState(null);

  // Table columns configuration
  const columns = [
    { key: 'name', header: 'NAME' },
    { key: 'id', header: 'ID' },
    { key: 'phone', header: 'PHONE' },
    { key: 'function', header: 'FUNCTION' },
    { key: 'status', header: 'STATUS' },
    { key: 'nationality', header: 'NATIONALITY' }
  ];

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Inactive', 'Suspended'],
    function: ['Coach', 'Player', 'Referee'],
    nationality: ['Rwandan', 'Foreign']
  };

  const getProfessionalsCount = () => {
    return filteredProfessionals.length;
  };

  const getTabs = (count) => [
    `All ${count}`,
    'Manage Discipline',
    'Manage function'
  ];

  const tabs = getTabs(getProfessionalsCount());

  // Simulate initial data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setActiveTab(`All ${getProfessionalsCount()}`);
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load professionals. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProfessional = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new professional to the list
      const newProfessional = {
        id: `#${professionals.length + 1}`,
        ...data
      };
      
      setProfessionals([...professionals, newProfessional]);
      setFilteredProfessionals([...professionals, newProfessional]);
      
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Professional added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add professional'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (professional) => {
    setSelectedProfessional(professional);
    setShowEditModal(true);
  };

  const handleDelete = async (professional) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Professional deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete professional'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (professional) => {
    toast.success('Download started');
  };

  const handleFilter = (filters) => {
    const filtered = professionals.filter(professional => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        return professional[key].toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredProfessionals(filtered);
  };

  const handleFederationChange = (federationId) => {
    // Find the selected federation
    const federation = federationsData.find(f => f.id.toString() === federationId);
    if (federation) {
      // Update available clubs based on selected federation
      setAvailableClubs(federation.clubs || []);
    } else {
      setAvailableClubs([]);
    }
  };

  // Custom row renderer for the DataTable
  const renderRow = (professional) => (
    <tr key={professional.id} className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <img 
            src={professional.avatar} 
            alt={professional.name} 
            className="h-8 w-8 rounded-full"
          />
          <div>
            <div className="font-medium">{professional.name}</div>
            <div className="text-sm text-gray-500">{professional.username}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">{professional.id}</td>
      <td className="px-6 py-4">{professional.phone}</td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium">{professional.function}</div>
          <div className="text-sm text-gray-500">{professional.subFunction}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          professional.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {professional.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <span>{professional.nationality}</span>
          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
            {professional.region}
          </span>
          <span className="text-xs text-gray-500">
            {professional.count}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <ActionMenu
          onEdit={() => handleEdit(professional)}
          onDelete={() => handleDelete(professional)}
          onDownload={() => handleDownload(professional)}
        />
      </td>
    </tr>
  );

  // Add this function to handle discipline search
  const handleDisciplineSearch = (searchTerm) => {
    const filtered = initialDisciplines.filter(discipline =>
      discipline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discipline.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDisciplines(filtered);
    setDisciplineCurrentPage(1);
  };

  // Add discipline pagination calculations
  const disciplineIndexOfLastItem = disciplineCurrentPage * disciplineEntriesPerPage;
  const disciplineIndexOfFirstItem = disciplineIndexOfLastItem - disciplineEntriesPerPage;
  const currentDisciplines = filteredDisciplines.slice(disciplineIndexOfFirstItem, disciplineIndexOfLastItem);
  const totalDisciplinePages = Math.ceil(filteredDisciplines.length / disciplineEntriesPerPage);

  // Add these handlers for discipline operations
  const handleEditDiscipline = (discipline) => {
    setDisciplineToEdit(discipline);
    setShowEditDisciplineModal(true);
  };

  const handleDeleteDiscipline = (discipline) => {
    setDisciplineToDelete(discipline);
    setShowDeleteDisciplineModal(true);
  };

  // Add this function to process discipline deletion
  const handleConfirmDeleteDiscipline = async () => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to delete the discipline
      const updatedDisciplines = disciplines.filter(d => d.id !== disciplineToDelete.id);
      setDisciplines(updatedDisciplines);
      setFilteredDisciplines(updatedDisciplines);
      setShowDeleteDisciplineModal(false);
      setDisciplineToDelete(null);
      toast.success('Discipline deleted successfully');
    } catch (error) {
      toast.error('Failed to delete discipline');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to handle discipline edit submission
  const handleEditDisciplineSubmit = async (updatedData) => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to update the discipline
      const updatedDisciplines = disciplines.map(d => 
        d.id === disciplineToEdit.id ? { ...d, ...updatedData } : d
      );
      setDisciplines(updatedDisciplines);
      setFilteredDisciplines(updatedDisciplines);
      setShowEditDisciplineModal(false);
      setDisciplineToEdit(null);
      toast.success('Discipline updated successfully');
    } catch (error) {
      toast.error('Failed to update discipline');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to handle discipline addition
  const handleAddDiscipline = async (formData) => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to add the discipline
      console.log('Adding discipline:', formData);
      
      // Update local data
      const newDiscipline = {
        id: disciplines.length + 1,
        name: formData.name,
        type: formData.type
      };
      
      setDisciplines([...disciplines, newDiscipline]);
      setFilteredDisciplines([...disciplines, newDiscipline]);
      setShowAddDisciplineModal(false);
      setDisciplineToConfirm(null);
      toast.success('Discipline added successfully');
    } catch (error) {
      toast.error('Failed to add discipline');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to handle function search
  const handleFunctionSearch = (searchTerm) => {
    const filtered = initialFunctions.filter(func =>
      func.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.discipline.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFunctions(filtered);
    setFunctionCurrentPage(1);
  };

  // Add function pagination calculations
  const functionIndexOfLastItem = functionCurrentPage * functionEntriesPerPage;
  const functionIndexOfFirstItem = functionIndexOfLastItem - functionEntriesPerPage;
  const currentFunctions = filteredFunctions.slice(functionIndexOfFirstItem, functionIndexOfLastItem);
  const totalFunctionPages = Math.ceil(filteredFunctions.length / functionEntriesPerPage);

  // Add these handlers for function operations
  const handleEditFunction = (func) => {
    setFunctionToEdit(func);
    setShowEditFunctionModal(true);
  };

  const handleDeleteFunction = (func) => {
    setFunctions(functions.filter(f => f.id !== func.id));
    setFilteredFunctions(filteredFunctions.filter(f => f.id !== func.id));
    setShowEditFunctionModal(false);
    setFunctionToEdit(null);
    toast.success('Function deleted successfully');
  };

  // Add this function to handle function edit submission
  const handleEditFunctionSubmit = async (updatedData) => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to update the function
      const updatedFunctions = functions.map(f => 
        f.id === functionToEdit.id ? { ...f, ...updatedData } : f
      );
      setFunctions(updatedFunctions);
      setFilteredFunctions(updatedFunctions);
      setShowEditFunctionModal(false);
      setFunctionToEdit(null);
      toast.success('Function updated successfully');
    } catch (error) {
      toast.error('Failed to update function');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to handle function addition
  const handleAddFunction = async (formData) => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to add the function
      console.log('Adding function:', formData);
      
      // Update local data
      const newFunction = {
        id: functions.length + 1,
        function: formData.function,
        discipline: formData.discipline
      };
      
      setFunctions([...functions, newFunction]);
      setFilteredFunctions([...functions, newFunction]);
      setShowAddFunctionModal(false);
      toast.success('Function added successfully');
    } catch (error) {
      toast.error('Failed to add function');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case `All ${getProfessionalsCount()}`:
        return (
          <div className="transition-all duration-300 ease-in-out">
            <DataTable
              data={filteredProfessionals}
              columns={columns}
              filterConfig={filterConfig}
              searchKeys={['name', 'id', 'phone', 'function']}
              renderRow={renderRow}
              actions={true}
            />
          </div>
        );

      case 'Manage Sports Professionals':
        return (
          <div className="transition-all duration-300 ease-in-out">
            {/* Add your manage professionals content here */}
            <h2>Manage Sports Professionals Content</h2>
          </div>
        );

      case 'Manage Discipline':
        return (
          <div className="transition-all duration-300 ease-in-out">
            <div className="space-y-6">
              {/* Add Button and Search Section */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Button
                  onClick={() => setShowAddDisciplineModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Discipline
                </Button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show entries:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={disciplineEntriesPerPage}
                      onChange={(e) => setDisciplineEntriesPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search disciplines..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                      onChange={(e) => handleDisciplineSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Disciplines Table */}
              <div className="bg-white rounded-lg shadow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[300px] text-xs">Discipline</TableHead>
                      <TableHead className="w-[150px] text-xs">Type</TableHead>
                      <TableHead className="w-[100px] text-xs">Operation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDisciplines.map((discipline) => (
                      <TableRow key={discipline.id}>
                        <TableCell className="text-xs font-medium">{discipline.name}</TableCell>
                        <TableCell className="text-xs">{discipline.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditDiscipline(discipline)}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDiscipline(discipline)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Delete
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
                    Showing {disciplineIndexOfFirstItem + 1} to {Math.min(disciplineIndexOfLastItem, filteredDisciplines.length)} of {filteredDisciplines.length} entries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDisciplineCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={disciplineCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(totalDisciplinePages)].map((_, index) => (
                      <Button
                        key={index + 1}
                        variant={disciplineCurrentPage === index + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDisciplineCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDisciplineCurrentPage(prev => Math.min(prev + 1, totalDisciplinePages))}
                      disabled={disciplineCurrentPage === totalDisciplinePages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Discipline Modal */}
            <Modal
              isOpen={showEditDisciplineModal}
              onClose={() => {
                setShowEditDisciplineModal(false);
                setDisciplineToEdit(null);
              }}
              title="Edit Discipline"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = {
                    name: e.target.name.value,
                    type: e.target.type.value
                  };
                  handleEditDisciplineSubmit(formData);
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discipline name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    defaultValue={disciplineToEdit?.name}
                    placeholder="Enter discipline name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    defaultValue={disciplineToEdit?.type}
                  >
                    <option value="">Select type</option>
                    <option value="Sports">Sports</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditDisciplineModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Modal>

            {/* Delete Discipline Confirmation */}
            <Dialog open={showDeleteDisciplineModal} onOpenChange={setShowDeleteDisciplineModal}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Delete Discipline
                  </DialogTitle>
                  <DialogDescription className="py-4">
                    <div className="space-y-2">
                      <p>Are you sure you want to delete this discipline?</p>
                      {disciplineToDelete && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p><span className="font-semibold">Name:</span> {disciplineToDelete.name}</p>
                          <p><span className="font-semibold">Type:</span> {disciplineToDelete.type}</p>
                        </div>
                      )}
                      <p className="text-sm text-red-600">This action cannot be undone.</p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDisciplineModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirmDeleteDiscipline}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete Discipline'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Add Discipline Modal */}
            <Modal
              isOpen={showAddDisciplineModal}
              onClose={() => {
                if (!isSubmitting) {
                  setShowAddDisciplineModal(false);
                }
              }}
              title="Add Discipline"
            >
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setIsSubmitting(true);
                    const formData = {
                      name: e.target.name.value,
                      type: e.target.type.value
                    };
                    
                    // Here you would make your API call to add the discipline
                    console.log('Adding discipline:', formData);
                    
                    // Update local data
                    const newDiscipline = {
                      id: disciplines.length + 1,
                      name: formData.name,
                      type: formData.type
                    };
                    
                    setDisciplines([...disciplines, newDiscipline]);
                    setFilteredDisciplines([...disciplines, newDiscipline]);
                    setShowAddDisciplineModal(false);
                    toast.success('Discipline added successfully');
                  } catch (error) {
                    toast.error('Failed to add discipline');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Discipline name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    placeholder="Enter discipline name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Sports">Sports</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDisciplineModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Discipline'}
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        );

      case 'Manage function':
        return (
          <div className="transition-all duration-300 ease-in-out">
            <div className="space-y-6">
              {/* Add Function Button and Search Section */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Button
                  onClick={() => setShowAddFunctionModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Function
                </Button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show entries:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={functionEntriesPerPage}
                      onChange={(e) => setFunctionEntriesPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search functions..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                      onChange={(e) => handleFunctionSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Functions Table */}
              <div className="bg-white rounded-lg shadow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px] text-xs">Function</TableHead>
                      <TableHead className="min-w-[300px] text-xs">Discipline</TableHead>
                      <TableHead className="w-[100px] text-xs">Operation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentFunctions.map((func) => (
                      <TableRow key={func.id}>
                        <TableCell className="text-xs font-medium">{func.function}</TableCell>
                        <TableCell className="text-xs">{func.discipline}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditFunction(func)}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFunction(func)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              Delete
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
                    Showing {functionIndexOfFirstItem + 1} to {Math.min(functionIndexOfLastItem, filteredFunctions.length)} of {filteredFunctions.length} entries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFunctionCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={functionCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(totalFunctionPages)].map((_, index) => (
                      <Button
                        key={index + 1}
                        variant={functionCurrentPage === index + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFunctionCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFunctionCurrentPage(prev => Math.min(prev + 1, totalFunctionPages))}
                      disabled={functionCurrentPage === totalFunctionPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Reset any necessary states based on tab
    if (tab === 'Manage Discipline') {
      setDisciplineCurrentPage(1);
    } else if (tab === 'Manage function') {
      setFunctionCurrentPage(1);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Sports Professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sports Professionals</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5" />
          <span>Add Professional</span>
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
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Tab Content with Transition */}
      <div className="transition-all duration-300 ease-in-out">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Professional"
        message={`Are you sure you want to delete ${selectedProfessional?.name}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedProfessional(null);
          }
        }}
        title={selectedProfessional ? "Edit Professional" : "Add Professional"}
        className="max-w-4xl"
      >
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <AddSportsProfessionalForm
            initialData={selectedProfessional}
            onSubmit={handleAddProfessional}
            onCancel={() => {
              if (!isSubmitting) {
                setShowAddModal(false);
                setSelectedProfessional(null);
              }
            }}
            isSubmitting={isSubmitting}
          />
        </div>
      </Modal>

      <EditSportsProfessionalModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProfessional(null);
        }}
        professional={selectedProfessional}
        federations={federationsData}
        clubs={availableClubs}
        onFederationChange={handleFederationChange}
        onSave={async (updatedData) => {
          try {
            // Here you would make your API call to update the professional
            console.log('Updating professional:', updatedData);
            
            // Update local data
            const updatedProfessionals = professionals.map(p => 
              p.id === selectedProfessional.id ? { ...p, ...updatedData } : p
            );
            setProfessionals(updatedProfessionals);
            setFilteredProfessionals(updatedProfessionals);
            
            setShowEditModal(false);
            setSelectedProfessional(null);
            toast.success('Professional updated successfully');
          } catch (error) {
            toast.error('Failed to update professional');
          }
        }}
      />

      <Modal
        isOpen={showAddFunctionModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddFunctionModal(false);
          }
        }}
        title="Add Function"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setIsSubmitting(true);
              const formData = {
                function: e.target.function.value,
                discipline: e.target.discipline.value
              };
              
              // Here you would make your API call to add the function
              console.log('Adding function:', formData);
              
              // Update local data
              const newFunction = {
                id: functions.length + 1,
                function: formData.function,
                discipline: formData.discipline
              };
              
              setFunctions([...functions, newFunction]);
              setFilteredFunctions([...functions, newFunction]);
              setShowAddFunctionModal(false);
              toast.success('Function added successfully');
            } catch (error) {
              toast.error('Failed to add function');
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Discipline
            </label>
            <select
              name="discipline"
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Discipline</option>
              {disciplines.map(discipline => (
                <option key={discipline.id} value={discipline.name}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Function
            </label>
            <input
              name="function"
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              required
              placeholder="Enter function name"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddFunctionModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Function'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditFunctionModal}
        onClose={() => {
          setShowEditFunctionModal(false);
          setFunctionToEdit(null);
        }}
        title="Edit Function"
      >
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setIsSubmitting(true);
              const formData = {
                function: e.target.function.value,
                discipline: e.target.discipline.value
              };
              
              // Update local data
              const updatedFunctions = functions.map(f => 
                f.id === functionToEdit.id ? { ...f, ...formData } : f
              );
              setFunctions(updatedFunctions);
              setFilteredFunctions(updatedFunctions);
              setShowEditFunctionModal(false);
              setFunctionToEdit(null);
              toast.success('Function updated successfully');
            } catch (error) {
              toast.error('Failed to update function');
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Discipline
            </label>
            <select
              name="discipline"
              className="w-full border rounded-lg px-3 py-2"
              required
              defaultValue={functionToEdit?.discipline}
            >
              <option value="">Select Discipline</option>
              {disciplines.map(discipline => (
                <option key={discipline.id} value={discipline.name}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Function
            </label>
            <input
              name="function"
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              required
              defaultValue={functionToEdit?.function}
              placeholder="Enter function name"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditFunctionModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SportsProfessionals; 