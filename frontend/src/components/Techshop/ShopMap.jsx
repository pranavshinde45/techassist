import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicnVzaGlwaGFsa2UyMDAzIiwiYSI6ImNtZGFjYzYzcTBnOXAybHF1bHdsZjZ4N2oifQ.HboA6guGwmfprlth5zYM6g';

function ShopMap({ latitude, longitude }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 13,
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <div
      ref={mapContainer}
      style={{ height: '400px', width: '100%', borderRadius: '10px', marginTop: '20px' }}
    />
  );
}

export default ShopMap;
