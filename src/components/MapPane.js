import React from 'react';
import { GoogleMap, Marker, useLoadScript, OverlayView } from '@react-google-maps/api';
import CustomLabel from './CustomLabel';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};
const center = {
  lat: 37.762024747895126,
  lng: -122.43969849090182
};

const MapPane = ({ markers }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDV0xlG522FMsB3cV4VVldAgUtjQwjFD38', // Replace with your API key
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
    >
      {markers.map((marker, index) => (
        <React.Fragment key={index}>
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={marker.icon} // Set custom icon
          />
          <OverlayView
            position={{ lat: marker.lat, lng: marker.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div style={{ position: 'relative' }}>
              <CustomLabel label={marker.label} />
            </div>
          </OverlayView>
        </React.Fragment>
      ))}
    </GoogleMap>
  );
};

export default MapPane;
