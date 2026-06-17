import React from 'react';

interface SearchFormProps {
  query: string;
  setQuery: (val: string) => void;
  includeAdult: boolean;
  setIncludeAdult: (val: boolean) => void;
  language: string;
  setLanguage: (val: string) => void;
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm = ({
  query, setQuery,
  includeAdult, setIncludeAdult,
  language, setLanguage,
  onSearch
}: SearchFormProps) => {
  return (
    <form 
      onSubmit={onSearch} 
      className="bg-white p-6 rounded-xl shadow-md flex flex-wrap items-center gap-4 mb-10"
    >
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="영화 제목을 입력하세요" 
        className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
      />

      <label className="flex items-center gap-2 cursor-pointer text-gray-700 select-none">
        <input 
          type="checkbox" 
          checked={includeAdult} 
          onChange={(e) => setIncludeAdult(e.target.checked)} 
          className="w-5 h-5 text-blue-600 rounded cursor-pointer"
        />
        성인 콘텐츠 포함
      </label>

      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)} 
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="ko-KR">한국어 (ko-KR)</option>
        <option value="en-US">영어 (en-US)</option>
        <option value="ja-JP">일본어 (ja-JP)</option>
      </select>

      <button 
        type="submit" 
        className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        검색
      </button>
    </form>
  );
};

export default SearchForm;