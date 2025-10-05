
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';

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

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const Map: React.FC<MapProps> = ({ teams, selectedTeamNo }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const initMap = () => {
        const globalAny = window as any;
        if (!mapRef.current || !globalAny.google) return;
        mapInstance.current = new globalAny.google.maps.Map(mapRef.current, {
            center: { lat: 51.1657, lng: 10.4515 }, // Center of Germany
            zoom: 6,
        });
    };

    // export default Map;
    const updateMarkers = () => {
        const globalAny = window as any;
        if (!mapInstance.current || !globalAny.google) return;
        // Remove old markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        // Add new markers
        teams.forEach(team => {
            const marker = new globalAny.google.maps.Marker({
                position: { lat: team.lat, lng: team.lng },
                map: mapInstance.current,
                label: team.teamName,
            });
            markersRef.current.push(marker);
        });
        // Center map on selected team
        if (selectedTeamNo) {
            const selected = teams.find(t => t.no === selectedTeamNo);
            if (selected) {
                mapInstance.current.setCenter({ lat: selected.lat, lng: selected.lng });
                mapInstance.current.setZoom(12);
            }
        }
    };

    useEffect(() => {
        if (!(window as any).google && GOOGLE_MAPS_API_KEY) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
            script.async = true;
            script.onload = () => initMap();
            document.body.appendChild(script);
        } else {
            initMap();
        }
    }, []);

    useEffect(() => {
        updateMarkers();
    }, [teams, selectedTeamNo]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: 400 }} />
    );

}
export default Map;

