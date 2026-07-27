console.log("L =", L);
console.log("coordinates =", coordinates);
console.log("map div =", document.getElementById("map"));

const map = map("map").setView(
    [coordinates[1], coordinates[0]],
    13
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup("Listing Location")
    .openPopup();