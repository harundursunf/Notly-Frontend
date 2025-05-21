import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import ProfileHeader from '../Components/profile/ProfileHeader';
import UserPostsSection from '../Components/profile/UserPostsSection';
import UserLikesSection from '../Components/profile/UserLikesSection';
import UserCoursesSection from '../Components/profile/UserCoursesSection';
import EditProfileDetails from '../Components/profile/EditProfileDetails';

// --- YENİ İKON TANIMLAMALARI ---
const IconGrid = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
);

const IconHeart = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const IconAcademicCap = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
);


const Profile = () => {
    const navigate = useNavigate();

    const initialUserState = {
        id: null,
        name: 'Yükleniyor...',
        username: 'Yükleniyor...',
        university: 'Yükleniyor...',
        department: 'Yükleniyor...',
        bio: 'Biyografi yükleniyor...',
        avatar: 'https://ui-avatars.com/api/?name=L&background=cccccc&color=fff&font-size=0.5&bold=true&length=1&rounded=true',
    };

    const [user, setUser] = useState(initialUserState);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [pageLoadError, setPageLoadError] = useState('');
    const [avatarError, setAvatarError] = useState('');
    const [avatarSuccess, setAvatarSuccess] = useState('');
    const [courseError, setCourseError] = useState('');
    const [noteDeletionError, setNoteDeletionError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [isDeletingCourse, setIsDeletingCourse] = useState(false);
    const [isDeletingNoteId, setIsDeletingNoteId] = useState(null);
    const fileInputRef = useRef(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [postedNotes, setPostedNotes] = useState([]);
    const [userLikedNotes, setUserLikedNotes] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const Icons = {
       
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(initialUserState);
        setLoggedInUserId(null);
        setEnrolledCourses([]);
        setPostedNotes([]);
        setUserLikedNotes([]);
        setPageLoadError('');
        setAvatarError('');
        setAvatarSuccess('');
        setCourseError('');
        setNoteDeletionError('');
        setIsEditingProfile(false);
        setActiveTab('posts');
        setSelectedFile(null);
        setUploadingAvatar(false);
        navigate('/login');
    };

    const fetchUserDetails = async (userId, token) => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`https://localhost:7119/api/Users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(prevUser => ({
                ...prevUser,
                id: prevUser.id || userId,
                username: response.data.username || prevUser.username || 'Kullanıcı Adı Yok',
                name: response.data.fullName || prevUser.name || 'İsim Yok',
                university: response.data.university || 'Bilinmiyor',
                bio: response.data.bio || 'Biyografi bulunmuyor.',
                department: response.data.department || 'Bilinmiyor',
                avatar: response.data.profilePictureUrl || prevUser.avatar,
            }));
        } catch (err) {
            console.error('Kullanıcı Detayları Hatası:', err);
            let message = 'Kullanıcı detayları çekilirken bir hata oluştu.';
            if (axios.isAxiosError(err) && err.response) {
                message = err.response.data?.message || err.response.data?.title || message;
            } else if (axios.isAxiosError(err) && err.request) {
                message = 'Sunucuya ulaşılamadı.';
            }
            setPageLoadError(prev => prev ? `${prev}\n${message}`.trim() : message);
            setUser(prevUser => ({ ...prevUser, university: 'Yüklenemedi', bio: 'Yüklenemedi', department: 'Yüklenemedi' }));
        }
    };

    const fetchUserCourses = async (userId, token) => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`https://localhost:7119/api/Courses/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                setEnrolledCourses(response.data);
            } else {
                setEnrolledCourses([]);
                setPageLoadError(prev => prev ? `${prev}\nKullanıcı dersleri formatı hatalı.`.trim() : 'Kullanıcı dersleri formatı hatalı.');
            }
        } catch (err) {
            console.error('Kullanıcı Dersleri Hatası:', err);
            setEnrolledCourses([]);
            setPageLoadError(prev => prev ? `${prev}\nDersler yüklenemedi.`.trim() : 'Dersler yüklenemedi.');
        }
    };

    const fetchPostedNotes = async (userId, token) => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`https://localhost:7119/api/Notes/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                const formattedNotes = response.data.map(note => ({
                    id: note.id,
                    title: note.title,
                    likes: note.likesCount || 0,
                    date: new Date(note.publishDate || note.createdAt).toLocaleDateString('tr-TR'),
                    course: note.courseName || 'Bilinmiyor',
                }));
                setPostedNotes(formattedNotes);
            } else {
                setPostedNotes([]);
                setPageLoadError(prev => prev ? `${prev}\nPaylaşılan not formatı hatalı.`.trim() : 'Paylaşılan not formatı hatalı.');
            }
        } catch (err) {
            console.error('Kullanıcının Paylaştığı Notlar Hatası:', err);
            setPostedNotes([]);
            setPageLoadError(prev => prev ? `${prev}\nPaylaşımlar yüklenemedi.`.trim() : 'Paylaşımlar yüklenemedi.');
        }
    };

    const fetchUserLikedNotes = async (userId, token) => {
        if (!userId || !token) {
            setUserLikedNotes([]);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7119/api/Likes/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                const formattedLikedNotes = response.data.map(item => ({
                    id: item.noteId,
                    likeId: item.likeId,
                    title: item.noteTitle || 'Başlık Bilinmiyor',
                    author: item.noteAuthorFullName || 'Yazar Bilinmiyor',
                    course: item.noteCourseName || 'Ders Bilinmiyor',
                    likes: typeof item.totalLikesForNote === 'number' ? item.totalLikesForNote : undefined,
                }));
                setUserLikedNotes(formattedLikedNotes);
            } else {
                setUserLikedNotes([]);
                setPageLoadError(prev => prev ? `${prev}\nBeğenilenler listesi formatı hatalı.`.trim() : 'Beğenilenler listesi formatı hatalı.');
            }
        } catch (err) {
            console.error('Kullanıcının Beğendiği Notlar Hatası:', err);
            setUserLikedNotes([]);
            if (err.response && err.response.status === 404) {
                // Beğeni olmaması durumu, hata olarak göstermeyebiliriz.
            } else {
                let message = 'Beğenilenler yüklenemedi.';
                if (axios.isAxiosError(err) && err.response) {
                    const responseData = err.response.data;
                    if (typeof responseData === 'string' && responseData.length < 200) {
                        message = responseData;
                    } else if (responseData?.message) {
                        message = responseData.message;
                    } else if (responseData?.title) {
                        message = responseData.title;
                    }
                } else if (axios.isAxiosError(err) && err.request) {
                    message = 'Sunucuya ulaşılamadı.';
                }
                setPageLoadError(prev => prev ? `${prev}\n${message}`.trim() : message);
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const usernameClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                const userIdClaimKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const usernameFromToken = decodedToken[usernameClaimKey];
                const userIdFromToken = decodedToken[userIdClaimKey];

                if (usernameFromToken && userIdFromToken) {
                    const currentUserId = parseInt(userIdFromToken, 10);
                    setLoggedInUserId(currentUserId);
                    setUser(prevUser => ({
                        ...prevUser,
                        id: currentUserId,
                        username: usernameFromToken,
                        name: usernameFromToken,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(usernameFromToken)}&background=60A5FA&color=fff&font-size=0.5&bold=true&length=2&rounded=true`,
                    }));
                    setPageLoadError('');
                    fetchUserDetails(currentUserId, token);
                    fetchUserCourses(currentUserId, token);
                    fetchPostedNotes(currentUserId, token);
                    fetchUserLikedNotes(currentUserId, token);
                } else {
                    setPageLoadError("Token geçersiz. Tekrar giriş yapın.");
                    handleLogout();
                }
            } catch (error) {
                console.error("Token hatası veya veri çekme sorunu:", error);
                setPageLoadError("Oturum sorunu. Tekrar giriş yapın.");
                handleLogout();
            }
        } else {
            setPageLoadError("Giriş yapmanız gerekiyor.");
            handleLogout();
        }
    }, [navigate]);

    // --- YARDIMCI VE EVENT HANDLER FONKSİYONLARININ TAMAMI ---
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setSelectedFile(file); else setSelectedFile(null);
        setAvatarError(''); setAvatarSuccess('');
    };

    // const triggerFileInput = () => fileInputRef.current?.click(); // Eğer ProfileHeader'a gönderilecekse

    const clearSelectedFile = () => {
        setSelectedFile(null); setAvatarError(''); setAvatarSuccess('');
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const uploadProfilePicture = async () => {
        if (!selectedFile || !user.id) {
            setAvatarError('Yüklenecek dosya veya kullanıcı bilgisi eksik.'); return;
        }
        setUploadingAvatar(true); setAvatarError(''); setAvatarSuccess('');
        const formData = new FormData(); formData.append('file', selectedFile);
        const token = localStorage.getItem('token');
        if (!token) {
            setAvatarError('Kimlik doğrulama tokenı bulunamadı.'); setUploadingAvatar(false); return;
        }
        try {
            const response = await axios.post(`https://localhost:7119/api/Users/${user.id}/upload-profile-picture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
            });
            if (response.data.profilePictureUrl) {
                setUser(prev => ({ ...prev, avatar: response.data.profilePictureUrl }));
                clearSelectedFile(); setAvatarSuccess('Profil fotoğrafı başarıyla güncellendi.');
            } else setAvatarError('Fotoğraf yüklendi ancak yeni URL alınamadı.');
        } catch (err) {
            let msg = 'Profil fotoğrafı yüklenirken bir hata oluştu.';
            if (axios.isAxiosError(err)) {
                if (err.response) msg = err.response.data?.message || err.response.data?.title || msg;
                else if (err.request) msg = 'Sunucuya ulaşılamadı.';
            }
            setAvatarError(msg);
        } finally { setUploadingAvatar(false); }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Bu dersi silmek istediğinizden emin misiniz?")) return;
        setIsDeletingCourse(true); setCourseError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setCourseError('Kimlik doğrulama tokenı bulunamadı.'); setIsDeletingCourse(false); return;
        }
        try {
            await axios.delete(`https://localhost:7119/api/Courses/${courseId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setEnrolledCourses(prev => prev.filter(course => course.id !== courseId));
        } catch (err) {
            let msg = 'Ders silinirken bir hata oluştu.';
            if (axios.isAxiosError(err) && err.response) {
                msg = err.response.data?.message || err.response.data?.title || msg;
            } else if (axios.isAxiosError(err) && err.request) msg = 'Sunucuya ulaşılamadı.';
            setCourseError(msg);
        } finally { setIsDeletingCourse(false); }
    };

    const handleDeleteNote = async (noteId) => { // *** BU FONKSİYONUN TANIMI BURADA ***
        if (!window.confirm("Bu notu silmek istediğinizden emin misiniz?")) return;
        setIsDeletingNoteId(noteId); setNoteDeletionError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setNoteDeletionError('Kimlik doğrulama tokenı bulunamadı.'); setIsDeletingNoteId(null); return;
        }
        try {
            await axios.delete(`https://localhost:7119/api/Notes/${noteId}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setPostedNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        } catch (err) {
            console.error('Not silme hatası:', err);
            let msg = 'Not silinirken bir hata oluştu.';
            if (axios.isAxiosError(err)) {
                if (err.response) msg = err.response.data?.message || err.response.data?.title || msg;
                else if (err.request) msg = 'Sunucuya ulaşılamadı.';
            }
            setNoteDeletionError(msg);
        } finally { setIsDeletingNoteId(null); }
    };
    // --- YARDIMCI FONKSİYONLARIN SONU ---

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsAddingCourse(false);
        setCourseError('');
        setNoteDeletionError('');
        if (isEditingProfile) {
            setIsEditingProfile(false);
        }
    };

    const handleEditProfileClick = () => {
        setIsEditingProfile(true);
        setIsAddingCourse(false);
        setActiveTab('');
    };

    const handleProfileUpdated = () => {
        if (user && user.id) {
            const token = localStorage.getItem('token');
            if (token) {
                fetchUserDetails(user.id, token);
            }
        }
        setIsEditingProfile(false);
        setActiveTab('posts');
    };

    const handleCancelEditProfile = () => {
        setIsEditingProfile(false);
        setActiveTab('posts');
    };

    const goToHomepage = () => navigate('/notes');
    const handleAddCourseClick = () => setIsAddingCourse(true);

    const handleCourseAdded = (newCourse) => {
        if (newCourse && typeof newCourse.id !== 'undefined' && typeof newCourse.name !== 'undefined') {
            setEnrolledCourses(prev => [...prev, { id: newCourse.id, name: newCourse.name }]);
        } else {
            const token = localStorage.getItem('token');
            if (user.id && token) fetchUserCourses(user.id, token);
        }
        setIsAddingCourse(false);
    };

    const isProcessingCourseAction = isAddingCourse || isDeletingCourse;
    const contentPadding = "p-6 sm:p-8 md:p-10";
    const iconCommonClass = "w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2";

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <ProfileHeader
                        user={user}
                        onGoToHomepage={goToHomepage}
                        avatarError={avatarError}
                        avatarSuccess={avatarSuccess}
                        postsCount={postedNotes.length}
                        coursesCount={enrolledCourses.length}
                        likesCount={userLikedNotes.length}
                        icons={Icons}
                        pageLoadError={pageLoadError || courseError || noteDeletionError}
                        isOwnProfile={loggedInUserId === user.id && user.id !== null}
                        onEditProfile={handleEditProfileClick}
                        onLogout={handleLogout}
                    />

                    {isEditingProfile ? (
                        <div className={contentPadding}>
                            <EditProfileDetails
                                currentUserDetails={user}
                                token={localStorage.getItem('token')}
                                onProfileUpdated={handleProfileUpdated}
                                onCancel={handleCancelEditProfile}
                            />
                        </div>
                    ) : (
                        <div className={contentPadding}>
                            <div className="flex border-b border-slate-200 mb-8">
                                <button
                                    onClick={() => handleTabChange('posts')}
                                    disabled={isProcessingCourseAction && activeTab !== 'posts'}
                                    className={`inline-flex items-center justify-center flex-1 py-3.5 px-2 sm:px-4 font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-60 rounded-t-lg ${activeTab === 'posts' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-b-2 border-transparent'} disabled:opacity-50 group`}
                                >
                                    <IconGrid className={`${iconCommonClass} ${activeTab === 'posts' ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                    Paylaşımlar ({postedNotes.length})
                                </button>
                                <button
                                    onClick={() => handleTabChange('liked')}
                                    disabled={isProcessingCourseAction && activeTab !== 'liked'}
                                    className={`inline-flex items-center justify-center flex-1 py-3.5 px-2 sm:px-4 font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-60 rounded-t-lg ${activeTab === 'liked' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-b-2 border-transparent'} disabled:opacity-50 group`}
                                >
                                    <IconHeart className={`${iconCommonClass} ${activeTab === 'liked' ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                    Beğenilenler ({userLikedNotes.length})
                                </button>
                                <button
                                    onClick={() => handleTabChange('courses')}
                                    className={`inline-flex items-center justify-center flex-1 py-3.5 px-2 sm:px-4 font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-60 rounded-t-lg ${activeTab === 'courses' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-b-2 border-transparent'} disabled:opacity-50 group`}
                                >
                                    <IconAcademicCap className={`${iconCommonClass} ${activeTab === 'courses' ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                    Dersler ({enrolledCourses.length})
                                </button>
                            </div>

                            <div className="tab-content mt-2">
                                {activeTab === 'posts' && (
                                    <UserPostsSection
                                        postedNotes={postedNotes}
                                        icons={Icons}
                                        onDeleteNote={handleDeleteNote}
                                        isDeletingNote={isDeletingNoteId}
                                        noteError={noteDeletionError}
                                    />
                                )}
                                {activeTab === 'liked' && (
                                    <UserLikesSection
                                        userLikedNotes={userLikedNotes}
                                        icons={Icons}
                                    />
                                )}
                                {activeTab === 'courses' && (
                                    <UserCoursesSection
                                        enrolledCourses={enrolledCourses}
                                        isAddingCourse={isAddingCourse}
                                        onAddCourseClick={handleAddCourseClick}
                                        userId={user.id}
                                        token={localStorage.getItem('token')}
                                        userFullName={user.name}
                                        onCourseAdded={handleCourseAdded}
                                        onSetIsAddingCourse={setIsAddingCourse}
                                        icons={Icons}
                                        onDeleteCourse={handleDeleteCourse}
                                        isProcessing={isProcessingCourseAction}
                                        errorMessage={courseError}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;