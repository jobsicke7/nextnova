"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { twoline2satrec, propagate, gstime, eciToGeodetic } from 'satellite.js';
import type { EciVec3 } from 'satellite.js';
import styles from './map.module.css';
import 'leaflet/dist/leaflet.css';

interface OrbitPoint {
    position: [number, number];
    type: 'past' | 'future';
}

const ISSTracker = () => {
    const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
    const [issPosition, setIssPosition] = useState<[number, number]>([0, 0]);
    const [mapType, setMapType] = useState<'default' | 'satellite'>('default');
    const [orbitPath, setOrbitPath] = useState<OrbitPoint[]>([]);

    const issIcon = new Icon({
        iconUrl: '/images/iss.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

    const userIcon = new Icon({
        iconUrl: '/images/my.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });

    // Define map bounds
    const maxBounds: [[number, number], [number, number]] = [
        [-90, -180], // South West
        [90, 180]    // North East
    ];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setUserPosition([position.coords.latitude, position.coords.longitude]),
            (error) => console.error('Error:', error)
        );
    }, []);

    useEffect(() => {
        const calculateOrbits = async () => {
            try {
                const response = await fetch('https://www.celestrak.com/NORAD/elements/stations.txt');
                const data = await response.text();
                const lines = data.split('\n');
                const issLines = lines.slice(0, 3);
                const satrec = twoline2satrec(issLines[1], issLines[2]);

                if (satrec) {
                    const orbits: OrbitPoint[] = [];
                    const currentTime = new Date();

                    // Past orbits (3 hours back)
                    for (let i = 180; i >= 0; i--) {
                        const pastTime = new Date(currentTime.getTime() - i * 60000);
                        const positionAndVelocity = propagate(satrec, pastTime);
                        const gmst = gstime(pastTime);

                        const position = positionAndVelocity.position as EciVec3<number>;
                        if (position && 'x' in position) {
                            const geodetic = eciToGeodetic(position, gmst);
                            orbits.push({
                                position: [
                                    (geodetic.latitude * 180) / Math.PI,
                                    (geodetic.longitude * 180) / Math.PI
                                ],
                                type: 'past'
                            });
                        }
                    }

                    // Future orbits (3 hours ahead)
                    for (let i = 0; i <= 180; i++) {
                        const futureTime = new Date(currentTime.getTime() + i * 60000);
                        const positionAndVelocity = propagate(satrec, futureTime);
                        const gmst = gstime(futureTime);

                        const position = positionAndVelocity.position as EciVec3<number>;
                        if (position && 'x' in position) {
                            const geodetic = eciToGeodetic(position, gmst);
                            orbits.push({
                                position: [
                                    (geodetic.latitude * 180) / Math.PI,
                                    (geodetic.longitude * 180) / Math.PI
                                ],
                                type: 'future'
                            });
                        }
                    }

                    setOrbitPath(orbits);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        calculateOrbits();
        const interval = setInterval(calculateOrbits, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchISSPosition = async () => {
            try {
                const response = await fetch('http://api.open-notify.org/iss-now.json');
                const data = await response.json();
                setIssPosition([
                    parseFloat(data.iss_position.latitude),
                    parseFloat(data.iss_position.longitude)
                ]);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchISSPosition();
        const interval = setInterval(fetchISSPosition, 1000);
        return () => clearInterval(interval);
    }, []);

    const renderOrbits = () => {
        const segments: { past: [number, number][][], future: [number, number][][] } = {
            past: [],
            future: []
        };
        let currentPastSegment: [number, number][] = [];
        let currentFutureSegment: [number, number][] = [];

        orbitPath.forEach((point, index) => {
            if (index > 0) {
                const prevLon = orbitPath[index - 1].position[1];
                const currentLon = point.position[1];

                if (Math.abs(currentLon - prevLon) > 180) {
                    if (point.type === 'past' && currentPastSegment.length > 0) {
                        segments.past.push([...currentPastSegment]);
                        currentPastSegment = [];
                    } else if (point.type === 'future' && currentFutureSegment.length > 0) {
                        segments.future.push([...currentFutureSegment]);
                        currentFutureSegment = [];
                    }
                }
            }

            if (point.type === 'past') {
                currentPastSegment.push(point.position);
            } else {
                currentFutureSegment.push(point.position);
            }
        });

        if (currentPastSegment.length > 0) segments.past.push(currentPastSegment);
        if (currentFutureSegment.length > 0) segments.future.push(currentFutureSegment);

        return (
            <>
                {segments.past.map((segment, index) => (
                    <Polyline
                        key={`past-${index}`}
                        positions={segment}
                        color="#ff6b6b"
                        weight={2}
                        opacity={0.7}
                    />
                ))}
                {segments.future.map((segment, index) => (
                    <Polyline
                        key={`future-${index}`}
                        positions={segment}
                        color="#4ecdc4"
                        weight={2}
                        opacity={0.7}
                    />
                ))}
            </>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <button
                    onClick={() => setMapType(mapType === 'default' ? 'satellite' : 'default')}
                    className={styles.mapToggle}
                >
                    {mapType === 'default' ? '위성 지도로 변경' : '기본 지도로 변경'}
                </button>
            </div>

            <MapContainer
                center={[0, 0]}
                zoom={2}
                className={styles.map}
                scrollWheelZoom={true}
                maxBounds={maxBounds}
                maxBoundsViscosity={1.0}
                minZoom={2}
            >
                <TileLayer
                    url={
                        mapType === 'default'
                            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    }
                    noWrap={true}
                    bounds={maxBounds}
                />

                {userPosition && <Marker position={userPosition} icon={userIcon} />}
                <Marker position={issPosition} icon={issIcon} />
                {renderOrbits()}
            </MapContainer>
        </div>
    );
};

export default ISSTracker;