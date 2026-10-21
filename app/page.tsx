import { createClient } from '@supabase/supabase-js';
import { Suspense } from 'react';

// 1. 데이터를 가져와서 카드 목록을 그리는 핵심 컴포넌트
async function PostList() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('deadline', { ascending: true });

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm text-center border">
        <p className="text-gray-500 mb-4">아직 수집된 공고가 없습니다.</p>
        <a
          href="/api/collect"
          target="_blank"
          className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          여기를 눌러 첫 데이터 수집하기
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">
              {post.category}
            </span>
            <span className="text-sm font-medium text-red-500">
              마감일: {post.deadline || '상시채용'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{post.title}</h2>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-3 border-t border-gray-50">
            <span>🏢 주최/기업: {post.organization}</span>
            <span>📌 출처: {post.source_name}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

// 2. 메인 페이지 (뼈대)
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 취업·공모전·대외활동 통합 보드
        </h1>
        <p className="text-gray-600 mb-8">
          공식 API를 통해 매일 자동으로 업데이트되는 맞춤형 취업 정보입니다.
        </p>

        {/* 👇 데이터가 오는 동안 "불러오는 중" 표시를 띄워주는 안전장치(Suspense)입니다 */}
        <Suspense fallback={<div className="text-center p-10 text-gray-500 font-medium">데이터를 불러오는 중입니다... ⏳</div>}>
          <PostList />
        </Suspense>

      </div>
    </main>
  );
}