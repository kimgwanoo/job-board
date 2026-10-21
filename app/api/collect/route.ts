import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 👇 나중에 여기에 워크넷/공공데이터 API의 대구경북 필터를 넣게 됩니다!
  const samplePosts = [
    {
      title: '[대구] 2026년 하반기 공공기관 통합채용',
      organization: '대구광역시',
      category: '채용',
      deadline: '2026-11-30', // 다가올 마감일
      source_name: '대구시청',
      source_url: 'https://www.daegu.go.kr',
      external_id: 'dg-2026-001',
    },
    {
      title: '[경북] 대학생 지역기업 탐방단 모집',
      organization: '경상북도 경제진흥원',
      category: '대외활동',
      deadline: '2026-12-15', // 다가올 마감일
      source_name: '경북테크노파크',
      source_url: 'https://www.gbtp.or.kr',
      external_id: 'gb-2026-002',
    },
    {
      title: '[대구/경북] 이미 기간이 끝난 예전 공고 (보이면 안 됨!)',
      organization: '테스트 기관',
      category: '공모전',
      deadline: '2026-01-01', // 👈 이미 지난 옛날 날짜!
      source_name: '테스트 데이터',
      source_url: '#',
      external_id: 'test-old-001',
    }
  ];

  const { error } = await supabase
    .from('posts')
    .upsert(samplePosts, { onConflict: 'source_name,external_id', ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: '대구경북 데이터 수집 완료!' });
}