
'use client';

import { useEffect, useState } from 'react';

export default function Page() {
    const [color, setColor] = useState('');

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const response = await fetch('https://api.jobsicke.xyz/traffic-light');
                const data = await response.json();
                setColor(data.color);
            } catch (error) {
                console.error('Error fetching traffic light color:', error);
            }
        };

        fetchColor();
    }, []);

    return (
        <div>
            <p>Traffic Light Color: {color}</p>
        </div>
    );
}