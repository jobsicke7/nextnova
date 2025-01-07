"use client";

import dynamic from "next/dynamic";

// Leaflet 컴포넌트를 동적으로 임포트
const ISSTracker = dynamic(() => import("./ISSTracker"), {
    ssr: false, // 서버 사이드 렌더링 비활성화
    loading: () => <div>Loading map...</div>,
});

export default function ISSPage() {
    return (
        <div>
            <ISSTracker />
        </div>
    );
}