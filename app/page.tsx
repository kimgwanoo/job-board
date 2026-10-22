import { createClient } from '@supabase/supabase-js';
import { Suspense } from 'react';
import { connection } from 'next/server';

async function PostList() {
  await connection();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 👇 날짜 필터를 빼고 모든 공고를 최신순으로 가져오기
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm text-center border">
        <p className="text-gray-500 mb-4">아직 수집된 공고가 없습니다.</p>
        <a
          href="/api/collect"
          target="_blank"
          className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          데이터 수집하기
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
            <span className="text-sm font-medium text-gray-500">
              등록/마감: {post.deadline || '상시채용'}
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          🚀 대구·경북 취업/대외활동 통합 보드
        </h1>
        <p className="text-gray-600 mb-8">
          대구광역시청 공식 RSS에서 수집한 실시간 공고 목록입니다.
        </p>

        <Suspense fallback={<div className="text-center p-10 text-gray-500 font-medium">데이터를 불러오는 중입니다... ⏳</div>}>
          <PostList />
        </Suspense>
      </div>
    </main>
  );
}