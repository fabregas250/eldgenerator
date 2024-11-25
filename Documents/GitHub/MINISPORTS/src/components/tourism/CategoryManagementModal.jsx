import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTourism } from '../../contexts/TourismContext';

const CategoryManagementModal = ({ isOpen, onClose }) => {
  const { categories, updateCategories } = useTourism();
  const [newCategory, setNewCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    if (Object.keys(categories).includes(newCategory)) {
      toast.error('Category already exists');
      return;
    }

    const updatedCategories = {
      ...categories,
      [newCategory]: {
        subCategories: [],
        levels: []
      }
    };

    updateCategories(updatedCategories);
    setNewCategory('');
    toast.success('Category added successfully');
  };

  const handleAddSubCategory = () => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }

    if (!newSubCategory.trim()) {
      toast.error('Subcategory name cannot be empty');
      return;
    }

    if (categories[selectedCategory].subCategories.includes(newSubCategory)) {
      toast.error('Subcategory already exists');
      return;
    }

    const updatedCategories = {
      ...categories,
      [selectedCategory]: {
        ...categories[selectedCategory],
        subCategories: [...categories[selectedCategory].subCategories, newSubCategory]
      }
    };

    updateCategories(updatedCategories);
    setNewSubCategory('');
    toast.success('Subcategory added successfully');
  };

  const handleDeleteCategory = (category) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="font-medium mb-2 dark:text-white">Delete Category</h3>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete "{category}"? This will also delete all its subcategories.
        </p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const newCategories = { ...categories };
              delete newCategories[category];
              updateCategories(newCategories);
              toast.dismiss(t);
              toast.success('Category deleted successfully');
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ));
  };

  const handleDeleteSubCategory = (category, subCategory) => {
    const updatedCategories = {
      ...categories,
      [category]: {
        ...categories[category],
        subCategories: categories[category].subCategories.filter(sub => sub !== subCategory)
      }
    };
    updateCategories(updatedCategories);
    toast.success('Subcategory deleted successfully');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Event Categories"
      size="2xl"
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Form Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Event Category Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add and manage event categories and their subcategories
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-8 py-6">
            {/* Add Category Section */}
            <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-base font-semibold mb-4">Add New Category</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </section>

            {/* Add Subcategory Section */}
            <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-base font-semibold mb-4">Add New Subcategory</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  className="flex h-10 w-full sm:w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {Object.keys(categories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="flex flex-1 gap-3">
                  <Input
                    placeholder="Enter subcategory name"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddSubCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </section>

            {/* Categories List */}
            <section>
              <h3 className="text-base font-semibold mb-4">Current Categories</h3>
              <div className="space-y-4">
                {Object.entries(categories).map(([category, data]) => (
                  <div key={category} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between">
                      <h4 className="font-medium text-lg">{category}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {data.subCategories.map(subcategory => (
                          <div 
                            key={subcategory} 
                            className="flex items-center justify-between py-2 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-md"
                          >
                            <span className="text-sm">{subcategory}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteSubCategory(category, subcategory)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {data.subCategories.length === 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                            No subcategories yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryManagementModal; 