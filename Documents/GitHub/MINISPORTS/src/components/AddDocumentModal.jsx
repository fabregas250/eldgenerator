import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function AddDocumentModal({ isOpen, onClose, onAdd }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    documentName: '',
    documentType: 'Incoming', // Default to Incoming
    referenceNo: '',
    addressedTo: '',
    phone: '',
    email: '',
    recordingDate: '',
    receptionDate: '',
    status: 'Pending' // Default status
  });

  // Document types
  const documentTypes = ['Incoming', 'Outgoing', 'Internal'];

  // Status options
  const statusOptions = ['Pending', 'Received', 'Sent', 'Processed'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.documentName || !formData.referenceNo || !formData.addressedTo) {
        throw new Error('Please fill in all required fields');
      }

      // Phone number validation (Rwanda format)
      const phoneRegex = /^(\+?25)?(07[238]\d{7})$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid Rwandan phone number');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Date validation
      if (new Date(formData.receptionDate) < new Date(formData.recordingDate)) {
        throw new Error('Reception date cannot be earlier than recording date');
      }

      await onAdd(formData);
      onClose();
      toast.success('Document added successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
              } p-6 text-left align-middle shadow-xl transition-all`}>
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Add New Document
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Document Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Document Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.documentName}
                        onChange={(e) => setFormData(prev => ({ ...prev, documentName: e.target.value }))}
                        required
                        placeholder="Enter document name"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Document Type</label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => setFormData(prev => ({ ...prev, documentType: e.target.value }))}
                        className="w-full border rounded-lg p-2"
                      >
                        {documentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Reference No. <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.referenceNo}
                      onChange={(e) => setFormData(prev => ({ ...prev, referenceNo: e.target.value }))}
                      required
                      placeholder="Enter reference number"
                    />
                  </div>

                  {/* Institution and Contact Information */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Person/Institution <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.addressedTo}
                        onChange={(e) => setFormData(prev => ({ ...prev, addressedTo: e.target.value }))}
                        required
                        placeholder="Enter name/institution"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="07X XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Email ID</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  {/* Dates and Status */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Recording Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.recordingDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, recordingDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Reception/Sending Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.receptionDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, receptionDate: e.target.value }))}
                        required
                        min={formData.recordingDate} // Cannot be earlier than recording date
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full border rounded-lg p-2"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add Document
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddDocumentModal; 