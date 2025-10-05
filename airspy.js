const markersLayer = L.layerGroup().addTo(map);

let receiversData = [];

fetch("https://api.codetabs.com/v1/proxy/?quest=https://airspy.com/directory/status.json")
  .then(res => res.json())
  .then(data => {
    receiversData = data.servers || [];
    updateMarkers();
  })
  .catch(err => console.error("Erreur de chargement Airspy JSON:", err));

function updateMarkers() {
  markersLayer.clearLayers();

  if (map.getZoom() < 2) return;

  receiversData.forEach(server => {
    if (!server.antennaLocation || !server.antennaLocation.lat || !server.antennaLocation.long) return;

    const lat = parseFloat(server.antennaLocation.lat);
    const lon = parseFloat(server.antennaLocation.long);

    // Détermine l’état du serveur
    let iconColor = "gray"; // par défaut (offline)
    if (server.online) {
      if (server.currentClientCount >= server.maxClients) {
        iconColor = "orange"; // plein
      } else {
        iconColor = "green"; // online et dispo
      }
    }

    // Crée un cercle coloré comme icône
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 18px;
        height: 18px;
        background-color: ${iconColor};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 3px rgba(0,0,0,0.5);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });

    const popupHTML = `
      <strong>${server.deviceType || "Unknown Device"}</strong><br>
      Owner: ${server.ownerName || "anonymous"}<br>
      IP: ${server.streamingHost}:${server.streamingPort}<br>
      Status: ${server.online ? (server.currentClientCount >= server.maxClients ? "🟠 Full" : "🟢 Online") : "🔴 Offline"}<br>
      Clients: ${server.currentClientCount} / ${server.maxClients}<br>
      Frequency: ${(server.currentCenterFrequency / 1e6).toFixed(2)} MHz<br>
      Bandwidth: ${(server.maximumDisplayedBandwidth / 1e3).toFixed(0)} kHz<br>
      Last Seen: ${server.lastSeen} sec<br>
      Description: ${server.generalDescription || "No description"}
    `;

    L.marker([lat, lon], { icon: customIcon })
      .bindPopup(popupHTML)
      .addTo(markersLayer);
  });
}

map.on('zoomend', updateMarkers);
