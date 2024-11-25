import React, { useState, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AddAcademyModal from '../components/AddAcademyModal';
import AddAcademyStudent from '../components/AddAcademyStudent';
import EditAcademyModal from '../components/EditAcademyModal';

function Academies() {
  const [activeTab, setActiveTab] = useState('manage');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAcademy, setSelectedAcademy] = useState(null);
  const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
  const [selectedAcademyStudents, setSelectedAcademyStudents] = useState([]);

  // Add new states for student management
  const [studentSearchFilters, setStudentSearchFilters] = useState({
    firstName: '',
    lastName: '',
    school: '',
    class: ''
  });

  // Add new state for student modal
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  // Add new states for transfer functionality
  const [transferData, setTransferData] = useState({
    fromSchool: '',
    student: '',
    toSchool: ''
  });

  // Add states for available students based on selected school
  const [availableStudents, setAvailableStudents] = useState([]);

  // Mock academies data
  const [academies] = useState([
    {
      id: 1,
      name: 'Lycee de Kigali',
      location: 'City of Kigali',
      category: 'Excellence school',
      students: 1
    },
    {
      id: 2,
      name: 'Agaciro Football Center',
      location: 'City of Kigali',
      category: 'F.Center',
      students: 0
    },
    // ... add more mock data
  ]);

  // Mock data for students
  const [students] = useState([
    {
      id: 1,
      firstName: 'ABAMIKAZI',
      lastName: 'Deborah',
      school: '',
      dateOfBirth: '2006-01-01',
      nationality: 'Rwandan',
      gender: 'Female',
      game: 'Handball',
      class: 'P6'
    },
    {
      id: 2,
      firstName: 'Abatesi',
      lastName: 'Blaise',
      school: '',
      dateOfBirth: '2002-01-12',
      nationality: 'Rwandan',
      gender: 'Male',
      game: 'Handball',
      class: 'S1'
    },
    // ... add more student data
  ]);

  // Mock data for schools/academies (you can fetch this from your backend)
  const academiesList = [
    { id: 1, name: 'Lycee de Kigali' },
    { id: 2, name: 'FAWE Girls School' },
    { id: 3, name: 'College Saint Andre' },
    { id: 4, name: 'Agaciro Football Center' },
    { id: 5, name: 'Alpha Sport' },
    { id: 6, name: 'Amagaju Girls Academy' },
    { id: 7, name: 'Amagaju Youth FC' }
  ];

  // Mock data for students (in real app, this would be fetched based on selected school)
  const mockStudents = {
    1: [ // Lycee de Kigali students
      { id: 1, name: 'ABAMIKAZI Deborah', class: 'P6' },
      { id: 2, name: 'Abatesi Blaise', class: 'S1' }
    ],
    2: [ // FAWE Girls School students
      { id: 3, name: 'ABAYISENGA Caline', class: 'P3' },
      { id: 4, name: 'ABAYISENGA SANDRINE', class: 'S3' }
    ]
    // ... add more students for other schools
  };

  // School options
  const schoolOptions = [
    'Select School',
    'Lycee de Kigali',
    'FAWE Girls School',
    'College Saint Andre'
  ];

  // Class options
  const classOptions = [
    'Select Class',
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6'
  ];

  // Filter academies based on search
  const filteredAcademies = academies.filter(academy => {
    const matchesSearch = Object.values(academy).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSearch;
  });

  // Filter students based on search criteria
  const filteredStudents = students.filter(student => {
    const matchesFirstName = student.firstName.toLowerCase().includes(studentSearchFilters.firstName.toLowerCase());
    const matchesLastName = student.lastName.toLowerCase().includes(studentSearchFilters.lastName.toLowerCase());
    const matchesSchool = !studentSearchFilters.school || studentSearchFilters.school === 'Select School' || student.school === studentSearchFilters.school;
    const matchesClass = !studentSearchFilters.class || studentSearchFilters.class === 'Select Class' || student.class === studentSearchFilters.class;
    
    return matchesFirstName && matchesLastName && matchesSchool && matchesClass;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAcademies.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentAcademies = filteredAcademies.slice(startIndex, startIndex + entriesPerPage);

  // Action handlers
  const handleView = (academy) => {
    setSelectedAcademy(academy);
    setIsViewModalOpen(true);
  };

  const handleEdit = (academy) => {
    setSelectedAcademy(academy);
    setIsEditModalOpen(true);
  };

  const handleDelete = (academy) => {
    setSelectedAcademy(academy);
    setIsDeleteModalOpen(true);
  };

  const handleViewStudents = (academy) => {
    const students = fetchStudentsByAcademy(academy.id);
    setSelectedAcademyStudents(students);
    setIsViewStudentsModalOpen(true);
  };

  // Handle add student
  const handleAddStudent = (studentData) => {
    // Handle the new student data
    console.log('New student:', studentData);
    setIsAddStudentModalOpen(false);
    toast.success('Student added successfully');
  };

  // Handle school from change
  const handleFromSchoolChange = (schoolId) => {
    setTransferData(prev => ({
      ...prev,
      fromSchool: schoolId,
      student: '' // Reset student when school changes
    }));
    setAvailableStudents(mockStudents[schoolId] || []);
  };

  // Handle transfer submit
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    
    if (!transferData.fromSchool || !transferData.student || !transferData.toSchool) {
      toast.error('Please fill in all transfer fields');
      return;
    }

    if (transferData.fromSchool === transferData.toSchool) {
      toast.error('Source and destination schools cannot be the same');
      return;
    }

    // Handle transfer logic here
    console.log('Transfer data:', transferData);
    toast.success('Student transferred successfully');

    // Reset form
    setTransferData({
      fromSchool: '',
      student: '',
      toSchool: ''
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setAcademies(prev => prev.filter(a => a.id !== selectedAcademy.id));
    setIsDeleteModalOpen(false);
    toast.success('Academy deleted successfully');
  };

  // Handle edit submit
  const handleEditSubmit = (updatedAcademy) => {
    setAcademies(prev => prev.map(academy => 
      academy.id === updatedAcademy.id ? updatedAcademy : academy
    ));
    setIsEditModalOpen(false);
    toast.success('Academy updated successfully');
  };

  // Update the renderActions function in the Academies component
  const renderActions = (academy) => (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleView(academy)}
        className="p-1 h-7 w-7"
        title="View Details"
      >
        <Eye className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEdit(academy)}
        className="p-1 h-7 w-7"
        title="Edit Academy"
      >
        <Edit className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleDelete(academy)}
        className="p-1 h-7 w-7"
        title="Delete Academy"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );

  // Render tabs content
  const renderContent = () => {
    switch (activeTab) {
      case 'manage':
        return (
          <>
            {/* Search and Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search academies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Academy
              </Button>
            </div>

            {/* Academies Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Students</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentAcademies.map((academy) => (
                    <tr key={academy.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{academy.name}</td>
                      <td className="px-4 py-3 text-sm">{academy.location}</td>
                      <td className="px-4 py-3 text-sm">{academy.category}</td>
                      <td className="px-4 py-3 text-sm">{academy.students || '-'}</td>
                      <td className="px-4 py-3">
                        {renderActions(academy)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end mt-4 space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-md"
              >
                Previous
              </Button>

              <div className="flex items-center">
                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  {currentPage}
                </span>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded-md"
              >
                Next
              </Button>
            </div>
          </>
        );
      
      case 'students':
        return (
          <>
            {/* Search Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Search By</h2>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name:</label>
                  <Input
                    type="text"
                    value={studentSearchFilters.firstName}
                    onChange={(e) => setStudentSearchFilters(prev => ({
                      ...prev,
                      firstName: e.target.value
                    }))}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name:</label>
                  <Input
                    type="text"
                    value={studentSearchFilters.lastName}
                    onChange={(e) => setStudentSearchFilters(prev => ({
                      ...prev,
                      lastName: e.target.value
                    }))}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">School:</label>
                  <select
                    value={studentSearchFilters.school}
                    onChange={(e) => setStudentSearchFilters(prev => ({
                      ...prev,
                      school: e.target.value
                    }))}
                    className="w-full border rounded-lg p-2"
                  >
                    {schoolOptions.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Class:</label>
                  <select
                    value={studentSearchFilters.class}
                    onChange={(e) => setStudentSearchFilters(prev => ({
                      ...prev,
                      class: e.target.value
                    }))}
                    className="w-full border rounded-lg p-2"
                  >
                    {classOptions.map(classOption => (
                      <option key={classOption} value={classOption}>{classOption}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Add Student Button */}
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setIsAddStudentModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Academy Student
              </Button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">School</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Age/Date of Birth</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nationality</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Game</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{`${student.firstName} ${student.lastName}`}</td>
                      <td className="px-4 py-3 text-sm">{student.schoolName}</td>
                      <td className="px-4 py-3 text-sm">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">{student.nationality}</td>
                      <td className="px-4 py-3 text-sm">{student.gender}</td>
                      <td className="px-4 py-3 text-sm">{student.gameType}</td>
                      <td className="px-4 py-3 text-sm">{student.class}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewStudent(student)}
                            className="p-1 h-7 w-7"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStudent(student)}
                            className="p-1 h-7 w-7"
                            title="Edit Student"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteStudent(student)}
                            className="p-1 h-7 w-7"
                            title="Delete Student"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end mt-4 space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded-md"
              >
                Previous
              </Button>

              <div className="flex items-center">
                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  {currentPage}
                </span>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded-md"
              >
                Next
              </Button>
            </div>
          </>
        );
      
      case 'transfer':
        return (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Academy Student Transfer</h2>
            
            <form onSubmit={handleTransferSubmit} className="space-y-6">
              {/* School From */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  School From <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.fromSchool}
                  onChange={(e) => handleFromSchoolChange(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select School</option>
                  {academiesList.map(academy => (
                    <option key={academy.id} value={academy.id}>
                      {academy.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Student <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.student}
                  onChange={(e) => setTransferData(prev => ({ ...prev, student: e.target.value }))}
                  required
                  disabled={!transferData.fromSchool}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select Student</option>
                  {availableStudents.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.class}
                    </option>
                  ))}
                </select>
              </div>

              {/* School To */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  School To <span className="text-red-500">*</span>
                </label>
                <select
                  value={transferData.toSchool}
                  onChange={(e) => setTransferData(prev => ({ ...prev, toSchool: e.target.value }))}
                  required
                  disabled={!transferData.student}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select School</option>
                  {academiesList
                    .filter(academy => academy.id !== transferData.fromSchool)
                    .map(academy => (
                      <option key={academy.id} value={academy.id}>
                        {academy.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Transfer Student
                </Button>
              </div>
            </form>
          </div>
        );
      
      // Add other tab cases here
      default:
        return null;
    }
  };

  // Update the renderAcademyDetails function
  const renderAcademyDetails = (academy) => {
    if (!academy) return null;

    const details = [
      { label: 'School Name', value: academy.name },
      { label: 'Domain', value: academy.domain || 'Sports' },
      { label: 'Category', value: academy.category },
      { label: 'Province', value: academy.location?.province || 'City of Kigali' },
      { label: 'District', value: academy.location?.district || 'NYARUGENGE' },
      { label: 'Secteur', value: academy.location?.sector || 'Nyarugenge' },
      { label: 'Cellule', value: academy.location?.cell || 'Kiyovu' },
      { label: 'Village', value: academy.location?.village || 'Cercle Sportif' },
      { label: 'LR Name', value: academy.legalRepresentative?.name || 'N/A' },
      { label: 'LR Gender', value: academy.legalRepresentative?.gender || 'N/A' },
      { label: 'LR Email', value: academy.legalRepresentative?.email || 'N/A' },
      { label: 'LR Phone', value: academy.legalRepresentative?.phone || 'N/A' }
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium border-b pb-2">Academy Details</h3>
        <div className="grid grid-cols-1 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b last:border-b-0">
              <div className="text-sm text-gray-500 font-medium">{detail.label}</div>
              <div className="text-sm">{detail.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Mock function to fetch students by academy ID
  const fetchStudentsByAcademy = (academyId) => {
    // This would be an API call in a real application
    const mockStudents = {
      1: [ // Lycee de Kigali students
        { id: 1, name: 'ABAMIKAZI Deborah', class: 'P6', game: 'Handball', gender: 'Female' },
        { id: 2, name: 'Abatesi Blaise', class: 'S1', game: 'Football', gender: 'Male' }
      ],
      2: [ // Agaciro Football Center students
        { id: 3, name: 'ABAYISENGA Caline', class: 'P3', game: 'Basketball', gender: 'Female' },
        { id: 4, name: 'ABAYISENGA SANDRINE', class: 'S3', game: 'Volleyball', gender: 'Female' }
      ]
    };
    return mockStudents[academyId] || [];
  };

  // Add new states for student operations
  const [isViewStudentModalOpen, setIsViewStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [isDeleteStudentModalOpen, setIsDeleteStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Handle student operations
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewStudentModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditStudentModalOpen(true);
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setIsDeleteStudentModalOpen(true);
  };

  const handleDeleteStudentConfirm = () => {
    setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
    setIsDeleteStudentModalOpen(false);
    toast.success('Student deleted successfully');
  };

  const handleEditStudentSubmit = (updatedStudent) => {
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setIsEditStudentModalOpen(false);
    toast.success('Student updated successfully');
  };

  // Render student details in view modal
  const renderStudentDetails = (student) => {
    if (!student) return null;

    const details = [
      { section: 'Personal Information', fields: [
        { label: 'Full Name', value: `${student.firstName} ${student.lastName}` },
        { label: 'Gender', value: student.gender },
        { label: 'Date of Birth', value: new Date(student.dateOfBirth).toLocaleDateString() },
        { label: 'Place of Birth', value: student.placeOfBirth },
        { label: 'Place of Residence', value: student.placeOfResidence },
        { label: 'Nationality', value: student.nationality },
        { label: 'Other Nationality', value: student.otherNationality || 'N/A' }
      ]},
      { section: 'Identification', fields: [
        { label: 'ID Type', value: student.identificationType },
        ...(student.identificationType === 'ID' ? [
          { label: 'ID Number', value: student.idNumber }
        ] : [
          { label: 'Passport Number', value: student.passportNumber },
          { label: 'Passport Expiry', value: student.passportExpiryDate }
        ])
      ]},
      { section: 'Academic Information', fields: [
        { label: 'School/Academy', value: student.schoolName },
        { label: 'Class', value: student.class },
        { label: 'Game Type', value: student.gameType }
      ]},
      { section: 'Contact Information', fields: [
        { label: 'Parents/Guardian', value: student.parentsGuardian },
        { label: 'Contact', value: student.contact || 'N/A' }
      ]}
    ];

    return (
      <div className="space-y-6">
        {student.passportPicture && (
          <div className="flex justify-center mb-6">
            <img 
              src={URL.createObjectURL(student.passportPicture)}
              alt="Student"
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
        )}

        {details.map((section, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <h3 className="text-lg font-medium mb-4">{section.section}</h3>
            <div className="grid grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <label className="text-sm text-gray-500">{field.label}</label>
                  <p className="font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Manage Academies</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'manage' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Academies
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'students' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('students')}
          >
            Manage Academy Students
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'transfer' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('transfer')}
          >
            Transfer Students
          </button>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-200 ease-in-out">
          {renderContent()}
        </div>
      </div>

      <AddAcademyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(data) => {
          // Handle adding new academy
          console.log('New academy:', data);
          setIsAddModalOpen(false);
          toast.success('Academy added successfully');
        }}
      />

      {/* Add Student Modal */}
      <AddAcademyStudent
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        onAdd={handleAddStudent}
      />

      {/* View Academy Modal */}
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
                    View Academy School
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderAcademyDetails(selectedAcademy)}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

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
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <Dialog.Title className="text-lg font-medium">
                    Delete Academy
                  </Dialog.Title>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete "{selectedAcademy?.name}"? 
                  This action cannot be undone.
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
                    Delete Academy
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add EditAcademyModal */}
      <EditAcademyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAcademy(null);
        }}
        onEdit={handleEditSubmit}
        academyData={selectedAcademy}
      />

      {/* Add View Students Modal */}
      <Transition appear show={isViewStudentsModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewStudentsModalOpen(false)}
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Academy Students
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewStudentsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {selectedAcademyStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Class</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Game</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Gender</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedAcademyStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{student.name}</td>
                            <td className="px-4 py-3">{student.class}</td>
                            <td className="px-4 py-3">{student.game}</td>
                            <td className="px-4 py-3">{student.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No students found for this academy</p>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <Button onClick={() => setIsViewStudentsModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Student Modal */}
      <Transition appear show={isViewStudentModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewStudentModalOpen(false)}
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Student Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewStudentModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderStudentDetails(selectedStudent)}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button onClick={() => setIsViewStudentModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Student Confirmation Modal */}
      <Transition appear show={isDeleteStudentModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDeleteStudentModalOpen(false)}
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
                    Delete Student
                  </Dialog.Title>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? 
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteStudentModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteStudentConfirm}
                  >
                    Delete Student
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Student Modal */}
      <AddAcademyStudent
        isOpen={isEditStudentModalOpen}
        onClose={() => {
          setIsEditStudentModalOpen(false);
          setSelectedStudent(null);
        }}
        onAdd={handleEditStudentSubmit}
        studentData={selectedStudent}
        isEditing={true}
      />
    </div>
  );
}

export default Academies; 