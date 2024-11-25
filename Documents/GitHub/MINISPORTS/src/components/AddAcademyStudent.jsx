import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function AddAcademyStudent({ isOpen, onClose, onAdd }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    passportPicture: null,
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    placeOfBirth: '',
    placeOfResidence: '',
    identificationType: 'ID',
    idNumber: '',
    passportNumber: '',
    passportExpiryDate: '',
    nationality: '',
    otherNationality: '',
    parentsGuardian: '',
    schoolName: '',
    class: '',
    gameType: '',
    contact: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Options for select fields
  const genderOptions = ['Male', 'Female', 'Other'];
  const nationalityOptions = [
    'Rwandan', 'Kenyan', 'Ugandan', 'Tanzanian', 'Burundian', 
    'Other (specify)'
  ];
  const classOptions = [
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6'
  ];

  // Add identification type options
  const identificationTypes = ['ID', 'Passport', 'N/A'];

  // Add state for school search
  const [schoolSearch, setSchoolSearch] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  // Mock schools/academies data (in real app, fetch from API)
  const [schools] = useState([
    { id: 1, name: 'Lycee de Kigali', type: 'Excellence school' },
    { id: 2, name: 'FAWE Girls School', type: 'Excellence school' },
    { id: 3, name: 'College Saint Andre', type: 'Excellence school' },
    { id: 4, name: 'Agaciro Football Center', type: 'F.Center' },
    { id: 5, name: 'Alpha Sport', type: 'Youth Center' },
    { id: 6, name: 'Amagaju Girls Academy', type: 'Centre' },
    { id: 7, name: 'Amagaju Youth FC', type: 'Centre' },
    { id: 8, name: 'Amaisero Vision Sport', type: 'F.Center' },
    { id: 9, name: 'Amazero yubuzima', type: 'Youth Centre' }
  ]);

  // Filter schools based on search
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    school.type.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  // Handle school selection
  const handleSchoolSelect = (school) => {
    setFormData(prev => ({
      ...prev,
      schoolName: school.name,
      type: school.type
    }));
    setShowSchoolDropdown(false);
    setSchoolSearch('');
  };

  // Update the form to include identification type selection
  const renderIdentificationFields = () => {
    switch (formData.identificationType) {
      case 'ID':
        return (
          <div>
            <label className="block mb-1 text-sm font-medium">
              ID Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.idNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
              required
              placeholder="Enter ID number"
            />
          </div>
        );
      case 'Passport':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Passport Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
                required
                placeholder="Enter passport number"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.passportExpiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, passportExpiryDate: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, passportPicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        throw new Error('Please fill in all required fields');
      }

      // ID/Passport validation
      if (formData.identificationType === 'ID' && !formData.idNumber) {
        throw new Error('Please enter ID number');
      }

      if (formData.identificationType === 'Passport') {
        if (!formData.passportNumber) {
          throw new Error('Please enter passport number');
        }
        if (!formData.passportExpiryDate) {
          throw new Error('Please enter passport expiry date');
        }
        
        // Validate expiry date
        const expiryDate = new Date(formData.passportExpiryDate);
        if (expiryDate <= new Date()) {
          throw new Error('Passport has expired');
        }
      }

      // Age validation (12-17)
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 12 || age > 17) {
        throw new Error('Student must be between 12 and 17 years old');
      }

      await onAdd(formData);
      onClose();
      toast.success('Student added successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update the School/Academy section in the form
  const renderSchoolField = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 text-sm font-medium">
          School/Academy Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="relative">
            <Input
              type="text"
              value={schoolSearch}
              onChange={(e) => {
                setSchoolSearch(e.target.value);
                setShowSchoolDropdown(true);
              }}
              onFocus={() => setShowSchoolDropdown(true)}
              placeholder="Search school/academy..."
              className="w-full pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Selected school display */}
          {formData.schoolName && !showSchoolDropdown && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md flex justify-between items-center">
              <div>
                <span className="font-medium">{formData.schoolName}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  schoolName: ''
                }))}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* School search dropdown */}
          {showSchoolDropdown && schoolSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border">
              {filteredSchools.length > 0 ? (
                filteredSchools.map(school => (
                  <button
                    key={school.id}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() => handleSchoolSelect(school)}
                  >
                    <div className="font-medium">{school.name}</div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No schools/academies found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Class</label>
        <select
          value={formData.class}
          onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Select Class</option>
          {classOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );

  // Add state for game search
  const [gameSearch, setGameSearch] = useState('');
  const [showGameDropdown, setShowGameDropdown] = useState(false);

  // Expanded list of sports/games
  const allGameTypes = [
    // Team Sports
    'Football',
    'Basketball',
    'Volleyball',
    'Handball',
    'Rugby',
    'Cricket',
    'Hockey',
    'Baseball',
    'Netball',
    
    // Individual Sports
    'Tennis',
    'Table Tennis',
    'Badminton',
    'Swimming',
    'Athletics',
    'Boxing',
    'Wrestling',
    'Judo',
    'Karate',
    'Taekwondo',
    
    // Racket Sports
    'Squash',
    'Pickleball',
    
    // Combat Sports
    'Kickboxing',
    'Mixed Martial Arts',
    
    // Other Sports
    'Cycling',
    'Golf',
    'Gymnastics',
    'Weightlifting',
    'Chess',
    'Archery'
  ].sort(); // Sort alphabetically

  // Filter games based on search
  const filteredGames = allGameTypes.filter(game =>
    game.toLowerCase().includes(gameSearch.toLowerCase())
  );

  // Handle game selection
  const handleGameSelect = (game) => {
    setFormData(prev => ({
      ...prev,
      gameType: game
    }));
    setShowGameDropdown(false);
    setGameSearch('');
  };

  // Update the game type field in the form
  const renderGameTypeField = () => (
    <div>
      <label className="block mb-1 text-sm font-medium">Type of Game</label>
      <div className="relative">
        <div className="relative">
          <Input
            type="text"
            value={gameSearch}
            onChange={(e) => {
              setGameSearch(e.target.value);
              setShowGameDropdown(true);
            }}
            onFocus={() => setShowGameDropdown(true)}
            placeholder="Search game type..."
            className="w-full pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Selected game display */}
        {formData.gameType && !showGameDropdown && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md flex justify-between items-center">
            <span className="font-medium">{formData.gameType}</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, gameType: '' }))}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Game search dropdown */}
        {showGameDropdown && gameSearch && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border">
            {filteredGames.length > 0 ? (
              filteredGames.map(game => (
                <button
                  key={game}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleGameSelect(game)}
                >
                  <div className="font-medium">{game}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No games found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Add state for nationality search
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);

  // Comprehensive list of world nationalities
  const allNationalities = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan', 'Argentine',
    'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi',
    'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bhutanese', 'Bolivian',
    'Bosnian', 'Botswanan', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabe',
    'Burundian', 'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African',
    'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican',
    'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dutch',
    'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean', 'Eritrean',
    'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian',
    'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Guinean',
    'Guinea-Bissauan', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelandic', 'Indian',
    'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican',
    'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan', 'Kiribati', 'North Korean', 'South Korean',
    'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Lesothan', 'Liberian', 'Libyan',
    'Liechtensteiner', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 'Malawian',
    'Malaysian', 'Maldivian', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian',
    'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Montenegrin', 'Moroccan',
    'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian',
    'Nigerien', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Palestinian', 'Panamanian',
    'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Qatari', 'Romanian',
    'Russian', 'Rwandan', 'Saint Kitts and Nevis', 'Saint Lucian', 'Salvadoran', 'Samoan',
    'San Marinese', 'Sao Tomean', 'Saudi', 'Senegalese', 'Serbian', 'Seychellois',
    'Sierra Leonean', 'Singaporean', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali',
    'South African', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese', 'Swazi', 'Swedish',
    'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese', 'Tongan',
    'Trinidadian', 'Tunisian', 'Turkish', 'Turkmen', 'Tuvaluan', 'Ugandan', 'Ukrainian',
    'Uruguayan', 'Uzbekistani', 'Vanuatuan', 'Vatican', 'Venezuelan', 'Vietnamese', 'Yemeni',
    'Zambian', 'Zimbabwean'
  ].sort();

  // Filter nationalities based on search
  const filteredNationalities = allNationalities.filter(nationality =>
    nationality.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  // Handle nationality selection
  const handleNationalitySelect = (nationality) => {
    setFormData(prev => ({
      ...prev,
      nationality
    }));
    setShowNationalityDropdown(false);
    setNationalitySearch('');
  };

  // Update the nationality field in the form to be searchable
  const renderNationalityField = () => (
    <div>
      <label className="block mb-1 text-sm font-medium">Nationality</label>
      <div className="relative">
        <div className="relative">
          <Input
            type="text"
            value={nationalitySearch}
            onChange={(e) => {
              setNationalitySearch(e.target.value);
              setShowNationalityDropdown(true);
            }}
            onFocus={() => setShowNationalityDropdown(true)}
            placeholder="Search nationality..."
            className="w-full pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Selected nationality display */}
        {formData.nationality && !showNationalityDropdown && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md flex justify-between items-center">
            <span className="font-medium">{formData.nationality}</span>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, nationality: '' }))}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Nationality search dropdown */}
        {showNationalityDropdown && nationalitySearch && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border">
            {filteredNationalities.length > 0 ? (
              filteredNationalities.map(nationality => (
                <button
                  key={nationality}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleNationalitySelect(nationality)}
                >
                  <div className="font-medium">{nationality}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No nationalities found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
            } p-6 text-left align-middle shadow-xl transition-all`}>
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-bold">
                  Add Academy Student
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Passport Picture */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Passport Picture</label>
                  <div className="flex items-center space-x-4">
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.passportPicture ? formData.passportPicture.name : 'No file chosen'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Gender and Date of Birth */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      required
                      className="w-full border rounded-lg p-2"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Place of Birth and Residence */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Place of Birth</label>
                    <Input
                      type="text"
                      value={formData.placeOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                      placeholder="Enter place of birth"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Place of Residence</label>
                    <Input
                      type="text"
                      value={formData.placeOfResidence}
                      onChange={(e) => setFormData(prev => ({ ...prev, placeOfResidence: e.target.value }))}
                      placeholder="Enter place of residence"
                    />
                  </div>
                </div>

                {/* Add Identification Type Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Identification Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.identificationType}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        identificationType: e.target.value,
                        // Reset related fields when changing type
                        idNumber: '',
                        passportNumber: '',
                        passportExpiryDate: ''
                      }))}
                      required
                      className="w-full border rounded-lg p-2"
                    >
                      {identificationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Render ID/Passport fields based on selection */}
                  {renderIdentificationFields()}
                </div>

                {/* Replace the old nationality select with the new searchable version */}
                <div className="grid grid-cols-2 gap-4">
                  {renderNationalityField()}
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Names of Parents/Guardian <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.parentsGuardian}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentsGuardian: e.target.value }))}
                      required
                      placeholder="Enter parent/guardian names"
                    />
                  </div>
                </div>

                {/* Replace the old school fields with the new searchable version */}
                {renderSchoolField()}

                {/* Game Type */}
                <div>
                  {renderGameTypeField()}
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Contact</label>
                  <Input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="Enter contact number"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
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
                    Add Student
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddAcademyStudent; 