import React, { useState, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Eye, Edit, Download, Trash2, AlertTriangle, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AddContractModal from '../components/AddContractModal';
import EditContractModal from '../components/EditContractModal';

function Contracts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { isDarkMode } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Mock contracts data
  const [contracts] = useState([
    {
      id: '.01/2015',
      title: 'MEMORANDUM OF UNDERSTANDING ON IMPLEMENTATION OF PARTNERSHIP THAT LEADS TO DEMAND DRIVEN SKILLS DEVELOPMENT IN SPORTS SECTORS',
      duration: '6 months',
      amount: '700,000 FRW',
      supplier: 'THE WORKFORCE DEVELOPMENT IN SPORT SECTORS',
      supervisor: 'FLORENT HABYARIMANA',
      startDate: '2015-12-11',
      endDate: '2016-06-11',
      status: 'Active',
      percentage: calculateProgress('2015-12-11', '2016-06-11')
    }
  ]);

  // Calculate contract progress based on dates
  function calculateProgress(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (today < start) return 0;
    if (today > end) return 100;

    const total = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  }

  // Filter contracts that are expiring soon (within 30 days)
  const expiringSoonContracts = contracts.filter(contract => {
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  // Filter based on search
  const filteredContracts = contracts.filter(contract =>
    Object.values(contract).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContracts = filteredContracts.slice(startIndex, endIndex);

  // Add contract handler
  const handleAddContract = (newContract) => {
    // Handle the new contract data
    console.log('New contract:', newContract);
    setIsAddModalOpen(false);
    toast.success('Contract added successfully');
  };

  // Handle view contract
  const handleView = (contract) => {
    setSelectedContract(contract);
    setIsViewModalOpen(true);
  };

  // Handle delete contract
  const handleDelete = (contract) => {
    setSelectedContract(contract);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Remove the contract from the data
    const updatedContracts = contracts.filter(c => c.id !== selectedContract.id);
    setContracts(updatedContracts);
    setIsDeleteModalOpen(false);
    toast.success('Contract deleted successfully');
  };

  // Handle edit
  const handleEdit = (contract) => {
    setSelectedContract(contract);
    setIsEditModalOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = (updatedContract) => {
    const updatedContracts = contracts.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    );
    setContracts(updatedContracts);
    setIsEditModalOpen(false);
    toast.success('Contract updated successfully');
  };

  // Render contract details in view modal
  const renderContractDetails = (contract) => {
    if (!contract) return null;

    return (
      <div className="space-y-6">
        {/* Contract Information */}
        <div>
          <h3 className="text-lg font-medium border-b pb-2">Contract Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-500">Contract No</label>
              <p className="font-medium">{contract.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Title</label>
              <p className="font-medium">{contract.title}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Duration</label>
              <p className="font-medium">{contract.duration}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Amount</label>
              <p className="font-medium">{contract.amount}</p>
            </div>
          </div>
        </div>

        {/* Supplier Information */}
        <div>
          <h3 className="text-lg font-medium border-b pb-2">Supplier Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-500">Supplier</label>
              <p className="font-medium">{contract.supplier}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Supervisor</label>
              <p className="font-medium">{contract.supervisor}</p>
            </div>
          </div>
        </div>

        {/* Contract Period */}
        <div>
          <h3 className="text-lg font-medium border-b pb-2">Contract Period</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-500">Start Date</label>
              <p className="font-medium">{contract.startDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">End Date</label>
              <p className="font-medium">{contract.endDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <p>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                  contract.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {contract.status}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Progress</label>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${contract.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">{contract.percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the table actions to include edit
  const renderActions = (contract) => (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleView(contract)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEdit(contract)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleDelete(contract)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          // Handle download
          toast.success('Downloading contract...');
        }}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Manage Contracts</h1>

        {/* Expiring Soon Alert */}
        {expiringSoonContracts.length > 0 && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-yellow-700">
                {expiringSoonContracts.length} contract(s) expiring soon
              </span>
            </div>
          </div>
        )}

        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search contracts..."
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
            Add Contract
          </Button>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contract No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contract Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Supervisor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Start Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">End Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Progress</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{contract.id}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{contract.title}</td>
                  <td className="px-4 py-3 text-sm">{contract.duration}</td>
                  <td className="px-4 py-3 text-sm">{contract.amount}</td>
                  <td className="px-4 py-3 text-sm">{contract.supplier}</td>
                  <td className="px-4 py-3 text-sm">{contract.supervisor}</td>
                  <td className="px-4 py-3 text-sm">{contract.startDate}</td>
                  <td className="px-4 py-3 text-sm">{contract.endDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      contract.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${contract.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{contract.percentage}%</span>
                  </td>
                  <td className="px-4 py-3">
                    {renderActions(contract)}
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
      </div>

      {/* Add Contract Modal */}
      <AddContractModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddContract}
      />

      {/* View Contract Modal */}
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Contract Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderContractDetails(selectedContract)}

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
                    Delete Contract
                  </Dialog.Title>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete contract "{selectedContract?.id}"? 
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
                    Delete Contract
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add EditContractModal */}
      <EditContractModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedContract(null);
        }}
        onEdit={handleEditSubmit}
        contractData={selectedContract}
      />
    </div>
  );
}

export default Contracts; 