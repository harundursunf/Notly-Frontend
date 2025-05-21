import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LikeButton from './LikeButton';

// Global ikon bileşenleri (SVG ile çizilmiş)
const GlobalIcons = {
    Close: ({ className = "w-6 h-6" }) => (
        // Kapatma (X) ikonu
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    ChevronLeft: ({ className = "w-5 h-5" }) => (
        // Geri ok ikonu
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    ),
};

// Ana bileşen: Not detay sayfası veya modal olarak gösterilebilir
export default function Detail({ noteId: noteIdFromProp, onClose, isModalMode = false }) {
    const { id: noteIdFromUrl } = useParams();
    const navigate = useNavigate();
    const actualNoteId = noteIdFromProp || noteIdFromUrl; // Props ile geldiyse onu kullan, yoksa URL'den al

    // Not verileri ve durumları
    const [noteDetail, setNoteDetail] = useState(null);
    const [loadingNote, setLoadingNote] = useState(true);
    const [noteError, setNoteError] = useState(null);

    // Giriş yapan kullanıcı bilgileri
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loggedInUserFullName, setLoggedInUserFullName] = useState('');

    // Sidebar için top kurslar (opsiyonel)
    const [topCoursesForSidebar, setTopCoursesForSidebar] = useState([]);
    const [loadingSidebar, setLoadingSidebar] = useState(true);
    const [sidebarError, setSidebarError] = useState(null);
    const [totalNotesCountForSidebar, setTotalNotesCountForSidebar] = useState(0);

    // Sayfa yüklendiğinde kullanıcı token'ı çözülür
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
            } catch (error) {
                console.error("DetailPage: Token decode error:", error);
            }
        }
    }, []);

    // Not detayları API'den çekilir
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

                // Not detayları state'e set edilir
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

    // Beğeni durumu değiştiğinde güncellenir
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

    // Not içeriği gösterimi (JSX)
    const NoteContentDisplay = () => (
        <div className={`space-y-6 ${isModalMode ? 'pt-8 sm:pt-4' : 'pt-0'}`}>
            {/* Yazar bilgileri */}
            <div className="flex items-center border-b border-slate-200 pb-4 sm:pb-5">
                <img src={noteDetail.authorAvatar} alt={noteDetail.author} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full mr-3.5 sm:mr-4 border-2 border-indigo-100 object-cover shadow-sm" />
                <div>
                    <span className="text-md font-semibold text-slate-800">{noteDetail.author}</span>
                    <p className="text-sm text-slate-500">{noteDetail.course}</p>
                </div>
            </div>

            {/* Başlık */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{noteDetail.title}</h1>

            {/* Açıklama */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {noteDetail.description}
            </div>

            {/* Tarih ve beğeni */}
            <div className="flex flex-wrap gap-y-3 gap-x-5 justify-start items-center text-sm text-slate-500 pt-4 sm:pt-5 border-t border-slate-200">
                <span className="flex items-center">
                    {/* Takvim ikonu eksik tanımlı */}
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
        </div>
    );

    // Modal modunda gösterim
    if (isModalMode) {
        if (loadingNote) {
            return <div className="bg-white p-10 rounded-xl shadow-2xl text-center w-full max-w-md mx-auto"><p className="text-slate-600">Not detayı yükleniyor...</p></div>;
        }

        if (noteError || !noteDetail) {
            return (
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center w-full max-w-md mx-auto relative">
                    <button onClick={onClose} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600" aria-label="Kapat">
                        <GlobalIcons.Close className="w-5 h-5" />
                    </button>
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

   
    return null; 
}
