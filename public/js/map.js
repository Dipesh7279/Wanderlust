
const mapElement = document.getElementById('map');
const mapToken = mapElement?.dataset?.mapToken;
const coordinates = (mapElement?.dataset?.coordinates || '79.0889,21.1466')
  .split(',')
  .map(Number);

if (!mapToken) {
  console.error('Mapbox token is missing. Check MAP_TOKEN in .env and restart the server.');
} else if (coordinates.some(Number.isNaN)) {
  console.error('Listing coordinates are invalid.');
} else {
  const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 9
  });

  const popupContent = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = mapElement.dataset.title || 'Listing';
  popupContent.append(title, document.createElement('br'));
  popupContent.append(document.createTextNode(mapElement.dataset.location || ''));

  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent))
    .addTo(map);
}

 