import React, { useState } from 'react';
import { Info, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover } from '@headlessui/react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const AddAppointmentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    time: '',
    name: '',
    phone: '',
    message: '',
    location: 'MINISPORTS OFFICE',
    requestedDate: new Date(),
    status: 'Not confirmed',
    creator: 'email'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Time slots available
  const timeSlots = [
    "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00",
    "10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00",
    "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00",
    "16:00 - 16:30", "16:30 - 17:00", "17:00 - 17:30", "17:30 - 18:00"
  ];

  const locations = [
    "MINISPORTS OFFICE",
    "AMAHORO STADIUM",
    "BK ARENA"
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, requestedDate: date }));
    setShowCalendar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.time || !formData.name || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Phone number validation (Rwanda format)
      const phoneRegex = /^(\+?25)?(07[238]\d{7})$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Please enter a valid Rwandan phone number');
      }

      await onSubmit(formData);
      
      // Reset form
      setFormData({
        time: '',
        name: '',
        phone: '',
        message: '',
        location: 'MINISPORTS OFFICE',
        requestedDate: new Date(),
        status: 'Not confirmed',
        creator: 'email'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Date and Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Popover>
              <Popover.Button className="w-full">
                <div className="flex items-center justify-between w-full px-3 py-2 border rounded-lg">
                  <span>{selectedDate.toLocaleDateString()}</span>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </Popover.Button>

              <Popover.Panel className="absolute z-10 bg-white shadow-lg rounded-lg mt-1">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={[
                    { before: new Date() },
                    { dayOfWeek: [0, 6] } // Disable weekends
                  ]}
                />
              </Popover.Panel>
            </Popover>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Time <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Time</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
            placeholder="07X XXX XXXX"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block mb-1 text-sm font-medium">Location</label>
        <select
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full border rounded-lg p-2"
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block mb-1 text-sm font-medium">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          rows={4}
          className="w-full border rounded-lg p-2 resize-none"
          placeholder="Enter your message"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Appointment'}
        </Button>
      </div>
    </form>
  );
};

export default AddAppointmentForm; 