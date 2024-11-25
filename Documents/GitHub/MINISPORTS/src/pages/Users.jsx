import React, { useState, Fragment, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';
import ManageGroups from './ManageGroups';
import AddGroupModal from '../components/AddGroupModal';

function Users() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState(null);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  // Mock data for users
  const [usersData, setUsersData] = useState([
    {
      id: 1,
      name: "Jean d'Amour Rukundo",
      email: "jarukundo@minisports.gov.rw",
      group: "Planning2",
      status: "Active"
    },
    // Add more mock data...
  ]);

  // Mock data for groups
  const groups = [
    "All Groups",
    "Planning1",
    "Planning2",
    "Admin",
    "User",
    "Manager"
  ];

  const statuses = ["All", "Active", "Inactive", "Suspended"];

  // Filter function
  const filteredData = usersData.filter(user => {
    const matchesSearch = Object.values(user).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesGroup = !selectedGroup || selectedGroup === "All Groups" || user.group === selectedGroup;
    const matchesStatus = !selectedStatus || selectedStatus === "All" || user.status === selectedStatus;
    const matchesName = !nameFilter || user.name.toLowerCase().includes(nameFilter.toLowerCase());

    return matchesSearch && matchesGroup && matchesStatus && matchesName;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Calculate the actual numbers for the entries display
  const totalEntries = filteredData.length;
  const firstEntry = totalEntries === 0 ? 0 : startIndex + 1;
  const lastEntry = Math.min(startIndex + entriesPerPage, totalEntries);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedUser) => {
    setUsersData(prev => 
      prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setIsEditModalOpen(false);
    toast.success('User updated successfully');
  };

  const handleAddUser = (newUser) => {
    setUsersData(prev => [...prev, newUser]);
    setIsAddModalOpen(false);
    toast.success('User added successfully');
  };

  const handleAddGroup = (newGroup) => {
    console.log('New group:', newGroup);
    setIsAddGroupModalOpen(false);
    toast.success('Group added successfully');
  };

  // Simulate data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data loading success
        setUsersData([
          {
            id: 1,
            name: "Jean d'Amour Rukundo",
            email: "jarukundo@minisports.gov.rw",
            group: "Planning2",
            status: "Active"
          },
          // Add more mock data here
        ]);
      } catch (err) {
        setError('Failed to load users data. Please try again later.');
        toast.error('Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-600">Loading users data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Add the renderContent function
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Search By</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Group:</label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    {groups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name:</label>
                  <Input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status:</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              {paginatedData.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.group}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
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
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
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
                    {[...Array(totalPages)].map((_, i) => (
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
          </>
        );

      case 'groups':
        return <ManageGroups />;

      default:
        return null;
    }
  };

  // Render content only when data is loaded
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">
          {activeTab === 'users' ? 'Manage Users' : 'Manage Groups'}
        </h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button 
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'addUser' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add User
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'groups' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            Manage Groups
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              activeTab === 'addGroup' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setIsAddGroupModalOpen(true)}
          >
            Add Group
          </button>
        </div>

        {/* Content Area with CSS Transition */}
        <div className="transition-opacity duration-200 ease-in-out">
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditSubmit}
        userData={selectedUser}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <AddGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
        onAdd={handleAddGroup}
      />
    </div>
  );
}

export default Users; 