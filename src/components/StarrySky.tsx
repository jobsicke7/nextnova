"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/StarrySky.module.css';

interface StarProps {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
}

const Star: React.FC<StarProps> = ({ x, y, size, delay }) => {
    return (
        <div
            className={styles.star}
            style={{
                left: `${x}vw`,
                top: `${y}vh`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `${styles.twinkle} 1.5s ease-in-out infinite`,
                animationDelay: `${delay}s`,
            }}
        />
    );
};

interface TwinklingStarsProps {
    count?: number;
}

const TwinklingStars: React.FC<TwinklingStarsProps> = ({ count = 50 }) => {
    const [stars, setStars] = useState<StarProps[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 98, // 화면 가장자리 여백을 위해 98로 제한
            y: Math.random() * 98,
            size: Math.random() * 3 + 1,
            delay: Math.random() * 2
        }));
        setStars(newStars);
    }, [count]);

    return (
        <div className={styles.container}>
            {stars.map((star) => (
                <Star key={star.id} {...star} />
            ))}
        </div>
    );
};

export default TwinklingStars;