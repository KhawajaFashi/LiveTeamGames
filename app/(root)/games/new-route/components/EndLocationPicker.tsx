"use client";
import React, { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface Props {
    initialCoords?: [string, string];
    open: boolean;
    onClose: () => void;
    onSelect: (coords: [string, string]) => void;
}

const EndLocationPicker: React.FC<Props> = ({ initialCoords, open, onClose, onSelect }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [searchText, setSearchText] = useState("");
    const [lat, setLat] = useState<number | null>(initialCoords ? parseFloat(initialCoords[0]) : null);
    const [lng, setLng] = useState<number | null>(initialCoords ? parseFloat(initialCoords[1]) : null);

    // load Google Maps script with places library
    useEffect(() => {
        const globalAny = window as any;
        if (globalAny.google?.maps) {
            initMap();
            return;
        }
        if (!document.getElementById("google-maps-script")) {
            const script = document.createElement("script");
            script.id = "google-maps-script";
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => initMap();
            document.body.appendChild(script);
        } else {
            initMap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const initMap = () => {
        const globalAny = window as any;
        if (!mapRef.current || !globalAny.google) return;

        const center = {
            lat: lat ?? 51.1657,
            lng: lng ?? 10.4515,
        };

        mapInstance.current = new globalAny.google.maps.Map(mapRef.current, {
            center,
            zoom: lat && lng ? 14 : 6,
        });

        // marker
        markerRef.current = new globalAny.google.maps.Marker({
            position: center,
            map: mapInstance.current,
            draggable: true,
        });

        markerRef.current.addListener("dragend", (e: any) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            setLat(newLat);
            setLng(newLng);
        });

        mapInstance.current.addListener("click", (e: any) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            markerRef.current.setPosition({ lat: newLat, lng: newLng });
            setLat(newLat);
            setLng(newLng);
        });
    };

    const doGeocode = async (address: string) => {
        const globalAny = window as any;
        if (!globalAny.google || !mapInstance.current) return;
        const geocoder = new globalAny.google.maps.Geocoder();
        geocoder.geocode({ address }, (results: any, status: string) => {
            if (status === "OK" && results && results[0]) {
                const loc = results[0].geometry.location;
                const newLat = loc.lat();
                const newLng = loc.lng();
                mapInstance.current.setCenter({ lat: newLat, lng: newLng });
                mapInstance.current.setZoom(14);
                markerRef.current.setPosition({ lat: newLat, lng: newLng });
                setLat(newLat);
                setLng(newLng);
            }
        });
    };

    const handleSave = () => {
        if (lat == null || lng == null) return;
        onSelect([String(lat), String(lng)]);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.15)]">
            <div className="bg-white rounded-lg shadow-xl max-w-[900px] w-[90%] h-[70vh] p-0 relative">
                <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-white rounded-t-md">
                    <h2 className="text-lg font-semibold">End Location</h2>
                    <button className="text-gray-500 text-2xl" onClick={onClose}>&times;</button>
                </div>
                <div className="p-4 h-[80%]">
                    <div className="mb-3 flex gap-3 items-center">
                        <input value={searchText} onChange={e => setSearchText(e.target.value)} className="border px-3 py-2 rounded w-[320px] text-sm" placeholder="Search location" />
                        <button className="bg-[#009FE3] text-white px-4 py-2 rounded" onClick={() => doGeocode(searchText)}>Start</button>
                        <button className="text-sm text-[#009FE3] ml-2" onClick={() => {
                            if (lat && lng) {
                                // center to last coordinate
                                mapInstance.current?.setCenter({ lat, lng });
                                mapInstance.current?.setZoom(14);
                            }
                        }}>Set to last coordinate</button>
                    </div>
                    <div className="w-full h-[90%] border rounded overflow-hidden">
                        <div ref={mapRef} className="w-full h-full" />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 p-6 bg-white rounded-b ">
                    <button className="px-5 py-1 flex items-center justify-center gap-2 border-1 border-gray-200 font-medium rounded hover:bg-sky-400 cursor-pointer hover:text-white transition-all duration-300 " onClick={onClose}>Back</button>
                    <button className="px-5 py-1 bg-[#00AEEF] text-white rounded" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EndLocationPicker;
