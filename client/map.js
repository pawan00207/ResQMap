import L from "leaflet";

export function addResourceMarker(map, lat, lon, name) {
  const icon = L.icon({
    iconUrl: "/icons/hospital.png",
    iconSize: [30, 30],
  });

  const marker = L.marker([lat, lon], { icon }).addTo(map);

  marker.bindPopup(`
    <b>${name}</b><br/>
    Emergency Resource
  `);
}
