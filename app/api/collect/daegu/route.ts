import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssUrl = "https://www.daegu.go.kr/icms/rss/feed.do?id=BBS_02086";
    const res = await fetch(rssUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) {
      return new NextResponse("대구시청 응답 실패", { status: 500 });
    }

    const xml = await res.text();
    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch (error) {
    return new NextResponse("서버 통신 실패", { status: 500 });
  }
}