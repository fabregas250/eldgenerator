import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { rwandaLocations } from '../../data/rwandaLocations';

const AddIsongaProgramForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    domain: initialData?.domain || '',
    category: initialData?.category || '',
    location: {
      province: initialData?.location?.province || '',
      district: initialData?.location?.district || '',
      sector: initialData?.location?.sector || '',
      cell: initialData?.location?.cell || '',
      village: initialData?.location?.village || ''
    },
    legalRepresentative: {
      name: initialData?.legalRepresentative?.name || '',
      gender: initialData?.legalRepresentative?.gender || '',
      email: initialData?.legalRepresentative?.email || '',
      phone: initialData?.legalRepresentative?.phone || ''
    }
  });

  // Add these states for location dropdowns
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update available locations when province changes
  useEffect(() => {
    if (formData.location.province) {
      const selectedProvince = rwandaLocations[formData.location.province];
      setDistricts(Object.keys(selectedProvince.districts));
      // Reset lower-level selections
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          district: '',
          sector: '',
          cell: '',
          village: ''
        }
      }));
    }
  }, [formData.location.province]);

  // Update available sectors when district changes
  useEffect(() => {
    if (formData.location.province && formData.location.district) {
      const selectedDistrict = rwandaLocations[formData.location.province]
        .districts[formData.location.district];
      setSectors(Object.keys(selectedDistrict.sectors));
      // Reset lower-level selections
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          sector: '',
          cell: '',
          village: ''
        }
      }));
    }
  }, [formData.location.province, formData.location.district]);

  // Update available cells when sector changes
  useEffect(() => {
    if (formData.location.province && formData.location.district && formData.location.sector) {
      const selectedSector = rwandaLocations[formData.location.province]
        .districts[formData.location.district]
        .sectors[formData.location.sector];
      setCells(Object.keys(selectedSector.cells));
      // Reset lower-level selection
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          cell: '',
          village: ''
        }
      }));
    }
  }, [formData.location.province, formData.location.district, formData.location.sector]);

  // Update available villages when cell changes
  useEffect(() => {
    if (formData.location.province && formData.location.district && 
        formData.location.sector && formData.location.cell) {
      const selectedCell = rwandaLocations[formData.location.province]
        .districts[formData.location.district]
        .sectors[formData.location.sector]
        .cells[formData.location.cell];
      setVillages(selectedCell);
    }
  }, [formData.location.province, formData.location.district, 
      formData.location.sector, formData.location.cell]);

  // Update useEffect to handle initialData properly
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        domain: initialData.domain || '',
        category: initialData.category || '',
        location: {
          province: initialData.location?.province || '',
          district: initialData.location?.district || '',
          sector: initialData.location?.sector || '',
          cell: initialData.location?.cell || '',
          village: initialData.location?.village || ''
        },
        legalRepresentative: {
          name: initialData.legalRepresentative?.name || '',
          gender: initialData.legalRepresentative?.gender || '',
          email: initialData.legalRepresentative?.email || '',
          phone: initialData.legalRepresentative?.phone || ''
        }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else if (name.startsWith('legalRepresentative.')) {
      const repField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        legalRepresentative: {
          ...prev.legalRepresentative,
          [repField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.name || !formData.domain || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.legalRepresentative.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone format
      const phoneRegex = /^\+?[0-9]{10,}$/;
      if (!phoneRegex.test(formData.legalRepresentative.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      await onSubmit(formData);
      
      // Reset form
      setFormData({
        name: '',
        domain: '',
        category: '',
        location: {
          province: '',
          district: '',
          sector: '',
          cell: '',
          village: ''
        },
        legalRepresentative: {
          name: '',
          gender: '',
          email: '',
          phone: ''
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Institution Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter institution name"
          disabled={loading}
          required
        />
      </div>

      {/* Domain and Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain <span className="text-red-500">*</span>
          </label>
          <select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          >
            <option value="">Select Domain</option>
            <option value="Sports">Sports</option>
            <option value="Culture">Culture</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          >
            <option value="">Select Category</option>
            <option value="Excellence school">Excellence school</option>
            <option value="Regular school">Regular school</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Location</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province <span className="text-red-500">*</span>
            </label>
            <select
              name="location.province"
              value={formData.location.province}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            >
              <option value="">Select Province</option>
              {Object.keys(rwandaLocations).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              name="location.district"
              value={formData.location.district}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading || !formData.location.province}
              required
            >
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sector <span className="text-red-500">*</span>
            </label>
            <select
              name="location.sector"
              value={formData.location.sector}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading || !formData.location.district}
              required
            >
              <option value="">Select Sector</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cell <span className="text-red-500">*</span>
            </label>
            <select
              name="location.cell"
              value={formData.location.cell}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading || !formData.location.sector}
              required
            >
              <option value="">Select Cell</option>
              {cells.map(cell => (
                <option key={cell} value={cell}>{cell}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Village <span className="text-red-500">*</span>
            </label>
            <select
              name="location.village"
              value={formData.location.village}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading || !formData.location.cell}
              required
            >
              <option value="">Select Village</option>
              {villages.map(village => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legal Representative Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Legal Representative Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="legalRepresentative.name"
              value={formData.legalRepresentative.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="legalRepresentative.gender"
              value={formData.legalRepresentative.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="legalRepresentative.email"
              value={formData.legalRepresentative.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="legalRepresentative.phone"
              value={formData.legalRepresentative.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              disabled={loading}
              required
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
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
          {loading ? 'Adding...' : 'Add Institution'}
        </button>
      </div>
    </form>
  );
};

export default AddIsongaProgramForm; 