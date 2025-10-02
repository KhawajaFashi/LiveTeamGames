
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
        if (!mapRef.current || !(window as any).google) return;
        mapInstance.current = new (window as any).google.maps.Map(mapRef.current, {
            center: { lat: 51.1657, lng: 10.4515 }, // Center of Germany
            zoom: 6,
        });
    };

    // export default Map;
    const updateMarkers = () => {
        if (!mapInstance.current || !(window as any).google) return;
        // Remove old markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        // Add new markers
        teams.forEach(team => {
            const marker = new (window as any).google.maps.Marker({
                position: { lat: team.lat, lng: team.lng },
                map: mapInstance.current,
                label: team.teamName,
                icon: selectedTeamNo === team.no ? undefined : undefined,
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        updateMarkers();
        // eslint-disable-next-line
    }, [teams, selectedTeamNo]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: 400 }} />
    );

}
export default Map;

