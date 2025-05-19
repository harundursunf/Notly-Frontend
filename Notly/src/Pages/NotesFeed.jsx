import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import ShareNote from './ShareNote';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const NotesFeed = () => {
    const [isCreatingNote, setIsCreatingNote] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState(null);

    const [topCoursesAsCommunities, setTopCoursesAsCommunities] = useState([]);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState(null); 

    const Icons = {
        Calendar: '📅',
        ThumbUp: '👍',
        Comment: '💬', 
        Community: '👥', 
        Note: '📄',
        PlusCircle: '➕',
        CourseDefault: '📚', 
    };

    const fetchNotes = async (token) => {
        setLoadingNotes(true);
        setNotesError(null);
        setTopCoursesAsCommunities([]); 

        try {
            const response = await axios.get('https://localhost:7119/api/Notes', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            console.log('--- NotesFeed: BACKEND\'DEN GELEN TÜM NOTLAR (response.data) ---');
            console.log(response.data);

            if (Array.isArray(response.data)) {
                const notesFromApi = response.data;
                const formattedNotes = notesFromApi.map(note => ({
                    id: note.id,
                    title: note.title,
                    courseName: note.courseName || 'Bilinmiyor',
                    courseId: note.courseId, 
                    communityId: note.communityId || null, 
                    author: note.userFullName || 'Yazar Bilinmiyor',
                    authorAvatar: note.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.userFullName || 'User')}&background=random&color=fff&rounded=true&bold=true`,
                    likes: note.likesCount || 0,
                    commentsCount: note.commentsCount || 0,
                    date: new Date(note.publishDate || note.createdAt).toLocaleDateString('tr-TR'), 
                    description: note.content || note.description || 'İçerik bulunmuyor.',
                }));
                setNotes(formattedNotes);
                const courseCounts = formattedNotes.reduce((acc, note) => {
                    if (note.courseId && note.courseName && note.courseName !== 'Bilinmiyor') {
                        acc[note.courseId] = acc[note.courseId] || {
                            id: note.courseId,
                            name: note.courseName,
                            noteCount: 0,
                            icon: Icons.CourseDefault
                        };
                        acc[note.courseId].noteCount++;
                    }
                    return acc;
                }, {});

                const derivedCourses = Object.values(courseCounts)
                    .sort((a, b) => b.noteCount - a.noteCount)
                    .slice(0, 5);
                setTopCoursesAsCommunities(derivedCourses);
                // --- Top 5 Kursu Hesaplama Sonu ---

            } else {
                console.error('NotesFeed: Notlar beklenmeyen formatta geldi:', response.data);
                setNotes([]);
                setNotesError("Notlar yüklenemedi (format hatası).");
            }
        } catch (err) {
            console.error('NotesFeed: Notları Çekme Hatası:', err);
            setNotes([]);
            if (axios.isAxiosError(err) && err.response) {
                const backendError = err.response.data;
                console.error('NotesFeed: Backend Hata Detayı (Notları Çekerken):', backendError);
                setNotesError(backendError.message || backendError.title || 'Notlar yüklenirken bir hata oluştu.');
            } else {
                setNotesError('Notlar yüklenirken beklenmedik bir sorun oluştu veya sunucuya ulaşılamadı.');
            }
        } finally {
            setLoadingNotes(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                jwtDecode(token);
                fetchNotes(token);
            } catch (error) {
                console.error("NotesFeed: Invalid token:", error);
                setNotesError("Geçersiz kimlik doğrulama tokenı. Lütfen tekrar giriş yapın.");
                setLoadingNotes(false);
            }
        } else {
            setNotesError("Notları görmek için giriş yapmanız gerekiyor.");
            setLoadingNotes(false);
        }
    }, []);

    const handleNoteShared = (newNoteResponse) => {
        console.log("NotesFeed: Yeni not paylaşıldı (backend response):", newNoteResponse);
        
        const formattedNewNote = {
            id: newNoteResponse.id,
            title: newNoteResponse.title,
            courseName: newNoteResponse.courseName || 'Bilinmiyor',
            courseId: newNoteResponse.courseId,
            communityId: newNoteResponse.communityId || null,
            author: newNoteResponse.userFullName || 'Yazar Bilinmiyor',
            authorAvatar: newNoteResponse.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newNoteResponse.userFullName || 'User')}&background=random&color=fff&rounded=true&bold=true`,
            likes: newNoteResponse.likesCount || 0,
            commentsCount: newNoteResponse.commentsCount || 0,
            date: new Date(newNoteResponse.createdAt || newNoteResponse.publishDate).toLocaleDateString('tr-TR'),
            description: newNoteResponse.content || newNoteResponse.description || 'İçerik bulunmuyor.',
        };
        setNotes(prevNotes => [formattedNewNote, ...prevNotes]);
    
        fetchNotes(localStorage.getItem('token')); // Veya sadece topCoursesAsCommunities'i yeniden hesapla
        setIsCreatingNote(false);
    };

    // Notları filtrele ve sırala
    const displayedNotes = useMemo(() => {
        let AFilteredNotes = notes;
        if (selectedCourseFilter) {
            AFilteredNotes = notes.filter(note => note.courseId === selectedCourseFilter);
        }
        return [...AFilteredNotes].sort((a, b) => {
         
            const dateA = new Date(a.date.split('.').reverse().join('-')); // DD.MM.YYYY -> YYYY-MM-DD varsayımıyla
            const dateB = new Date(b.date.split('.').reverse().join('-'));
            return dateB - dateA;
        });
    }, [notes, selectedCourseFilter]);

    const handleLike = async (e, noteId) => { /* ... (NotesFeed'deki handleLike güncellenmeli, Community.js'deki gibi API call yapmalı) ... */ };
    const handleCommentClick = (e, noteId) => { /* ... (Mevcut haliyle kalabilir) ... */ };
    const handleCreateNoteClick = () => setIsCreatingNote(true);
    const handleCancelCreateNote = () => setIsCreatingNote(false);

    const communitiesForShareNote = topCoursesAsCommunities.map(tc => ({id: tc.id, name: tc.name}));


    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sol Sütun: Artık Top Kurslar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                            <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span> Popüler Dersler
                        </h3>
                        {loadingNotes ? <p>Yükleniyor...</p> : (
                            <ul className="space-y-3">
                                <button
                                    onClick={() => setSelectedCourseFilter(null)}
                                    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${!selectedCourseFilter ? 'bg-indigo-100 text-indigo-800 font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'}`}
                                >
                                    <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({notes.length})
                                </button>
                                {topCoursesAsCommunities.map(course => (
                                    <button
                                        key={course.id} // courseId
                                        onClick={() => setSelectedCourseFilter(course.id)}
                                        className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${selectedCourseFilter === course.id ? 'bg-indigo-100 text-indigo-800 font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'}`}
                                    >
                                        <span className="text-xl mr-3">{course.icon}</span>
                                        <span className="flex-grow text-sm text-left">{course.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">{course.noteCount} Not</span>
                                    </button>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Sağ Sütun: Not Akışı veya Not Oluşturma Formu */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                            {isCreatingNote ? 'Yeni Not Oluştur' : 
                             selectedCourseFilter ? topCoursesAsCommunities.find(c => c.id === selectedCourseFilter)?.name + ' Notları' : 'Son Paylaşımlar'}
                        </h2>
                        {/* ... (Profil ve Not Oluştur/İptal butonları aynı kalabilir) ... */}
                         <div className="flex items-center space-x-3">
                             {!isCreatingNote && (
                                 <Link
                                     to="/profile"
                                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                 >
                                     Profil
                                 </Link>
                             )}
                             {!isCreatingNote ? (
                                 <button
                                     onClick={handleCreateNoteClick}
                                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                 >
                                     <span className="mr-2 text-lg">{Icons.PlusCircle}</span> Not Oluştur
                                 </button>
                             ) : (
                                 <button
                                     onClick={handleCancelCreateNote}
                                     className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                 >
                                     İptal
                                 </button>
                             )}
                         </div>
                    </div>

                    {loadingNotes && <div className="text-center text-gray-600 py-16"><p>Notlar yükleniyor...</p></div>}
                    {notesError && <div className="text-center text-red-600 py-16"><p>Hata: {notesError}</p></div>}
                    
                    {!loadingNotes && !notesError && !isCreatingNote && (
                        displayedNotes.length > 0 ? (
                            <div className="space-y-6">
                                {displayedNotes.map(note => (
                                   // Not kartı JSX'i aynı kalabilir
                                   <div key={note.id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col">
                                       <div className="flex items-center mb-4">
                                           <img src={note.authorAvatar} alt={note.author} className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-200" />
                                           <div>
                                               <span className="text-sm font-semibold text-gray-700">{note.author}</span>
                                               <p className="text-xs text-gray-500">{note.courseName}</p> {/* courseName olarak güncelledim */}
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
                                                    onClick={(e) => handleLike(e, note.id)} // Bu fonksiyonu API call yapacak şekilde güncellemeniz gerek
                                                    className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                                >
                                                    {Icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes}</span>
                                                </button>
                                                
                                           </div>
                                       </div>
                                       <Link
                                           to={`/not/${note.id}`}
                                           className="mt-4 w-full text-sm text-indigo-600 font-semibold py-2.5 px-4 border-2 border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                                       >
                                           Detayı Oku
                                       </Link>
                                   </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow-lg">
                                <p className="text-xl mb-2">{Icons.Note}</p>
                                <p className="font-semibold">
                                    {selectedCourseFilter ? "Bu derse ait henüz not paylaşılmamış." : "Henüz hiç not paylaşılmamış."}
                                </p>
                                <p className="text-sm mt-1">İlk notunu paylaşarak bu alanı canlandır!</p>
                            </div>
                        )
                    )}

                    {isCreatingNote && (
                        <ShareNote
                            setIsCreatingNote={setIsCreatingNote}
                            onNoteShared={handleNoteShared}
                            onCancel={handleCancelCreateNote}
                     
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesFeed;