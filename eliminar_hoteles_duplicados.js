const fs = require("fs");

// 📂 Leer el archivo JSON
const data = fs.readFileSync("./data/hotels.json", "utf8");
const hotels = JSON.parse(data);

// 🔍 Extraer los nombres
const allNames = hotels.features.map(f => f.properties.Name);

// 📊 Detectar duplicados
const nameCounts = {};
for (const name of allNames) {
  nameCounts[name] = (nameCounts[name] || 0) + 1;
}

const duplicates = Object.entries(nameCounts)
  .filter(([_, count]) => count > 1)
  .map(([name, count]) => ({ name, count }));

console.log("🔢 Total en JSON:", allNames.length);
console.log("🆔 Nombres únicos:", Object.keys(nameCounts).length);
console.log("⚠️ Hoteles duplicados:", duplicates.length);
console.log("📋 Lista de duplicados:");
console.table(duplicates.slice(0, 20)); // muestra los primeros 20
