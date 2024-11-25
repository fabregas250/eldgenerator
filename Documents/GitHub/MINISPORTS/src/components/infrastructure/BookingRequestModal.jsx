import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { toast } from 'sonner';

const BookingRequestModal = ({ isOpen, onClose, infrastructure }) => {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
    organizerName: '',
    organizerPhone: '',
    organizerEmail: '',
    additionalNotes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to submit booking request
      toast.success('Booking request submitted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to submit booking request');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book ${infrastructure?.name || 'Facility'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Calendar
              selected={formData.startDate}
              onSelect={(date) => setFormData({ ...formData, startDate: date })}
              minDate={new Date()}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Calendar
              selected={formData.endDate}
              onSelect={(date) => setFormData({ ...formData, endDate: date })}
              minDate={formData.startDate || new Date()}
              required
            />
          </div>
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Event Details */}
        <div>
          <label className="block text-sm font-medium mb-1">Purpose of Booking</label>
          <Input
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="e.g., Sports Tournament, Training Session"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expected Number of Attendees</label>
          <Input
            type="number"
            value={formData.expectedAttendees}
            onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
            required
          />
        </div>

        {/* Organizer Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organizer Name</label>
            <Input
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input
              type="tel"
              value={formData.organizerPhone}
              onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={formData.organizerEmail}
            onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Notes</label>
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            rows={3}
            placeholder="Any special requirements or additional information"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Submit Booking Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingRequestModal; 