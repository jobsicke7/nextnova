export interface ChatMessage {
  id: string;        // MongoDB의 _id를 string으로 변환한 값
  userId: string;    // 사용자 이메일
  naverId: string;   // 네이버 이메일
  message: string;   // 메시지 내용
  createdAt: Date;   // 생성 시간
}

export interface ChatProps {
  initialMessages: ChatMessage[];
}