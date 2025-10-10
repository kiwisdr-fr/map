const markersLayer = L.layerGroup().addTo(map); // Regroupe les marqueurs pour les contrôler facilement

let receiversData = [];

fetch("https://api.codetabs.com/v1/proxy/?quest=https://www.receiverbook.de/map?type=kiwisdr&band=")
  .then(res => res.text())
  .then(html => {
    const match = html.match(/var receivers = (\[.*?\]);/s);
    if (match) {
      receiversData = JSON.parse(match[1]); // On stocke dans une variable globale pour réutiliser
      updateMarkers(); // Affiche si zoom déjà correct
    }
  });

function updateMarkers() {
  markersLayer.clearLayers(); // Supprime tous les anciens marqueurs

  if (map.getZoom() < 2) return; // Si zoom trop faible, on n'affiche rien

  receiversData.forEach(site => {
    const [lon, lat] = site.location.coordinates;

    site.receivers.forEach(receiver => {
      const iconUrl = 'https://kiwisdr.ch/wp-content/uploads/sites/2/2024/04/openwebrx-kiwisdr-ch_logo.png';

      const customIcon = L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      L.marker([lat, lon], { icon: customIcon })
        .bindPopup(`<strong>${site.label}</strong><br><a href="${receiver.url}" target="_blank">${receiver.label}</a> </br> Receiver type: ${receiver.type} ${receiver.version}`)
        .addTo(markersLayer);
    });
  });
}

// Met à jour les marqueurs si le zoom change
map.on('zoomend', updateMarkers);
