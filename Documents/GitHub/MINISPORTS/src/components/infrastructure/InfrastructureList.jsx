import React, { useState } from 'react';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell 
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Eye, Edit, Trash2, MapPin, Search, Filter } from 'lucide-react';
import { useInfrastructure } from '../../contexts/InfrastructureContext';
import { toast } from 'sonner';
import ExportButton from './ExportButton';

const InfrastructureList = () => {
  const { infrastructures, categories } = useInfrastructure();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    province: '',
    district: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for provinces and districts
  const provinces = ['Kigali City', 'Eastern', 'Western', 'Northern', 'Southern'];
  const statuses = ['Active', 'Under Construction', 'Under Maintenance', 'Inactive'];

  const handleDelete = async (id) => {
    try {
      // API call to delete infrastructure
      toast.success('Infrastructure deleted successfully');
    } catch (error) {
      toast.error('Failed to delete infrastructure');
    }
  };

  const filteredInfrastructures = infrastructures.filter(infra => {
    const matchesSearch = searchTerm === '' || 
      infra.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      infra.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      infra.location.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === '' || infra.category === filters.category;
    const matchesStatus = filters.status === '' || infra.status === filters.status;
    const matchesProvince = filters.province === '' || infra.location.province === filters.province;
    const matchesDistrict = filters.district === '' || infra.location.district === filters.district;

    return matchesSearch && matchesCategory && matchesStatus && matchesProvince && matchesDistrict;
  });

  const prepareExportData = () => {
    return filteredInfrastructures.map(infra => ({
      Name: infra.name,
      Category: infra.category,
      'Sub Category': infra.subCategory,
      Type: infra.type,
      Status: infra.status,
      Capacity: infra.capacity,
      Province: infra.location.province,
      District: infra.location.district,
      'Plot Area': infra.plotArea,
      Owner: infra.owner,
      'Legal Representative': infra.legalRepresentative.name,
      Email: infra.legalRepresentative.email,
      Phone: infra.legalRepresentative.phone
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search infrastructures..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <ExportButton 
            data={prepareExportData()} 
            filename="infrastructure-list" 
            type="xlsx" 
          />
          <ExportButton 
            data={prepareExportData()} 
            filename="infrastructure-list" 
            type="csv" 
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Province</label>
            <Select
              value={filters.province}
              onChange={(e) => setFilters({ ...filters, province: e.target.value })}
            >
              <option value="">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <Select
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              disabled={!filters.province}
            >
              <option value="">All Districts</option>
              {/* Add districts based on selected province */}
            </Select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredInfrastructures.length} of {infrastructures.length} infrastructures
      </div>

      {/* Infrastructure Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInfrastructures.map((infra) => (
              <TableRow key={infra.id}>
                <TableCell className="font-medium">{infra.name}</TableCell>
                <TableCell>{infra.category}</TableCell>
                <TableCell>{`${infra.location.district}, ${infra.location.province}`}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    infra.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : infra.status === 'Under Construction'
                      ? 'bg-yellow-100 text-yellow-800'
                      : infra.status === 'Under Maintenance'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {infra.status}
                  </span>
                </TableCell>
                <TableCell>{infra.capacity}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600" 
                      title="Delete"
                      onClick={() => handleDelete(infra.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" title="View on Map">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InfrastructureList; 