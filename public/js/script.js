// Connect to socket server
const socket = io();

/* ===========================
   GEOLOCATION (SEND LOCATION)
=========================== */
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0
    }
  );
}

/* ===========================
   MAP INITIALIZATION
=========================== */
const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.linkedin.com/in/smruti-ranjan-sahood20040711/">Smruti Ranjan Sahoo</a>'
}).addTo(map);

/* ===========================
   MARKER ICONS (COLORS)
=========================== */
const markerIcons = {
  red: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  blue: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  green: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }),
  orange: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  })
};

/* ===========================
   STATE
=========================== */
const markers = {};
const userColors = {};
const colors = ["red", "blue", "green", "orange"];

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

/* ===========================
   RECEIVE LOCATION
=========================== */
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Assign color once per user
  if (!userColors[id]) {
    userColors[id] = getRandomColor();
  }

  const shortId = id.slice(0, 6); // cleaner label

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker(
      [latitude, longitude],
      { icon: markerIcons[userColors[id]] }
    )
      .addTo(map)
      .bindTooltip(`ID: ${shortId}`, {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        className: "socket-id-label"
      });
  }

  map.setView([latitude, longitude], 16);
});

/* ===========================
   USER DISCONNECT
=========================== */
socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    delete userColors[id];
  }
});
