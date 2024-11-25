import { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useToast } from '../../contexts/ToastContext';

const validationRules = {
  name: {
    required: true,
    minLength: 3
  },
  institution: {
    required: true
  },
  studentId: {
    required: true,
    pattern: /^[A-Z0-9]+$/,
    message: 'Student ID must contain only uppercase letters and numbers'
  },
  grade: {
    required: true
  }
};

function StudentForm({ student, onSubmit, onCancel }) {
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
    student || {
      name: '',
      institution: '',
      studentId: '',
      grade: '',
      status: 'Active',
      sport: 'Football'
    },
    validationRules
  );

  const sports = ['Football', 'Basketball', 'Volleyball', 'Athletics', 'Swimming'];
  const grades = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  const statuses = ['Active', 'Inactive', 'Graduated'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(values);
      showToast('Student saved successfully');
      resetForm();
    } catch (error) {
      showToast('Failed to save student', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Student Name
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
            placeholder="Enter student name"
          />
          {errors.name && touched.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Institution
          </label>
          <input
            type="text"
            name="institution"
            value={values.institution}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.institution && touched.institution
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#E2E7F0] focus:ring-[#4318FF]'
            } focus:outline-none focus:ring-2`}
            placeholder="Enter institution name"
          />
          {errors.institution && touched.institution && (
            <p className="mt-1 text-sm text-red-500">{errors.institution}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Student ID
          </label>
          <input
            type="text"
            name="studentId"
            value={values.studentId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.studentId && touched.studentId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#E2E7F0] focus:ring-[#4318FF]'
            } focus:outline-none focus:ring-2`}
            placeholder="Enter student ID"
          />
          {errors.studentId && touched.studentId && (
            <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Grade
          </label>
          <select
            name="grade"
            value={values.grade}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.grade && touched.grade
                ? 'border-red-500 focus:ring-red-500'
                : 'border-[#E2E7F0] focus:ring-[#4318FF]'
            } focus:outline-none focus:ring-2`}
          >
            <option value="">Select grade</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          {errors.grade && touched.grade && (
            <p className="mt-1 text-sm text-red-500">{errors.grade}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1B2559] mb-2">
            Sport
          </label>
          <select
            name="sport"
            value={values.sport}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-[#E2E7F0] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          >
            {sports.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
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

export default StudentForm; 