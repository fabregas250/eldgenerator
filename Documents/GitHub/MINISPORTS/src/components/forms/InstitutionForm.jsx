import { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useToast } from '../../contexts/ToastContext';

const validationRules = {
  name: {
    required: true,
    minLength: 3
  },
  location: {
    required: true
  },
  category: {
    required: true
  }
};

function InstitutionForm({ institution, onSubmit, onCancel }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    resetForm
  } = useFormValidation(
    institution || {
      name: '',
      location: '',
      category: 'EXCELLENCE SCHOOL',
      status: 'Active'
    },
    validationRules
  );

  const locations = ['SOUTHERN', 'EASTERN', 'WESTERN', 'NORTHERN', 'CITY OF KIGALI'];
  const categories = ['EXCELLENCE SCHOOL', 'REGULAR SCHOOL', 'SPECIAL SCHOOL'];
  const statuses = ['Active', 'Suspended', 'On going'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(values);
      showToast('Institution saved successfully');
      resetForm();
    } catch (error) {
      showToast('Failed to save institution', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Institution Name
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name && touched.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#E2E7F0] focus:ring-[#4318FF]'
            } focus:outline-none focus:ring-2`}
            placeholder="Enter institution name"
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Location
          </label>
          <select
            name="location"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.location && touched.location
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#E2E7F0] focus:ring-[#4318FF]'
            } focus:outline-none focus:ring-2`}
          >
            <option value="">Select location</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          {errors.location && touched.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Category
          </label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[#E2E7F0] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Status
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[#E2E7F0] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border border-[#E2E7F0] text-[#A3AED0] hover:bg-[#F4F7FE]"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-[#4318FF] text-white hover:bg-[#3311CC] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default InstitutionForm; 