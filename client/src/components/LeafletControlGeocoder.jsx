import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

export default function LeafletControlGeocoder() {
  const map = useMap();

  useEffect(() => {
    var geocoder = L.Control.Geocoder.nominatim();

    L.Control.geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder,
    })
      .on("markgeocode", function (e) {
        var latlng = e.geocode.center;
        L.marker(latlng, { icon })
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.fitBounds(e.geocode.bbox);
      })
      .addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
