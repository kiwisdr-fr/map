const markersLayer = L.layerGroup().addTo(map);

let receiversData = [];

fetch("https://api.codetabs.com/v1/proxy/?quest=https://www.rx-888.com/api/devices") // <-- remplace par ton URL
  .then(res => res.json())
  .then(data => {
    receiversData = data.devices;
    updateMarkers();
  });

function updateMarkers() {
  markersLayer.clearLayers();

  if (map.getZoom() < 2) return;

  receiversData.forEach(device => {
    // GPS est une string sous forme "(lat, lon)"
    const gpsMatch = device.gps.match(/\(([-\d.]+),\s*([-\d.]+)\)/);
    if (!gpsMatch) return;

    const lat = parseFloat(gpsMatch[1]);
    const lon = parseFloat(gpsMatch[2]);

    const iconUrl = 'http://web-888.psokotka.com:8074/gfx/web-888.51x60.png';

    const customIcon = L.icon({
      iconUrl,
      iconSize: [31, 40],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.marker([lat, lon], { icon: customIcon })
      .bindPopup(`
        <strong>${device.name}</strong><br>
        <a href="${device.url}" target="_blank">${device.url}</a><br>
        Status: ${device.status}<br>
        Antenna: ${device.antenna}<br>
        SNR: ${device.snr}<br>
        Users: ${device.users} / ${device.max_users}<br>
        Uptime: ${device.uptime} sec
      `)
      .addTo(markersLayer);
  });
}

map.on('zoomend', updateMarkers);
