import React, { useState, Fragment } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare, 
  Check, 
  X as XIcon,
  Eye, 
  Calendar,
  MoreVertical,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import AddAppointmentModal from '../components/AddAppointmentModal';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

function Appointments() {
  const [showMinister, setShowMinister] = useState(true);
  const [showPS, setShowPS] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [comment, setComment] = useState('');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  // Mock appointments data
  const [appointments] = useState([
    {
      id: 1,
      time: '18:15 - 19:00',
      names: 'Patrick BYOSENIYO',
      phone: '0784704515',
      message: "ikibazi cyijyanye n'imyambaro yabakinnyi bikipe nkuru",
      requestedDate: '10 Jul 2024 15:32:09',
      location: 'MINISPORTS OFFICE',
      status: 'Scheduled',
      creator: 'email'
    },
    {
      id: 2,
      time: '17:45 - 18:00',
      names: 'Jackson NTARINDWA',
      phone: '0784704515',
      message: "ikibazi cyijyanye n'imyambaro yabakinnyi bikipe nkuru",
      requestedDate: '10 Jul 2024 15:32:09',
      location: 'MINISPORTS OFFICE',
      status: 'Not confirmed',
      creator: 'chat'
    }
  ]);

  // Filter appointments based on search and type
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = Object.values(appointment).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesSearch;
  });

  // Sorting
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = sortedAppointments.slice(startIndex, endIndex);

  const getCreatorIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-blue-600" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  // Time slots for rescheduling
  const timeSlots = [
    "09:00 - 09:30", "09:30 - 10:00", 
    "10:00 - 10:30", "10:30 - 11:00",
    "11:00 - 11:30", "11:30 - 12:00",
    "14:00 - 14:30", "14:30 - 15:00",
    "15:00 - 15:30", "15:30 - 16:00",
    "16:00 - 16:30", "16:30 - 17:00"
  ];

  // Handle approve
  const handleApprove = (appointment) => {
    setSelectedAppointment(appointment);
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = () => {
    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        return { ...app, status: 'Scheduled' };
      }
      return app;
    });
    setAppointments(updatedAppointments);
    setIsApproveModalOpen(false);
    toast.success('Appointment approved successfully');
  };

  // Handle reject
  const handleReject = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        return { ...app, status: 'Rejected' };
      }
      return app;
    });
    setAppointments(updatedAppointments);
    setIsRejectModalOpen(false);
    toast.success('Appointment rejected');
  };

  // Handle reschedule
  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: '',
      time: '',
      reason: ''
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleData.date || !rescheduleData.time || !rescheduleData.reason) {
      toast.error('Please fill in all fields');
      return;
    }

    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        return {
          ...app,
          status: 'Rescheduled',
          requestedDate: rescheduleData.date,
          time: rescheduleData.time,
          rescheduleReason: rescheduleData.reason
        };
      }
      return app;
    });
    setAppointments(updatedAppointments);
    setIsRescheduleModalOpen(false);
    toast.success('Appointment rescheduled successfully');
  };

  // Action handlers
  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleAddComment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCommentModalOpen(true);
  };

  const handleCommentSubmit = () => {
    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        return { 
          ...app, 
          comments: [...(app.comments || []), { text: comment, date: new Date().toISOString() }]
        };
      }
      return app;
    });
    setAppointments(updatedAppointments);
    setComment('');
    setIsCommentModalOpen(false);
    toast.success('Comment added successfully');
  };

  // Update the table row actions
  const renderActions = (appointment) => (
    <div className="flex items-center space-x-1">
      {appointment.status === 'Not confirmed' && (
        <>
          <Button
            size="sm"
            variant="ghost"
            className="text-green-600 hover:text-green-700 p-1 h-7 w-7"
            onClick={() => handleApprove(appointment)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 p-1 h-7 w-7"
            onClick={() => handleReject(appointment)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="p-1 h-7 w-7"
        onClick={() => handleView(appointment)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1 h-7 w-7"
        onClick={() => handleReschedule(appointment)}
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-4">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 pl-8 h-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span>Showing: </span>
            <span className="font-medium">{currentAppointments.length} Appointments</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={showMinister}
              onChange={(e) => setShowMinister(e.target.checked)}
              className="rounded border-gray-300" 
            />
            <label className="text-sm">MINISTER</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={showPS}
              onChange={(e) => setShowPS(e.target.checked)}
              className="rounded border-gray-300" 
            />
            <label className="text-sm">PS</label>
          </div>
          <select className="border rounded-lg px-2 py-1 text-sm">
            <option>Display All</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-3 py-2">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedRows.length === currentAppointments.length}
                  onChange={() => {/* Handle select all */}}
                />
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">TIME</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">NAMES</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">PHONE</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">MESSAGE</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">REQUESTED DATE</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">LOCATION</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">STATUS</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">CREATOR</th>
              <th className="w-24 px-3 py-2 text-left text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap">{appointment.time}</td>
                <td className="px-3 py-2 text-sm">{appointment.names}</td>
                <td className="px-3 py-2 text-sm">{appointment.phone}</td>
                <td className="px-3 py-2 text-sm max-w-[200px] truncate">{appointment.message}</td>
                <td className="px-3 py-2 text-sm whitespace-nowrap">{appointment.requestedDate}</td>
                <td className="px-3 py-2 text-sm">{appointment.location}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                    appointment.status === 'Scheduled' 
                      ? 'bg-green-100 text-green-800' 
                      : appointment.status === 'Not confirmed'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {getCreatorIcon(appointment.creator)}
                </td>
                <td className="px-3 py-2">
                  {renderActions(appointment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Updated Pagination Section */}
      <div className="flex items-center justify-end mt-4 space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded-md"
        >
          Previous
        </Button>

        <div className="flex items-center">
          <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
            {currentPage}
          </span>
        </div>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded-md"
        >
          Next
        </Button>
      </div>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(data) => {
          // Handle adding new appointment
          console.log('New appointment:', data);
          setIsAddModalOpen(false);
          toast.success('Appointment request submitted successfully');
        }}
      />

      {/* Add View Modal */}
      <Dialog 
        open={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">
                Appointment Details
              </Dialog.Title>
              <button onClick={() => setIsViewModalOpen(false)}>
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{selectedAppointment.names}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Time</label>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                </div>
                {/* Add more appointment details */}
                <div>
                  <label className="text-sm text-gray-500">Message</label>
                  <p className="font-medium">{selectedAppointment.message}</p>
                </div>
                {/* Comments section */}
                <div>
                  <label className="text-sm text-gray-500">Comments</label>
                  <div className="mt-2 space-y-2">
                    {selectedAppointment.comments?.map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded">
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Comment Modal */}
      <Dialog 
        open={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium">
                Add Comment
              </Dialog.Title>
              <button onClick={() => setIsCommentModalOpen(false)}>
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-lg p-2 min-h-[100px]"
                placeholder="Enter your comment..."
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCommentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim()}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Approve Confirmation Modal */}
      <Transition appear show={isApproveModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsApproveModalOpen(false)}
        >
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Approve Appointment
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to approve this appointment for {selectedAppointment?.names}?
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsApproveModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApproveConfirm}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Reject Confirmation Modal */}
      <Transition appear show={isRejectModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsRejectModalOpen(false)}
        >
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Reject Appointment
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to reject this appointment for {selectedAppointment?.names}?
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsRejectModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRejectConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reject
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Reschedule Modal */}
      <Transition appear show={isRescheduleModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsRescheduleModalOpen(false)}
        >
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Reschedule Appointment
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">New Date</label>
                    <Input
                      type="date"
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Time</label>
                    <select
                      value={rescheduleData.time}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full border rounded-lg p-2"
                      required
                    >
                      <option value="">Select Time</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Rescheduling</label>
                    <textarea
                      value={rescheduleData.reason}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full border rounded-lg p-2 min-h-[100px]"
                      required
                      placeholder="Enter reason for rescheduling"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsRescheduleModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRescheduleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Reschedule
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Edit Modal */}
      {/* Similar structure to Add Appointment Modal but with pre-filled data */}
    </div>
  );
}

export default Appointments; 