/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";

interface Team {
    no: number;
    teamName: string;
    lat: number;
    lng: number;
}

interface MapProps {
    teams: Team[];
    selectedTeamNo: number | null;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const Map: React.FC<MapProps> = ({ teams, selectedTeamNo }) => {

    const mapStyle = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#523735"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#c9b2a6"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#dcd2be"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ae9e90"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#93817c"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#a5b076"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#447530"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f1e6"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fdfcf8"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f8c967"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#e9bc62"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e98d58"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#db8555"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#806b63"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8f7d77"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ebe3cd"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dfd2ae"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#b9d3c2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#92998d"
                }
            ]
        }
    ];

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const initMap = () => {
        const globalAny = window as any;
        if (!mapRef.current || !globalAny.google) return;

        mapInstance.current = new globalAny.google.maps.Map(mapRef.current, {
            center: { lat: 51.1657, lng: 10.4515 },
            zoom: 6,
        });
    };

    const updateMarkers = () => {
        const globalAny = window as any;
        if (!mapInstance.current || !globalAny.google) return;

        // Clear existing markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // Add new ones
        teams.forEach((team) => {
            const marker = new globalAny.google.maps.Marker({
                position: { lat: team.lat, lng: team.lng },
                map: mapInstance.current,
                label: {
                    text: team.teamName,
                    color: team.no === selectedTeamNo ? "#FF4757" : "#007BFF", // ✅ label color
                    fontWeight: "bold",
                    fontSize: "14px",
                },
                
                styles: mapStyle,
                icon: {
                    url: "/pointer.png", // ✅ path relative to /public
                    scaledSize: new globalAny.google.maps.Size(50, 50), // adjust as needed
                    anchor: new google.maps.Point(20, 40), // shifts icon up
                    labelOrigin: new google.maps.Point(20, 60), // 👈 moves label down
                },
            });
            markersRef.current.push(marker);
        });

        // Center map on selected team
        if (selectedTeamNo) {
            const selected = teams.find((t) => t.no === selectedTeamNo);
            if (selected) {
                mapInstance.current.setCenter({
                    lat: selected.lat,
                    lng: selected.lng,
                });
                mapInstance.current.setZoom(12);
            }
        }
    };

    // ✅ Load Google Maps once globally
    useEffect(() => {
        const globalAny = window as any;

        if (globalAny.google?.maps) {
            initMap();
            return;
        }

        if (!document.getElementById("google-maps-script")) {
            const script = document.createElement("script");
            script.id = "google-maps-script";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.onload = () => initMap();
            document.body.appendChild(script);
        } else {
            // Already loaded
            initMap();
        }
    }, []);

    useEffect(() => {
        updateMarkers();
    }, [teams, selectedTeamNo, updateMarkers]);

    return <div ref={mapRef} className="w-full h-full"/>;
};

export default Map;
