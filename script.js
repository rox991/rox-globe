const globe = Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .showAtmosphere(true)
  .atmosphereColor('#3a228a')
  .atmosphereAltitude(0.25)
  .polygonCapColor(() => 'rgba(255, 255, 255, 0.05)')
  .polygonSideColor(() => 'rgba(255, 255, 255, 0.02)')
  .polygonStrokeColor(() => '#888')
  .onPolygonHover(showCountryInfo)
  .onPolygonClick(showCountryInfo)
  .polygonsData([])(document.getElementById('globeViz'));

fetch('https://unpkg.com/world-atlas@2/countries-110m.json')
  .then(res => res.json())
  .then(worldData => {
    const countries = topojson.feature(worldData, worldData.objects.countries).features;
    globe.polygonsData(countries).polygonLabel(({ properties: d }) => `${d.name}`);
  });

const infoBox = document.getElementById('infoBox');

function showCountryInfo(polygon, event) {
  if (!polygon) {
    infoBox.classList.add("hidden");
    return;
  }

  const { name, iso_a2, iso_a3 } = polygon.properties;
  infoBox.innerHTML = `
    <strong>${name}</strong><br>
    ISO2: ${iso_a2 || 'N/A'}<br>
    ISO3: ${iso_a3 || 'N/A'}
  `;

  const mouseX = event?.clientX ?? window.innerWidth / 2;
  const mouseY = event?.clientY ?? window.innerHeight / 2;

  infoBox.style.top = `${mouseY + 10}px`;
  infoBox.style.left = `${mouseX + 10}px`;
  infoBox.classList.remove("hidden");
}
