async function kiwiload() {
    try {
      const response = await fetch("https://api.codetabs.com/v1/proxy/?quest=http://kiwisdr.com/.public/");
      const html = await response.text();
  
      // Crée un conteneur DOM temporaire pour parser le HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
  
      const entries = doc.querySelectorAll(".cl-entry");
  
      entries.forEach(entry => {
        const htmlBlock = entry.innerHTML;
  
        // Extraction via RegEx
        const gps = /<!--\s*gps=\(([^,]+),\s*([^)]+)\)\s*-->/.exec(htmlBlock);
        const name = /<!--\s*name=([^\n\r]+?)\s*-->/.exec(htmlBlock);
        const sdr_hw = /<!--\s*sdr_hw=([^\n\r]+?)\s*-->/.exec(htmlBlock);
        const users = /<!--\s*users=(\d+)\s*-->/.exec(htmlBlock);
        const users_max = /<!--\s*users_max=(\d+)\s*-->/.exec(htmlBlock);
        const loc = /<!--\s*loc=([^\n\r]+?)\s*-->/.exec(htmlBlock);
        const sw_version = /<!--\s*sw_version=([^\n\r]+?)\s*-->/.exec(htmlBlock);
        const antenna = /<!--\s*antenna=([^\n\r]+?)\s*-->/.exec(htmlBlock);
  
        const lat = gps ? parseFloat(gps[1]) : null;
        const lng = gps ? parseFloat(gps[2]) : null;
  
        const urlEl = entry.querySelector("a[href^='http']");
        const link = urlEl ? urlEl.getAttribute("href") : null;
  
        const imgEl = entry.querySelector("img.cl-avatar");
        const iconUrl = imgEl ? imgEl.getAttribute("src") : null;
  
        if (lat && lng && name && iconUrl) {
          // Définir une icône personnalisée pour chaque entrée
          const customIcon = L.icon({
            iconUrl: iconUrl.startsWith("http") ? iconUrl : "http://kiwisdr.com" + iconUrl,
            iconSize: [16, 16],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
          });
  
          const popupContent = `
            <strong><a href="${link}" target="_blank">${name[1]}</a></strong><br>
            <em>${loc ? loc[1] : "?"}</em><br>
            Material: ${sdr_hw ? sdr_hw[1] : "?"}<br>
            Users: ${users ? users[1] : "?"}/${users_max ? users_max[1] : "?"}<br>
            Version: ${sw_version ? sw_version[1] : "?"}<br>
            Antenna: ${antenna ? antenna[1] : "?"}
          `;
  
          L.marker([lat, lng], { icon: kiwisdrIcon, alt: 'KiwiSDR Marker', bubblingMouseEvents: true, interactive: true}).bindTooltip(popupContent).bindPopup(popupContent).addTo(map);
        }
      });
    } catch (err) {
      console.error("Erreur lors du chargement des données SDR:", err);
    }
  }
  
  // Appel
  kiwiload();
