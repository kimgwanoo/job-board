import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // 👇 컴퓨터가 현재 환경변수를 어떻게 읽고 있는지 터미널에 출력해 봅니다.
  console.log("--- 🔎 주소 확인 시작 ---");
  console.log("URL 주소:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Secret 키:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "잘 들어옴" : "안 들어옴(비어있음)");
  console.log("-------------------------");

  // URL이나 키가 비어있으면 멈춤
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, error: "환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요." }, { status: 500 });
  }

  // Supabase 연결
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 테스트용 공고 데이터 3개
  const samplePosts = [
    {
      title: '2026년 상반기 청년 인턴 채용',
      organization: '한국산업인력공단',
      category: '채용',
      deadline: '2026-11-15',
      source_name: '고용24',
      source_url: 'https://www.work24.go.kr',
      external_id: 'test-101',
    }
  ];

  const { error } = await supabase
    .from('posts')
    .upsert(samplePosts, { onConflict: 'source_name,external_id', ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: '성공!' });
}