import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet/dist/leaflet.css";

// import "../Assets/SCSS/maps.scss";

import LocationMarker from "../components/LocationMarker";
import attributions from "../helpers/osmProvider";
import ToolTipPoly from "../components/ToolTipPoly";
import "bootstrap/dist/css/bootstrap.css";
import MapsControl from "../components/MapsControl";
import L from "leaflet";
import WeatherInfo from "../components/WeatherInfo";
// import axios from "axios";

import {
    Container,
    Row,
    Col,
    Alert,
} from "react-bootstrap";
import config from '../config/config';
import convertVNtoEng from "../helpers/convertVNtoEng";
import ImageForm from "../components/ImageForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import ReviewMarker from '../components/ReviewMarker';

export default function Travel() {

    return (
        <>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ width: '100vw', height: '100vh' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    )
}