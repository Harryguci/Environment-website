import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet/dist/leaflet.css";

import "../Assets/SCSS/maps.scss";

import LocationMarker from "../components/LocationMarker";
import attributions from "../helpers/osmProvider";
import ToolTipPoly from "../components/ToolTipPoly";
import "bootstrap/dist/css/bootstrap.css";
import MapsControl from "../components/MapsControl";
import WeatherInfo from "../components/WeatherInfo";
// import axios from "axios";

import {
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

import convertVNtoEng from "../helpers/convertVNtoEng";
import ImageForm from "../components/ImageForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import ReviewMarker from '../components/ReviewMarker';

import L from "leaflet";

import config from '../config/config';

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});


const hanoipoints = [
  [21.079374593525337, 105.89481353759767],
  [21.07376838647649, 105.92348098754884],
  [21.061914567119807, 105.92948913574219],
  [21.046695441515006, 105.93584060668947],
  [21.039966489991286, 105.93824386596681],
  [21.034999687911917, 105.94734191894533],
  [21.028911123993602, 105.95111846923828],
  [21.022982546427425, 105.95197677612306],
  [21.014970580547725, 105.948543548584],
  [21.00968244727318, 105.94528198242189],
  [21.00054795738831, 105.93858718872072],
  [20.993496389857583, 105.9346389770508],
  [20.951500617754565, 105.90923309326172],
  [20.94027837682011, 105.90030670166017],
  [20.936751213064184, 105.87215423583986],
  [20.939316431308203, 105.85018157958986],
  [20.952462484967604, 105.80760955810548],
  [20.978109995719024, 105.78014373779297],
  [20.99189371442306, 105.7602310180664],
  [21.008240196572455, 105.74752807617189],
  [21.03836431386586, 105.7379150390625],
  [21.073608206025916, 105.72830200195314],
  [21.09026604845475, 105.74340820312501],
  [21.098594269392102, 105.75576782226564],
  [21.09410990075993, 105.81275939941408],
  [21.092828627710034, 105.82408905029297],
  [21.086742429803333, 105.83747863769533],
  [21.08097632813527, 105.84571838378906],
  [21.07264711969881, 105.8577346801758],
  [21.071686027159775, 105.86803436279297],
  [21.073287844607105, 105.87284088134767],
];

function Maps() {

  const createId = useCallback((name) => {
    return convertVNtoEng(name)
      .trim()
      .toLowerCase().replace(/ /g, "-");
  }, []);

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 21.023997, lng: 105.806099 });
  const [points, setPoints] = useState([]);
  const [showPolygon, setShowPolygon] = useState(false);
  const [cites, setCites] = useState([]);

  const [currentLocation, setCurrentLocation] = useState({
    lat: 21.023997,
    lng: 105.806099,
  });

  const [previousLocation, setPreviosLocation] = useState(null)

  const [newCityState, setNewCityState] = useState("");
  const [weatherData, setWeatherData] = useState({});

  const [alertState, setAlertState] = useState({});
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [showImageForm, setShowImageForm] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [dataError, setDataError] = useState();

  const [timeOut, setTimeOut] = useState(1);

  const refreshData = useCallback(() => {
    const promiseData = fetch(`${config.SERVER_URI}/points/data`)
      .then((response) => response.json())
      .then((data) => {
        setCites(data);
        return data;
      })
      .catch((error) => {
        setDataError({ error: error })
        return ({ error })
      });

    const promiseGetImg = fetch(`${config.SERVER_URI}/get-image`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        return data
      })
      .catch((error) => {
        setDataError({ error: error })
        return ({ error })
      });

    Promise.all([promiseData, promiseGetImg])
      .then(value => !(value[0].error || value[1].error))
      .then(is => {
        if (is) setDataError(null);
      })
      .catch((error) => error);
  }, []);

  useEffect(() => {
    fetch(`${config.SERVER_URI}/points/data`)
      .then((response) => response.json())
      .then((data) => setCites(data))
      .catch((error) => setDataError({ error: error }));
  }, []);

  useEffect(() => {
    fetch(`${config.SERVER_URI}/get-image`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => setDataError({ error: error }));
  }, []);

  // useEffect(() => console.log('CONFIG' + config.SERVER_URI), []);

  useEffect(() => {
    setTimeOut(() => {
      setTimeOut(prev => --prev);
    }, 1000);
  }, []);

  useEffect(() => {
    if (timeOut && dataError && dataError.error) {
      console.log('Refresh data');
      refreshData();
    }
  }, [timeOut, dataError, refreshData])

  useEffect(() => {
    if (navigator.geolocation) {
      setAlertState({
        variant: "success",
        content: "Detecting location...",
      });
      window.scrollTo(0, 0);

      navigator.geolocation.getCurrentPosition(function (position) {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

        setAlertState({});
        console.log('detected location...');
      });
    }
  }, []);

  useEffect(() => {
    if (!previousLocation
      || Math.abs(previousLocation.lat - currentLocation.lat) >= 0.07
      || Math.abs(previousLocation.lng - currentLocation.lng) >= 0.07)
      fetch(
        `https://openweather-personal-api.onrender.com/get-weather?lat=${currentLocation.lat}&lon=${currentLocation.lng}`
      )
        .then((response) => response.clone().json())
        .then((response) => {
          // Convert from K temp to C temp
          console.log('[Fetch Weather]');
          response.main.temp = Math.round(response.main.temp - 273);
          response.main.temp_max = Math.round(response.main.temp_max - 273);
          response.main.temp_min = Math.round(response.main.temp_min - 273);
          response.main.feels_like = Math.round(response.main.feels_like - 273);

          setPreviosLocation(currentLocation);
          setWeatherData(response);
        })
        .catch((err) => console.log(err));


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const [showMapsControl, setShowMapsControl] = useState(() => {
    return !(window.innerWidth < 768);
  });

  const handleAddPlace = async (e) => {
    cites.push({
      id: createId(newCityState),
      name: newCityState,
      points: points,
    });

    setPoints([]);
    if (newCityState && points && points.length) {
      await fetch(`${config.SERVER_URI}/points/data`,
        {
          method: "POST",
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: createId(newCityState),
            name: newCityState,
            points: points,
          }),
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else
            console.log("POST", data)
        })
        .catch((err) => console.log(err));
    } else {
      alert('Please fill the information');
    }
  };

  const displayReviews = useMemo(() => (
    <>
      {reviews && reviews.length &&
        reviews.map((review) => (
          <ReviewMarker key={review.id} review={review} />
        ))
      }
    </>
  ), [reviews]);


  useEffect(() => {
    if (map) {
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
    }
  }, [map]);

  
  return (
    <div id="maps-container">
      <div className="information-box">
        <div className="control-information-box d-flex gap-1 justify-content-center">
          <button
            className="custom-button"
            onClick={(e) => setShowInfoBox((prev) => !prev)}
            style={{ width: "100%" }}
          >
            {!showMapsControl && !showImageForm && showInfoBox ? <FontAwesomeIcon icon={faClose} /> : "Weather"}
          </button>
        </div>
        {!showMapsControl && !showImageForm && showInfoBox && (
          <WeatherInfo weatherData={weatherData} />
        )}
      </div>

      {showMapsControl && map && !showImageForm ?
        <MapsControl
          cites={cites}
          setCenter={setCenter}
          setCurrentLocation={setCurrentLocation}
          setPoints={setPoints}
          hanoipoints={hanoipoints}
          showPolygon={showPolygon}
          setShowPolygon={setShowPolygon}
          newCityState={newCityState}
          setNewCityState={setNewCityState}
          handleAddPlace={handleAddPlace}
          setShowImageForm={setShowImageForm}
          hide={() => setShowMapsControl(false)}
          map={map}
        /> : <button
          className="custom-button position-absolute"
          style={{ top: 100, left: 20, zIndex: 2000 }}
          onClick={e => { setShowMapsControl(true); }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>}

      {showImageForm && ( // disable prettier 
        <ImageForm location={currentLocation} hide={setShowImageForm} />
      )}

      <Container fluid>
        <Row>
          <Col className="col-12 maps-section__main">
            {alertState && alertState.content && (
              <Alert
                key={JSON.stringify(alertState)}
                variant={alertState.variant}
                style={{ height: 'max-content' }}
              >
                {alertState.content}
              </Alert>
            )}
            <Row>
              <MapContainer
                key={JSON.stringify([center.lat, center.lng])}
                center={center}
                ref={setMap} // [Required for using map at the external element]
                zoom={13}
                scrollWheelZoom={false}
                style={{
                  height: "100vh",
                  position: "relative",
                  zIndex: 5
                }}
              >
                {/* <LeafletControlGeocoder /> */}

                {/* User Location Marker */}
                <LocationMarker
                  center={center}
                  points={points}
                  currentLocation={currentLocation}
                  setPoints={setPoints}
                  setCurrentLocation={setCurrentLocation}
                  setAlertState={setAlertState}
                  enablePoly={showPolygon}
                  showMapsControl={showMapsControl}
                  showImageForm={showImageForm}
                  disableChangeLocation={showImageForm}
                />

                {/* Display review Markers */}
                {displayReviews}

                {/* Display Maps */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {showPolygon && points && points.length && (
                  <ToolTipPoly points={points} />
                )}
              </MapContainer>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default memo(Maps);