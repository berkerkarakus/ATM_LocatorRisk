import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBar from './SearchBar';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import redIconUrl from '../assets/marker-icon-red.png';
import blueIconUrl from '../assets/marker-icon-blue.png';
import greenIconUrl from '../assets/marker-icon-green.png';
import yellowIconUrl from '../assets/marker-icon-yellow.png';
import shadowUrl from '../assets/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const redIcon = new L.Icon({ iconUrl: redIconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const blueIcon = new L.Icon({ iconUrl: blueIconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const yellowIcon = new L.Icon({ iconUrl: yellowIconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const greenIcon = new L.Icon({ iconUrl: greenIconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

const defaultPosition = [40.991, 29.126];

function MapWatcher({ onMove }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const center = map.getCenter();
      const bounds = map.getBounds();
      const radius = Math.ceil(center.distanceTo(bounds.getNorthEast()));
      onMove(center.lat, center.lng, radius);
    },
  });
  return null;
}

function MapFlyController({ selectedAtm }) {
  const map = useMap();
  useEffect(() => {
    if (selectedAtm) {
      map.flyTo([selectedAtm.lat, selectedAtm.lng], 16, { duration: 1.5 });
    }
  }, [selectedAtm]);
  return null;
}

function MapDashboard() {
  const [position, setPosition] = useState(null);
  const [atms, setAtms] = useState([]);
  const [selectedAtm, setSelectedAtm] = useState(null);

  const fetchAtms = (lat, lng, radius = 4500) => {
    fetch(`http://localhost:5000/atms?lat=${lat}&lng=${lng}&radius=${radius}`)
      .then((res) => res.json())
      .then((data) => {
        return fetch("http://localhost:5000/enrich", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      })
      .then((res) => res.json())
      .then((enrichedData) => {
        setAtms(enrichedData);
      })
      .catch((err) => console.error("ATM fetch or enrich error:", err));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userPos);
        fetchAtms(userPos[0], userPos[1]);
      },
      () => {
        setPosition(defaultPosition);
        fetchAtms(defaultPosition[0], defaultPosition[1]);
      }
    );
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SearchBar
        onSearchSelect={(atm) => {
          setAtms([atm]);
          setSelectedAtm(atm);
        }}
        onSearchAll={(query) => {
          fetch(`http://localhost:5000/atm-search?query=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((results) => {
              setAtms(results);
              setSelectedAtm(null);
            })
            .catch((err) => console.error('ATM search error:', err));
        }}
      />

      <div style={{ flex: 1 }}>
        {position && (
          <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
            <MapWatcher onMove={fetchAtms} />
            <MapFlyController selectedAtm={selectedAtm} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

            <Marker position={position} icon={blueIcon}>
              <Popup>
                <strong>Benim Konumum</strong>
                <br />Şu an buradasınız.
              </Popup>
            </Marker>

            {atms.map((atm, idx) => {
              let icon = redIcon;
              let riskLevel = 'HIGH';
              let reason = 'ATM açık alanda bulunuyor ve sıcaklık çok yüksek ya da çok düşük.';

              if (atm.risk_score === 0) {
                icon = greenIcon;
                riskLevel = 'LOW';
                reason = 'ATM kapalı alanda bulunuyor.';
              } else if (atm.risk_score === 10) {
                icon = yellowIcon;
                riskLevel = 'MEDIUM';
                reason = 'ATM açık alanda bulunuyor.';
              }

              return (
                <Marker key={idx} position={[atm.lat, atm.lng]} icon={icon}>
                  <Popup>
                    <strong>{atm.name}</strong>
                    <br />
                    {atm.address}
                    <br />
                    {atm.rating ? `⭐ ${atm.rating}` : 'Değerlendirme yok'}
                    <br />
                    <strong>RISK LEVEL: {riskLevel}</strong>
                    <br />
                    {reason}
                    {atm.temperature !== null && (
                      <>
                        <br />Sıcaklık: {atm.temperature}°C
                      </>
                    )}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default MapDashboard;
