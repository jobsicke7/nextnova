'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './moon.module.css';
import Image from 'next/image';

interface Coordinates {
    latitude: number;
    longitude: number;
    altitude: number;
}
interface MoonInfo {
    age: number;
    illumination: number;
    illuminationLux: number;
    angularDiameter: number;
    distance: number;
    magnitude: number;
    moonrise: string;
    moonset: string;
}
interface ImageCache {
    [key: number]: string;
}
const MoonPhasePage = () => {

    const calculateMoonAge = (phase: number): number => {
        return phase * 29.530588853; // 평균 달의 위상 주기
    };
    const calculateMoonDistance = (jd: number): number => {
        const T = (jd - 2451545.0) / 36525;
        const D = 297.8502042 + 445267.1115168 * T - 0.0016300 * T * T;
        const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
        const Mm = 134.9634114 + 477198.8676313 * T + 0.008997 * T * T;

        const E = 1 + (-0.002516 * T) + (-0.0000074 * T * T);

        // 평균 거리에 섭동 항들을 적용
        const distance = 385000.56 +
            -3629.215 * Math.cos(Mm * Math.PI / 180) +
            63.224 * Math.cos(2 * D - Mm * Math.PI / 180) +
            -57.143 * Math.cos(2 * D * Math.PI / 180) +
            -20.762 * Math.cos(2 * Mm * Math.PI / 180);

        return distance;
    };
    const calculateAngularDiameter = (distance: number): number => {
        return 2 * Math.atan(1738 / distance) * 180 / Math.PI;
    };
    const calculateMoonMagnitude = (phase: number, distance: number): number => {
        const phaseAngle = phase * 360;
        const mag = -12.73 +
            0.026 * Math.abs(phaseAngle) +
            4e-9 * Math.pow(phaseAngle, 4) +
            0.000000215 * (distance - 385000);
        return mag;
    };
    // 달의 조도(illumination) 계산
    const calculateIllumination = (phase: number): number => {
        // 위상각을 라디안으로 변환 (0 = 삭, 0.5 = 보름)
        const phaseAngle = phase * 2 * Math.PI;
        // 코사인 함수를 사용하여 조도 계산 (-1 to 1 범위를 0 to 100으로 변환)
        return ((1 - Math.cos(phaseAngle)) / 2) * 100;
    };
    // 개선판
    const calculateIlluminationLux = (phase: number, distance: number): number => {
        // 위상각 계산 (보름달에서 0°, 삭에서 180°)
        const phaseAngle = (1 - phase) * 360;
        // 달의 밝기 비율 계산 (보름달 기준 최대값, 삭 기준 0)
        const illuminationPercentage = (1 + Math.cos(phaseAngle * Math.PI / 180)) / 2;
        const maxLux = 0.25; // 보름달 기준 lux 값
        const normalizedDistance = 385000 / distance; // 평균 거리(385,000 km) 대비 현재 거리 비율
        return illuminationPercentage * maxLux * Math.pow(normalizedDistance, 2);
    };
    // 월출/월몰 시간 계산
    const calculateMoonRiseSet = (date: Date, lat: number, lon: number): { moonrise: string; moonset: string } => {
        const jd = getJulianDate(date);
        const T = (jd - 2451545.0) / 36525;

        // 달의 평균 황경
        const L = 218.3164477 + 481267.88123421 * T;
        // 달의 평균 승교점 경도
        const omega = 125.0445479 - 1934.1362891 * T;

        // 관측자의 위치에 따른 보정
        const localSiderealTime = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + lon) % 360;

        // 달의 적경과 적위 계산 (간략화된 버전)
        const RA = L + omega;
        const Dec = 23.43929111 * Math.sin(omega * Math.PI / 180);

        // 월출/월몰 시각 계산 (간략화된 버전)
        const H = Math.acos((-0.583 - Math.sin(Dec * Math.PI / 180) * Math.sin(lat * Math.PI / 180)) /
            (Math.cos(Dec * Math.PI / 180) * Math.cos(lat * Math.PI / 180))) * 180 / Math.PI;

        const transitTime = (RA - localSiderealTime) / 15;
        const riseTime = (transitTime - H / 15 + 24) % 24;
        const setTime = (transitTime + H / 15 + 24) % 24;

        // HH:MM 형식으로 변환
        const formatTime = (time: number) => {
            const hours = Math.floor(time);
            const minutes = Math.floor((time - hours) * 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };

        return {
            moonrise: formatTime(riseTime),
            moonset: formatTime(setTime)
        };
    };
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [coordinates, setCoordinates] = useState<Coordinates>({
        latitude: 0,
        longitude: 0,
        altitude: 0
    });
    const [imageCache, setImageCache] = useState<ImageCache>({});
    const [isLoading, setIsLoading] = useState(true);
    const preloadedImages = useRef<HTMLImageElement[]>([]);
    const preloadImages = async () => {
        setIsLoading(true);
        const imagePromises: Promise<void>[] = [];

        for (let i = 1; i <= 30; i++) {
            const promise = new Promise<void>((resolve) => {
                const img = new window.Image();
                img.onload = () => {
                    setImageCache(prev => ({
                        ...prev,
                        [i]: `/images/moonimg/${i}.png`
                    }));
                    resolve();
                };
                img.src = `/images/moonimg/${i}.png`;
                preloadedImages.current.push(img);
            });
            imagePromises.push(promise);
        }

        await Promise.all(imagePromises);
        setIsLoading(false);
    };
    const calculateMoonInfo = (date: Date, phase: number, lat: number, lon: number): MoonInfo => {
        const jd = getJulianDate(date);
        const distance = calculateMoonDistance(jd);
        const { moonrise, moonset } = calculateMoonRiseSet(date, lat, lon);

        return {
            age: calculateMoonAge(phase),
            illumination: calculateIllumination(phase),
            illuminationLux: calculateIlluminationLux(phase, distance),
            angularDiameter: calculateAngularDiameter(distance),
            distance: distance,
            magnitude: calculateMoonMagnitude(phase, distance),
            moonrise,
            moonset
        };
    };
    useEffect(() => {
        preloadImages();

        return () => {
            preloadedImages.current = [];
            setImageCache({});
        };
    }, []);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        altitude: position.coords.altitude || 0
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setCoordinates({
                        latitude: 37.5665,
                        longitude: 126.9780,
                        altitude: 38
                    });
                }
            );
        }
    }, []);

    // 율리우스 날짜 계산
    const getJulianDate = (date: Date): number => {
        const time = date.getTime();
        const julian = time / 86400000 + 2440587.5;
        return julian;
    };

    // 태양의 위치 계산
    const calculateSunPosition = (jd: number) => {
        const T = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0

        // 평균 황경
        let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
        L0 = L0 % 360;
        if (L0 < 0) L0 += 360;

        // 평균 근점 이각
        let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
        M = M % 360;
        if (M < 0) M += 360;

        // 이심률
        const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

        // 황경 보정값
        const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
            + 0.000289 * Math.sin(3 * M * Math.PI / 180);

        // 진황경
        const L = L0 + C;

        return { L, M, e };
    };

    // 달의 위치 계산
    const calculateMoonPosition = (jd: number) => {
        const T = (jd - 2451545.0) / 36525;

        // 달의 평균 황경
        let Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000;
        Lp = Lp % 360;
        if (Lp < 0) Lp += 360;

        // 달의 평균 근점 이각
        let M = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000;
        M = M % 360;
        if (M < 0) M += 360;

        // 달과 태양의 평균 거리
        let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000;
        D = D % 360;
        if (D < 0) D += 360;

        return { Lp, M, D };
    };

    // 대기 굴절 보정
    const calculateAtmosphericRefraction = (altitude: number, temperature: number = 15, pressure: number = 1013.25) => {
        // 온도는 섭씨, 압력은 hPa
        const R = 1 / Math.tan((altitude + 7.31 / (altitude + 4.4)) * Math.PI / 180);
        const correction = R * pressure / 1010 * 283 / (273 + temperature);
        return correction / 60; // 도 단위로 변환
    };

    // 달의 위상 계산
    const calculateMoonPhase = (date: Date, lat: number, lon: number, alt: number): number => {
        const JD = getJulianDate(date);

        // 태양과 달의 위치 계산
        const sunPos = calculateSunPosition(JD);
        const moonPos = calculateMoonPosition(JD);

        // 달의 이심률
        const e = 0.054900;

        // 위상각 계산
        let phase = moonPos.Lp - sunPos.L;
        phase = phase % 360;
        if (phase < 0) phase += 360;

        // 보정값 적용
        // 1. 달의 이심률에 의한 보정
        const moonEccCorrection = 6.289 * Math.sin(moonPos.M * Math.PI / 180);

        // 2. 태양의 이심률에 의한 보정
        const sunEccCorrection = 1.274 * Math.sin((moonPos.Lp - 2 * moonPos.D) * Math.PI / 180);

        // 3. 위도 보정
        const latitudeCorrection = Math.sin(lat * Math.PI / 180) * 0.001;

        // 4. 경도 보정
        const longitudeCorrection = lon / 360;

        // 5. 고도에 따른 대기 굴절 보정
        const refractionCorrection = calculateAtmosphericRefraction(alt) / 360;

        // 최종 위상 계산
        phase = (phase + moonEccCorrection + sunEccCorrection + latitudeCorrection + longitudeCorrection + refractionCorrection) % 360;
        console.log(phase)

        // 0-1 범위로 정규화
        let normalizedPhase = phase / 360;
        if (normalizedPhase < 0) normalizedPhase += 1;

        return normalizedPhase;
    };

    const getMoonPhaseName = (phase: number): string => {
        if (phase < 0.025 || phase >= 0.975) return '삭';
        if (phase < 0.225) return '초승달';
        if (phase < 0.275) return '상현달';
        if (phase < 0.475) return '상현망간의달';
        if (phase < 0.525) return '보름달';
        if (phase < 0.725) return '하현망간의달';
        if (phase < 0.775) return '하현달';
        return '그믐달';
    };
    const getMoonPhaseImage = (phase: number): number => {
        // 위상값(0-1)을 1-30 사이의 정수로 변환
        let imageNumber = Math.round(phase * 30);

        // 경계값 처리
        if (imageNumber === 0) imageNumber = 30;
        if (imageNumber === 31) imageNumber = 1;

        return imageNumber;
    };
    const handlePrevDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const moonPhase = calculateMoonPhase(
        currentDate,
        coordinates.latitude,
        coordinates.longitude,
        coordinates.altitude
    );

    const moonInfo = calculateMoonInfo(
        currentDate,
        moonPhase,
        coordinates.latitude,
        coordinates.longitude
    );
    const currentPhaseImage = getMoonPhaseImage(moonPhase);
    const phaseName = getMoonPhaseName(moonPhase);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>달의 위상</h1>
                </div>

                <div className={styles.dateControl}>
                    <button className={styles.button} onClick={handlePrevDay}>
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className={styles.value}>
                        {currentDate.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                    <button className={styles.button} onClick={handleNextDay}>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className={styles.locationInfo}>
                    <div className={styles.label}>현재 위치</div>
                    <div className={styles.value}>위도: {coordinates.latitude.toFixed(4)}°</div>
                    <div className={styles.value}>경도: {coordinates.longitude.toFixed(4)}°</div>
                    <div className={styles.value}>고도: {coordinates.altitude.toFixed(1)}m</div>
                </div>

                <div className={styles.phaseInfo}>
                    <div className={styles.label}>달의 위상</div>
                    {isLoading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        <Image
                            src={imageCache[currentPhaseImage] || `/images/moonimg/${currentPhaseImage}.png`}
                            alt={phaseName}
                            width={200}
                            height={200}
                            className={styles.moonImage}
                            priority={true}
                            loading="eager"
                        />
                    )}
                    <div className={styles.phaseName}>{phaseName}</div>
                    <div className={styles.phaseValue}>
                        위상값: {(moonPhase * 100).toFixed(1)}%
                    </div>
                </div>
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>달의 나이</div>
                        <div className={styles.infoValue}>{moonInfo.age.toFixed(1)}일</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>달의 조도</div>
                        <div className={styles.infoValue}>{moonInfo.illumination.toFixed(1)}%</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>시직경</div>
                        <div className={styles.infoValue}>{moonInfo.angularDiameter.toFixed(2)}°</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>지구와의 거리</div>
                        <div className={styles.infoValue}>{(moonInfo.distance / 1000).toFixed(1)}만 km</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>가시등급</div>
                        <div className={styles.infoValue}>{moonInfo.magnitude.toFixed(1)}</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>월출/월몰</div>
                        <div className={styles.infoValue}>
                            {moonInfo.moonrise} / {moonInfo.moonset}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoonPhasePage;