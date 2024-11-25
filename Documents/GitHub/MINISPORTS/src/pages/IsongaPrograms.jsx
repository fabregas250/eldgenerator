import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Search, Plus, Filter, X, Eye, Edit, Trash2, Users, Printer, AlertCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddIsongaProgramForm from '../components/forms/AddIsongaProgramForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';

const IsongaPrograms = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('Manage Institution');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [programs, setPrograms] = useState([
    {
      id: '#1',
      name: 'Coll. Christ Roi Nyanza',
      location: 'Southern',
      category: 'Excellence school',
      students: '-'
    },
    {
      id: '#2',
      name: 'College de Gisenyi',
      location: 'Western',
      category: 'Excellence school',
      students: '1'
    }
  ]);
  const [filteredPrograms, setFilteredPrograms] = useState(programs);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter configuration
  const filterConfig = {
    status: ['Active', 'Completed', 'Cancelled'],
    category: ['Football', 'Basketball', 'Volleyball', 'Athletics'],
    location: ['Amahoro Stadium', 'BK Arena', 'Kigali Arena']
  };

  const tabs = ['Manage Institution', 'Manage Students', 'Transfer Students'];

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load programs. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddProgram = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Program added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add program'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (program) => {
    setSelectedProgram(program);
    setShowAddModal(true);
  };

  const handleDelete = async (program) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Program deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete program'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (program) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(programs.map(program => program.id));
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

  const handleViewDetails = (program) => {
    setSelectedProgram(program);
    setShowDetailsModal(true);
  };

  const handleViewStudents = (program) => {
    setSelectedProgram(program);
    setShowStudentsModal(true);
  };

  const handleSearch = (searchValue) => {
    if (!searchValue) {
      setFilteredPrograms(programs);
      return;
    }

    const filtered = programs.filter(program => 
      program.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      program.location?.toLowerCase().includes(searchValue.toLowerCase()) ||
      program.category?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPrograms(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrograms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  // Add this initial data for students
  const initialStudents = [
    {
      id: 1,
      name: 'test qddsd',
      school: 'College de Gisenyi',
      dateOfBirth: '16 Apr 2021',
      nationality: 'Zambian',
      gender: 'Male',
      game: 'Football',
      class: 'P3'
    },
    {
      id: 2,
      name: 'test rt',
      school: 'Lycee de Kigali',
      dateOfBirth: '02 Jan 2001',
      nationality: 'Rwandan',
      gender: 'Male',
      game: 'Football',
      class: 'S4'
    }
  ];

  // Add these states for student management
  const [students, setStudents] = useState(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState(initialStudents);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentEntriesPerPage, setStudentEntriesPerPage] = useState(100);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Add this function to handle student search
  const handleStudentSearch = (searchTerm) => {
    const filtered = initialStudents.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setStudentCurrentPage(1);
  };

  // Add student pagination calculations
  const studentIndexOfLastItem = studentCurrentPage * studentEntriesPerPage;
  const studentIndexOfFirstItem = studentIndexOfLastItem - studentEntriesPerPage;
  const currentStudents = filteredStudents.slice(studentIndexOfFirstItem, studentIndexOfLastItem);
  const totalStudentPages = Math.ceil(filteredStudents.length / studentEntriesPerPage);

  // Add these states for student form
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [idType, setIdType] = useState('nid');
  const [idNumber, setIdNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [idError, setIdError] = useState('');
  const [isLoadingNIDA, setIsLoadingNIDA] = useState(false);
  const [nidaData, setNidaData] = useState(null);

  // Add this function to handle NIDA lookup
  const handleNIDLookup = async (id, type) => {
    setIsLoadingNIDA(true);
    setIdError('');
    try {
      // Simulate API call to NIDA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate NIDA response
      const mockNIDAData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        maritalStatus: 'Single',
        address: {
          province: 'Kigali City',
          district: 'Gasabo',
          sector: 'Kimironko',
          cell: 'Kibagabaga',
          village: 'Nyagatovu'
        },
        photo: null // Base64 encoded photo would be here
      };

      setNidaData(mockNIDAData);
    } catch (error) {
      setIdError('Failed to verify ID. Please try again.');
    } finally {
      setIsLoadingNIDA(false);
    }
  };

  // Add these handler functions after other handlers
  const handleViewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetailsModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditStudentModal(true);
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setShowDeleteStudentModal(true);
  };

  const handleConfirmDeleteStudent = async () => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to delete the student
      const updatedStudents = students.filter(s => s.id !== studentToDelete.id);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setShowDeleteStudentModal(false);
      setStudentToDelete(null);
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add these states near the other state declarations
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Add this function to render student details
  const renderStudentDetails = (student) => {
    return (
      <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <img 
              src="/logo.png" 
              alt="MINISPORTS Logo" 
              className="h-16"
            />
            <div className="text-right">
              <h2 className="text-xl font-bold">Student Details Report</h2>
              <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <hr className="border-t-2 border-gray-200" />
        </div>

        {/* Student Photo and Print Button */}
        <div className="flex justify-between items-start">
          <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Photo
              </div>
            )}
          </div>
          <Button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 text-white print:hidden"
          >
            <Printer className="h-4 w-4" />
            Print Details
          </Button>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{student.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">School</label>
              <p className="font-medium">{student.school}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date of Birth</label>
              <p className="font-medium">{student.dateOfBirth}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Nationality</label>
              <p className="font-medium">{student.nationality}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Gender</label>
              <p className="font-medium">{student.gender}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Class</label>
              <p className="font-medium">{student.class}</p>
            </div>
          </div>
        </div>

        {/* Game Information */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Game Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Game Type</label>
              <p className="font-medium">{student.game}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Position/Role</label>
              <p className="font-medium">{student.position || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Print Footer - Only visible when printing */}
        <div className="hidden print:block mt-8 pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-500">
            <p>MINISPORTS Web Application</p>
            <p>Page 1 of 1</p>
          </div>
        </div>

        {/* Print-specific styles */}
        <style type="text/css" media="print">
          {`
            @page { 
              size: A4; 
              margin: 2cm; 
            }
            body { 
              font-size: 12pt;
              color: #000;
              background: #fff;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:block {
              display: block !important;
            }
          `}
        </style>
      </div>
    );
  };

  // Add this sample data for schools and transfers
  const [schools] = useState([
    {
      id: 1,
      name: 'Coll. Christ Roi Nyanza',
      students: [
        { id: 1, name: 'test qddsd', class: 'P3', age: '16' },
        { id: 2, name: 'Jean Pierre', class: 'P4', age: '15' }
      ]
    },
    {
      id: 2,
      name: 'College de Gisenyi',
      students: [
        { id: 3, name: 'test rt', class: 'S4', age: '18' },
        { id: 4, name: 'Marie Claire', class: 'S3', age: '17' }
      ]
    }
  ]);

  // Add these states for transfer
  const [fromSchool, setFromSchool] = useState('');
  const [toSchool, setToSchool] = useState('');
  const [transferStudent, setTransferStudent] = useState('');
  const [availableStudents, setAvailableStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);

  // Add this function to handle school change
  const handleFromSchoolChange = async (schoolId) => {
    setFromSchool(schoolId);
    setTransferStudent('');
    setIsLoadingStudents(true);
    
    try {
      // Simulate API call to fetch students
      await new Promise(resolve => setTimeout(resolve, 1000));
      const school = schools.find(s => s.id === parseInt(schoolId));
      setAvailableStudents(school?.students || []);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Add this function to handle transfer submission
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!fromSchool) {
      toast.error('Please select source school');
      return;
    }
    if (!transferStudent) {
      toast.error('Please select a student');
      return;
    }
    if (!toSchool) {
      toast.error('Please select destination school');
      return;
    }
    if (fromSchool === toSchool) {
      toast.error('Source and destination schools cannot be the same');
      return;
    }

    // Show confirmation dialog
    setShowTransferConfirm(true);
  };

  // Add this function to process transfer
  const processTransfer = async () => {
    try {
      setIsSubmitting(true);
      // Here you would make your API call to process the transfer
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFromSchool('');
      setToSchool('');
      setTransferStudent('');
      setShowTransferConfirm(false);
      toast.success('Transfer processed successfully');
    } catch (error) {
      toast.error('Failed to process transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function before the return statement
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Manage Institution':
        return (
          <div className="transition-all duration-300 ease-in-out">
            <div className="space-y-6">
              {/* Search and Entries Section */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show entries:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search institutions..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px] text-xs">Name</TableHead>
                      <TableHead className="min-w-[100px] text-xs">Location</TableHead>
                      <TableHead className="min-w-[150px] text-xs">Category</TableHead>
                      <TableHead className="w-[80px] text-xs">Students</TableHead>
                      <TableHead className="w-[150px] text-xs">Operation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="text-xs font-medium">{program.name}</TableCell>
                        <TableCell className="text-xs">{program.location}</TableCell>
                        <TableCell className="text-xs">{program.category}</TableCell>
                        <TableCell className="text-xs">{program.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewDetails(program)}
                              className="p-1 rounded-lg hover:bg-gray-100"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(program)}
                              className="p-1 rounded-lg hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(program)}
                              className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleViewStudents(program)}
                              className="p-1 rounded-lg hover:bg-gray-100"
                              title="View Students"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case 'Manage Students':
        return (
          <div className="transition-all duration-300 ease-in-out">
            <div className="space-y-6">
              {/* Search and Entries Section */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Button
                  onClick={() => setShowAddStudentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show entries:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={studentEntriesPerPage}
                      onChange={(e) => setStudentEntriesPerPage(Number(e.target.value))}
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
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                      onChange={(e) => handleStudentSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-lg shadow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px] text-xs">Name</TableHead>
                      <TableHead className="min-w-[150px] text-xs">School</TableHead>
                      <TableHead className="min-w-[120px] text-xs">Age/date of birth</TableHead>
                      <TableHead className="min-w-[100px] text-xs">Nationality</TableHead>
                      <TableHead className="w-[80px] text-xs">Gender</TableHead>
                      <TableHead className="w-[100px] text-xs">Game</TableHead>
                      <TableHead className="w-[80px] text-xs">Class</TableHead>
                      <TableHead className="w-[150px] text-xs">Operation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="text-xs font-medium">{student.name}</TableCell>
                        <TableCell className="text-xs">{student.school}</TableCell>
                        <TableCell className="text-xs">{student.dateOfBirth}</TableCell>
                        <TableCell className="text-xs">{student.nationality}</TableCell>
                        <TableCell className="text-xs">{student.gender}</TableCell>
                        <TableCell className="text-xs">{student.game}</TableCell>
                        <TableCell className="text-xs">{student.class}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewStudentDetails(student)}
                              className="p-1 rounded-lg hover:bg-gray-100"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="p-1 rounded-lg hover:bg-gray-100"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student)}
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
                    Showing {studentIndexOfFirstItem + 1} to {Math.min(studentIndexOfLastItem, filteredStudents.length)} of {filteredStudents.length} entries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStudentCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={studentCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(totalStudentPages)].map((_, index) => (
                      <Button
                        key={index + 1}
                        variant={studentCurrentPage === index + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStudentCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStudentCurrentPage(prev => Math.min(prev + 1, totalStudentPages))}
                      disabled={studentCurrentPage === totalStudentPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Transfer Students':
        return (
          <div className="transition-all duration-300 ease-in-out">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Student Transfer Form</h2>
              
              <form onSubmit={handleTransferSubmit} className="space-y-6">
                {/* Source School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School From <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={fromSchool}
                    onChange={(e) => handleFromSchoolChange(e.target.value)}
                    required
                  >
                    <option value="">Select School</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={transferStudent}
                    onChange={(e) => setTransferStudent(e.target.value)}
                    required
                    disabled={!fromSchool || isLoadingStudents}
                  >
                    <option value="">
                      {isLoadingStudents 
                        ? 'Loading students...' 
                        : fromSchool 
                          ? 'Select Student'
                          : 'Select school first'
                      }
                    </option>
                    {availableStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.class} (Age: {student.age})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School To <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={toSchool}
                    onChange={(e) => setToSchool(e.target.value)}
                    required
                    disabled={!transferStudent}
                  >
                    <option value="">Select School</option>
                    {schools
                      .filter(school => school.id !== parseInt(fromSchool))
                      .map(school => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting || !fromSchool || !transferStudent || !toSchool}
                  >
                    {isSubmitting ? 'Processing...' : 'Process Transfer'}
                  </Button>
                </div>
              </form>
            </div>

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
                      <p>Please confirm the following transfer:</p>
                      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                        <p>
                          <span className="font-semibold">Student:</span>{' '}
                          {availableStudents.find(s => s.id === parseInt(transferStudent))?.name}
                        </p>
                        <p>
                          <span className="font-semibold">From:</span>{' '}
                          {schools.find(s => s.id === parseInt(fromSchool))?.name}
                        </p>
                        <p>
                          <span className="font-semibold">To:</span>{' '}
                          {schools.find(s => s.id === parseInt(toSchool))?.name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        This action will transfer all student records to the new school.
                      </p>
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
          </div>
        );

      default:
        return null;
    }
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

      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Isonga Programs
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          disabled={isSubmitting}
        >
          <Plus className="h-5 w-5" />
          <span>Add Institution</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Tab Content with Transition */}
      <div className="relative">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Program"
        message={`Are you sure you want to delete ${selectedProgram?.name}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedProgram(null);
          }
        }}
        title={selectedProgram ? "Edit Program" : "Add Program"}
      >
        <AddIsongaProgramForm
          initialData={selectedProgram}
          onSubmit={handleAddProgram}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedProgram(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedProgram(null);
        }}
        title={selectedProgram ? `${selectedProgram.name} Details` : 'Institution Details'}
      >
        {selectedProgram && (
          <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 sticky top-0 bg-white py-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{selectedProgram.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Domain</label>
                  <p className="font-medium">{selectedProgram.domain || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">{selectedProgram.category || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Students</label>
                  <p className="font-medium">{selectedProgram.students || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 sticky top-0 bg-white py-2">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Province</label>
                  <p className="font-medium">{selectedProgram.location?.province || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">District</label>
                  <p className="font-medium">{selectedProgram.location?.district || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Sector</label>
                  <p className="font-medium">{selectedProgram.location?.sector || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Cell</label>
                  <p className="font-medium">{selectedProgram.location?.cell || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Village</label>
                  <p className="font-medium">{selectedProgram.location?.village || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Legal Representative Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 sticky top-0 bg-white py-2">Legal Representative</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{selectedProgram.legalRepresentative?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="font-medium">{selectedProgram.legalRepresentative?.gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{selectedProgram.legalRepresentative?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{selectedProgram.legalRepresentative?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Additional Information (if any) */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4 sticky top-0 bg-white py-2">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Add any additional fields here */}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => {
          setShowStudentsModal(false);
          setSelectedProgram(null);
        }}
        title={selectedProgram ? `${selectedProgram.name} Students` : 'Students'}
      >
        {selectedProgram && (
          <div className="space-y-4">
            <p>Students list will be displayed here</p>
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => {
          setShowAddStudentModal(false);
          setNidaData(null);
          setIdType('nid');
          setIdNumber('');
          setPassportExpiry('');
          setIdError('');
        }}
        title="Add Student"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission
        }} className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
          {/* ID Verification Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">ID Verification</h3>
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
              <label className="flex items-center">
                <input
                  type="radio"
                  name="idType"
                  value="na"
                  checked={idType === 'na'}
                  onChange={(e) => {
                    setIdType(e.target.value);
                    setIdNumber('');
                    setIdError('');
                  }}
                  className="mr-2"
                />
                N/A
              </label>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  {idType === 'nid' ? 'National ID Number' : idType === 'passport' ? 'Passport Number' : 'Reference Number'}
                </label>
                <input
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 ${idError ? 'border-red-500' : ''}`}
                  placeholder={idType === 'nid' ? 'Enter 16-digit ID number' : 'Enter number'}
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
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              {idType !== 'na' && (
                <Button
                  type="button"
                  onClick={() => handleNIDLookup(idNumber, idType)}
                  disabled={isLoadingNIDA || !idNumber || (idType === 'passport' && !passportExpiry)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoadingNIDA ? 'Verifying...' : 'Verify'}
                </Button>
              )}
            </div>

            {idError && (
              <div className="text-red-500 text-sm mt-1">
                {idError}
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Passport Picture
            </label>
            <div className="mt-1 flex items-center gap-4">
              {nidaData?.photo ? (
                <img
                  src={`data:image/jpeg;base64,${nidaData.photo}`}
                  alt="ID Photo"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer text-center p-4"
                  >
                    <div className="text-gray-400">Click to upload</div>
                    <div className="text-xs text-gray-400">PNG, JPG up to 5MB</div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.firstName || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.lastName || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.gender || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.dateOfBirth || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.address?.province || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.address?.district || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sector</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.address?.sector || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cell</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.address?.cell || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Village</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                value={nidaData?.address?.village || ''}
                readOnly={!!nidaData}
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nationality</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Nationality</option>
                <option value="rwandan">Rwandan</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Nationality</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="If applicable"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parents/Guardian Names</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution Type</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Type</option>
                <option value="school">School</option>
                <option value="academy">Academy</option>
                <option value="center">Training Center</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution Name</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Institution</option>
                {/* Add institutions based on selected type */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class/Level</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Class</option>
                <option value="p1">P1</option>
                <option value="p2">P2</option>
                {/* Add more classes */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Game Type</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Game</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                {/* Add more games */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <input
                type="tel"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddStudentModal(false);
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
              disabled={isLoadingNIDA}
            >
              Add Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Details Modal */}
      <Modal
        isOpen={showStudentDetailsModal}
        onClose={() => {
          setShowStudentDetailsModal(false);
          setSelectedStudent(null);
        }}
        title="Student Details"
        className="max-w-4xl"
      >
        {selectedStudent && renderStudentDetails(selectedStudent)}
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditStudentModal}
        onClose={() => {
          setShowEditStudentModal(false);
          setSelectedStudent(null);
        }}
        title="Edit Student"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              name: e.target.name.value,
              school: e.target.school.value,
              dateOfBirth: e.target.dateOfBirth.value,
              nationality: e.target.nationality.value,
              gender: e.target.gender.value,
              game: e.target.game.value,
              class: e.target.class.value
            };
            
            // Update local data
            const updatedStudents = students.map(s => 
              s.id === selectedStudent.id ? { ...s, ...formData } : s
            );
            setStudents(updatedStudents);
            setFilteredStudents(updatedStudents);
            setShowEditStudentModal(false);
            setSelectedStudent(null);
            toast.success('Student updated successfully');
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={selectedStudent?.name}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">School</label>
              <input
                type="text"
                name="school"
                defaultValue={selectedStudent?.school}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="text"
                name="dateOfBirth"
                defaultValue={selectedStudent?.dateOfBirth}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nationality</label>
              <input
                type="text"
                name="nationality"
                defaultValue={selectedStudent?.nationality}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                defaultValue={selectedStudent?.gender}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Game</label>
              <input
                type="text"
                name="game"
                defaultValue={selectedStudent?.game}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <input
                type="text"
                name="class"
                defaultValue={selectedStudent?.class}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditStudentModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Student Confirmation Dialog */}
      <Dialog open={showDeleteStudentModal} onOpenChange={setShowDeleteStudentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Student
            </DialogTitle>
            <DialogDescription className="py-4">
              <div className="space-y-2">
                <p>Are you sure you want to delete this student?</p>
                {studentToDelete && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><span className="font-semibold">Name:</span> {studentToDelete.name}</p>
                    <p><span className="font-semibold">School:</span> {studentToDelete.school}</p>
                    <p><span className="font-semibold">Class:</span> {studentToDelete.class}</p>
                  </div>
                )}
                <p className="text-sm text-red-600">This action cannot be undone.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteStudentModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteStudent}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Student'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IsongaPrograms; 