import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CommunityPage = () => { 
    const { courseIdFromUrl } = useParams(); 
    const selectedCourseIdAsInt = parseInt(courseIdFromUrl, 10);

    const [courseNotes, setCourseNotes] = useState([]); r
    const [currentCourseDetails, setCurrentCourseDetails] = useState(null); 

    const [allNotesForSidebar, setAllNotesForSidebar] = useState([]); 
    const [topCoursesForSidebar, setTopCoursesForSidebar] = useState([]);
    const [loadingSidebarCourses, setLoadingSidebarCourses] = useState(true);

    const [loadingCourseNotes, setLoadingCourseNotes] = useState(true);
    const [courseNotesError, setCourseNotesError] = useState(null);
    const [sidebarError, setSidebarError] = useState(null);

    const Icons = { /* ... (NotesFeed'deki gibi) ... */
        Calendar: '📅', ThumbUp: '👍', Note: '📄', CourseDefault: '📚' // Community ikonu kaldırıldı
    };

    useEffect(() => {
        const fetchAllNotesAndDeriveTopCourses = async () => {
            setLoadingSidebarCourses(true);
            setSidebarError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setSidebarError("Giriş yapmalısınız.");
                setLoadingSidebarCourses(false);
                return;
            }
            try {
                const response = await axios.get('https://localhost:7119/api/Notes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (Array.isArray(response.data)) {
                    const allNotes = response.data.map(note => ({ // Gerekli alanları formatla
                        courseId: note.courseId,
                        courseName: note.courseName || 'Bilinmiyor',
                    }));
                    // setAllNotesForSidebar(allNotes); // Bu state'e gerek olmayabilir, direkt hesaplayabiliriz

                    const courseCounts = allNotes.reduce((acc, note) => {
                        if (note.courseId && note.courseName && note.courseName !== 'Bilinmiyor') {
                            acc[note.courseId] = acc[note.courseId] || {
                                id: note.courseId, name: note.courseName, noteCount: 0, icon: Icons.CourseDefault
                            };
                            acc[note.courseId].noteCount++;
                        }
                        return acc;
                    }, {});
                    const derivedCourses = Object.values(courseCounts)
                        .sort((a, b) => b.noteCount - a.noteCount).slice(0, 5);
                    setTopCoursesForSidebar(derivedCourses);
                } else {
                    setSidebarError("Veri formatı yanlış.");
                }
            } catch (err) {
                setSidebarError("Popüler dersler yüklenemedi.");
            } finally {
                setLoadingSidebarCourses(false);
            }
        };
        fetchAllNotesAndDeriveTopCourses();
    }, []); // Icons objesi bağımlılıklardan çıkarıldı çünkü artık useEffect içinde değişmiyor

    // --- Belirli Bir Kursun Notlarını ve Detaylarını Çekmek ---
    useEffect(() => {
        if (selectedCourseIdAsInt) {
            const fetchCourseSpecificData = async () => {
                setLoadingCourseNotes(true);
                setCourseNotesError(null);
                setCourseNotes([]);
                setCurrentCourseDetails(null); // Önceki kurs bilgilerini temizle
                const token = localStorage.getItem('token');
                if (!token) {
                    setCourseNotesError("Notları getirmek için giriş yapmalısınız.");
                    setLoadingCourseNotes(false);
                    return;
                }

                try {
                    // 1. Kursun notlarını çek
                    const notesResponse = await axios.get(`https://localhost:7119/api/Notes/course/${selectedCourseIdAsInt}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    console.log(`--- CoursePage: ${selectedCourseIdAsInt} ID'li KURSUN NOTLARI ---`);
                    console.log(notesResponse.data);

                    if (Array.isArray(notesResponse.data)) {
                        const formattedNotes = notesResponse.data.map(note => ({
                            id: note.id, title: note.title,
                            courseName: note.courseName || 'Bilinmiyor', courseId: note.courseId,
                            author: note.userFullName || 'Yazar Bilinmiyor',
                            authorAvatar: note.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.userFullName || 'User')}&background=random&color=fff&rounded=true&bold=true`,
                            likes: note.likesCount || 0, commentsCount: note.commentsCount || 0,
                            date: new Date(note.publishDate || note.createdAt).toLocaleDateString('tr-TR'),
                            description: note.content || 'İçerik bulunmuyor.',
                        }));
                        setCourseNotes(formattedNotes);

                        if (formattedNotes.length > 0) {
                            setCurrentCourseDetails({ id: formattedNotes[0].courseId, name: formattedNotes[0].courseName, icon: Icons.CourseDefault });
                        } else if (topCoursesForSidebar.length > 0) {
                            const foundCourse = topCoursesForSidebar.find(c => c.id === selectedCourseIdAsInt);
                            if (foundCourse) setCurrentCourseDetails(foundCourse);
                            else setCurrentCourseDetails({ name: "Bilinmeyen Kurs", id: selectedCourseIdAsInt, icon: Icons.CourseDefault });
                        } else {
                            const fallbackCourse = allNotesForSidebar.find(note => note.courseId === selectedCourseIdAsInt);
                            if (fallbackCourse) {
                                setCurrentCourseDetails({ name: fallbackCourse.courseName, id: selectedCourseIdAsInt, icon: Icons.CourseDefault });
                            } else {
                                setCurrentCourseDetails({ name: `Kurs ID: ${selectedCourseIdAsInt}`, id: selectedCourseIdAsInt, icon: Icons.CourseDefault });
                            }
                        }

                    } else {
                        setCourseNotesError("Bu kursa ait notlar beklenen formatta değil.");
                    }
                } catch (err) {
                    console.error(`Kurs notları çekme hatası (Course ID: ${selectedCourseIdAsInt}):`, err);
                    if (err.response && err.response.status === 404) {
                        setCourseNotesError("Bu kursa ait not bulunamadı veya kurs mevcut değil.");
                        setCurrentCourseDetails({ name: "Bilinmeyen veya Boş Kurs", id: selectedCourseIdAsInt, icon: Icons.CourseDefault });
                    } else {
                        setCourseNotesError(err.response?.data?.message || err.message || "Notlar yüklenirken bir sorun oluştu.");
                    }
                } finally {
                    setLoadingCourseNotes(false);
                }
            };
            fetchCourseSpecificData();
        } else {
            setLoadingCourseNotes(false);
            setCourseNotesError("Geçerli bir kurs ID'si belirtilmedi.");
            setCurrentCourseDetails(null);
        }
    }, [selectedCourseIdAsInt, topCoursesForSidebar, allNotesForSidebar]); // Icons bağımlılığı kaldırıldı, allNotesForSidebar eklendi

    const sortedCourseNotes = useMemo(() => {
        return [...courseNotes].sort((a, b) => {
         
            const datePartsA = a.date.split('.');
            const dateA = new Date(+datePartsA[2], datePartsA[1] - 1, +datePartsA[0]);
            const datePartsB = b.date.split('.');
            const dateB = new Date(+datePartsB[2], datePartsB[1] - 1, +datePartsB[0]);
            return dateB - dateA;
        });
    }, [courseNotes]);

    const handleLike = async (e, noteId) => {  };

    if (loadingSidebarCourses && loadingCourseNotes) {
        return <div className="min-h-screen flex justify-center items-center"><p>Sayfa ve menü yükleniyor...</p></div>;
    }

    if (!selectedCourseIdAsInt && !loadingCourseNotes) { 
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-red-500 p-4">
                <p className="text-lg mb-2">Geçerli bir kurs ID'si belirtilmedi.</p>
                <Link to="/notes" className="text-indigo-600 hover:text-indigo-800">Ana Sayfaya Dön</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
               
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                           
                            Popüler Dersler
                        </h3>
                        {loadingSidebarCourses ? <p>Yükleniyor...</p> : sidebarError ? <p className="text-red-500">{sidebarError}</p> : (
                            <ul className="space-y-3">
                                <Link
                                    to="/notes"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                                >
                                    <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar
                                </Link>
                                {topCoursesForSidebar.map(course => (
                                    <Link
                                        key={course.id}
                                        to={`/course/${course.id}`}
                                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${selectedCourseIdAsInt === course.id ? 'bg-indigo-100 text-indigo-800 font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'}`}
                                    >
                                        <span className="text-xl mr-3">{course.icon || Icons.CourseDefault}</span>
                                        <span className="flex-grow text-sm">{course.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">{course.noteCount} Not</span>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

               
                <div className="lg:col-span-3 space-y-6">
                    {loadingCourseNotes && !currentCourseDetails && <div className="text-center text-gray-600 py-16"><p>Kurs bilgileri yükleniyor...</p></div> }
                    {courseNotesError && !loadingCourseNotes && (
                        <div className="text-center text-red-600 py-16 bg-white rounded-lg shadow p-4">
                            <p className="text-xl font-semibold mb-2">Hata!</p>
                            <p>{courseNotesError}</p>
                            {!currentCourseDetails && selectedCourseIdAsInt && <p className="mt-2">Belirtilen ID ({selectedCourseIdAsInt}) ile kurs bulunamadı veya notları yüklenemedi.</p>}
                            <Link to="/notes" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                                Ana Sayfaya Dön
                            </Link>
                        </div>
                    )}

                    {currentCourseDetails && !courseNotesError && (
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-6 flex items-center">
                            <span className="mr-3 text-2xl">{currentCourseDetails.icon || Icons.CourseDefault}</span>
                            {currentCourseDetails.name} Notları
                        </h2>
                    )}

                    {loadingCourseNotes && currentCourseDetails && <div className="text-center text-gray-600 py-16"><p>'{currentCourseDetails.name}' dersine ait notlar yükleniyor...</p></div>}
                    
                    {!loadingCourseNotes && !courseNotesError && currentCourseDetails && (
                        sortedCourseNotes.length > 0 ? (
                            <div className="space-y-6">
                                {sortedCourseNotes.map(note => (
                                    <div key={note.id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col">
                                        <div className="flex items-center mb-4">
                                            <img src={note.authorAvatar} alt={note.author} className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-200" />
                                            <div>
                                                <span className="text-sm font-semibold text-gray-700">{note.author}</span>
                                               
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-indigo-700 mb-2">{note.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.description}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                                            <span className="flex items-center">
                                                {Icons.Calendar} <span className="ml-1.5">{note.date}</span>
                                            </span>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={(e) => handleLike(e, note.id)}
                                                    className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                                >
                                                    {Icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes}</span>
                                                </button>
                                               
                                            </div>
                                        </div>
                                        <Link
                                            to={`/not/${note.id}`} // Not detay sayfasına yönlendirme
                                            className="mt-4 w-full text-sm text-indigo-600 font-semibold py-2.5 px-4 border-2 border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                                        >
                                            Detayı Oku
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow-lg p-4">
                                <p className="text-xl mb-2">{currentCourseDetails.icon || Icons.Note}</p>
                                <p className="font-semibold">Bu derse ait henüz not bulunmuyor.</p>
                                <p className="text-sm mt-1">Bu derse ilk notu sen paylaşarak katkıda bulunabilirsin!</p>
                               
                            </div>
                        )
                    )}
                    {!currentCourseDetails && !loadingCourseNotes && !courseNotesError && selectedCourseIdAsInt && (
                        <div className="text-center text-gray-500 py-16">Bu kursa ait detaylar yüklenemedi veya böyle bir kurs bulunmuyor.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;