import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const AddPartnerForm = ({ initialData, onSubmit, onCancel, isSubmitting, locationData }) => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    discipline: initialData?.discipline || '',
    legalStatus: initialData?.legalStatus || '',
    business: initialData?.business || '',
    location: {
      province: initialData?.location?.province || '',
      district: initialData?.location?.district || '',
      sector: initialData?.location?.sector || '',
      cell: initialData?.location?.cell || '',
      village: initialData?.location?.village || ''
    },
    representative: {
      name: initialData?.representative?.name || '',
      gender: initialData?.representative?.gender || '',
      email: initialData?.representative?.email || '',
      phone: initialData?.representative?.phone || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Partner Name */}
      <div>
        <label htmlFor="name" className={labelClasses}>Partner Name</label>
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

      {/* Sports Discipline */}
      <div>
        <label htmlFor="discipline" className={labelClasses}>Sports Discipline</label>
        <select
          id="discipline"
          name="discipline"
          value={formData.discipline}
          onChange={handleChange}
          className={inputClasses}
          required
        >
          <option value="">Select Discipline</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
          <option value="Handball">Handball</option>
          <option value="Volleyball">Volleyball</option>
          <option value="Tennis">Tennis</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Legal Status */}
      <div>
        <label htmlFor="legalStatus" className={labelClasses}>Legal Status</label>
        <select
          id="legalStatus"
          name="legalStatus"
          value={formData.legalStatus}
          onChange={handleChange}
          className={inputClasses}
          required
        >
          <option value="">Select Status</option>
          <option value="Company">Company</option>
          <option value="NGO">NGO</option>
          <option value="Public Institution">Public Institution</option>
          <option value="Cooperative">Cooperative</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Business/Intervention */}
      <div>
        <label htmlFor="business" className={labelClasses}>Business / Intervention</label>
        <input
          type="text"
          id="business"
          name="business"
          value={formData.business}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        {/* Province */}
        <div>
          <label htmlFor="location.province" className={labelClasses}>Province</label>
          <select
            id="location.province"
            name="location.province"
            value={formData.location.province}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select Province</option>
            {locationData?.provinces?.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label htmlFor="location.district" className={labelClasses}>District</label>
          <select
            id="location.district"
            name="location.district"
            value={formData.location.district}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select District</option>
            {locationData?.districts[formData.location.province]?.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Add other location fields similarly */}
      </div>

      {/* Legal Representative Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="representative.name" className={labelClasses}>Legal Representative Name</label>
          <input
            type="text"
            id="representative.name"
            name="representative.name"
            value={formData.representative.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="representative.gender" className={labelClasses}>Legal Representative Gender</label>
          <select
            id="representative.gender"
            name="representative.gender"
            value={formData.representative.gender}
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
          <label htmlFor="representative.email" className={labelClasses}>Legal Representative Email</label>
          <input
            type="email"
            id="representative.email"
            name="representative.email"
            value={formData.representative.email}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="representative.phone" className={labelClasses}>Legal Representative Phone</label>
          <input
            type="tel"
            id="representative.phone"
            name="representative.phone"
            value={formData.representative.phone}
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
            <span>Save Partner</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddPartnerForm; 