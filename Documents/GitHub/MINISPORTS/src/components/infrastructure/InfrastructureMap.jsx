import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, Phone, Mail, Info } from 'lucide-react';
import BookingRequestModal from './BookingRequestModal';
import { useInfrastructure } from '../../contexts/InfrastructureContext';
import InfrastructureDetailsModal from './InfrastructureDetailsModal';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Rwanda center coordinates
const center = {
  lat: -1.9403,
  lng: 29.8739
};

const InfrastructureMap = () => {
  const { infrastructures } = useInfrastructure();
  const [selectedInfra, setSelectedInfra] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [map, setMap] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under Construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Maintenance':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="h-[calc(100vh-12rem)] rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        >
          {infrastructures.map((infra) => (
            <Marker
              key={infra.id}
              position={{
                lat: parseFloat(infra.coordinates.latitude),
                lng: parseFloat(infra.coordinates.longitude)
              }}
              onClick={() => setSelectedInfra(infra)}
            />
          ))}

          {selectedInfra && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedInfra.coordinates.latitude),
                lng: parseFloat(selectedInfra.coordinates.longitude)
              }}
              onCloseClick={() => setSelectedInfra(null)}
            >
              <div className="p-2 space-y-4 min-w-[300px]">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">{selectedInfra.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{`${selectedInfra.location.district}, ${selectedInfra.location.province}`}</span>
                  </div>
                </div>

                {/* Status and Category */}
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedInfra.status)}`}>
                    {selectedInfra.status}
                  </span>
                  <span className="text-sm text-gray-600">{selectedInfra.category}</span>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Capacity: {selectedInfra.capacity}</span>
                  </div>
                  {selectedInfra.services.internet && (
                    <div className="text-green-600">✓ Internet</div>
                  )}
                  {selectedInfra.services.electricity && (
                    <div className="text-green-600">✓ Electricity</div>
                  )}
                  {selectedInfra.services.water && (
                    <div className="text-green-600">✓ Water</div>
                  )}
                </div>

                {/* Contact */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{selectedInfra.legalRepresentative.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{selectedInfra.legalRepresentative.email}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowBookingModal(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDetailsModal(true)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Booking Modal */}
      <BookingRequestModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        infrastructure={selectedInfra}
      />

      {/* Details Modal */}
      <InfrastructureDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        infrastructure={selectedInfra}
      />
    </>
  );
};

export default InfrastructureMap; 