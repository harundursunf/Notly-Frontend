import React from 'react';

const SearchIcon = ({ className = "h-5 w-5 text-slate-400" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const ClearIcon = ({ className = "h-5 w-5 text-slate-400 hover:text-slate-600" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);


export default function FilterPanel({ searchTerm, onSearchChange, placeholder }) {
    return (
     
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 border border-slate-200/60">
            <label htmlFor="search-filter" className="text-base font-semibold text-slate-800 mb-3 block">
                Filtrele
            </label>
            <div className="relative">
                {/* Arama ikonu */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    id="search-filter"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder || "Ders adı, konu..."}
                    className="w-full pl-11 pr-10 py-3 bg-slate-100 text-slate-800 border-2 border-transparent rounded-full focus:ring-2 focus:ring-indigo-500/50 focus:bg-white focus:border-indigo-500 transition-all duration-300 ease-in-out placeholder:text-slate-400"
                    aria-label="Notları filtrelemek için arama yapın"
                />
               
                {searchTerm && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                            onClick={() => onSearchChange('')}
                            className="p-1 rounded-full text-slate-500 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label="Aramayı temizle"
                        >
                            <ClearIcon />
                        </button>
                    </div>
                )}
            
            </div>
        </div>
    );
}