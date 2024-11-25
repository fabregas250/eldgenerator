import React, { useState, Fragment } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus, Eye, Download, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AddDocumentModal from '../components/AddDocumentModal';

function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { isDarkMode } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Mock documents data
  const [documents, setDocuments] = useState([
    {
      id: 'DOC001',
      name: 'Annual Sports Report 2023',
      type: 'Report',
      referenceNo: 'REF/2023/001',
      addressedTo: 'Ministry of Sports',
      phone: '0784704515',
      email: 'info@minisports.gov.rw',
      recordingDate: '2023-12-15',
      receptionDate: '2023-12-16',
      status: 'Received'
    },
    {
      id: 'DOC002',
      name: 'Sports Infrastructure Plan',
      type: 'Proposal',
      referenceNo: 'REF/2023/002',
      addressedTo: 'Rwanda Sports Council',
      phone: '0784704516',
      email: 'rsc@gov.rw',
      recordingDate: '2023-12-20',
      receptionDate: '2023-12-21',
      status: 'Pending'
    }
  ]);

  // Filter documents based on search
  const filteredDocuments = documents.filter(doc =>
    Object.values(doc).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Handle view document
  const handleView = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  // Handle download document
  const handleDownload = (document) => {
    toast.success(`Downloading ${document.name}...`);
  };

  // Handle delete document
  const handleDelete = (document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    toast.success('Document deleted successfully');
    setIsDeleteModalOpen(false);
  };

  // Add handler for new document
  const handleAddDocument = (newDocument) => {
    // Add the new document to the documents array
    const documentWithId = {
      id: `DOC${documents.length + 1}`.padStart(6, '0'),
      ...newDocument,
      status: 'Pending',
      recordingDate: new Date().toISOString().split('T')[0]
    };
    
    setDocuments(prev => [...prev, documentWithId]);
    setIsAddModalOpen(false);
    toast.success('Document added successfully');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-6">Manage Documents</h1>

        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search documents..."
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
            Add Document
          </Button>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Document Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Document Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reference No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Addressed To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Recording Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Reception Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{doc.id}</td>
                  <td className="px-4 py-3 text-sm">{doc.name}</td>
                  <td className="px-4 py-3 text-sm">{doc.type}</td>
                  <td className="px-4 py-3 text-sm">{doc.referenceNo}</td>
                  <td className="px-4 py-3 text-sm">{doc.addressedTo}</td>
                  <td className="px-4 py-3 text-sm">{doc.phone}</td>
                  <td className="px-4 py-3 text-sm">{doc.email}</td>
                  <td className="px-4 py-3 text-sm">{doc.recordingDate}</td>
                  <td className="px-4 py-3 text-sm">{doc.receptionDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      doc.status === 'Received' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
      </div>

      {/* View Document Modal */}
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
                <Dialog.Title className="text-lg font-medium mb-4">
                  Document Details
                </Dialog.Title>
                {selectedDocument && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Document ID</label>
                        <p className="font-medium">{selectedDocument.id}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Document Name</label>
                        <p className="font-medium">{selectedDocument.name}</p>
                      </div>
                    </div>
                    {/* Add more document details */}
                  </div>
                )}
                <div className="mt-6">
                  <Button onClick={() => setIsViewModalOpen(false)}>
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
                    Delete Document
                  </Dialog.Title>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete this document? This action cannot be undone.
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
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Document Modal */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDocument}
      />
    </div>
  );
}

export default Documents; 