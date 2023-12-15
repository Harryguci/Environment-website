import { useState, useMemo } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";

function LocationMarker({
  center,
  points,
  enablePoly,
  currentLocation,
  setPoints,
  setCurrentLocation,
  setAlertState,
  showMapsControl,
  showImageForm,
  disableChangeLocation
}) {
  const [position, setPosition] = useState(center);

  const map = useMapEvents({
    click(e) {
      if (!disableChangeLocation && !showMapsControl && !showImageForm) {
        setPosition(e.latlng);
        setCurrentLocation(e.latlng);
        setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    },
    keypress(e) {
      // if (
      //   e.originalEvent &&
      //   e.originalEvent.charCode
      // ) {
      //   // map.locate();
      //   setAlertState({
      //     variant: "success",
      //     content: "Detecting location...",
      //   });

      //   setTimeout(() => {
      //     setAlertState({});
      //   }, 3000);

      //   console.log(e.originalEvent.charCode);
      // }
    },
    locationfound(e) {
      setPosition(e.latlng);
      setCurrentLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const popup = useMemo(
    () =>
      (<Popup>You are here</Popup>),
    []
  );

  return position === null ? null : (
    <Marker
      position={position}
      icon={
        new Icon({
          iconUrl: './marker-location-yellow.png',
          iconSize: [41, 41],
          iconAnchor: [12, 41],
        })
      }
    >
      {popup}
    </Marker>
  );
}

export default LocationMarker;
