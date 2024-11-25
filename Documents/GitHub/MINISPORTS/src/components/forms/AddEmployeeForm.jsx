import React, { useState } from 'react';
import { Info, Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { rwandaLocations } from '../../data/rwandaLocations';

const AddEmployeeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    // Personal Data
    passportPicture: null,
    firstName: '',
    lastName: '',
    gender: '',
    emailId: '',
    phone: '',
    status: '',
    
    // Home Address
    country: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    
    // Employee Job
    startDate: '',
    employeeStatus: '',
    employeeType: '',
    department: '',
    supervisorName: '',
    
    // Person of Contact
    contactFirstName: '',
    contactLastName: '',
    relationship: '',
    contactPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Options for select fields
  const genderOptions = ["Male", "Female", "Other"];
  const statusOptions = ["Active", "Inactive"];
  const countryOptions = ["Rwanda", "Uganda", "Kenya", "Tanzania"];
  const provinceOptions = ["Kigali", "Eastern", "Western", "Northern", "Southern"];
  const employeeStatusOptions = ["Active", "Dormant"];
  const employeeTypeOptions = ["ON SALARY", "CONTRACT"];
  const departmentOptions = ["PS", "IT", "HR", "Finance"];
  const supervisorOptions = ["KAMANZI", "MUTESI", "KALISA"];

  // Add states for location selection
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableCells, setAvailableCells] = useState([]);
  const [availableVillages, setAvailableVillages] = useState([]);

  // Add state for supervisor search
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);

  // Mock existing employees data (in real app, this would come from API/props)
  const existingEmployees = [
    { id: 1, name: 'KAMANZI', position: 'Manager' },
    { id: 2, name: 'MUTESI', position: 'Team Lead' },
    { id: 3, name: 'KALISA', position: 'Senior Manager' },
    { id: 4, name: 'MUGISHA', position: 'Department Head' },
    { id: 5, name: 'UWASE', position: 'Director' },
    // Add more employees...
  ];

  // Filter supervisors based on search
  const filteredSupervisors = existingEmployees.filter(emp =>
    emp.name.toLowerCase().includes(supervisorSearch.toLowerCase())
  );

  // Handle supervisor selection
  const handleSupervisorSelect = (supervisor) => {
    setFormData(prev => ({
      ...prev,
      supervisorName: supervisor.name
    }));
    setShowSupervisorDropdown(false);
    setSupervisorSearch('');
  };

  // Add National ID validation and formatting functions
  const validateNationalId = (id) => {
    // Remove any spaces or special characters
    const cleanId = id.replace(/\D/g, '');
    return cleanId.length === 16;
  };

  const formatNationalId = (value) => {
    // Remove non-digits
    const cleanValue = value.replace(/\D/g, '');
    // Split into groups of 4
    const chunks = cleanValue.match(/.{1,4}/g);
    // Join with spaces
    return chunks ? chunks.join(' ') : '';
  };

  const handleNationalIdChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatNationalId(value);
    setFormData(prev => ({
      ...prev,
      nationalId: formattedValue
    }));
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setFormData(prev => ({
      ...prev,
      province,
      district: '',
      sector: '',
      cell: '',
      village: ''
    }));

    if (province && rwandaLocations[province]) {
      setAvailableDistricts(Object.keys(rwandaLocations[province].districts));
    } else {
      setAvailableDistricts([]);
    }
    setAvailableSectors([]);
    setAvailableCells([]);
    setAvailableVillages([]);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedSector('');
    setSelectedCell('');
    setFormData(prev => ({
      ...prev,
      district,
      sector: '',
      cell: '',
      village: ''
    }));

    if (district && rwandaLocations[selectedProvince]?.districts[district]) {
      setAvailableSectors(Object.keys(rwandaLocations[selectedProvince].districts[district].sectors));
    } else {
      setAvailableSectors([]);
    }
    setAvailableCells([]);
    setAvailableVillages([]);
  };

  // Handle sector change
  const handleSectorChange = (e) => {
    const sector = e.target.value;
    setSelectedSector(sector);
    setSelectedCell('');
    setFormData(prev => ({
      ...prev,
      sector,
      cell: '',
      village: ''
    }));

    if (sector && rwandaLocations[selectedProvince]?.districts[selectedDistrict]?.sectors[sector]) {
      setAvailableCells(Object.keys(rwandaLocations[selectedProvince].districts[selectedDistrict].sectors[sector].cells));
    } else {
      setAvailableCells([]);
    }
    setAvailableVillages([]);
  };

  // Handle cell change
  const handleCellChange = (e) => {
    const cell = e.target.value;
    setSelectedCell(cell);
    setFormData(prev => ({
      ...prev,
      cell,
      village: ''
    }));

    if (cell && rwandaLocations[selectedProvince]?.districts[selectedDistrict]?.sectors[selectedSector]?.cells[cell]) {
      setAvailableVillages(rwandaLocations[selectedProvince].districts[selectedDistrict].sectors[selectedSector].cells[cell]);
    } else {
      setAvailableVillages([]);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, passportPicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate National ID
      if (!validateNationalId(formData.nationalId.replace(/\s/g, ''))) {
        throw new Error('Please enter a valid 16-digit National ID');
      }

      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.emailId) {
        throw new Error('Please fill in all required fields');
      }

      // Validate location fields
      if (!selectedProvince || !selectedDistrict || !selectedSector || !selectedCell || !formData.village) {
        throw new Error('Please complete all location fields');
      }

      await onSubmit(formData);
      
      // Reset form
      setFormData({
        passportPicture: null,
        firstName: '',
        lastName: '',
        gender: '',
        emailId: '',
        phone: '',
        status: '',
        country: '',
        province: '',
        district: '',
        sector: '',
        cell: '',
        village: '',
        startDate: '',
        employeeStatus: '',
        employeeType: '',
        department: '',
        supervisorName: '',
        contactFirstName: '',
        contactLastName: '',
        relationship: '',
        contactPhone: ''
      });
      setPreviewUrl(null);
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedSector('');
      setSelectedCell('');
      setAvailableDistricts([]);
      setAvailableSectors([]);
      setAvailableCells([]);
      setAvailableVillages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the Employee Job section in the form to include searchable supervisor selection
  const renderSupervisorField = () => (
    <div>
      <label className="block mb-1 text-sm font-medium">Supervisor Name</label>
      <div className="relative">
        <div className="relative">
          <Input
            type="text"
            value={supervisorSearch}
            onChange={(e) => {
              setSupervisorSearch(e.target.value);
              setShowSupervisorDropdown(true);
            }}
            onFocus={() => setShowSupervisorDropdown(true)}
            placeholder="Search supervisor..."
            className="w-full pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Selected supervisor display */}
        {formData.supervisorName && !showSupervisorDropdown && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md flex justify-between items-center">
            <span>{formData.supervisorName}</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, supervisorName: '' }))}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Supervisor search dropdown */}
        {showSupervisorDropdown && supervisorSearch && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border">
            {filteredSupervisors.length > 0 ? (
              filteredSupervisors.map(supervisor => (
                <button
                  key={supervisor.id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleSupervisorSelect(supervisor)}
                >
                  <div className="font-medium">{supervisor.name}</div>
                  <div className="text-sm text-gray-500">{supervisor.position}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No supervisors found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Personal Data Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Personal Data</h3>
        
        {/* Passport Picture */}
        <div>
          <label className="block mb-1 text-sm font-medium">Passport Picture</label>
          <div className="flex items-center space-x-4">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.passportPicture ? formData.passportPicture.name : 'No file chosen'}
              </p>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>

        {/* Gender, Email, Phone, Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Gender</option>
              {genderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Email ID <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Status</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* National ID Field */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            National ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleNationalIdChange}
              maxLength={19} // 16 digits + 3 spaces
              required
              placeholder="1234 5678 9012 3456"
              className="w-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {formData.nationalId && (
                <span className={`text-xs ${
                  validateNationalId(formData.nationalId.replace(/\s/g, ''))
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {validateNationalId(formData.nationalId.replace(/\s/g, ''))
                    ? '✓ Valid'
                    : '✗ Invalid'}
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Format: XXXX XXXX XXXX XXXX (16 digits)
          </p>
        </div>
      </div>

      {/* Home Address Section with Cascading Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Home Address</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Province</label>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Province</option>
              {Object.keys(rwandaLocations).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">District</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              required
              disabled={!selectedProvince}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select District</option>
              {availableDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Sector</label>
            <select
              value={selectedSector}
              onChange={handleSectorChange}
              required
              disabled={!selectedDistrict}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Sector</option>
              {availableSectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Cell</label>
            <select
              value={selectedCell}
              onChange={handleCellChange}
              required
              disabled={!selectedSector}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Cell</option>
              {availableCells.map(cell => (
                <option key={cell} value={cell}>{cell}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Village</label>
          <select
            name="village"
            value={formData.village}
            onChange={handleChange}
            required
            disabled={!selectedCell}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select Village</option>
            {availableVillages.map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Job Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Employee Job</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Employee Status</label>
            <select
              name="employeeStatus"
              value={formData.employeeStatus}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Status</option>
              {employeeStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Employee Type</label>
            <select
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Type</option>
              {employeeTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Department</option>
              {departmentOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Searchable Supervisor Selection */}
        {renderSupervisorField()}
      </div>

      {/* Person of Contact Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Person of Contact</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <Input
              type="text"
              name="contactFirstName"
              value={formData.contactFirstName}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <Input
              type="text"
              name="contactLastName"
              value={formData.contactLastName}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Relationship</label>
            <Input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Telephone</label>
            <Input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default AddEmployeeForm; 