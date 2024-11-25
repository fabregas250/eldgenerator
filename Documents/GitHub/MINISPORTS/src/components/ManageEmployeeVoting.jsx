import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Eye, Download, Trash2, AlertTriangle, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

function ManageEmployeeVoting() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [votingToDelete, setVotingToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVoting, setSelectedVoting] = useState(null);

  // Add voting results state
  const [votingResults, setVotingResults] = useState({
    1: { // voting ID
      candidates: {
        1: { // candidate ID
          votes: [
            { criteriaId: 1, points: 8 },
            { criteriaId: 2, points: 7 },
            // ... other criteria points
          ],
          totalPoints: 0
        },
        2: {
          votes: [
            { criteriaId: 1, points: 9 },
            { criteriaId: 2, points: 8 },
          ],
          totalPoints: 0
        },
        // ... other candidates
      }
    }
  });

  // Function to calculate winners
  const calculateWinners = (votingId) => {
    const votingSession = votingResults[votingId];
    if (!votingSession) return { winner: null, runnerUp: null };

    // Calculate total points for each candidate
    const candidateScores = Object.entries(votingSession.candidates).map(([candidateId, data]) => {
      const totalPoints = data.votes.reduce((sum, vote) => sum + vote.points, 0);
      return {
        candidateId,
        totalPoints
      };
    });

    // Sort by total points in descending order
    candidateScores.sort((a, b) => b.totalPoints - a.totalPoints);

    // Get winner and runner-up
    const [winner, runnerUp] = candidateScores;

    return {
      winner: winner ? findCandidateById(winner.candidateId) : null,
      runnerUp: runnerUp ? findCandidateById(runnerUp.candidateId) : null
    };
  };

  // Helper function to find candidate details
  const findCandidateById = (candidateId) => {
    // This would typically come from your candidates data
    const candidates = {
      1: { name: 'MUREKATETE Adrie' },
      2: { name: 'BIMENYIMANA Adrien' },
      // ... other candidates
    };
    return candidates[candidateId];
  };

  // Update mock voting data to include calculated winners
  const [votingData, setVotingData] = useState([
    {
      id: 1,
      year: '2023 - 2024',
      period: {
        fromDate: '2023-12-01',
        toDate: '2023-12-31'
      },
      totalCandidates: 25,
      totalVotes: 150,
      status: 'Active',
      get winners() {
        const result = calculateWinners(this.id);
        return {
          winner: result.winner?.name || 'Pending',
          runnerUp: result.runnerUp?.name || 'Pending'
        };
      }
    },
    {
      id: 2,
      year: '2022 - 2023',
      period: {
        fromDate: '2022-12-01',
        toDate: '2022-12-31'
      },
      totalCandidates: 20,
      totalVotes: 130,
      status: 'Completed',
      get winners() {
        const result = calculateWinners(this.id);
        return {
          winner: result.winner?.name || 'Pending',
          runnerUp: result.runnerUp?.name || 'Pending'
        };
      }
    }
  ]);

  // Filter data based on search
  const filteredData = votingData.filter(voting =>
    Object.values(voting).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle delete
  const handleDelete = (voting) => {
    setVotingToDelete(voting);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    setVotingData(prev => prev.filter(v => v.id !== votingToDelete.id));
    setIsDeleteModalOpen(false);
    toast.success('Voting record deleted successfully');
  };

  // Handle view
  const handleView = (voting) => {
    setSelectedVoting(voting);
    setIsViewModalOpen(true);
  };

  // Handle download
  const handleDownload = (voting) => {
    toast.success('Downloading voting data...');
  };

  // Add function to record a vote
  const recordVote = (votingId, candidateId, criteriaId, points) => {
    setVotingResults(prev => ({
      ...prev,
      [votingId]: {
        ...prev[votingId],
        candidates: {
          ...prev[votingId].candidates,
          [candidateId]: {
            ...prev[votingId].candidates[candidateId],
            votes: [
              ...prev[votingId].candidates[candidateId].votes.filter(v => v.criteriaId !== criteriaId),
              { criteriaId, points }
            ]
          }
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search voting records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Voting Records Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voting Year</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Candidates</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Votes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Winner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Runner Up</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((voting) => (
              <tr key={voting.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{voting.year}</td>
                <td className="px-4 py-3">
                  {voting.period.fromDate} to {voting.period.toDate}
                </td>
                <td className="px-4 py-3">{voting.totalCandidates}</td>
                <td className="px-4 py-3">{voting.totalVotes}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    voting.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {voting.status}
                  </span>
                </td>
                <td className="px-4 py-3">{voting.winners.winner}</td>
                <td className="px-4 py-3">{voting.winners.runnerUp}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(voting)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(voting)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(voting)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Voting Details Modal */}
      <Transition appear show={isViewModalOpen} as={React.Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewModalOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
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
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-xl font-bold">
                      Voting Details
                    </Dialog.Title>
                    <button
                      onClick={() => setIsViewModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {selectedVoting && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Voting Year</label>
                          <p className="font-medium">{selectedVoting.year}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Status</label>
                          <p>
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              selectedVoting.status === 'Active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {selectedVoting.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Voting Period</label>
                        <p className="font-medium">
                          {selectedVoting.period.fromDate} to {selectedVoting.period.toDate}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Total Candidates</label>
                          <p className="font-medium">{selectedVoting.totalCandidates}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Total Votes</label>
                          <p className="font-medium">{selectedVoting.totalVotes}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Winner</label>
                          <p className="font-medium">{selectedVoting.winners.winner}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Runner Up</label>
                          <p className="font-medium">{selectedVoting.winners.runnerUp}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
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
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <Dialog.Title className="text-lg font-medium">
                      Delete Voting Record
                    </Dialog.Title>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this voting record? This action cannot be undone.
                  </p>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteConfirm}
                    >
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default ManageEmployeeVoting; 