import React, { useState } from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const AddClubForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    logo: initialData?.logo || null,
    federation: initialData?.federation || '',
    name: initialData?.name || '',
    yearFounded: initialData?.yearFounded || '',
    address: initialData?.address || '',
    division: initialData?.division || '',
    legalRepresentative: {
      name: initialData?.legalRepresentative?.name || '',
      gender: initialData?.legalRepresentative?.gender || '',
      email: initialData?.legalRepresentative?.email || '',
      phone: initialData?.legalRepresentative?.phone || ''
    }
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-gray-200' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  const labelClasses = `block text-sm font-medium mb-1 ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  // Federation options
  const federations = [
    'Rwanda Football Federation (FERWAFA)',
    'Rwanda Basketball Federation (FERWABA)',
    'Rwanda Volleyball Federation (FRVB)',
    'Rwanda Athletics Federation (RAF)'
  ];

  // Division options
  const divisions = [
    'Premier League',
    'Division 1',
    'Division 2',
    'Women League'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Club Logo */}
      <div>
        <label htmlFor="logo" className={labelClasses}>Club Logo</label>
        <input
          type="file"
          id="logo"
          name="logo"
          accept="image/*"
          onChange={handleChange}
          className={inputClasses}
        />
        {formData.logo && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(formData.logo)}
              alt="Club Logo Preview"
              className="h-20 w-20 object-contain"
            />
          </div>
        )}
      </div>

      {/* Federation Selection */}
      <div>
        <label htmlFor="federation" className={labelClasses}>Select Federation</label>
        <select
          id="federation"
          name="federation"
          value={formData.federation}
          onChange={handleChange}
          className={inputClasses}
          required
        >
          <option value="">Select Federation</option>
          {federations.map(federation => (
            <option key={federation} value={federation}>
              {federation}
            </option>
          ))}
        </select>
      </div>

      {/* Club Name */}
      <div>
        <label htmlFor="name" className={labelClasses}>Club Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      {/* Year Founded */}
      <div>
        <label htmlFor="yearFounded" className={labelClasses}>Year Founded</label>
        <input
          type="number"
          id="yearFounded"
          name="yearFounded"
          value={formData.yearFounded}
          onChange={handleChange}
          className={inputClasses}
          min="1900"
          max={new Date().getFullYear()}
          required
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className={labelClasses}>Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      {/* Division */}
      <div>
        <label htmlFor="division" className={labelClasses}>Division</label>
        <select
          id="division"
          name="division"
          value={formData.division}
          onChange={handleChange}
          className={inputClasses}
          required
        >
          <option value="">Select Division</option>
          {divisions.map(division => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      {/* Legal Representative Information */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
          Legal Representative Information
        </h3>

        <div>
          <label htmlFor="legalRepresentative.name" className={labelClasses}>Legal Representative Name</label>
          <input
            type="text"
            id="legalRepresentative.name"
            name="legalRepresentative.name"
            value={formData.legalRepresentative.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="legalRepresentative.gender" className={labelClasses}>Legal Representative Gender</label>
          <select
            id="legalRepresentative.gender"
            name="legalRepresentative.gender"
            value={formData.legalRepresentative.gender}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label htmlFor="legalRepresentative.email" className={labelClasses}>Legal Representative Email</label>
          <input
            type="email"
            id="legalRepresentative.email"
            name="legalRepresentative.email"
            value={formData.legalRepresentative.email}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="legalRepresentative.phone" className={labelClasses}>Legal Representative Phone</label>
          <input
            type="tel"
            id="legalRepresentative.phone"
            name="legalRepresentative.phone"
            value={formData.legalRepresentative.phone}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⌛</span>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Club</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddClubForm; 