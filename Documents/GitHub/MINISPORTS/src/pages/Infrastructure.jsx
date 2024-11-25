import React, { useState } from 'react';
import { Plus, MapPin, Filter, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import InfrastructureMap from '../components/infrastructure/InfrastructureMap';
import InfrastructureList from '../components/infrastructure/InfrastructureList';
import AddInfrastructureModal from '../components/infrastructure/AddInfrastructureModal';
import BookingManagement from '../components/infrastructure/BookingManagement';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useDarkMode } from '../contexts/DarkModeContext';
import CategoryManagementModal from '../components/infrastructure/CategoryManagementModal';
import { useInfrastructure } from '../contexts/InfrastructureContext';

const Infrastructure = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const { isDarkMode } = useDarkMode();
  const { categories, updateCategories } = useInfrastructure();

  // Only show Add Infrastructure button on list view
  const showAddButton = activeTab === 'list';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Sports Infrastructure
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage and monitor sports facilities across the country
          </p>
        </div>
        <div className="flex gap-3">
          {showAddButton && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(true)}
              >
                Manage Categories
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Infrastructure
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <Tabs defaultValue="list" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">
            List View
          </TabsTrigger>
          <TabsTrigger value="map">
            Map View
          </TabsTrigger>
          <TabsTrigger value="bookings">
            Booking Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <InfrastructureList />
        </TabsContent>

        <TabsContent value="map">
          <InfrastructureMap />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>
      </Tabs>

      {/* Add Infrastructure Modal */}
      <AddInfrastructureModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onUpdate={updateCategories}
      />
    </div>
  );
};

export default Infrastructure; 