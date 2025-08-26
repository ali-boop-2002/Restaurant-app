"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationArrow } from "react-icons/fa";

mapboxgl.accessToken = process?.env.NEXT_PUBLIC_MAPBOX_TOKEN;

function MapSelector({ onAddressSelected, methodType, getAddress }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const methodRef = useRef(methodType);
  const [addressQuery, setAddressQuery] = useState("");

  const pickupCenter = [-76.05056613458986, 42.10555352949508];
  const deliveryCenter = [-76.05275273743611, 42.10046033091452];

  useEffect(() => {
    handleGetLocationFromAddress(getAddress);
  }, [getAddress]);

  useEffect(() => {
    methodRef.current = methodType;
  }, [methodType]);

  // Create the map ONCE
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: methodType === "Pickup" ? pickupCenter : deliveryCenter,
      zoom: 15,
    });
    mapRef.current = map;

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      await handleSelectLocation(lat, lng);
    });

    return () => {
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // not dependent on methodType

  // When methodType changes, recenter the map AND move the marker to that center
  useEffect(() => {
    if (!mapRef.current) return;
    const center = methodType === "Pickup" ? pickupCenter : deliveryCenter;

    // ensure we have a marker
    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker();
    }
    markerRef.current.setLngLat(center).addTo(mapRef.current);

    mapRef.current.setCenter(center);
    mapRef.current.setZoom(15);
  }, [methodType]);

  // Click/geolocation handler: move marker to chosen coords and fly there
  const handleSelectLocation = async (lat, lng) => {
    if (!mapRef.current) return;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await res.json();
    const address = data.features[0]?.place_name;

    if (address) onAddressSelected({ address, lat, lng });

    if (!markerRef.current) markerRef.current = new mapboxgl.Marker();

    if (methodRef.current !== "Pickup") {
      markerRef.current.setLngLat([lng, lat]).addTo(mapRef.current);
    }

    if (methodRef.current !== "Pickup") {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
    }
  };

  const handleGetLocationFromAddress = async (findAddress) => {
    if (!mapRef.current || !findAddress) return;

    const q = encodeURIComponent(findAddress);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?limit=1&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();
    const feature = data.features?.[0];
    console.log(feature);
    if (!feature) {
      alert("No address found");
      return;
    }

    const [lng, lat] = feature.center;
    const placeName = feature.place_name;

    // tell parent
    onAddressSelected({ address: placeName, lat, lng });

    // ensure marker exists
    if (!markerRef.current) markerRef.current = new mapboxgl.Marker();
    markerRef.current.setLngLat([lng, lat]).addTo(mapRef.current);

    // move map
    mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleSelectLocation(latitude, longitude);
      },
      () => alert("Unable to retrieve your location.")
    );
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-[400px] rounded" />
      {methodType === "Delivery" && (
        <button className="absolute bottom-10 right-2 bg-transparent px-3 py-1 text-sm rounded z-10">
          <FaLocationArrow
            onClick={handleGetLocation}
            size={25}
            color="black"
            className="hover:cursor-pointer"
          />
        </button>
      )}
    </div>
  );
}

export default MapSelector;
