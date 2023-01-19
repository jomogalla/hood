
import './Station.css';

import React from "react";
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'

function Station({
  station,
}) {
  return (
    <div className="station-wrapper">
      <h2>Station Information</h2>
      <div className="station-info-wrapper">
      <div className="station-info">
          <strong>Name:</strong> {station.name}
        </div>
        <div className="station-info">
          <strong>Coordinates:</strong> {station.latitude},{station.longitude}
        </div>
        <div className="station-info">
          <strong>Elevation:</strong> {station.elevation}ft
        </div>
      </div>
      <div className="map-wrapper">
        <MapContainer center={[station.latitude, station.longitude]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={[station.latitude, station.longitude]}
            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default Station;
