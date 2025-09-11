const markersLayer = L.layerGroup().addTo(map);

let receiversData = [];

fetch("https://api.codetabs.com/v1/proxy/?quest=https://sdr-list.xyz/api/get_websdrs") // Mets ton URL ici
  .then(res => res.json())
  .then(data => {
    receiversData = data;
    updateMarkers();
  });

function updateMarkers() {
  markersLayer.clearLayers();

  if (map.getZoom() < 2) return;

  receiversData.forEach(device => {
    const latlon = maidenheadToLatLon(device.grid_locator);
    if (!latlon) return;

    const [lat, lon] = latlon;

    const iconUrl = 'https://www.hyperplane.org/wsdr/imgs/amateur_radio_sym.svg';

    const customIcon = L.icon({
      iconUrl,
      iconSize: [32, 64],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.marker([lat, lon], { icon: customIcon })
      .bindPopup(`
        <strong>${device.name}</strong><br>
        <a href="${device.url}" target="_blank">${device.url}</a><br>
        Antenna: ${device.antenna}<br>
        Users: ${device.users} / ${device.max_users}<br>
        Bandwidth: ${device.bandwidth} Hz<br>
        Center Freq: ${device.center_frequency} Hz<br>
        Grid: ${device.grid_locator}
      `)
      .addTo(markersLayer);
  });
}

function maidenheadToLatLon(locator) {
  if (!locator || locator.length < 4) return null;

  locator = locator.toUpperCase();
  let lon = (locator.charCodeAt(0) - 65) * 20 - 180;
  let lat = (locator.charCodeAt(1) - 65) * 10 - 90;

  lon += parseInt(locator.charAt(2)) * 2;
  lat += parseInt(locator.charAt(3)) * 1;

  if (locator.length >= 6) {
    lon += (locator.charCodeAt(4) - 65) * 5 / 60;
    lat += (locator.charCodeAt(5) - 65) * 2.5 / 60;
  }

  lon += 1; // 2°/2
  lat += 0.5; // 1°/2

  return [lat, lon];
}

map.on('zoomend', updateMarkers);
