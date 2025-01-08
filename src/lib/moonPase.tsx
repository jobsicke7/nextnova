export function getMoonPhase(date: Date): string {
    const newMoon = new Date(2023, 0, 1); // 기준일, 예시로 2023년 1월 1일 신월
    const diffInTime = date.getTime() - newMoon.getTime();
    const daysPassed = diffInTime / (1000 * 3600 * 24); // 날짜 차이 계산

    const lunarCycle = 29.53058867; // 평균 음력 주기
    const phase = (daysPassed % lunarCycle) / lunarCycle;

    if (phase < 0.03) return '삭';
    if (phase < 0.25) return '초승달';
    if (phase < 0.27) return '상현달';
    if (phase < 0.5) return '상현망간의달';
    if (phase < 0.53) return '보름달';
    if (phase < 0.75) return '하현망간의달';
    if (phase < 0.77) return '하현달';
    return '그믐달';
}