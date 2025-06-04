import React from 'react';
import FilterPanel from '../FilterPanel'; // Daha önce oluşturduğumuz FilterPanel'i import ediyoruz.

const Sidebar = ({
    stickyOffset,
    searchTerm,
    onSearchChange,
    loading,
    error,
    courses,
    selectedCourse,
    onCourseClick,
    allNotesCount,
    Icons,
}) => {
    return (
        <aside className="lg:col-span-3">
            <div className={`sticky ${stickyOffset} space-y-6`}>
                <FilterPanel 
                    searchTerm={searchTerm}
                    onSearchChange={onSearchChange}
                    placeholder="Derslerde ara..."
                />
                
                <div className="bg-white rounded-2xl shadow-md p-5 border border-slate-200/60">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                        Popüler Dersler
                    </h2>
                    {loading && !courses.length ? (
                        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>)}</div>
                    ) : error ? (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                    ) : !courses.length ? (
                        <p className="text-sm text-slate-500">Popüler ders bulunmuyor.</p>
                    ) : (
                        <ul className="space-y-2">
                            <li>
                                <button onClick={() => onCourseClick(null)} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left ${!selectedCourse ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'bg-slate-100 hover:bg-indigo-100 text-slate-700'}`}>
                                    <span className="flex-grow text-sm">Tüm Notlar</span>
                                    <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${!selectedCourse ? 'bg-indigo-500' : 'bg-slate-200 text-slate-600'}`}>{allNotesCount}</span>
                                </button>
                            </li>
                            {courses.map(course => (
                                <li key={course.id}>
                                    <button onClick={() => onCourseClick(course.id)} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left ${selectedCourse === course.id ? 'bg-indigo-600 text-white font-semibold shadow-md' : 'bg-slate-100 hover:bg-indigo-100 text-slate-700'}`}>
                                        <span className={`text-xl mr-3 ${selectedCourse === course.id ? 'text-indigo-200' : 'text-slate-400'}`}>{course.icon || Icons.CourseDefault}</span>
                                        <span className="flex-grow text-sm truncate" title={course.name}>{course.name}</span>
                                        <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${selectedCourse === course.id ? 'bg-indigo-500' : 'bg-slate-200 text-slate-600'}`}>{course.noteCount}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;