import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const AddNationalTeamForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    teamName: initialData?.teamName || '',
    teamMonth: initialData?.teamMonth || '',
    month: initialData?.month || '',
    teamYear: initialData?.teamYear || '',
    federation: initialData?.federation || '',
    competition: initialData?.competition || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    games: initialData?.games || [{ game: '', stadium: '' }]
  });

  // Federation options
  const federations = [
    "Rwanda Football Federation (FERWAFA)",
    "Rwanda Basketball Federation (FERWABA)",
    "Rwanda Volleyball Federation (FRVB)",
    "Rwanda Athletics Federation (RAF)",
    "Rwanda Paralympic Committee (NPC)",
    "Rwanda National Olympic and Sports Committee (RNOSC)"
  ];

  // Countries list
  const countries = [
    "Rwanda",
    "Uganda",
    "Kenya",
    "Tanzania",
    "Burundi",
    "DR Congo"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGame = () => {
    setFormData(prev => ({
      ...prev,
      games: [...prev.games, { game: '', stadium: '' }]
    }));
  };

  const handleRemoveGame = (index) => {
    setFormData(prev => ({
      ...prev,
      games: prev.games.filter((_, i) => i !== index)
    }));
  };

  const handleGameChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      games: prev.games.map((game, i) => {
        if (i === index) {
          return { ...game, [field]: value };
        }
        return game;
      })
    }));
  };

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Team Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            required
            placeholder="Enter team name"
          />
        </div>

        {/* Team Month */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Team Month <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="teamMonth"
            value={formData.teamMonth}
            onChange={handleChange}
            required
            placeholder="Enter team month"
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = new Date(0, i).toLocaleString('default', { month: 'long' });
              return <option key={month} value={month}>{month}</option>;
            })}
          </select>
        </div>

        {/* Team Year */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Team Year <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            name="teamYear"
            value={formData.teamYear}
            onChange={handleChange}
            required
            placeholder="Enter team year"
            min="2000"
            max="2100"
          />
        </div>

        {/* Federation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Federation <span className="text-red-500">*</span>
          </label>
          <select
            name="federation"
            value={formData.federation}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Federation</option>
            {federations.map(fed => (
              <option key={fed} value={fed}>{fed}</option>
            ))}
          </select>
        </div>

        {/* Competition */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Competition <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="competition"
            value={formData.competition}
            onChange={handleChange}
            required
            placeholder="Enter competition name"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="Enter city"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Games Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Games and Stadiums</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGame}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Game
            </Button>
          </div>

          <div className="space-y-3">
            {formData.games.map((game, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Game Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={game.game}
                      onChange={(e) => handleGameChange(index, 'game', e.target.value)}
                      required
                      placeholder="Enter game name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Stadium <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={game.stadium}
                        onChange={(e) => handleGameChange(index, 'stadium', e.target.value)}
                        required
                        placeholder="Enter stadium name"
                      />
                      {formData.games.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGame(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {initialData ? 'Update Team' : 'Add Team'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNationalTeamForm; 