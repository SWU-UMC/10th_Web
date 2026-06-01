import React, { useState } from 'react';
import { MovieFilters, MovieLanguage } from '../types/movie';
import { LATEST_LANGUAGE_OPTIONS } from '../constants/movie';

interface MovieFilterProps {
  onFilterChange: (filters: MovieFilters) => void;
}


export const MovieFilter = React.memo(({ onFilterChange }: MovieFilterProps) => {
  console.log('🔄 MovieFilter 리렌더링');

  const [query, setQuery] = useState('');
  const [includeAdult, setIncludeAdult] = useState(false);
  const [language, setLanguage] = useState<MovieLanguage>('ko-KR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      query,
      include_adult: includeAdult,
      language
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg bg-white p-6 shadow-md mb-8">
      <div className="flex flex-wrap gap-6">
        {/* 영화 제목 입력란 */}
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">🎬 영화 제목</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 성인 콘텐츠 체크박스 */}
        <div className="flex items-center min-w-[150px] pt-6">
          <input
            id="adult-checkbox"
            type="checkbox"
            checked={includeAdult}
            onChange={(e) => setIncludeAdult(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="adult-checkbox" className="ml-2 text-sm font-medium text-gray-700 select-none cursor-pointer">
            🔞 성인 콘텐츠 표시
          </label>
        </div>

        {/* 언어 선택 드롭다운 */}
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">🌐 언어</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as MovieLanguage)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LATEST_LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-600 text-white font-bold p-3 rounded-md hover:bg-blue-700 transition"
      >
        🔍 검색하기
      </button>
    </form>
  );
});

MovieFilter.displayName = 'MovieFilter';