import React, { useState, useEffect, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Edit, Download, Trash2, AlertTriangle, Eye, X } from 'lucide-react';
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import toast from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import AddEmployeeVoting from '../components/AddEmployeeVoting';
import ManageEmployeeVoting from '../components/ManageEmployeeVoting';

function Employee() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  // Mock data
  const [employeesData, setEmployeesData] = useState([
    {
      id: '#1',
      names: 'GATSIMBANYI Aimable',
      startDate: '22/04/2022',
      employeeStatus: 'Active',
      employeeType: 'ON SALARY',
      department: 'PS',
      supervisor: 'KAMANZI'
    },
    {
      id: '#2',
      names: 'KAYITAKIRWA Eric',
      startDate: '22/04/2022',
      employeeStatus: 'Dormant',
      employeeType: 'ON SALARY',
      department: 'PS',
      supervisor: 'KAMANZI'
    },
    // Add more mock data...
  ]);

  // Calculate counts for different statuses
  const counts = {
    total: employeesData.length,
    active: employeesData.filter(emp => emp.employeeStatus === 'Active').length,
    dormant: employeesData.filter(emp => emp.employeeStatus === 'Dormant').length,
    onSalary: employeesData.filter(emp => emp.employeeType === 'ON SALARY').length,
    contract: employeesData.filter(emp => emp.employeeType === 'CONTRACT').length
  };

  // Navigation tabs with dynamic counts
  const tabs = [
    { id: 'all', label: `All ${counts.total}` },
    { id: 'manage', label: 'Manage Employee' },
    { id: 'addVoting', label: 'Add Employee Voting' },
    { id: 'manageVoting', label: 'Manage Employee Voting' }
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Filter data based on search
  const filteredData = employeesData.filter(employee =>
    Object.values(employee).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Update handleAddEmployee function
  const handleAddEmployee = (newEmployee) => {
    const formattedEmployee = {
      id: `#${employeesData.length + 1}`,
      names: `${newEmployee.firstName} ${newEmployee.lastName}`,
      startDate: newEmployee.startDate,
      employeeStatus: newEmployee.employeeStatus,
      employeeType: newEmployee.employeeType,
      department: newEmployee.department || 'PS', // Default to PS if not provided
      supervisor: newEmployee.supervisorName || 'KAMANZI' // Default to KAMANZI if not provided
    };

    setEmployeesData(prev => [...prev, formattedEmployee]);
    setIsAddModalOpen(false);
    toast.success('Employee added successfully');
  };

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle edit
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = (updatedEmployee) => {
    setEmployeesData(prev => 
      prev.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
    setIsEditModalOpen(false);
    toast.success('Employee updated successfully');
  };

  // Handle delete
  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    setEmployeesData(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
    setIsDeleteModalOpen(false);
    toast.success('Employee deleted successfully');
  };

  // Handle view
  const handleView = (employee) => {
    setViewEmployee(employee);
    setIsViewModalOpen(true);
  };

  // Handle download
  const handleDownload = (employee) => {
    // Implement download logic here
    toast.success('Downloading employee data...');
  };

  // Update the View Employee Modal section
  const renderEmployeeDetails = (employee) => {
    if (!employee) return null;

    return (
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg border-b pb-2">Personal Information</h3>
          
          {/* Profile Picture */}
          {employee.passportPicture && (
            <div className="mb-4">
              <img 
                src={employee.passportPicture} 
                alt={employee.names}
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Employee ID</label>
              <p className="font-medium">{employee.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-medium">{employee.names}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Start Date</label>
              <p className="font-medium">{employee.startDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <p>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  employee.employeeStatus === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.employeeStatus}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{employee.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="font-medium">{employee.phone}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">National ID</label>
            <p className="font-medium">{employee.nationalId}</p>
          </div>
        </div>

        {/* Employment Details */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg border-b pb-2">Employment Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Department</label>
              <p className="font-medium">{employee.department}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Employee Type</label>
              <p className="font-medium">{employee.employeeType}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Supervisor</label>
            <p className="font-medium">{employee.supervisor}</p>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg border-b pb-2">Address Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Province</label>
              <p className="font-medium">{employee.province}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">District</label>
              <p className="font-medium">{employee.district}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Sector</label>
              <p className="font-medium">{employee.sector}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Cell</label>
              <p className="font-medium">{employee.cell}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Village</label>
            <p className="font-medium">{employee.village}</p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg border-b pb-2">Emergency Contact</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Contact Name</label>
              <p className="font-medium">{`${employee.contactFirstName} ${employee.contactLastName}`}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Relationship</label>
              <p className="font-medium">{employee.relationship}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Contact Phone</label>
            <p className="font-medium">{employee.contactPhone}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'all':
      case 'manage':
        return (
          <div className="transition-all duration-200 ease-in-out">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Total Employees</h3>
                <p className="text-2xl font-semibold">{counts.total}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Active</h3>
                <p className="text-2xl font-semibold text-green-600">{counts.active}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">Dormant</h3>
                <p className="text-2xl font-semibold text-red-600">{counts.dormant}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm text-gray-500">On Salary</h3>
                <p className="text-2xl font-semibold text-blue-600">{counts.onSalary}</p>
              </div>
            </div>

            {/* Search and Add Employee */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
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
                Add Employee
              </Button>
            </div>

            {/* Employee Count */}
            <div className="mb-6">
              <h2 className="text-lg font-medium">Employees ({filteredData.length})</h2>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              {filteredData.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Names</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-blue-600">{employee.id}</td>
                        <td className="px-4 py-3 text-sm">{employee.names}</td>
                        <td className="px-4 py-3 text-sm">{employee.startDate}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            employee.employeeStatus === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.employeeStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{employee.employeeType}</td>
                        <td className="px-4 py-3 text-sm">{employee.department}</td>
                        <td className="px-4 py-3 text-sm">{employee.supervisor}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(employee)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(employee)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(employee)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(employee)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
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
                    Try adjusting your search
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'addVoting':
        return (
          <div className="transition-all duration-200 ease-in-out">
            <AddEmployeeVoting />
          </div>
        );

      case 'manageVoting':
        return <ManageEmployeeVoting />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-600">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Employee Management</h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]"> {/* Add minimum height to prevent layout shift */}
          {renderContent()}
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        onEdit={handleEditSubmit}
        employeeData={selectedEmployee}
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
                      Delete Employee
                    </Dialog.Title>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete employee "{employeeToDelete?.names}"? 
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
                      Delete Employee
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Employee Modal */}
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
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-xl font-bold">
                      Employee Details
                    </Dialog.Title>
                    <button
                      onClick={() => setIsViewModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Employee Details Content */}
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {renderEmployeeDetails(viewEmployee)}
                  </div>

                  <div className="flex justify-end mt-6 pt-4 border-t">
                    <Button
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      Close
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

export default Employee; 