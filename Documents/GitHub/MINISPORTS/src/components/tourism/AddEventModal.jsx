import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useTourism } from '../../contexts/TourismContext';
import { Upload } from 'lucide-react';
import { locations } from '../../data/locations';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddEventModal = ({ isOpen, onClose }) => {
  const { categories, addEvent } = useTourism();
  const [formData, setFormData] = useState({
    banner: null,
    video: null,
    name: '',
    category: '',
    subCategory: '',
    location: {
      province: '',
      district: '',
      sector: '',
      cell: '',
      village: ''
    },
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    participants: {
      male: 0,
      female: 0
    },
    fees: '',
    amountGenerated: '',
    description: '',
    status: 'Upcoming' // Default status
  });

  const [locationData, setLocationData] = useState({
    provinces: locations.provinces,
    districts: [],
    sectors: [],
    cells: [],
    villages: []
  });

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  });

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (field === 'banner' && !file.type.startsWith('image/')) {
        toast.error('Please upload an image file for the banner');
        return;
      }
      if (field === 'video' && !file.type.startsWith('video/')) {
        toast.error('Please upload a video file');
        return;
      }
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => {
      const newLocation = {
        ...prev.location,
        [field]: value
      };

      // Reset dependent fields
      switch (field) {
        case 'province':
          newLocation.district = '';
          newLocation.sector = '';
          newLocation.cell = '';
          newLocation.village = '';
          setLocationData(prev => ({
            ...prev,
            districts: locations.districts[value] || [],
            sectors: [],
            cells: [],
            villages: []
          }));
          break;
        case 'district':
          newLocation.sector = '';
          newLocation.cell = '';
          newLocation.village = '';
          setLocationData(prev => ({
            ...prev,
            sectors: locations.sectors[value] || [],
            cells: [],
            villages: []
          }));
          break;
        case 'sector':
          newLocation.cell = '';
          newLocation.village = '';
          setLocationData(prev => ({
            ...prev,
            cells: locations.cells[value] || [],
            villages: []
          }));
          break;
        case 'cell':
          newLocation.village = '';
          setLocationData(prev => ({
            ...prev,
            villages: locations.villages[value] || []
          }));
          break;
      }

      return { ...prev, location: newLocation };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.category || !formData.startDate || !formData.startTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create a new event object
      const newEvent = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        // Convert dates to ISO string format for consistency
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate || formData.startDate).toISOString(),
      };

      // Add the event using the context function
      await addEvent(newEvent);
      
      toast.success('Event added successfully');
      onClose();

      // Reset form
      setFormData({
        banner: null,
        video: null,
        name: '',
        category: '',
        subCategory: '',
        location: {
          province: '',
          district: '',
          sector: '',
          cell: '',
          village: ''
        },
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        participants: {
          male: 0,
          female: 0
        },
        fees: '',
        amountGenerated: '',
        description: '',
        status: 'Upcoming'
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Sports Tourism Event"
      size="2xl"
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
          <div className="space-y-8">
            {/* Media Upload Section */}
            <section className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Banner</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('banner', e)}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
                  >
                    {formData.banner ? (
                      <img
                        src={URL.createObjectURL(formData.banner)}
                        alt="Banner preview"
                        className="h-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-600">Upload Banner</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Video</label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange('video', e)}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
                  >
                    {formData.video ? (
                      <video
                        src={URL.createObjectURL(formData.video)}
                        className="h-full"
                        controls
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-600">Upload Video</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {Object.keys(categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sub Category</label>
                <Select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  required
                  disabled={!formData.category}
                >
                  <option value="">Select Sub Category</option>
                  {formData.category && categories[formData.category].subCategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </Select>
              </div>
            </section>

            {/* Location Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Event Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Province</label>
                  <Select
                    value={formData.location.province}
                    onChange={(e) => handleLocationChange('province', e.target.value)}
                    required
                  >
                    <option value="">Select Province</option>
                    {locationData.provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">District</label>
                  <Select
                    value={formData.location.district}
                    onChange={(e) => handleLocationChange('district', e.target.value)}
                    required
                    disabled={!formData.location.province}
                  >
                    <option value="">Select District</option>
                    {locationData.districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <Select
                    value={formData.location.sector}
                    onChange={(e) => handleLocationChange('sector', e.target.value)}
                    required
                    disabled={!formData.location.district}
                  >
                    <option value="">Select Sector</option>
                    {locationData.sectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cell</label>
                  <Select
                    value={formData.location.cell}
                    onChange={(e) => handleLocationChange('cell', e.target.value)}
                    required
                    disabled={!formData.location.sector}
                  >
                    <option value="">Select Cell</option>
                    {locationData.cells.map(cell => (
                      <option key={cell} value={cell}>{cell}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Village</label>
                  <Select
                    value={formData.location.village}
                    onChange={(e) => handleLocationChange('village', e.target.value)}
                    required
                    disabled={!formData.location.cell}
                  >
                    <option value="">Select Village</option>
                    {locationData.villages.map(village => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </section>

            {/* Date and Time Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <Select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    min={formData.startDate}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <Select
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  >
                    <option value="">Select Time</option>
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </section>

            {/* Participants and Fees Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4">Participants & Fees</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Male Participants</label>
                  <Input
                    type="number"
                    value={formData.participants.male}
                    onChange={(e) => setFormData({
                      ...formData,
                      participants: { ...formData.participants, male: e.target.value }
                    })}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Female Participants</label>
                  <Input
                    type="number"
                    value={formData.participants.female}
                    onChange={(e) => setFormData({
                      ...formData,
                      participants: { ...formData.participants, female: e.target.value }
                    })}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Fees (RWF)</label>
                  <Input
                    type="number"
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount Generated (RWF)</label>
                  <Input
                    type="number"
                    value={formData.amountGenerated}
                    onChange={(e) => setFormData({ ...formData, amountGenerated: e.target.value })}
                    min="0"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <div>
                <label className="block text-sm font-medium mb-2">Event Description</label>
                <div className="prose max-w-none">
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFormData({ ...formData, description: data });
                    }}
                    config={{
                      toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'blockQuote',
                        'insertTable',
                        'undo',
                        'redo'
                      ],
                      placeholder: 'Enter detailed event description...',
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[100px] h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-event-form"
              className="min-w-[140px] h-10 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Add Event
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddEventModal; 