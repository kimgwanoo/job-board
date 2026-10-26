import React from "react";

// 올려주신 대구광역시 공식 심볼 이미지와 100% 동일한 정밀 SVG 로고
function DaeguLogo() {
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full max-h-52 object-contain group-hover:scale-105 transition-transform duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. 가장 좌측 녹색 봉우리 */}
      <polygon points="172,118 24,360 76,346 190,154" fill="#00802c" />

      {/* 2. 첫 번째와 두 번째 사이를 가르는 흰색 스트라이프 선 */}
      <polygon points="190,154 76,346 95,340 197,170" fill="#ffffff" />

      {/* 3. 가운데 중간 높이 녹색 봉우리 */}
      <polygon points="244,94 114,336 142,328 258,136" fill="#00802c" />

      {/* 4. 두 번째와 세 번째 사이를 가르는 흰색 스트라이프 선 */}
      <polygon points="258,136 142,328 165,322 268,154" fill="#ffffff" />

      {/* 5. 우측 가장 높고 웅장한 메인 삼각형 봉우리 */}
      <polygon points="304,74 142,330 478,370" fill="#00802c" />

      {/* 6. 메인 봉우리 하단과 DAEGU 위를 가로지르는 유려한 활 모양 지평선 곡선 */}
      <path
        d="M 24,360 Q 250,314 478,370 C 478,370 460,428 368,438 C 428,420 442,382 432,368 Q 248,328 68,368 Z"
        fill="#00802c"
      />

      {/* 7. 대구 공식 영문 서체 (굵고 둥근 고딕 볼드 타이포) */}
      <text
        x="195"
        y="426"
        textAnchor="middle"
        fontFamily="Impact, 'Arial Black', -apple-system, sans-serif"
        fontWeight="900"
        fontSize="65"
        letterSpacing="2"
        fill="#00802c"
      >
        DAEGU
      </text>
    </svg>
  );
}

// 긴 공고 제목을 핵심만 남겨 가독성 높게 축약하는 함수
function formatTitle(rawTitle: string) {
  const yearMatch = rawTitle.match(/\d{4}/);
  const roundMatch = rawTitle.match(/제\d+회/);
  const badgeText = `${yearMatch ? yearMatch[0] : ""} ${roundMatch ? roundMatch[0] : ""}`.trim();

  let shortTitle = rawTitle
    .replace(/\d{4}년도?/, "")
    .replace(/제\d+회/, "")
    .replace(/대구광역시(청)?/, "")
    .replace(/지방공무원\s*임용(시험)?/, "")
    .replace(/\[.*?\]|\(.*?\)/g, "")
    .trim();

  if (!shortTitle) {
    shortTitle = "지방공무원 임용시험 안내";
  }

  return {
    badge: badgeText || "대구시 공채",
    mainTitle: shortTitle,
    fullTitle: rawTitle,
  };
}

// 날짜 포맷팅 함수 (YYYY-MM-DD)
function formatDate(dateStr: string): string {
  if (!dateStr) return "최신 공고";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 대구시청 RSS 데이터 수집 및 정제
async function getRssData() {
  try {
    const rssUrl = "https://www.daegu.go.kr/icms/rss/feed.do?id=BBS_02086";
    const res = await fetch(rssUrl, {
      next: { revalidate: 600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const itemsRaw = xml.split("<item>").slice(1);
    const rawList = [];

    for (const chunk of itemsRaw) {
      const title = (chunk.split("<title>")[1]?.split("</title>")[0] || "")
        .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
        .trim();
      const link = (chunk.split("<link>")[1]?.split("</link>")[0] || "")
        .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
        .trim();
      const pubDate = (chunk.split("<pubDate>")[1]?.split("</pubDate>")[0] || "").trim();

      const isOfficialRecruit = /지방공무원.*임용|임용.*시행계획|공무원.*임용/.test(title);

      if (isOfficialRecruit) {
        const realPostedDate = formatDate(pubDate);

        // 연도 및 회차별 그룹 키 (중복 제거)
        const matchYear = title.match(/\d{4}년/);
        const matchRound = title.match(/제\d+회/);
        const groupKey = `${matchYear ? matchYear[0] : ""}_${matchRound ? matchRound[0] : title.slice(0, 15)}`;

        rawList.push({
          groupKey,
          type: "recruitment",
          title,
          link,
          date: realPostedDate,
        });
      }
    }

    // 회차별 최신 공고 1건만 유지
    const seen = new Set();
    const uniqueList = [];
    for (const item of rawList) {
      if (!seen.has(item.groupKey)) {
        seen.add(item.groupKey);
        uniqueList.push(item);
      }
    }

    return uniqueList;
  } catch (err) {
    console.error("RSS 수집 오류:", err);
    return [];
  }
}

export default async function HomePage() {
  const items = await getRssData();

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28">
      {/* 상단 헤더 */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 py-7 px-6 text-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          대구광역시 채용 알림센터
        </h1>
        <p className="text-sm font-medium text-emerald-700 mt-1.5 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          대구광역시청 공식 채용 실시간 연동
        </p>
      </header>

      {/* 카테고리 탭 버튼 */}
      <nav className="flex justify-center gap-3 pt-8 pb-4 px-6">
        <span className="px-6 py-2.5 rounded-full font-bold text-sm bg-emerald-600 text-white shadow-md shadow-emerald-200/80">
          💼 지방공무원 임용 공고 ({items.length})
        </span>
        <span className="px-6 py-2.5 rounded-full font-bold text-sm bg-white text-gray-400 border border-gray-200">
          🏆 대외 공모전 (준비중)
        </span>
      </nav>

      {/* 화면 전체 폭을 시원하게 채우는 4열 대형 그리드 */}
      <main className="w-full max-w-[1700px] mx-auto px-6 md:px-10 lg:px-12 mt-6">
        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-base font-medium">현재 등록된 공고가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, index) => {
              const { badge, mainTitle, fullTitle } = formatTitle(item.title);

              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={fullTitle}
                  className="group bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 flex flex-col hover:-translate-y-2 cursor-pointer"
                >
                  {/* 대구광역시 심볼 로고 영역 (제시해주신 로고와 100% 동일한 형태) */}
                  <div className="w-full aspect-[4/3] bg-white flex items-center justify-center p-8 border-b border-gray-100">
                    <DaeguLogo />
                  </div>

                  {/* 공고 본문 정보 */}
                  <div className="p-6 flex flex-col flex-1 justify-between bg-white space-y-4">
                    <div>
                      {/* 회차 뱃지 */}
                      <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wide bg-emerald-100 text-emerald-800 mb-2.5">
                        {badge}
                      </span>
                      {/* 축약된 굵은 헤드라인 제목 */}
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
                        {mainTitle}
                      </h2>
                    </div>

                    {/* 하단 기관 및 게시일 */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                        대구광역시청
                      </span>
                      <span className="font-medium text-gray-600">
                        게시일: <strong className="text-gray-900">{item.date}</strong>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}