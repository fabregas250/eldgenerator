import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell,
  TablePagination 
} from '../components/ui/table';
import { Search, Plus, Filter, X } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import AddPartnerForm from '../components/forms/AddPartnerForm';

const Partners = () => {
  const { isDarkMode } = useDarkMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  // Initial data
  const initialPartners = [
    {
      id: '#1',
      name: 'Rwanda Football Federation',
      discipline: 'Football',
      legalStatus: 'NGO',
      business: 'Sports Development',
      location: {
        province: 'Kigali City',
        district: 'Nyarugenge',
        sector: 'Nyarugenge',
        cell: 'Nyarugenge',
        village: 'Nyarugenge'
      },
      representative: {
        name: 'John Doe',
        gender: 'Male',
        email: 'john@example.com',
        phone: '0788123456'
      },
      status: 'Active'
    }
  ];

  const [partners, setPartners] = useState(initialPartners);

  // Filter configuration
  const filterConfig = {
    discipline: ['Football', 'Basketball', 'Handball', 'Volleyball', 'Tennis', 'Other'],
    legalStatus: ['Company', 'NGO', 'Public Institution', 'Cooperative', 'Other'],
    status: ['Active', 'Inactive']
  };

  // Location data (you would typically fetch this from an API)
  const locationData = {
    provinces: ['Kigali City', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'],
    districts: {
      'Kigali City': ['Nyarugenge', 'Gasabo', 'Kicukiro']
      // Add other districts
    }
    // Add sectors, cells, and villages data
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load partners. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPartner = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Partner added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add partner'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (partner) => {
    setSelectedPartner(partner);
    setShowAddModal(true);
  };

  const handleDelete = async (partner) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Partner deleted successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to delete partner'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (partner) => {
    toast.success('Download started');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(partners.map(partner => partner.id));
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
          Partners
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search partners..."
              className={`pl-10 pr-4 py-2 border rounded-lg w-64 ${
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
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        {Object.entries(filterConfig).map(([filterName, options]) => (
          <select
            key={filterName}
            className={`border rounded-lg px-3 py-1.5 text-sm ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">{filterName}</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ))}
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
                  checked={selectedRows.length === partners.length}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>PARTNER NAME</TableHead>
              <TableHead>DISCIPLINE</TableHead>
              <TableHead>LEGAL STATUS</TableHead>
              <TableHead>BUSINESS</TableHead>
              <TableHead>LOCATION</TableHead>
              <TableHead>REPRESENTATIVE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedRows.includes(partner.id)}
                    onChange={() => handleSelectRow(partner.id)}
                  />
                </TableCell>
                <TableCell>{partner.id}</TableCell>
                <TableCell>{partner.name}</TableCell>
                <TableCell>{partner.discipline}</TableCell>
                <TableCell>{partner.legalStatus}</TableCell>
                <TableCell>{partner.business}</TableCell>
                <TableCell>{partner.location.district}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{partner.representative.name}</div>
                    <div className="text-sm text-gray-500">{partner.representative.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    partner.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {partner.status}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionMenu
                    onEdit={() => handleEdit(partner)}
                    onDelete={() => handleDelete(partner)}
                    onDownload={() => handleDownload(partner)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Partner"
        message={`Are you sure you want to delete ${selectedPartner?.name}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedPartner(null);
          }
        }}
        title={selectedPartner ? "Edit Partner" : "Add Partner"}
      >
        <AddPartnerForm
          initialData={selectedPartner}
          onSubmit={handleAddPartner}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedPartner(null);
            }
          }}
          isSubmitting={isSubmitting}
          locationData={locationData}
        />
      </Modal>
    </div>
  );
};

export default Partners; 