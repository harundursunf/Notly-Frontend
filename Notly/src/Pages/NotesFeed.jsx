import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Bileşenler (Header, FilterPanel, ShareNote, Detail kendi dosyalarından import ediliyor)
import Header from '../Components/notes/Header';
import FilterPanel from '../Components/FilterPanel'; // Bu hala ayrı bir bileşen olarak kalacak ve sidebar içinde kullanılacak
import ShareNote from './ShareNote';
import Detail from './Detail';

// Reklam Paneli (Bu da ayrı bir bileşen olarak kalabilir ve grid'de kullanılır)
const AdvertisementPanel = () => (
    <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-[calc(4rem+2rem)] space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-5 text-center border border-dashed border-slate-300">
                <h3 className="text-lg font-bold text-slate-700 mb-2">Reklam Alanı</h3>
                <p className="text-sm text-slate-500 mb-4">Platformumuzda binlerce öğrenciye ulaşın!</p>
                <a href="mailto:reklam@notevreni.com" className="inline-block bg-emerald-500 text-white font-bold text-sm py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all">Bilgi Al</a>
            </div>
        </div>
    </aside>
);

const NotesFeed = () => {
    // --- STATE'LER ---
    const [isCreatingNote, setIsCreatingNote] = useState(false);
    const [viewingNoteId, setViewingNoteId] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [notesError, setNotesError] = useState(null);
    const [sidebarError, setSidebarError] = useState(null);
    const [topCoursesAsCommunities, setTopCoursesAsCommunities] = useState([]);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();

    const Icons = { Calendar: '📅', ThumbUp: '👍', CourseDefault: '📚', PDF: '📝', Article: '📑', Image: '🖼️' };

    // PDF ismini URL'den çıkaran yardımcı fonksiyon (NoteCard'dan buraya taşındı)
    const getPdfNameFromUrl = (url) => {
        try {
            const pathSegments = new URL(url).pathname.split('/');
            return decodeURIComponent(pathSegments[pathSegments.length - 1]);
        } catch (e) {
            const fallbackName = url.substring(url.lastIndexOf('/') + 1);
            return decodeURIComponent(fallbackName) || `PDF Dosyası`;
        }
    };

    // --- FONKSİYONLAR VE VERİ ÇEKME MANTIĞI ---
    const fetchNotes = useCallback(async (token) => {
        setLoadingNotes(true);
        setNotesError(null);
        setSidebarError(null);
        try {
            const response = await axios.get('https://localhost:7119/api/Notes', { headers: { 'Authorization': `Bearer ${token}` } });
            if (Array.isArray(response.data)) {
                const notesFromApi = response.data;
                const formattedNotes = notesFromApi.map(note => ({
                    id: note.id,
                    title: note.title,
                    courseName: note.courseName || 'Bilinmiyor',
                    courseId: note.courseId,
                    userId: note.userId,
                    author: note.userFullName || 'Yazar Bilinmiyor',
                    authorAvatar: note.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(note.userFullName || 'U')}&background=random&color=fff&rounded=true`,
                    likes: note.likesCount || 0,
                    isLikedByCurrentUser: note.isLikedByCurrentUser || false,
                    currentUserLikeId: note.currentUserLikeId || null,
                    commentsCount: note.commentsCount || 0, // Bu alanı ekledik
                    date: new Date(note.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }),
                    description: note.content || 'İçerik bulunmuyor.',
                    imageUrls: (note.imageUrl && Array.isArray(note.imageUrl)) ? note.imageUrl : [],
                    pdfUrls: (note.pdfUrl && Array.isArray(note.pdfUrl)) ? note.pdfUrl : [],
                    createdAt: note.createdAt,
                }));
                setNotes(formattedNotes);

                const courseCounts = formattedNotes.reduce((acc, note) => {
                    if (note.courseId && note.courseName && note.courseName !== 'Bilinmiyor') {
                        acc[note.courseId] = acc[note.courseId] || { id: note.courseId, name: note.courseName, noteCount: 0, icon: Icons.CourseDefault };
                        acc[note.courseId].noteCount++;
                    }
                    return acc;
                }, {});
                setTopCoursesAsCommunities(Object.values(courseCounts).sort((a, b) => b.noteCount - a.noteCount).slice(0, 7));
            }
        } catch (err) {
            console.error('NotesFeed: Notları Çekme Hatası:', err);
            let mainErrorMsg = 'Notlar yüklenemedi veya sunucuya ulaşılamadı.';
            if (err.response?.status === 401) mainErrorMsg = "Oturumunuz zaman aşımına uğramış veya geçersiz. Lütfen tekrar giriş yapın.";
            setNotesError(mainErrorMsg);
            setSidebarError("Popüler dersler listesi yüklenemedi.");
        } finally {
            setLoadingNotes(false);
        }
    }, [Icons.CourseDefault]);

    const handleLikeDislikeNote = async (note) => {
        const token = localStorage.getItem('token');
        if (!token || !currentUser?.id) {
            setNotesError("Beğeni işlemi için giriş yapmalısınız.");
            return;
        }

        const originalNotes = [...notes];
        const newIsLiked = !note.isLikedByCurrentUser;
        const newLikesCount = newIsLiked ? note.likes + 1 : note.likes - 1;

        setNotes(prev => prev.map(n => n.id === note.id ? { ...n, likes: newLikesCount, isLikedByCurrentUser: newIsLiked } : n));

        try {
            if (newIsLiked) {
                const payload = {
                    userId: parseInt(currentUser.id, 10),
                    noteId: note.id,
                    noteTitle: note.title,
                    userFullName: currentUser.name 
                };
                const response = await axios.post('https://localhost:7119/api/Likes', payload, { headers: { 'Authorization': `Bearer ${token}` } });
                setNotes(prev => prev.map(n => n.id === note.id ? { ...n, currentUserLikeId: response.data.id } : n));
            } else {
                if (note.currentUserLikeId) {
                    await axios.delete(`https://localhost:7119/api/Likes/${note.currentUserLikeId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, currentUserLikeId: null } : n));
                } else {
                    console.error("Like ID eksik, sunucudan taze veri çekiliyor.");
                    await fetchNotes(token); // Güvenlik önlemi olarak notları yeniden çek
                }
            }
        } catch (err) {
            console.error('Beğeni Hatası:', err.response?.data || err.message);
            setNotes(originalNotes);
            setNotesError("Beğeni işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };
    
    // --- useEffect HOOK'LARI ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const courseId = params.get('courseId');
        setSelectedCourseFilter(courseId ? parseInt(courseId, 10) : null);
    }, [location.search]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
                const nameClaimValue = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Kullanıcı';

                if (userId) {
                    const fetchUserDetails = async () => {
                        try {
                            const response = await axios.get(`https://localhost:7119/api/Users/${userId}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            const userData = response.data;
                            setCurrentUser({
                                id: userId,
                                name: userData.fullName || nameClaimValue, // API'den gelen fullName'i önceliklendir
                                avatarUrl: userData.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || nameClaimValue)}&background=random&color=fff&rounded=true`
                            });
                        } catch (apiError) {
                            console.error("Kullanıcı detayları çekilemedi, token verileri kullanılacak:", apiError);
                            setCurrentUser({ // Fallback to token data if API call fails
                                id: userId,
                                name: nameClaimValue,
                                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameClaimValue)}&background=random&color=fff&rounded=true`
                            });
                        }
                    };
                    fetchUserDetails();
                } else { // userId yoksa sadece token'dan gelen name ile devam et
                     setCurrentUser({
                        id: null, // ID yok
                        name: nameClaimValue,
                        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameClaimValue)}&background=random&color=fff&rounded=true`
                    });
                }
            } catch (error) {
                console.error("Token decode hatası veya kullanıcı bilgisi çekme hatası:", error);
                setCurrentUser(null); // Hata durumunda currentUser'ı null yap
            }
        } else {
            setCurrentUser(null); // Token yoksa currentUser null
        }
    }, []); // Bağımlılık listesi boş, sadece component mount olduğunda çalışır

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchNotes(token);
        } else {
            setNotesError("Notları görmek için giriş yapmanız gerekiyor.");
            setSidebarError("Popüler dersleri görmek için giriş yapmanız gerekiyor.");
            setLoadingNotes(false);
        }
    }, [fetchNotes]);

    const displayedNotes = useMemo(() => {
        return notes
            .filter(note => selectedCourseFilter ? note.courseId === selectedCourseFilter : true)
            .filter(note => searchTerm ? note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || note.author.toLowerCase().includes(searchTerm.toLowerCase()): true)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [notes, selectedCourseFilter, searchTerm]);

    const handleCourseFilterClick = (courseId) => {
        setSelectedCourseFilter(courseId);
        setSearchTerm('');
        navigate(courseId ? `/notes?courseId=${courseId}` : '/notes', { replace: true });
    };

    const handleNoteShared = () => {
        fetchNotes(localStorage.getItem('token'));
        setIsCreatingNote(false);
    };
    
    const stickySidebarTopOffset = "top-[calc(4rem+1.5rem)]"; // Header yüksekliği + boşluk

    // --- RENDER (RETURN) ---
    return (
        <div className="min-h-screen bg-slate-100"> {/* Arka plan rengi daha yumuşak slate-100 */}
            <Header user={currentUser} onCreateNoteClick={() => setIsCreatingNote(true)} />
            
            <main className="max-w-screen-xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    
                    {/* === SOL KENAR ÇUBUĞU (SIDEBAR) === */}
                    <aside className="lg:col-span-3">
                        <div className={`sticky ${stickySidebarTopOffset} space-y-6`}>
                            <FilterPanel 
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                placeholder="Not veya ders ara..."
                            />
                            
                            <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 border border-slate-200/60">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">
                                    Popüler Dersler
                                </h2>
                                {loadingNotes && !topCoursesAsCommunities.length ? (
                                    <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>)}</div>
                                ) : sidebarError ? (
                                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{sidebarError}</p>
                                ) : topCoursesAsCommunities.length === 0 && !loadingNotes? (
                                    <p className="text-sm text-slate-500">Popüler ders bulunmuyor.</p>
                                ) : (
                                    <ul className="space-y-2.5">
                                        <li>
                                            <button onClick={() => handleCourseFilterClick(null)} className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-200 text-left ${!selectedCourseFilter ? 'bg-indigo-600 text-white font-semibold shadow-lg' : 'bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700'}`}>
                                                <span className="flex-grow text-sm">Tüm Notlar</span>
                                                <span className={`text-xs ml-2 px-2.5 py-1 rounded-full ${!selectedCourseFilter ? 'bg-indigo-500' : 'bg-slate-200 text-slate-600'}`}>{notes.length}</span>
                                            </button>
                                        </li>
                                        {topCoursesAsCommunities.map(course => (
                                            <li key={course.id}>
                                                <button onClick={() => handleCourseFilterClick(course.id)} className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-200 text-left ${selectedCourseFilter === course.id ? 'bg-indigo-600 text-white font-semibold shadow-lg' : 'bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700'}`}>
                                                    <span className={`text-xl mr-3 ${selectedCourseFilter === course.id ? 'text-indigo-200' : 'text-slate-400'}`}>{course.icon || Icons.CourseDefault}</span>
                                                    <span className="flex-grow text-sm truncate" title={course.name}>{course.name}</span>
                                                    <span className={`text-xs ml-2 px-2.5 py-1 rounded-full ${selectedCourseFilter === course.id ? 'bg-indigo-500' : 'bg-slate-200 text-slate-600'}`}>{course.noteCount}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* === ANA İÇERİK BÖLÜMÜ === */}
                    <section className="lg:col-span-6 space-y-6">
                     {/* === Not Paylaşma Alanı (Güncellenmiş Hali) === */}
                        <div className="bg-white rounded-xl shadow-lg p-4 transition-shadow hover:shadow-xl duration-200"> {/* Orijinal stilinize daha yakın */}
                            <div className="flex items-center space-x-4">
                                {currentUser && (
                                    <img
                                        src={currentUser.avatarUrl}
                                        alt={currentUser.name}
                                        className="w-11 h-11 rounded-full object-cover shadow-sm"
                                    />
                                )}
                                <button
                                    onClick={() => setIsCreatingNote(true)}
                                    className="flex-grow text-left bg-slate-100 hover:bg-slate-200 transition-colors duration-200 text-slate-500 font-medium py-3 px-4 rounded-full cursor-pointer" /* Orijinal stilinize daha yakın */
                                >
                                    Bir not, soru veya dosya paylaş...
                                </button>
                            </div>
                            {/* --- YENİ EKLENEN BÖLÜM --- */}
                            <div className="border-t border-slate-200 my-4"></div>
                            <div className="flex justify-around items-center">
                                <button 
                                    onClick={() => setIsCreatingNote(true)} 
                                    className="flex items-center space-x-2 text-slate-600 hover:bg-green-50 hover:text-green-600 py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-xl text-green-500">{Icons.PDF}</span> {/* PDF ikonu */}
                                    <span className="font-medium text-sm">PDF</span>
                                </button>
                                <button 
                                    onClick={() => setIsCreatingNote(true)} 
                                    className="flex items-center space-x-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-xl text-blue-500">{Icons.Image}</span> {/* Image ikonu */}
                                    <span className="font-medium text-sm">Fotoğraf</span>
                                </button>
                                <button 
                                    onClick={() => setIsCreatingNote(true)} 
                                    className="flex items-center space-x-2 text-slate-600 hover:bg-orange-50 hover:text-orange-600 py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-xl text-orange-500">{Icons.Article}</span> {/* Article ikonu */}
                                    <span className="font-medium text-sm">Yazı Yaz</span>
                                </button>
                            </div>
                            {/* --- YENİ EKLENEN BÖLÜM SONU --- */}
                        </div>
                        {/* Notların Listesi */}
                        {loadingNotes && displayedNotes.length === 0 ? (
                             <div className="space-y-6">{[...Array(3)].map((_, i) => (<div key={i} className="bg-white p-6 rounded-2xl shadow-md animate-pulse h-72 border border-slate-200"></div>))}</div>
                        ) : notesError ? (
                            <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center shadow border border-red-200"><strong>Hata:</strong> {notesError}</div>
                        ) : displayedNotes.length === 0 ? (
                            <div className="text-center text-slate-500 py-24 bg-white rounded-2xl shadow-md border border-slate-200/80">
                                <p className="font-semibold text-xl text-slate-700">Hiç Not Bulunamadı</p>
                                <p className="text-base mt-2.5">{searchTerm ? 'Arama kriterlerinize uygun not bulunamadı.' : 'Bu toplulukta ilk notu sen paylaş!'}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {displayedNotes.map(note => (
                                    // === NOT KARTI (ESKİ NoteCard'ın İÇERİĞİ) ===
                                    <article key={note.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-slate-200/80 flex flex-col transform hover:-translate-y-0.5">
                                        <div className="flex items-center mb-4">
                                            <img src={note.authorAvatar} alt={note.author} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-100 object-cover shadow" />
                                            <div>
                                                <Link to={`/profil/${note.userId}`} className="text-base font-bold text-slate-800 hover:text-indigo-600 transition-colors block leading-tight">{note.author}</Link>
                                                <Link to={`/notes?courseId=${note.courseId}`} className="text-sm text-slate-500 hover:text-indigo-500 transition-colors block">{note.courseName}</Link>
                                            </div>
                                        </div>
                                        <div className="flex-grow mb-4">
                                            <h2 className="text-xl font-bold text-slate-900 mb-2.5 hover:text-indigo-700 transition-colors">
                                                <button onClick={() => setViewingNoteId(note.id)} className="text-left hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded-sm">{note.title}</button>
                                            </h2>
                                            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{note.description}</p>
                                        </div>
                                        {note.imageUrls && note.imageUrls.length > 0 && (
                                            <div className="my-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                                {note.imageUrls.slice(0, 4).map((url, index) => (
                                                    <button key={index} onClick={() => setViewingNoteId(note.id)} className="focus:outline-none block group relative aspect-w-1 aspect-h-1">
                                                        <img src={url} alt={`Not için resim ${index + 1}`} className="w-full h-full object-cover rounded-xl shadow-md border group-hover:opacity-80 transition-opacity" />
                                                        {index === 3 && note.imageUrls.length > 4 && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl"><span className="text-white font-bold text-2xl">+{note.imageUrls.length - 4}</span></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {note.pdfUrls && note.pdfUrls.length > 0 && (
                                            <div className="my-4 space-y-3">
                                                {note.pdfUrls.map((url, index) => (
                                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 transition-colors group" title={getPdfNameFromUrl(url)}>
                                                        <span className="text-2xl mr-3.5 text-red-500">{Icons.PDF}</span>
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 truncate">{getPdfNameFromUrl(url)}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-sm text-slate-500 pt-4 border-t border-slate-200/80 mt-auto">
                                            <span className="flex items-center gap-2">
                                                <span className="text-lg text-slate-400">{Icons.Calendar}</span>{note.date}
                                            </span>
                                            <button onClick={() => handleLikeDislikeNote(note)} className={`flex items-center transition-all duration-200 focus:outline-none group rounded-full px-3.5 py-2 -my-2 -mr-2 ${note.isLikedByCurrentUser ? 'text-red-600 bg-red-100/80 hover:bg-red-100' : 'text-slate-500 hover:text-red-500 hover:bg-red-100/50'}`} title={note.isLikedByCurrentUser ? "Beğeniyi Geri Al" : "Beğen"}>
                                                <span className={`text-xl transition-transform duration-200 ease-out transform ${note.isLikedByCurrentUser ? 'scale-110' : 'group-hover:scale-110'}`}>{Icons.ThumbUp}</span>
                                                <span className="ml-2 font-semibold">{note.likes}</span>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                    
                    <AdvertisementPanel />
                </div>
            </main>

            {/* Modallar */}
            {isCreatingNote && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsCreatingNote(false)}>
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
                        <ShareNote onNoteShared={handleNoteShared} onCancel={() => setIsCreatingNote(false)} />
                    </div>
                </div>
            )}
            {viewingNoteId && (
                 <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8" onClick={() => setViewingNoteId(null)}>
                     <div className="w-full max-w-5xl h-full max-h-[90vh] bg-transparent" onClick={e => e.stopPropagation()}> {/* Arka planı Detail'e bırak */}
                        <Detail noteId={viewingNoteId} onClose={() => setViewingNoteId(null)} isModalMode={true} onNoteUpdated={() => fetchNotes(localStorage.getItem('token'))} onNoteDeleted={() => { fetchNotes(localStorage.getItem('token')); setViewingNoteId(null); }} />
                     </div>
                 </div>
            )}
        </div>
    );
};

export default NotesFeed;