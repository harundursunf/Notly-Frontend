import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LikeButton from './LikeButton';

const GlobalIcons = {
    Calendar: '📅',
    Note: '📄',
    ArrowLeft: '⬅️',
    CourseDefault: '📚',
    Close: ({ className = "w-6 h-6" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    ChevronLeft: ({ className = "w-5 h-5" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    ),
};

export default function Detail({ noteId: noteIdFromProp, onClose, isModalMode = false }) {
    const { id: noteIdFromUrl } = useParams();
    const navigate = useNavigate();
    const actualNoteId = noteIdFromProp || noteIdFromUrl;

    const [noteDetail, setNoteDetail] = useState(null);
    const [loadingNote, setLoadingNote] = useState(true);
    const [noteError, setNoteError] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loggedInUserFullName, setLoggedInUserFullName] = useState('');

    const [topCoursesForSidebar, setTopCoursesForSidebar] = useState([]);
    const [loadingSidebar, setLoadingSidebar] = useState(true);
    const [sidebarError, setSidebarError] = useState(null);
    const [totalNotesCountForSidebar, setTotalNotesCountForSidebar] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const nameIdentifierClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                const userIdFromToken = decodedToken[nameIdentifierClaim];
                setLoggedInUserId(userIdFromToken ? parseInt(userIdFromToken, 10) : null);
                setLoggedInUserFullName(decodedToken[nameClaim] || '');
            } catch (error) { console.error("DetailPage: Token decode error:", error); }
        }
    }, []);

    useEffect(() => {
        const fetchNoteDetailFunc = async () => {
            if (!actualNoteId) {
                setNoteError('Not ID bilgisi eksik.');
                setLoadingNote(false);
                return;
            }
            setLoadingNote(true);
            setNoteError(null);
            const token = localStorage.getItem('token');
            if (!token && !isModalMode) {
                setNoteError("Not detayını görmek için giriş yapmalısınız.");
                setLoadingNote(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7119/api/Notes/${actualNoteId}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const fetchedNote = response.data;
                setNoteDetail({
                    id: fetchedNote.id,
                    title: fetchedNote.title,
                    course: fetchedNote.courseName || 'Bilinmiyor',
                    courseId: fetchedNote.courseId,
                    author: fetchedNote.userFullName || 'Yazar Bilinmiyor',
                    authorAvatar: fetchedNote.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fetchedNote.userFullName || 'U')}&background=random&color=fff&rounded=true&bold=true&size=128`,
                    likesCount: fetchedNote.likesCount || 0,
                    isLikedByCurrentUser: fetchedNote.isLikedByCurrentUser || false,
                    currentUserLikeId: fetchedNote.currentUserLikeId || null,
                    date: new Date(fetchedNote.createdAt || fetchedNote.publishDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    description: fetchedNote.content || 'İçerik bulunmuyor.',
                });
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setNoteError('Aradığınız not bulunamadı.');
                } else {
                    setNoteError(err.response?.data?.message || err.message || "Not detayı yüklenemedi.");
                }
            } finally {
                setLoadingNote(false);
            }
        };

        if (actualNoteId) {
            fetchNoteDetailFunc();
        } else if (!isModalMode) {
            setNoteError('Not ID\'si URL\'de bulunamadı.');
            setLoadingNote(false);
        }
    }, [actualNoteId, isModalMode]);

    useEffect(() => {
        const fetchSidebarDataFunc = async () => {
            setLoadingSidebar(true);
            setSidebarError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setSidebarError("Popüler dersleri görmek için giriş yapın.");
                setLoadingSidebar(false); return;
            }
            try {
                const response = await axios.get('https://localhost:7119/api/Notes', { headers: { 'Authorization': `Bearer ${token}` }});
                if (Array.isArray(response.data)) {
                    const allNotes = response.data.map(note => ({ courseId: note.courseId, courseName: note.courseName || 'Bilinmiyor' }));
                    setTotalNotesCountForSidebar(allNotes.length);
                    const courseCounts = allNotes.reduce((acc, note) => {
                         if (note.courseId && note.courseName && note.courseName !== 'Bilinmiyor') {
                             acc[note.courseId] = acc[note.courseId] || { id: note.courseId, name: note.courseName, noteCount: 0, icon: GlobalIcons.CourseDefault };
                             acc[note.courseId].noteCount++;
                         } return acc;
                    }, {});
                    const derivedCourses = Object.values(courseCounts).sort((a, b) => b.noteCount - a.noteCount).slice(0, 5);
                    setTopCoursesForSidebar(derivedCourses);
                } else { setSidebarError("Veri formatı yanlış."); }
            } catch (err) { setSidebarError("Kenar çubuğu yüklenemedi."); } 
            finally { setLoadingSidebar(false); }
        };

        if (!isModalMode) {
            fetchSidebarDataFunc();
        } else {
            setLoadingSidebar(false);
        }
    }, [isModalMode]);

    const handleGoBackOrClose = () => {
        if (isModalMode && onClose) {
            onClose();
        } else {
            navigate(-1);
        }
    };
    
    const handleDetailLikeChange = (targetNoteId, { newLikesCount, newIsLiked, newCurrentUserLikeId }) => {
        if (noteDetail && noteDetail.id === targetNoteId) {
            setNoteDetail(prevDetails => ({
                ...prevDetails,
                likesCount: newLikesCount,
                isLikedByCurrentUser: newIsLiked,
                currentUserLikeId: newCurrentUserLikeId
            }));
        }
    };

    const renderActualSidebar = () => (
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 sticky top-24">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-5 flex items-center">
                Popüler Dersler
            </h3>
            {loadingSidebar ? <p className="text-sm text-slate-500">Yükleniyor...</p> : sidebarError ? <p className="text-red-500 text-sm">{sidebarError}</p> : (
                <ul className="space-y-2.5">
                    <li>
                        <Link
                            to="/notes"
                            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 bg-slate-50 hover:bg-indigo-50 text-slate-700 font-medium hover:text-indigo-700`}
                        >
                            <span className={`text-xl mr-3 text-slate-400`}>{GlobalIcons.Note}</span>
                            <span className="flex-grow text-sm text-left">Tüm Notlar</span>
                            <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600`}>{totalNotesCountForSidebar}</span>
                        </Link>
                    </li>
                    {topCoursesForSidebar.map(course => (
                        <li key={course.id}>
                            <Link
                                to={`/notes?courseId=${course.id}`}
                                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                                    noteDetail?.courseId === course.id
                                    ? 'bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700'
                                    : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 font-medium hover:text-indigo-700'
                                }`}
                            >
                                <span className={`text-xl mr-3 ${noteDetail?.courseId === course.id ? 'text-indigo-200' : 'text-slate-400'}`}>{course.icon || GlobalIcons.CourseDefault}</span>
                                <span className="flex-grow text-sm text-left truncate" title={course.name}>{course.name}</span>
                                {typeof course.noteCount === 'number' && (
                                    <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-full ${noteDetail?.courseId === course.id ? 'bg-indigo-400 text-white' : 'bg-slate-200 text-slate-600'}`}>{course.noteCount} Not</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    const NoteContentDisplay = () => (
        <div className={`space-y-6 ${isModalMode ? 'pt-8 sm:pt-4' : 'pt-0'}`}>
            <div className="flex items-center border-b border-slate-200 pb-4 sm:pb-5">
                <img src={noteDetail.authorAvatar} alt={noteDetail.author} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full mr-3.5 sm:mr-4 border-2 border-indigo-100 object-cover shadow-sm" />
                <div>
                    <span className="text-md font-semibold text-slate-800">{noteDetail.author}</span>
                    <p className="text-sm text-slate-500">{noteDetail.course}</p>
                </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{noteDetail.title}</h1>
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {noteDetail.description}
            </div>
            <div className="flex flex-wrap gap-y-3 gap-x-5 justify-start items-center text-sm text-slate-500 pt-4 sm:pt-5 border-t border-slate-200">
                <span className="flex items-center">
                    <span className="text-lg mr-1.5">{GlobalIcons.Calendar}</span> {noteDetail.date}
                </span>
                {loggedInUserId && noteDetail.id && (
                    <LikeButton
                        noteId={noteDetail.id}
                        noteTitle={noteDetail.title}
                        initialLikesCount={noteDetail.likesCount}
                        initialIsLiked={noteDetail.isLikedByCurrentUser}
                        initialCurrentUserLikeId={noteDetail.currentUserLikeId}
                        currentUserId={loggedInUserId}
                        currentUserFullName={loggedInUserFullName}
                        onLikeStateChange={handleDetailLikeChange}
                        buttonSize="md"
                    />
                )}
            </div>
            {/* YORUMLAR BÖLÜMÜ KALDIRILDI */}
        </div>
    );
    
    if (isModalMode) {
        if (loadingNote) {
            return <div className="bg-white p-10 rounded-xl shadow-2xl text-center w-full max-w-md mx-auto"><p className="text-slate-600">Not detayı yükleniyor...</p></div>;
        }
        if (noteError || !noteDetail) {
            return (
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-md mx-auto relative">
                    <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600" aria-label="Kapat"> <GlobalIcons.Close className="w-5 h-5"/> </button>
                    <p className="text-xl font-semibold mb-3 text-red-600">Hata!</p>
                    <p className="text-slate-700">{noteError || 'Not bulunamadı.'}</p>
                </div>
            );
        }
        return (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto max-h-[85vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
                    aria-label="Kapat"
                >
                    <GlobalIcons.Close className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <NoteContentDisplay />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                <aside className="lg:col-span-1">
                    {renderActualSidebar()} 
                </aside>
                <main className="lg:col-span-3 space-y-6">
                    {loadingNote ? (
                        <div className="text-center text-slate-600 py-16 bg-white p-8 rounded-xl shadow-lg"><p>Not detayı yükleniyor...</p></div>
                    ) : noteError || !noteDetail ? (
                        <div className="text-center text-red-600 py-16 bg-white p-8 rounded-xl shadow-lg">
                            <p className="text-2xl font-semibold mb-3">Bir Sorun Oluştu</p>
                            <p className="text-slate-700">{noteError || 'Not bulunamadı veya yüklenemedi.'}</p>
                            <button
                                onClick={() => navigate('/notes')}
                                className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <GlobalIcons.ChevronLeft className="w-5 h-5 mr-1.5" /> Not Akışına Dön
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-2">
                                <button
                                    onClick={handleGoBackOrClose}
                                    className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg shadow-sm text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200"
                                >
                                    <GlobalIcons.ChevronLeft className="w-5 h-5 mr-2 text-slate-500" />
                                    Geri Dön
                                </button>
                            </div>
                            <article className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200/80">
                                <NoteContentDisplay />
                            </article>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}   