// Initialisation de la carte centrée sur Paris
var map = L.map('map').setView([42, 2], 2);
var popup = L.popup();

// Définition des différentes couches de carte
var baseLayers = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "OpenStreetMap France": L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    "World Imagery":  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    "Nasa Map (Night)": L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 8,
        format: 'jpg',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level'
    }),
    "Google Maps Streets": L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.google.com/intl/fr_fr/help/terms_maps/">Google Maps</a>',
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    "Google Maps Satellites": L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.google.com/intl/fr_fr/help/terms_maps/">Google Maps</a>',
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    "Google Maps Hybrid": L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.google.com/intl/fr_fr/help/terms_maps/">Google Maps</a>',
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    "Google Maps Terrain": L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 30,
        attribution: '&copy; <a href="https://www.google.com/intl/fr_fr/help/terms_maps/">Google Maps</a>',
        subdomains:['mt0','mt1','mt2','mt3']
    }),
    "Carto Voyager": L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.carto.com/attributions">CARTO Voyager</a>'
    }),
    "Wikimedia": L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://wikimedia.org">Wikimedia</a>'
    }),
    /*"Stadia Day": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }),
    "Stadia Night": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    }),
    "Stadia Satellite": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'jpg'
    }),*/
    "OPVNKarte (Airport spot map)": L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
};
L.terminator().addTo(map);

// Ajout de la couche OSM par défaut
baseLayers["OpenStreetMap"].addTo(map);

// Ajout du contrôle de couches en haut à droite
L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

map.on('click', function(e) {
    let lat = e.latlng.lat.toPrecision(8);
    let lon = e.latlng.lng.toPrecision(8);

    // Définition de l'icône personnalisée
    const customIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/7061/7061883.png',
        iconSize: [32, 32], // Taille de l'icône
        iconAnchor: [16, 32], // Point d'ancrage (au centre en bas)
        popupAnchor: [0, -32] // Décalage du popup par rapport à l'icône
    });

    // Ajout du marqueur avec l'icône personnalisée
    const point = L.marker([lat, lon], { icon: customIcon }).addTo(map)
        .bindPopup('<a href="http://maps.google.com/maps?q=&layer=c&cbll=' + lat + ',' + lon + '&cbp=11,0,0,0,0" target="blank"><b> Google Street View </b></a><br>Location: <b>' + lat + ', ' + lon + '</b>').openPopup();
});


// Exemples de marker : https://leafletjs.com/examples/quick-start/

// Définition des icônes personnalisées
var kiwisdrIcon = L.icon({
    iconUrl: 'https://lh6.googleusercontent.com/proxy/XxF3-F2dKSulH4ZiAXpaYOrdFEp4pu3wCFkxurZo0Z54YXztG-ExKFglO-OXXXvloNgzKDrKT06LSQCMaEap-iWHqny2V2NFbA',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var autreIcon = L.icon({
    iconUrl: 'images/marker-icon-oth.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var web888Icon = new L.Icon({
    iconUrl: 'images/web-888-51x60.png',
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var militaryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/256/13397/13397085.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var owrIcon = new L.Icon({
    iconUrl: 'images/images.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var txIcon = new L.Icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/cia-operations/512/radio_transmitter-512.png',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var tstIcon = new L.Icon({
    iconUrl: 'https://icon-library.com/images/gps-icon-png/gps-icon-png-6.jpg',
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var noaaIcon = new L.Icon({
    iconUrl: 'https://floridadep.gov/sites/default/files/media-folders/media-root/NOAA-color-logo-no-text-print.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

var noaaSatIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/10290/10290311.png',
    iconSize: [40, 30], 
    iconAnchor: [20, 41],
    popupAnchor: [1, -34]
})

var websdrIcon = new L.Icon({
    iconUrl: './images/veronlogo100b.gif',
    iconSize: [25, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

function Cicon(lat, lng, popupContent, type) {
    var icon = (type === 'kiwisdr') ? kiwisdrIcon : (type === 'web888') ? web888Icon : (type === 'military') ? militaryIcon : (type === 'owr') ? owrIcon : (type === 'tx') ? txIcon : (type === 'times') ? tstIcon : (type === 'noaa') ? noaaIcon : (type === 'websdr') ? websdrIcon: autreIcon;
    L.marker([lat, lng], { icon: icon }).addTo(map)
        .bindPopup(popupContent)
        .openPopup();
}