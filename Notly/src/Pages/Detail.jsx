// Detail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LikeButton from './LikeButton';

const Icons = {
    Calendar: '📅',
    // Community: '👥', // Community ikonu kaldırıldı
    Note: '📄',
    ArrowLeft: '⬅️',
    CourseDefault: '📚',
};

const Detail = () => {
    const { id: noteIdFromUrl } = useParams();
    const navigate = useNavigate();

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
                console.log("DetailPage: LoggedInUser ID:", userIdFromToken, "Name:", decodedToken[nameClaim]);
            } catch (error) {
                console.error("DetailPage: Token decode error:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchNoteDetail = async () => {
            if (!noteIdFromUrl) {
                setNoteError('Not ID\'si bulunamadı.');
                setLoadingNote(false);
                return;
            }
            setLoadingNote(true);
            setNoteError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setNoteError("Not detayını görmek için giriş yapmalısınız.");
                setLoadingNote(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7119/api/Notes/${noteIdFromUrl}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log('--- DetailPage: NOT DETAYI (response.data) ---');
                console.log(response.data);

                const fetchedNote = response.data;
                setNoteDetail({
                    id: fetchedNote.id,
                    title: fetchedNote.title,
                    course: fetchedNote.courseName || 'Bilinmiyor',
                    courseId: fetchedNote.courseId,
                    author: fetchedNote.userFullName || 'Yazar Bilinmiyor',
                    authorAvatar: fetchedNote.userProfilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fetchedNote.userFullName || 'User')}&background=random&color=fff&rounded=true&bold=true`,
                    likesCount: fetchedNote.likesCount || 0,
                    isLikedByCurrentUser: fetchedNote.isLikedByCurrentUser || false,
                    currentUserLikeId: fetchedNote.currentUserLikeId || null,
                    date: new Date(fetchedNote.createdAt || fetchedNote.publishDate).toLocaleDateString('tr-TR'),
                    description: fetchedNote.content || 'İçerik bulunmuyor.',
                });

            } catch (err) {
                console.error("Not detayı çekme hatası:", err);
                if (err.response && err.response.status === 404) {
                    setNoteError('Üzgünüz, aradığınız not bulunamadı.');
                } else {
                    setNoteError(err.response?.data?.message || err.message || "Not detayı yüklenirken bir sorun oluştu.");
                }
            } finally {
                setLoadingNote(false);
            }
        };

        fetchNoteDetail();
    }, [noteIdFromUrl]);

    useEffect(() => {
        const fetchAllNotesAndDeriveTopCoursesForSidebar = async () => {
            setLoadingSidebar(true);
            setSidebarError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setSidebarError("Popüler dersleri görmek için giriş yapmalısınız.");
                setLoadingSidebar(false);
                return;
            }

            try {
                const response = await axios.get('https://localhost:7119/api/Notes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (Array.isArray(response.data)) {
                    const allNotes = response.data.map(note => ({
                        courseId: note.courseId,
                        courseName: note.courseName || 'Bilinmiyor',
                    }));
                    setTotalNotesCountForSidebar(allNotes.length);
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
                    setSidebarError("Popüler dersler için veri formatı yanlış.");
                }
            } catch (err) {
                setSidebarError("Popüler dersler menüsü yüklenemedi.");
            } finally {
                setLoadingSidebar(false);
            }
        };
        fetchAllNotesAndDeriveTopCoursesForSidebar();
    }, []);

    const handleGoBack = () => {
        navigate(-1);
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

    const renderSidebar = () => (
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                {/* <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span>  SİMGE KULLANIMI KALDIRILDI */}
                Popüler Dersler
            </h3>
            {loadingSidebar ? <p>Yükleniyor...</p> : sidebarError ? <p className="text-red-500 text-sm">{sidebarError}</p> : (
                <ul className="space-y-3">
                    <Link
                        to="/notes"
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                    >
                        <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({totalNotesCountForSidebar})
                    </Link>
                    {topCoursesForSidebar.map(course => (
                        <Link
                            key={course.id}
                            to={`/notes?courseId=${course.id}`}
                            className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                                noteDetail?.courseId === course.id
                                ? 'bg-indigo-100 text-indigo-800 font-bold'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'
                            }`}
                        >
                            <span className="text-xl mr-3">{course.icon || Icons.CourseDefault}</span>
                            <span className="flex-grow text-sm">{course.name}</span>
                            {typeof course.noteCount === 'number' && (
                                <span className="text-xs text-gray-500 ml-2">{course.noteCount} Not</span>
                            )}
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    {renderSidebar()}
                </div>
                <div className="lg:col-span-3 space-y-6">
                    {loadingNote ? (
                        <div className="text-center text-gray-600 py-16"><p>Not detayı yükleniyor...</p></div>
                    ) : noteError || !noteDetail ? (
                        <div className="text-center text-red-600 py-16 bg-white rounded-lg shadow">
                            <p className="text-xl font-semibold mb-2">Hata!</p>
                            <p>{noteError || 'Not bulunamadı veya yüklenemedi.'}</p>
                            <button
                                onClick={() => navigate('/notes')}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <span className="mr-2">{Icons.ArrowLeft}</span> Not Akışına Dön
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <button
                                    onClick={handleGoBack}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Geri Dön
                                </button>
                            </div>
                            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
                                <div className="flex items-center border-b border-gray-100 pb-4">
                                    <img src={noteDetail.authorAvatar} alt={noteDetail.author} className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-200" />
                                    <div>
                                        <span className="text-md font-semibold text-gray-700">{noteDetail.author}</span>
                                        <p className="text-sm text-gray-500">{noteDetail.course}</p>
                                    </div>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">{noteDetail.title}</h1>
                                <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">{noteDetail.description}</p>
                                <div className="flex justify-start items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                                    <span className="flex items-center mr-6">
                                        {Icons.Calendar} <span className="ml-1.5">{noteDetail.date}</span>
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
                                        />
                                    )}
                                </div>
                                {noteDetail && noteDetail.id && (
                                    <div className="mt-10">
                                        {/* Yorumlar buraya gelebilir */}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Detail;