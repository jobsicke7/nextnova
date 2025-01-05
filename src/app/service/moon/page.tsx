"use client";

import { useEffect, useState } from 'react';
import { MoonPhase } from 'astronomy-engine';
import styles from '../../../styles/MoonInfo.module.css';
import dynamic from 'next/dynamic';

// Define interfaces for moon data
interface MoonTimesType {
    rise: string;
    set: string;
}

const Home: React.FC = () => {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [moonPhase, setMoonPhase] = useState<number>(0);
    const [moonTimes, setMoonTimes] = useState<MoonTimesType>({ rise: '', set: '' });
    const [moonAltitude, setMoonAltitude] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            calculateMoonData(latitude, longitude, new Date(selectedDate));
        });
    }, [selectedDate]);

    const calculateMoonData = (lat: number, lon: number, date: Date): void => {
        // Moon phase calculation
        const phase = MoonPhase(date);
        setMoonPhase(phase);

        // Note: MoonTimes and MoonPosition are not available in astronomy-engine
        // You'll need to implement alternative calculations or use a different library
        // For now, setting dummy values
        setMoonTimes({
            rise: new Date().toLocaleTimeString(),
            set: new Date().toLocaleTimeString()
        });
        setMoonAltitude(0);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSelectedDate(e.target.value);
        calculateMoonData(latitude, longitude, new Date(e.target.value));
    };

    const handleLocationUpdate = (): void => {
        const newLatStr = prompt('Enter Latitude', latitude.toString());
        const newLonStr = prompt('Enter Longitude', longitude.toString());

        const newLat = newLatStr ? parseFloat(newLatStr) : null;
        const newLon = newLonStr ? parseFloat(newLonStr) : null;

        if (newLat !== null && newLon !== null && !isNaN(newLat) && !isNaN(newLon)) {
            setLatitude(newLat);
            setLongitude(newLon);
            calculateMoonData(newLat, newLon, new Date(selectedDate));
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>Moon Phase Tracker</header>

            <div className={styles.controls}>
                <div className={styles.field}>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className={styles.input}
                    />
                </div>

                <button onClick={handleLocationUpdate} className={styles.button}>Update Location</button>

                <div className={styles.location}>
                    Latitude: {latitude}, Longitude: {longitude}
                </div>
            </div>

            <div className={styles.results}>
                <div className={styles.resultItem}>
                    <h2>Moon Phase</h2>
                    <p>{moonPhase}</p>
                </div>

                <div className={styles.resultItem}>
                    <h2>Moonrise & Moonset</h2>
                    <p>Rise: {moonTimes.rise}</p>
                    <p>Set: {moonTimes.set}</p>
                </div>

                <div className={styles.resultItem}>
                    <h2>Moon Altitude</h2>
                    <p>{moonAltitude.toFixed(2)}°</p>
                </div>
            </div>

            <div className={styles.moonAnimation}></div>
        </div>
    );
};

export default Home;
