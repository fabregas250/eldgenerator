import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'react-hot-toast';

const AddSportsProfessionalForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [idType, setIdType] = useState('nid');
  const [idNumber, setIdNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [idError, setIdError] = useState('');
  const [isLoadingNIDA, setIsLoadingNIDA] = useState(false);
  const [nidaData, setNidaData] = useState(null);
  const [formData, setFormData] = useState({
    function: '',
    subFunction: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const handleNIDLookup = async () => {
    setIdError('');

    // Validate ID format
    if (idType === 'nid') {
      if (!/^\d{16}$/.test(idNumber)) {
        setIdError('National ID must be exactly 16 digits');
        return;
      }
    } else {
      // Passport validation
      if (!/^[A-Z0-9]{6,9}$/.test(idNumber)) {
        setIdError('Invalid passport format');
        return;
      }
      
      if (!passportExpiry) {
        setIdError('Passport expiry date is required');
        return;
      }
      
      const expiryDate = new Date(passportExpiry);
      if (expiryDate < new Date()) {
        setIdError('Passport has expired');
        return;
      }
    }

    setIsLoadingNIDA(true);
    try {
      // Simulate NIDA API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample response
      const response = {
        documentNumber: idNumber,
        names: "NSHUTI Jean Baptiste",
        dateOfBirth: "1995-02-19",
        gender: "Male",
        nationality: "Rwandan",
        placeOfBirth: "Kigali",
        photo: "base64_encoded_photo_string"
      };

      setNidaData(response);
      toast.success('ID verified successfully');
    } catch (error) {
      toast.error('Failed to verify ID');
      setNidaData(null);
    } finally {
      setIsLoadingNIDA(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nidaData) {
      toast.error('Please verify ID first');
      return;
    }

    // Combine NIDA data with form data
    const submitData = {
      ...formData,
      name: nidaData.names,
      dateOfBirth: nidaData.dateOfBirth,
      gender: nidaData.gender,
      nationality: nidaData.nationality,
      idType,
      idNumber,
      ...(idType === 'passport' && { passportExpiry }),
      photo: nidaData.photo
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ID Type Selection */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="idType"
              value="nid"
              checked={idType === 'nid'}
              onChange={(e) => {
                setIdType(e.target.value);
                setIdNumber('');
                setIdError('');
                setNidaData(null);
              }}
              className="mr-2"
            />
            National ID
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="idType"
              value="passport"
              checked={idType === 'passport'}
              onChange={(e) => {
                setIdType(e.target.value);
                setIdNumber('');
                setIdError('');
                setNidaData(null);
              }}
              className="mr-2"
            />
            Passport
          </label>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {idType === 'nid' ? 'National ID Number' : 'Passport Number'}
            </label>
            <Input
              type="text"
              value={idNumber}
              onChange={(e) => {
                setIdNumber(e.target.value);
                setIdError('');
              }}
              className={idError ? 'border-red-500' : ''}
              placeholder={idType === 'nid' ? 'Enter 16-digit ID number' : 'Enter passport number'}
            />
          </div>

          {idType === 'passport' && (
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Passport Expiry Date
              </label>
              <Input
                type="date"
                value={passportExpiry}
                onChange={(e) => {
                  setPassportExpiry(e.target.value);
                  setIdError('');
                }}
                min={new Date().toISOString().split('T')[0]}
                className={idError ? 'border-red-500' : ''}
              />
            </div>
          )}

          <Button
            type="button"
            onClick={handleNIDLookup}
            disabled={isLoadingNIDA || !idNumber || (idType === 'passport' && !passportExpiry)}
          >
            {isLoadingNIDA ? 'Verifying...' : 'Verify ID'}
          </Button>
        </div>

        {idError && (
          <p className="text-sm text-red-500 mt-1">{idError}</p>
        )}
      </div>

      {/* Personal Information - Read-only from NIDA */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            value={nidaData?.names || ''}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <Input
            value={nidaData?.dateOfBirth || ''}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <Input
            value={nidaData?.gender || ''}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nationality</label>
          <Input
            value={nidaData?.nationality || ''}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Function</label>
          <select
            value={formData.function}
            onChange={(e) => setFormData({ ...formData, function: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Function</option>
            <option value="Coach">Coach</option>
            <option value="Player">Player</option>
            <option value="Referee">Referee</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sub Function</label>
          <Input
            value={formData.subFunction}
            onChange={(e) => setFormData({ ...formData, subFunction: e.target.value })}
            placeholder="e.g., Head Coach, Assistant Coach"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Photo Preview */}
      {nidaData?.photo && (
        <div>
          <label className="block text-sm font-medium mb-2">Photo</label>
          <img
            src={`data:image/jpeg;base64,${nidaData.photo}`}
            alt="ID Photo"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !nidaData}
        >
          {isSubmitting ? 'Adding...' : 'Add Professional'}
        </Button>
      </div>
    </form>
  );
};

export default AddSportsProfessionalForm; 