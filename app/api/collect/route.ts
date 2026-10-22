import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const apiKey = process.env.PUBLIC_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API 키가 없습니다.' }, { status: 500 });
  }

  try {
    const baseUrl = 'https://api.odcloud.kr/api/15120518/v1/uddi:f0f1b1a0-cac2-41b0-9b1e-d2905b41493b';
    const fetchUrl = `${baseUrl}?page=1&perPage=20&serviceKey=${apiKey}`;

    const response = await fetch(fetchUrl);
    const json = await response.json();
    const items = json.data || [];

    if (items.length === 0) {
      return NextResponse.json({ success: true, message: '새로운 공고가 없습니다.' });
    }

    const formattedPosts = items.map((item: any) => ({
      title: item['제목'], 
      organization: '대구공공시설관리공단',
      category: '채용공고',
      deadline: null, 
      source_name: '대구공공시설관리공단',
      // 👇 방화벽이 없는 가장 안전한 '공식 채용 전용 사이트' 주소로 바꿨습니다.
      source_url: 'https://dpfc.saramin.co.kr', 
      external_id: String(item['순번']),
    }));

    // 👇 핵심!: 기존 DB에 있던 옛날 에러 주소를 새로운 주소로 '강제로 덮어쓰기' 하도록 규칙을 바꿨습니다.
    const { error } = await supabase
      .from('posts')
      .upsert(formattedPosts, { onConflict: 'source_name,external_id' }); // ignoreDuplicates 옵션 삭제!
      
    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `대구공공시설관리공단 공고 ${formattedPosts.length}개 안전한 주소로 덮어쓰기 완료!` 
    });

  } catch (error: any) {
    console.error('API 수집 에러:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}