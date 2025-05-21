import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ShareNote from './ShareNote';
import Detail from './Detail';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from '../Components/notes/Header'; // Header.jsx yolunuzu kontrol edin

const NotesFeed = () => {
    const [isCreatingNote, setIsCreatingNote] = useState(false);
    const [viewingNoteId, setViewingNoteId] = useState(null);

    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState(null);
    const [sidebarError, setSidebarError] = useState(null);

    const [topCoursesAsCommunities, setTopCoursesAsCommunities] = useState([]);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState(null); 
    
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const Icons = {
        Calendar: '📅',
        ThumbUp: '👍',
        Community: '👥', 
        Note: '📄',
        PlusCircle: '➕', 
        CourseDefault: '📚', 
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const courseIdFromUrl = queryParams.get('courseId');
        if (courseIdFromUrl) {
            setSelectedCourseFilter(parseInt(courseIdFromUrl, 10));
        }
    }, [location.search]);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const nameClaimValue = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Kullanıcı';
                const userIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const userId = decodedToken[userIdClaim];

                if (userId) {
                    const fetchUserDetailsForHeader = async () => {
                        try {
                            const response = await axios.get(`https://localhost:7119/api/Users/${userId}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const userDataFromApi = response.data;
                            setCurrentUser({
                                name: userDataFromApi.fullName || nameClaimValue,
                                avatarUrl: userDataFromApi.profilePictureUrl || 
                                           `https://ui-avatars.com/api/?name=${encodeURIComponent(userDataFromApi.fullName || nameClaimValue)}&background=random&color=fff&rounded=true&bold=true&size=128`
                            });
                        } catch (apiError) {
                            console.error("NotesFeed: Header için kullanıcı detayları çekilemedi, token verileri kullanılacak:", apiError);
                            setCurrentUser({
                                name: nameClaimValue,
                                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameClaimValue)}&background=random&color=fff&rounded=true&bold=true&size=128`
                            });
                        }
                    };
                    fetchUserDetailsForHeader();
                } else {
                    console.warn("NotesFeed: Header için token'da kullanıcı ID'si bulunamadı.");
                    setCurrentUser({
                        name: nameClaimValue,
                        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameClaimValue)}&background=random&color=fff&rounded=true&bold=true&size=128`
                    });
                }
            } catch (error) {
                console.error("NotesFeed: Token decode hatası (currentUser için):", error);
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    }, []);

    const fetchNotes = async (token) => {
        setLoadingNotes(true);
        setNotesError(null);
        setSidebarError(null);

        try {
            const response = await axios.get('https://localhost:7119/api/Notes', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (Array.isArray(response.data)) {
                const notesFromApi = response.data;
                const formattedNotes = notesFromApi.map(note => ({
                    id: note.id,
                    title: note.title,
                    courseName: note.courseName || 'Bilinmiyor',
                    courseId: note.courseId, 
                    userId: note.userId,
                    author: note.userFullName || 'Yazar Bilinmiyor',
                    authorAvatar: note.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.userFullName || 'U')}&background=random&color=fff&rounded=true&bold=true&size=128`,
                    likes: note.likesCount || 0,
                    commentsCount: note.commentsCount || 0, // Backend'den geliyorsa
                    date: new Date(note.publishDate || note.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }), 
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
                    .slice(0, 7); 
                setTopCoursesAsCommunities(derivedCourses);
            } else {
                setNotes([]);
                setTopCoursesAsCommunities([]);
                const errMsg = "Notlar yüklenemedi (beklenmedik format).";
                setNotesError(errMsg);
                setSidebarError("Popüler dersler için veri formatı hatalı.");
            }
        } catch (err) {
            console.error('NotesFeed: Notları Çekme Hatası:', err);
            setNotes([]);
            setTopCoursesAsCommunities([]);
            let mainErrorMsg = 'Notlar yüklenemedi veya sunucuya ulaşılamadı.';
            if (axios.isAxiosError(err) && err.response) {
                const backendError = err.response.data;
                mainErrorMsg = backendError?.message || backendError?.title || 'Notlar yüklenirken bir sunucu hatası oluştu.';
            }
            setNotesError(mainErrorMsg);
            setSidebarError("Popüler dersler listesi yüklenemedi.");
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
                console.error("NotesFeed: Geçersiz token veya fetch hatası:", error);
                setNotesError("Oturumunuz geçersiz veya bir sorun oluştu. Lütfen tekrar giriş yapın.");
                setSidebarError("Oturumunuz geçersiz olduğu için popüler dersler yüklenemedi.");
                setLoadingNotes(false);
                // navigate('/login'); // Opsiyonel: Hata durumunda login'e yönlendirme
            }
        } else {
            setNotesError("Notları görmek için giriş yapmanız gerekiyor.");
            setSidebarError("Popüler dersleri görmek için giriş yapmanız gerekiyor.");
            setLoadingNotes(false);
            // navigate('/login'); // Opsiyonel: Token yoksa login'e yönlendirme
        }
    }, []);

    const handleNoteShared = (newNoteResponse) => {
        fetchNotes(localStorage.getItem('token'));
    };

    const displayedNotes = useMemo(() => {
        let notesToDisplay = notes;
        if (selectedCourseFilter) {
            notesToDisplay = notes.filter(note => note.courseId === selectedCourseFilter);
        }
        return [...notesToDisplay].sort((a, b) => {
            try {
                const datePartsA = a.date.split('.');
                const dateA = new Date(+datePartsA[2], +datePartsA[1] - 1, +datePartsA[0]);
                const datePartsB = b.date.split('.');
                const dateB = new Date(+datePartsB[2], +datePartsB[1] - 1, +datePartsB[0]);
                return dateB.getTime() - dateA.getTime();
            } catch (e) { return 0; }
        });
    }, [notes, selectedCourseFilter]);

    const handleLikeNoteCard = async (noteId) => {
        console.log(`NotesFeed: Not ${noteId} için beğenme işlemi (API call yapılacak).`);
        
    };
    
    const handleOpenShareNoteModal = () => setIsCreatingNote(true);
    const handleCloseShareNoteModal = () => setIsCreatingNote(false);
    const handleOpenDetailModal = (noteId) => setViewingNoteId(noteId);
    const handleCloseDetailModal = () => setViewingNoteId(null);

    const stickySidebarTopOffset = "top-[calc(4rem+1.5rem)]"; 

    const handleCourseFilterClick = (courseId) => {
        setSelectedCourseFilter(courseId);
        if (courseId) {
            navigate(`/notes?courseId=${courseId}`, { replace: true });
        } else {
            navigate('/notes', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header
                logoSrc="/logo3.jpg" 
                siteName="NotEvreni" 
                isCreatingNote={isCreatingNote}
                onCreateNoteClick={handleOpenShareNoteModal}
                onCancelCreateNote={handleCloseShareNoteModal}
                profilePath="/profile"
                user={currentUser} // Güncellenmiş currentUser bilgisi Header'a iletiliyor
                icons={Icons} 
            />

            <main className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                            {selectedCourseFilter && !isCreatingNote ? 
                                (topCoursesAsCommunities.find(c => c.id === selectedCourseFilter)?.name || 'Ders') + ' Notları' 
                                : 'Son Paylaşımlar'}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        <aside className="lg:col-span-3 xl:col-span-3">
                            <div className={`bg-white rounded-xl shadow-lg p-5 md:p-6 sticky ${stickySidebarTopOffset}`}>
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-5 flex items-center">
                                    <span className="text-indigo-500 mr-2.5 text-2xl">{Icons.Community}</span> Popüler Dersler
                                </h2>
                                {loadingNotes && !topCoursesAsCommunities.length && !sidebarError ? (
                                    <div className="space-y-3">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : sidebarError && !topCoursesAsCommunities.length ? (
                                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{sidebarError}</p>
                                 ) : (
                                    <ul className="space-y-2.5">
                                        <li>
                                            <button
                                                onClick={() => handleCourseFilterClick(null)}
                                                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left ${!selectedCourseFilter ? 'bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700' : 'bg-slate-100 hover:bg-indigo-100 text-slate-700 font-medium hover:text-indigo-700'}`}
                                            >
                                                <span className={`text-xl mr-3 ${!selectedCourseFilter ? 'text-indigo-200' : 'text-slate-400'}`}>{Icons.Note}</span>
                                                <span className="flex-grow text-sm">Tüm Notlar</span>
                                                <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-full ${!selectedCourseFilter ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{notes.length}</span>
                                            </button>
                                        </li>
                                        {topCoursesAsCommunities.map(course => (
                                            <li key={course.id}>
                                                <button
                                                    onClick={() => handleCourseFilterClick(course.id)}
                                                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left ${selectedCourseFilter === course.id ? 'bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700' : 'bg-slate-100 hover:bg-indigo-100 text-slate-700 font-medium hover:text-indigo-700'}`}
                                                >
                                                    <span className={`text-xl mr-3 ${selectedCourseFilter === course.id ? 'text-indigo-200' : 'text-slate-400'}`}>{course.icon || Icons.CourseDefault}</span>
                                                    <span className="flex-grow text-sm truncate" title={course.name}>{course.name}</span>
                                                    <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-full ${selectedCourseFilter === course.id ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{course.noteCount}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </aside>

                        <section className="lg:col-span-9 xl:col-span-9 space-y-6">
                            {loadingNotes && displayedNotes.length === 0 && !notesError ? (
                                <div className="space-y-6">
                                    {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                                        <div className="flex items-center mb-4"><div className="w-11 h-11 rounded-full bg-slate-200 mr-3.5"></div><div><div className="h-4 bg-slate-200 rounded w-24 mb-1.5"></div><div className="h-3 bg-slate-200 rounded w-16"></div></div></div>
                                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2.5"></div><div className="h-4 bg-slate-200 rounded w-full mb-1"></div><div className="h-4 bg-slate-200 rounded w-5/6 mb-1"></div><div className="h-4 bg-slate-200 rounded w-4/6 mb-4"></div><div className="h-10 bg-slate-200 rounded-lg mt-5"></div>
                                    </div>
                                    ))}
                                </div>
                            ) : notesError && displayedNotes.length === 0 ? (
                                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-6 rounded-lg text-center shadow"><p><strong className="font-semibold">Hata:</strong> {notesError}</p></div>
                            ) : (!loadingNotes && !notesError && displayedNotes.length === 0) ? (
                                <div className="text-center text-slate-600 py-16 bg-white rounded-xl shadow-lg border border-slate-200/80">
                                    <p className="text-4xl mb-4 text-slate-400">{Icons.Note}</p>
                                    <p className="font-semibold text-lg text-slate-700">
                                        {selectedCourseFilter ? "Bu derse ait henüz not paylaşılmamış." : "Henüz hiç not paylaşılmamış."}
                                    </p>
                                    <p className="text-sm mt-2">İlk notu sen paylaşarak bu alanı canlandırabilirsin!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {displayedNotes.map(note => (
                                        <article key={note.id} className="bg-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out border border-slate-200/80 flex flex-col transform hover:-translate-y-1">
                                            <div className="flex items-center mb-4">
                                                <img src={note.authorAvatar} alt={note.author} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full mr-3.5 border-2 border-indigo-100 object-cover shadow-sm" />
                                                <div>
                                                    <Link to={`/profil/${note.userId}`} className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors block">{note.author}</Link>
                                                    <Link to={`/notes?courseId=${note.courseId}`} className="text-xs text-slate-500 hover:text-indigo-600 transition-colors block">{note.courseName}</Link>
                                                </div>
                                            </div>
                                            <h2 className="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 hover:text-indigo-800 transition-colors">
                                                <button onClick={() => handleOpenDetailModal(note.id)} className="text-left hover:underline focus:outline-none">{note.title}</button>
                                            </h2>
                                            <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed flex-grow">{note.description}</p>
                                            <div className="flex flex-wrap gap-y-2 justify-between items-center text-xs text-slate-500 pt-3.5 border-t border-slate-100 mt-auto">
                                                <span className="flex items-center">
                                                    <span className="text-base mr-1">{Icons.Calendar}</span> {note.date}
                                                </span>
                                                <button
                                                    onClick={() => handleLikeNoteCard(note.id)}
                                                    className="flex items-center text-slate-500 hover:text-red-500 transition-colors duration-200 focus:outline-none group"
                                                    title="Beğen"
                                                >
                                                    <span className="text-base group-hover:text-red-500 transition-colors">{Icons.ThumbUp}</span> 
                                                    <span className="ml-1 font-medium group-hover:text-red-500 transition-colors">{note.likes}</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleOpenDetailModal(note.id)}
                                                className="mt-5 block w-full text-sm text-indigo-600 font-semibold py-2.5 px-4 border-2 border-indigo-500 rounded-lg hover:bg-indigo-600 hover:text-white text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transform hover:scale-[1.01]"
                                            >
                                                Detayı Oku
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            {isCreatingNote && (
                <div 
                    className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out animate-fadeIn"
                    onClick={handleCloseShareNoteModal} 
                >
                    <div 
                        className="w-full animate-modalShow"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <ShareNote
                            onNoteShared={handleNoteShared} 
                            onCancel={handleCloseShareNoteModal}
                        />
                    </div>
                </div>
            )}

            {viewingNoteId && (
                <div 
                    className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 md:p-8 transition-opacity duration-300 ease-in-out animate-fadeIn"
                    onClick={handleCloseDetailModal}
                >
                    <div 
                        className="w-full animate-modalShow"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Detail 
                            noteId={viewingNoteId} 
                            onClose={handleCloseDetailModal}
                            isModalMode={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesFeed;
