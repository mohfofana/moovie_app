import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';

interface SearchProps {
  setQuery: (val: {}) => void;
}

const Search: React.FC<SearchProps> = ({ setQuery }) => {
  const { category } = useParams();
  const [search, setSearch] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    setQuery({ search });
    setSearch('');
  };

  return (
    <form
      className="text-[14px] lg:py-10 md:pt-8 md:pb-10 sm:pt-7 sm:pb-9 pt-6 pb-8 flex flex-row items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center bg-white/8 border border-white/10 rounded-2xl px-4 py-3 w-[320px] md:w-[420px]">
        <GoSearch className="text-[#d7caca] text-[18px]" />
        <input
          type="text"
          className="ml-3 bg-transparent outline-none w-full text-[#f2e7e7] placeholder:text-[#b9a6a6] font-medium"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder={`Search ${category === 'movie' ? 'movies' : 'tv series'}`}
        />
      </div>
    </form>
  );
};

export default Search;
