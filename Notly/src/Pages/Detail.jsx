import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LikeButton from './LikeButton';

// --- Configuration ---
const API_URL = "https://localhost:7119/api";

const GlobalIcons = {
    Close: ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>),
    ChevronLeft: ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /> </svg>),
    CarouselLeft: ({ className = "w-8 h-8" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>),
    CarouselRight: ({ className = "w-8 h-8" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>),
    PDF: ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>),
};

export default function Detail({ noteId: noteIdFromProp, onClose, isModalMode = false, onNoteUpdated }) {
    const { id: noteIdFromUrl } = useParams();
    const navigate = useNavigate();
    const actualNoteId = noteIdFromProp || noteIdFromUrl;

    const [noteDetail, setNoteDetail] = useState(null);
    const [loadingNote, setLoadingNote] = useState(true);
    const [noteError, setNoteError] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loggedInUserFullName, setLoggedInUserFullName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const nameIdentifierClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                setLoggedInUserId(decodedToken[nameIdentifierClaim] ? parseInt(decodedToken[nameIdentifierClaim], 10) : null);
                setLoggedInUserFullName(decodedToken[nameClaim] || '');
            } catch (error) { console.error("DetailPage: Token decode error:", error); }
        }
    }, []);

    const fetchNoteDetailFunc = useCallback(async () => {
        if (!actualNoteId) {
            setNoteError('Gösterilecek Not ID bilgisi eksik.');
            setLoadingNote(false);
            return;
        }
        setLoadingNote(true);
        setNoteError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/Notes/${actualNoteId}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const fetchedNote = response.data;
            const authorName = fetchedNote.userFullName || 'Yazar Bilinmiyor';
            const authorAvatar = fetchedNote.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName === 'Yazar Bilinmiyor' ? 'U' : authorName)}&background=random`;

            setNoteDetail({
                ...fetchedNote,
                author: authorName,
                userProfilePictureUrl: authorAvatar,
                displayDate: new Date(fetchedNote.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                imageUrls: fetchedNote.imageUrls || fetchedNote.imageUrl || [],
                pdfUrls: fetchedNote.pdfUrls || fetchedNote.pdfUrl || [],
            });
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Not detayı yüklenemedi.";
            setNoteError(errorMsg);
        } finally {
            setLoadingNote(false);
        }
    }, [actualNoteId]);

    useEffect(() => {
        fetchNoteDetailFunc();
    }, [fetchNoteDetailFunc]);

    const handleDetailLikeChange = (targetNoteId, { newLikesCount, newIsLiked, newCurrentUserLikeId }) => {
        if (noteDetail?.id === targetNoteId) {
            setNoteDetail(prev => ({
                ...prev,
                likesCount: newLikesCount,
                isLikedByCurrentUser: newIsLiked,
                currentUserLikeId: newCurrentUserLikeId
            }));
            if (onNoteUpdated) {
                onNoteUpdated(targetNoteId, { newLikesCount, newIsLiked });
            }
        }
    };

    const ImageCarousel = ({ imageUrls }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const goToPrevious = () => setCurrentIndex(prev => (prev === 0 ? imageUrls.length - 1 : prev - 1));
        const goToNext = () => setCurrentIndex(prev => (prev === imageUrls.length - 1 ? 0 : prev + 1));
        if (!imageUrls || imageUrls.length === 0) return null;

        return (
            <div className="relative w-full h-full bg-transparent group flex items-center justify-center">
                <a href={imageUrls[currentIndex]} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center">
                    <img src={imageUrls[currentIndex]} alt={`Not Resmi ${currentIndex + 1}`} className="max-w-full max-h-full object-contain" />
                </a>
                {imageUrls.length > 1 && (
                    <>
                        <button onClick={goToPrevious} className="absolute top-1/2 left-3 -translate-y-1/2 bg-gray-900/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><GlobalIcons.CarouselLeft /></button>
                        <button onClick={goToNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-gray-900/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><GlobalIcons.CarouselRight /></button>
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{currentIndex + 1} / {imageUrls.length}</div>
                    </>
                )}
            </div>
        );
    };

    const NoteContentDisplay = () => {
        if (!noteDetail) return null;
        const { title, content, imageUrls, pdfUrls, userProfilePictureUrl, author, userId, displayDate, courseName, courseId, likesCount } = noteDetail;
        const hasImages = imageUrls && imageUrls.length > 0;

        return (
            <div className={`flex flex-col lg:flex-row w-full max-h-full bg-white ${isModalMode ? 'h-full rounded-lg shadow-2xl' : 'min-h-[70vh] rounded-lg shadow-xl border border-slate-200'} overflow-hidden`}>
                {hasImages && (
                    <div className="w-full lg:w-3/5 xl:w-2/3 h-80 lg:h-auto bg-slate-100">
                        <ImageCarousel imageUrls={imageUrls} />
                    </div>
                )}
                <div className={`w-full ${hasImages ? 'lg:w-2/5 xl:w-1/3' : 'w-full'} flex flex-col`}>
                    {/* DEĞİŞİKLİK: İç padding p-5'e, öğeler arası dikey boşluk space-y-4'e düşürüldü. */}
                    <div className="flex-grow p-5 space-y-4 overflow-y-auto">
                        <header className="flex items-start gap-3">
                            <Link to={`/profil/${userId}`} className="flex-shrink-0">
                                <img src={userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(author === 'Yazar Bilinmiyor' ? 'U' : author)}&background=random`} alt={author} className="w-11 h-11 rounded-full object-cover" />
                            </Link>
                            <div className="flex-grow">
                                <Link to={`/profil/${userId}`} className="font-bold text-slate-800 hover:underline block leading-tight">{author}</Link>
                                <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                                    {courseName && courseName !== 'Bilinmiyor' && (
                                        <Link to={`/notes?courseId=${courseId}`} className="hover:underline">{courseName}</Link>
                                    )}
                                    {courseName && courseName !== 'Bilinmiyor' && <span>·</span>}
                                    <span>{displayDate}</span>
                                </div>
                            </div>
                        </header>

                        {/* DEĞİŞİKLİK: hr'ın dikey boşluğu my-3 yapıldı. */}
                        <hr className="my-3" />

                        <section>
                            <h1 className="text-xl font-bold text-slate-900 mb-2 break-words">{title || "Başlıksız Not"}</h1> {/* text-2xl -> text-xl, mb-3 -> mb-2 */}
                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{content}</p> {/* text-slate-700, text-sm, leading-relaxed */}
                        </section>

                        {pdfUrls.length > 0 && (
                            <section className="space-y-1.5 pt-1"> {/* space-y-2 -> space-y-1.5, pt-2 -> pt-1 */}
                                <h3 className="font-semibold text-slate-600 text-xs mb-1.5">Ekli Dosyalar:</h3> {/* text-sm -> text-xs */}
                                {pdfUrls.map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-all"> {/* gap-3 -> gap-2, p-2.5 -> p-2 */}
                                        <GlobalIcons.PDF className="w-5 h-5 flex-shrink-0 text-red-500" /> {/* w-6 h-6 -> w-5 h-5 */}
                                        <span className="font-medium text-xs text-blue-600 group-hover:underline truncate">{`PDF Belgesi ${index + 1}`}</span> {/* text-sm -> text-xs */}
                                    </a>
                                ))}
                            </section>
                        )}
                    </div>

                    {loggedInUserId && noteDetail.id && (
                        <footer className="p-3 border-t border-slate-200 bg-white mt-auto flex-shrink-0"> {/* p-4 -> p-3 */}
                            <div className="flex items-center justify-between">
                                <LikeButton
                                    noteId={noteDetail.id}
                                    noteTitle={noteDetail.title}
                                    initialLikesCount={noteDetail.likesCount}
                                    initialIsLiked={noteDetail.isLikedByCurrentUser}
                                    initialCurrentUserLikeId={noteDetail.currentUserLikeId}
                                    onLikeStateChange={handleDetailLikeChange}
                                    currentUserId={loggedInUserId}
                                    currentUserFullName={loggedInUserFullName}
                                />
                                {likesCount > 0 && <span className="text-xs font-medium text-slate-500">{likesCount} beğeni</span>} {/* text-sm -> text-xs */}
                            </div>
                        </footer>
                    )}
                </div>
            </div>
        );
    };

    if (loadingNote) return <div className="w-full h-full flex items-center justify-center bg-white rounded-lg"><p>Yükleniyor...</p></div>;
    if (noteError) return <div className="w-full h-full flex items-center justify-center bg-white rounded-lg p-4"><p className="text-red-600 text-center">{noteError}</p></div>;
    if (!noteDetail) return <div className="w-full h-full flex items-center justify-center bg-white rounded-lg"><p>Not bulunamadı.</p></div>;

    if (isModalMode) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8" onClick={onClose}>
                <div className="relative w-full max-w-4xl h-full max-h-[60vh] flex" onClick={(e) => e.stopPropagation()}>
                    <NoteContentDisplay />
                    <button onClick={onClose} className="absolute top-2 right-2 p-1.5 text-gray-500 bg-white/50 hover:bg-gray-200/80 rounded-full transition-all z-10" aria-label="Kapat">
                        <GlobalIcons.Close className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                        <GlobalIcons.ChevronLeft /> Geri Dön
                    </button>
                </div>
                <NoteContentDisplay />
            </div>
        </div>
    );
}