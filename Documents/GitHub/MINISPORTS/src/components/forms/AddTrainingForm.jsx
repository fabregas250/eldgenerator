import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import Select from 'react-select';

const AddTrainingForm = ({ onSubmit, onCancel, isSubmitting, initialData }) => {
  const [availableProfessionals] = useState([
    {
      value: 1,
      label: 'John Doe',
      details: {
        type: 'Player',
        federation: 'FERWAFA',
        club: 'APR FC',
      }
    },
    {
      value: 2,
      label: 'Jane Smith',
      details: {
        type: 'Staff',
        federation: 'FERWABA',
        club: 'Patriots',
      }
    }
    // ... more professionals
  ]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    period: {
      startDate: initialData?.period?.startDate || '',
      endDate: initialData?.period?.endDate || ''
    },
    organiser: initialData?.organiser || '',
    status: initialData?.status || '',
    participants: initialData?.participants || [],
    description: initialData?.description || '',
    venue: initialData?.venue || '',
    trainingType: initialData?.trainingType || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        period: {
          startDate: initialData.period?.startDate || '',
          endDate: initialData.period?.endDate || ''
        },
        organiser: initialData.organiser || '',
        status: initialData.status || '',
        participants: initialData.participants || [],
        description: initialData.description || '',
        venue: initialData.venue || '',
        trainingType: initialData.trainingType || ''
      });
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleParticipantChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      participants: selectedOptions || []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title || !formData.period.startDate || !formData.organiser) {
        throw new Error('Please fill in all required fields');
      }

      // Transform participants data before submission
      const submissionData = {
        ...formData,
        participants: formData.participants.map(p => ({
          id: p.value,
          name: p.label,
          ...p.details
        }))
      };

      await onSubmit(submissionData);
      
      // Reset form
      setFormData({
        title: '',
        period: {
          startDate: '',
          endDate: ''
        },
        organiser: '',
        status: '',
        participants: [],
        description: '',
        venue: '',
        trainingType: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = initialData ? 'Edit Training' : 'Add Training';
  const submitButtonText = initialData 
    ? (isSubmitting ? 'Saving...' : 'Save Changes')
    : (isSubmitting ? 'Adding...' : 'Add Training');

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Training Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Training Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter training title"
          disabled={loading}
        />
      </div>

      {/* Training Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="period.startDate"
            value={formData.period.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="period.endDate"
            value={formData.period.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            min={formData.period.startDate}
          />
        </div>
      </div>

      {/* Training Organiser */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Training Organiser <span className="text-red-500">*</span>
        </label>
        <select
          name="organiser"
          value={formData.organiser}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select Organiser</option>
          <option value="MINISPORTS">MINISPORTS</option>
          <option value="FERWAFA">FERWAFA</option>
          <option value="FERWABA">FERWABA</option>
        </select>
      </div>

      {/* Training Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Training Type
        </label>
        <select
          name="trainingType"
          value={formData.trainingType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select Type</option>
          <option value="Technical">Technical</option>
          <option value="Tactical">Tactical</option>
          <option value="Physical">Physical</option>
          <option value="Mental">Mental</option>
        </select>
      </div>

      {/* Venue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Venue
        </label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter training venue"
          disabled={loading}
        />
      </div>

      {/* Participants */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Participants
        </label>
        <input
          type="number"
          name="participants"
          value={formData.participants}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter number of participants"
          disabled={loading}
          min="0"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter training description"
          disabled={loading}
        />
      </div>

      {/* Participants Multi-select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participants
        </label>
        <Select
          isMulti
          name="participants"
          options={availableProfessionals}
          className="basic-multi-select"
          classNamePrefix="select"
          value={formData.participants}
          onChange={handleParticipantChange}
          placeholder="Select participants..."
          isDisabled={loading}
          formatOptionLabel={({ label, details }) => (
            <div className="flex justify-between items-center">
              <span>{label}</span>
              <span className="text-xs text-gray-500">
                {details.type} - {details.club}
              </span>
            </div>
          )}
        />
      </div>

      {/* Selected Participants Summary */}
      {formData.participants.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Participants ({formData.participants.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.participants.map((participant) => (
              <div 
                key={participant.value}
                className="bg-white px-3 py-1 rounded-full border text-sm flex items-center gap-2"
              >
                <span>{participant.label}</span>
                <span className="text-xs text-gray-500">
                  {participant.details.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default AddTrainingForm; 