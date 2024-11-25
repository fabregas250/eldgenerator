import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

function AddMassSportModal({ isOpen, onClose, onAdd }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    round: '',
    purpose: '',
    femaleCount: '',
    maleCount: '',
    organizers: '',
    guestOfHonor: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = Number(formData.femaleCount) + Number(formData.maleCount);
    onAdd({ ...formData, total });
    setFormData({
      date: '',
      location: '',
      round: '',
      purpose: '',
      femaleCount: '',
      maleCount: '',
      organizers: '',
      guestOfHonor: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-lg ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
              } p-6 text-left align-middle shadow-xl transition-all`}>
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    Add New Mass Sport Event
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Location</label>
                      <Input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter location"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Round</label>
                      <Input
                        type="text"
                        name="round"
                        value={formData.round}
                        onChange={handleChange}
                        required
                        placeholder="Enter round"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Purpose</label>
                      <Input
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        placeholder="Enter purpose"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">No. of Female</label>
                      <Input
                        type="number"
                        name="femaleCount"
                        value={formData.femaleCount}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">No. of Male</label>
                      <Input
                        type="number"
                        name="maleCount"
                        value={formData.maleCount}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">Organizers</label>
                      <Input
                        type="text"
                        name="organizers"
                        value={formData.organizers}
                        onChange={handleChange}
                        required
                        placeholder="Enter organizers"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Guest of Honor</label>
                      <Input
                        type="text"
                        name="guestOfHonor"
                        value={formData.guestOfHonor}
                        onChange={handleChange}
                        required
                        placeholder="Enter guest of honor"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add Mass Sport
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddMassSportModal; 