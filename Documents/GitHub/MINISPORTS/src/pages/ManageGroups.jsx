import React, { useState, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import EditGroupModal from '../components/EditGroupModal';

function ManageGroups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Mock data for groups
  const [groupsData, setGroupsData] = useState([
    {
      id: 1,
      name: "Admin Group",
      modules: 13,
      users: 3,
      permissions: {
        national_teams: { Add: true, Edit: true, Delete: true },
        youth_talents: { Add: true, Edit: true, Delete: false },
        // ... add permissions for other modules
      }
    },
    {
      id: 2,
      name: "alliance schools",
      modules: 1,
      users: 0,
      permissions: {
        national_teams: { Add: false, Edit: false, Delete: false },
        youth_talents: { Add: true, Edit: false, Delete: false },
        // ... add permissions for other modules
      }
    },
    {
      id: 3,
      name: "CULTURE",
      modules: 10,
      users: 1,
      permissions: {
        national_teams: { Add: true, Edit: true, Delete: false },
        youth_talents: { Add: true, Edit: true, Delete: true },
        // ... add permissions for other modules
      }
    }
  ]);

  // Filter function
  const filteredData = groupsData.filter(group =>
    Object.values(group).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // Calculate entries display
  const totalEntries = filteredData.length;
  const firstEntry = totalEntries === 0 ? 0 : startIndex + 1;
  const lastEntry = Math.min(startIndex + entriesPerPage, totalEntries);

  const handleEdit = (group) => {
    const groupToEdit = {
      ...group,
      permissions: group.permissions || {} // Ensure permissions exist
    };
    setSelectedGroup(groupToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedGroup) => {
    setGroupsData(prev => 
      prev.map(group => {
        if (group.id === updatedGroup.id) {
          // Count active modules based on permissions
          const activeModules = Object.values(updatedGroup.permissions).reduce(
            (count, perms) => 
              count + (Object.values(perms).some(v => v) ? 1 : 0),
            0
          );
          
          return {
            ...updatedGroup,
            modules: activeModules // Update the modules count
          };
        }
        return group;
      })
    );
    setIsEditModalOpen(false);
    toast.success('Group updated successfully');
  };

  const handleDelete = (group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setGroupsData(prev => prev.filter(group => group.id !== groupToDelete.id));
    setIsDeleteModalOpen(false);
    toast.success('Group deleted successfully');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Manage Groups</h1>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="mr-2">Show entries:</label>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded p-1"
              >
                <option value={100}>100</option>
                <option value={50}>50</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
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
          </div>
        </div>

        {/* Groups Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {paginatedData.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modules</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{group.name}</td>
                    <td className="px-4 py-3">{group.modules}</td>
                    <td className="px-4 py-3">{group.users}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(group)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(group)}
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
      </div>

      <EditGroupModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGroup(null); // Clear selected group when closing
        }}
        onEdit={handleEditSubmit}
        groupData={selectedGroup}
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
                      Delete Group
                    </Dialog.Title>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete the group "{groupToDelete?.name}"? 
                    This will also remove all associated permissions and cannot be undone.
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
                      Delete Group
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

export default ManageGroups; 