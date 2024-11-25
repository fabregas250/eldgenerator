import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const AddFederationForm = ({ onSubmit, onCancel, initialData, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    acronym: '',
    yearFounded: '',
    legalRepresentative: '',
    address: '',
    // ... other fields
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.name || !formData.acronym || !formData.yearFounded) {
        throw new Error('Please fill in all required fields');
      }

      // Website validation
      if (formData.website && !formData.website.startsWith('http')) {
        throw new Error('Website URL must start with http:// or https://');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.loginEmail)) {
        throw new Error('Please enter a valid email address');
      }

      onSubmit(formData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Logo</label>
          <div className="flex items-center gap-4">
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Acronym</label>
            <Input
              type="text"
              name="acronym"
              value={formData.acronym}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Year Founded</label>
            <Input
              type="number"
              name="yearFounded"
              value={formData.yearFounded}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Website and Login Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="eg. www.google.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Login Email</label>
            <Input
              type="email"
              name="loginEmail"
              value={formData.loginEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Login Password</label>
          <Input
            type="password"
            name="loginPassword"
            value={formData.loginPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Legal Representative Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Legal Representative Name</label>
            <Input
              type="text"
              name="legalRepName"
              value={formData.legalRepName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Legal Representative Gender</label>
            <select
              name="legalRepGender"
              value={formData.legalRepGender}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Legal Representative Email</label>
            <Input
              type="email"
              name="legalRepEmail"
              value={formData.legalRepEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Legal Representative Phone</label>
            <Input
              type="tel"
              name="legalRepPhone"
              value={formData.legalRepPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Form Actions - Make it sticky at the bottom */}
        <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditing ? 'Update Federation' : 'Add Federation'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddFederationForm; 