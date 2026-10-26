"use client";

import { useState } from "react";

interface Item {
  type: string;
  title: string;
  link: string;
  date: string;
  img: string;
}

export default function ClientFeed({ initialData }: { initialData: Item[] }) {
  const [currentCategory, setCurrentCategory] = useState("recruitment");

  const filteredData = initialData.filter((item) => item.type === currentCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="bg-white border-b border-gray-200 py-6 px-4 text-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          🚀 대구/경북 채용 & 공모전
        </h1>
        <p className="text-xs text-gray-500 mt-1">대구광역시 공식 공고 실시간 수집</p>
      </header>

      <nav className="flex justify-center gap-3 py-6 px-4">
        <button
          onClick={() => setCurrentCategory("recruitment")}
          className={`px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
            currentCategory === "recruitment"
              ? "bg-blue-600 text-white shadow-blue-200"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          💼 채용 공고 ({initialData.filter((i) => i.type === "recruitment").length})
        </button>
        <button
          onClick={() => setCurrentCategory("contest")}
          className={`px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-sm ${
            currentCategory === "contest"
              ? "bg-blue-600 text-white shadow-blue-200"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          🏆 대외 공모전 ({initialData.filter((i) => i.type === "contest").length})
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">해당 카테고리의 게시글이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>📌 대구시청 공고</span>
                    <span className="font-medium text-gray-700">게시일: {item.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}