import { createClient } from '@supabase/supabase-js';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

async function PostList() {
  await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 👇 오늘 날짜 구하기 (예: 2026-10-22)
  const today = new Date().toISOString().split('T')[0];

  // 👇 핵심 로직: 마감일이 오늘(today)보다 크거나 같음(gte) OR 마감일이 없는(null) 공고만 가져오기
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .or(`deadline.gte.${today},deadline.is.null`)
    .order('deadline', { ascending: true });

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm text-center border">
        <p className="text-gray-500 mb-4">현재 모집 중인 대구·경북 공고가 없습니다.</p>
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          🚀 대구·경북 취업/대외활동 통합 보드
        </h1>
        <p className="text-gray-600 mb-8">
          마감일이 지나지 않은 대구·경북 지역의 핵심 채용/공모전 정보만 모아 보여드립니다.
        </p>

        <Suspense fallback={<div className="text-center p-10 text-gray-500 font-medium">데이터를 불러오는 중입니다... ⏳</div>}>
          <PostList />
        </Suspense>
      </div>
    </main>
  );
}