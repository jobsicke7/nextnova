'use client';

import React, { useEffect, useState } from 'react';
import styles from './MoonPage.module.css'; // Import CSS module

const MoonPage = () => {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Tracks loading for new API calls
    const [error, setError] = useState<string | null>(null);

    // Fetch GPS location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            },
            (err) => {
                console.error('Error fetching location:', err);
                setError('위치를 가져오는 데 실패했습니다. 기본 위치를 사용합니다.');
                // 기본 위치 (애틀랜타, 미국)
                setLatitude(33.775867);
                setLongitude(-84.39733);
            }
        );
    }, []);

    // Fetch Moon Image
    const fetchMoonImage = async () => {
        if (latitude === null || longitude === null) return;

        setIsLoading(true); // Set loading state to true only for the new request
        try {
            const response = await fetch('/api/moon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude, date }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch moon data');
            }

            const data = await response.json();
            setImageUrl(data.imageUrl); // Update the image URL
        } catch (err) {
            console.error('Error fetching moon data:', err);
            setError('달 이미지를 가져오는 데 실패했습니다.');
        } finally {
            setIsLoading(false); // End loading state
        }
    };

    // Fetch the moon image whenever latitude, longitude, or date changes
    useEffect(() => {
        fetchMoonImage();
    }, [latitude, longitude, date]);

    // Handlers for user inputs
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLatitude(parseFloat(e.target.value));
    };

    const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLongitude(parseFloat(e.target.value));
    };

    // Adjust date by one day
    const changeDate = (days: number) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + days);
        setDate(currentDate.toISOString().split('T')[0]);
    };

    return (
        <div className={styles.container}>
            <h1>음력 달력: 오늘 달 모양</h1>
            {imageUrl && (
                <div className={styles.imageContainer}>
                    <img
                        src={imageUrl}
                        alt="Moon Phase"
                        className={isLoading ? styles.imageLoading : styles.image}
                    />
                </div>
            )}
            <div className={styles.dateControls}>
                <button
                    className={`${styles.arrowButton} ${isLoading ? styles.disabled : ''}`}
                    onClick={() => changeDate(-1)}
                    disabled={isLoading}
                >
                    &lt;
                </button>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className={styles.dateInput}
                />
                <button
                    className={`${styles.arrowButton} ${isLoading ? styles.disabled : ''}`}
                    onClick={() => changeDate(1)}
                    disabled={isLoading}
                >
                    &gt;
                </button>
            </div>
            <div className={styles.coordinates}>
                <label>
                    위도:
                    <input
                        type="number"
                        step="0.000001"
                        value={latitude ?? ''}
                        onChange={handleLatitudeChange}
                        className={styles.coordinateInput}
                    />
                </label>
                <label>
                    경도:
                    <input
                        type="number"
                        step="0.000001"
                        value={longitude ?? ''}
                        onChange={handleLongitudeChange}
                        className={styles.coordinateInput}
                    />
                </label>
            </div>
        </div>
    );
};

export default MoonPage;
