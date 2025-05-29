import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LikeButton from './LikeButton'; 

const GlobalIcons = {
    Close: ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg> ),
    ChevronLeft: ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /> </svg> ),
    Calendar: ({ className = "w-5 h-5 inline-block" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12v-.008zM9.75 15h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5v-.008z" /> </svg> ),
    Image: ({ className = "w-5 h-5 inline-block" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /> </svg> ),
    PDF: ({ className = "w-5 h-5 inline-block" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /> </svg> ),
    Download: ({ className = "w-5 h-5 inline-block" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg> ),
    Info: ({ className = "w-5 h-5 inline-block" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /> </svg> ),
    BookOpen: ({ className = "w-5 h-5 inline-block" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /> </svg> )
};

export default function Detail({ noteId: noteIdFromProp, onClose, isModalMode = false, onNoteUpdated, onNoteDeleted }) {
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
                const userIdFromToken = decodedToken[nameIdentifierClaim];
                setLoggedInUserId(userIdFromToken ? parseInt(userIdFromToken, 10) : null);
                setLoggedInUserFullName(decodedToken[nameClaim] || '');
            } catch (error) { console.error("DetailPage: Token decode error:", error); setLoggedInUserId(null); setLoggedInUserFullName(''); }
        }
    }, []);

    useEffect(() => {
        const fetchNoteDetailFunc = async () => {
            if (!actualNoteId) { setNoteError('Not ID bilgisi eksik.'); setLoadingNote(false); return; }
            setLoadingNote(true); setNoteError(null);
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`https://localhost:7119/api/Notes/${actualNoteId}`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
                const fetchedNote = response.data;
                let imgUrls = [];
                if (fetchedNote.imageUrls && Array.isArray(fetchedNote.imageUrls)) { imgUrls = fetchedNote.imageUrls; } else if (fetchedNote.imageUrl) { imgUrls = [fetchedNote.imageUrl]; }
                let pdfsUrls = [];
                if (fetchedNote.pdfUrls && Array.isArray(fetchedNote.pdfUrls)) { pdfsUrls = fetchedNote.pdfUrls; } else if (fetchedNote.pdfUrl) { pdfsUrls = [fetchedNote.pdfUrl]; }

                setNoteDetail({
                    id: fetchedNote.id,
                    title: fetchedNote.title, 
                    content: fetchedNote.content || '', 
                    courseName: fetchedNote.courseName || 'Bilinmiyor',
                    courseId: fetchedNote.courseId,
                    userId: fetchedNote.userId,
                    author: fetchedNote.userFullName || 'Yazar Bilinmiyor',
                    authorAvatar: fetchedNote.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fetchedNote.userFullName || 'U')}&background=e5e7eb&color=374151&rounded=true&bold=true&size=128`, // Açık tema avatar
                    likesCount: fetchedNote.likesCount || 0,
                    isLikedByCurrentUser: fetchedNote.isLikedByCurrentUser || false,
                    currentUserLikeId: fetchedNote.currentUserLikeId || null,
                    createdAt: fetchedNote.createdAt,
                    displayDate: new Date(fetchedNote.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), 
                    imageUrls: imgUrls.filter(url => url != null && url.trim() !== ''),
                    pdfUrls: pdfsUrls.filter(url => url != null && url.trim() !== '')
                });
            } catch (err) {
                console.error("DetailPage: Not detayı çekme hatası:", err);
                if (err.response && err.response.status === 404) { setNoteError('Aradığınız not bulunamadı.'); } else { setNoteError(err.response?.data?.message || err.message || "Not detayı yüklenemedi."); }
            } finally { setLoadingNote(false); }
        };
        if (actualNoteId) { fetchNoteDetailFunc(); } else if (!isModalMode) { setNoteError('Not ID\'si URL\'de bulunamadı.'); setLoadingNote(false); }
    }, [actualNoteId, isModalMode]);

    const handleDetailLikeChange = (targetNoteId, { newLikesCount, newIsLiked, newCurrentUserLikeId }) => {
        if (noteDetail && noteDetail.id === targetNoteId) {
            setNoteDetail(prevDetails => ({ ...prevDetails, likesCount: newLikesCount, isLikedByCurrentUser: newIsLiked, currentUserLikeId: newCurrentUserLikeId }));
            if (onNoteUpdated) { onNoteUpdated(); }
        }
    };


    const renderFacebookImageGrid = (images, inModal) => {
        const count = images.length;
        const imageBaseClass = "object-cover w-full h-full"; 

        if (count === 0) return null;

        if (count === 1) {
            return (
                <a href={images[0]} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={images[0]} alt="Not Resmi 1" className="w-full h-auto max-h-[70vh] object-contain block" />
                </a>
            );
        }
        
        // Küçük resimler için tıklanabilir alan ve resim
        const renderImageLink = (url, idx, extraClass = "", isOverlayChild = false) => (
            <a href={url} target="_blank" rel="noopener noreferrer" className={`block relative ${isOverlayChild ? '' : 'bg-gray-200'} ${extraClass}`} key={idx}>
                <img src={url} alt={`Not Resmi ${idx + 1}`} className={imageBaseClass} />
            </a>
        );

        if (count === 2) {
            return (
                <div className="flex space-x-0.5">
                    {images.map((img, idx) => renderImageLink(img, idx, "aspect-[3/4]"))} {/* Ortalama bir oran */}
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="flex space-x-0.5">
                    {renderImageLink(images[0], 0, "w-2/3 aspect-[3/4]")}
                    <div className="w-1/3 flex flex-col space-y-0.5">
                        {renderImageLink(images[1], 1, "h-1/2 aspect-square")}
                        {renderImageLink(images[2], 2, "h-1/2 aspect-square")}
                    </div>
                </div>
            );
        }

        if (count === 4) {
            return (
                <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
                    {images.map((img, idx) => renderImageLink(img, idx, "aspect-square"))}
                </div>
            );
        }

        // 5 veya daha fazla resim
        const firstFour = images.slice(0, 4);
        return (
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
                {firstFour.map((img, idx) => {
                    if (idx === 3 && count > 4) { // Son gösterilen resim ve daha fazlası var
                        return (
                            <a href={images[3]} target="_blank" rel="noopener noreferrer" className="block relative bg-gray-200 aspect-square" key={idx}>
                                <img src={img} alt={`Not Resmi ${idx + 1}`} className={imageBaseClass} />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-bold">
                                    +{count - 4}
                                </div>
                            </a>
                        );
                    }
                    return renderImageLink(img, idx, "aspect-square");
                })}
            </div>
        );
    };



    const NoteContentDisplay = () => {
        if (!noteDetail) return null;

        return (
            <article className={`bg-white ${isModalMode ? 'rounded-none sm:rounded-lg' : 'rounded-lg shadow border border-gray-200'} w-full ${isModalMode ? '' : 'max-w-xl mx-auto'}`}>
         
                <header className="p-3 sm:p-4 flex items-start space-x-3">
                    <Link to={`/profil/${noteDetail.userId}`} className="flex-shrink-0">
                        <img 
                            src={noteDetail.authorAvatar} 
                            alt={noteDetail.author} 
                            className="w-10 h-10 rounded-full border border-gray-300" 
                        />
                    </Link>
                    <div className="flex-grow">
                        <Link to={`/profil/${noteDetail.userId}`} className="text-[15px] font-semibold text-gray-900 hover:underline block">
                            {noteDetail.author}
                        </Link>
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                            <span>{noteDetail.displayDate}</span>
                            {noteDetail.courseId && (
                                <>
                                    <span>·</span>
                                    <Link to={`/notes?courseId=${noteDetail.courseId}`} className="hover:underline">
                                        {noteDetail.courseName}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

               
                <section className={`px-3 sm:px-4 ${noteDetail.imageUrls.length > 0 || noteDetail.pdfUrls.length > 0 ? 'pb-2 sm:pb-3' : 'pb-3 sm:pb-4'}`}>
                    {noteDetail.title && !noteDetail.content.startsWith(noteDetail.title) && ( // Eğer başlık içerikte yoksa göster
                         <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 break-words">
                             {noteDetail.title}
                         </h1>
                    )}
                    {noteDetail.content && (
                        <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                            {noteDetail.content}
                        </div>
                    )}
                </section>
                
                
                { (noteDetail.imageUrls.length > 0 || noteDetail.pdfUrls.length > 0) && (
                    <section className="bg-white"> 
                        {noteDetail.imageUrls.length > 0 && (
                          
                            <div className="-mx-0 sm:-mx-0"> 
                               {renderFacebookImageGrid(noteDetail.imageUrls, isModalMode)}
                            </div>
                        )}

                        {noteDetail.pdfUrls.length > 0 && (
                            <div className="px-3 sm:px-4 py-3 space-y-2 border-t border-gray-200">
                                {noteDetail.pdfUrls.map((url, index) => (
                                    <a 
                                        key={index} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 hover:underline group"
                                    >
                                        <GlobalIcons.PDF className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" />
                                        PDF Belgesi {index + 1}
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Footer: Beğen Butonu */}
                {loggedInUserId && noteDetail.id && (
                    <footer className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-gray-200">
                        <LikeButton
                            noteId={noteDetail.id}
                            noteTitle={noteDetail.title}
                            initialLikesCount={noteDetail.likesCount}
                            initialIsLiked={noteDetail.isLikedByCurrentUser}
                            initialCurrentUserLikeId={noteDetail.currentUserLikeId}
                            currentUserId={loggedInUserId}
                            currentUserFullName={loggedInUserFullName}
                            onLikeStateChange={handleDetailLikeChange}
                          
                            buttonSize="sm" // Daha kompakt bir buton
                            className="text-gray-600 hover:text-blue-600" // Basit stil
                        />
                    </footer>
                )}
            </article>
        );
    };
 
    const commonCardStyles = `bg-white ${isModalMode ? 'rounded-none sm:rounded-lg' : 'rounded-lg shadow border border-gray-200'} w-full ${isModalMode ? '' : 'max-w-xl mx-auto'}`;

    if (isModalMode) {
        if (loadingNote) {
            return (
                <div className={`${commonCardStyles} p-4 animate-pulse`}>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="h-48 bg-gray-200 rounded"></div>
                </div>
            );
        }

        if (noteError || !noteDetail) {
            return (
                 <div className={`${commonCardStyles} p-6 text-center`}>
                     <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full" aria-label="Kapat">
                        <GlobalIcons.Close className="w-5 h-5" />
                    </button>
                    <GlobalIcons.Info className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-lg font-medium mb-1 text-gray-700">Bir Sorun Oluştu</p>
                    <p className="text-sm text-gray-500">{noteError || 'Not bulunamadı.'}</p>
                </div>
            );
        }
       
        return (
            <div className={`bg-white shadow-xl ${isModalMode ? 'rounded-none sm:rounded-lg w-full h-full overflow-y-auto' : 'rounded-lg w-full max-w-xl mx-auto'}`}>
                 {isModalMode && (
                     <div className="sticky top-0 bg-white z-10 px-2 py-1 border-b border-gray-200 flex items-center justify-between">
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" aria-label="Geri">
                            <GlobalIcons.ChevronLeft className="w-6 h-6" />
                        </button>
                        <span className="text-base font-semibold text-gray-700">Not Detayı</span> {/* Modal Başlığı */}
                        <div className="w-10"></div> {/* Boşluk için */}
                    </div>
                 )}
                <NoteContentDisplay />
            </div>
        );
    }

   
    const pageBg = "bg-slate-100"; 

    if (loadingNote) {
        return (
            <div className={`min-h-screen ${pageBg} py-6 sm:py-8 flex justify-center`}>
                <div className={`${commonCardStyles} p-4 animate-pulse h-fit`}>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="h-64 bg-gray-200 rounded"></div> {/* Daha uzun resim alanı */}
                    <div className="h-8 bg-gray-200 rounded w-1/4 mt-4"></div>
                </div>
            </div>
        );
    }
    if (noteError) {
        return (
            <div className={`min-h-screen ${pageBg} flex items-center justify-center px-4 py-8`}>
                <div className={`${commonCardStyles} p-6 text-center`}>
                    <GlobalIcons.Info className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Bir Sorun Oluştu</h2>
                    <p className="text-sm text-gray-600 mb-6">{noteError}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <GlobalIcons.ChevronLeft className="mr-1.5 h-4 w-4 inline" /> Geri Dön
                    </button>
                </div>
            </div>
        );
    }
    if (!noteDetail) {
        return (
            <div className={`min-h-screen ${pageBg} flex items-center justify-center px-4 py-8`}>
                 <div className={`${commonCardStyles} p-6 text-center`}>
                    <GlobalIcons.Info className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Not Bulunamadı</h2>
                    <p className="text-sm text-gray-600 mb-6">Aradığınız not mevcut değil veya kaldırılmış olabilir.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                         <GlobalIcons.ChevronLeft className="mr-1.5 h-4 w-4 inline" /> Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    return ( 
        <div className={`min-h-screen ${pageBg} py-6 sm:py-8`}>
            <div className="container mx-auto px-2 sm:px-4">
              
                <NoteContentDisplay />
            </div>
        </div>
    );
}   