import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import ProfileHeader from '../Components/profile/ProfileHeader';
import UserPostsSection from '../Components/profile/UserPostsSection';
import UserLikesSection from '../Components/profile/UserLikesSection';
import UserCoursesSection from '../Components/profile/UserCoursesSection';
import EditProfileDetails from '../Components/profile/EditProfileDetails';

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
        Course: '🎓', LikeFill: '❤️', Calendar: '📅', ThumbUp: '👍', UserCircle: '👤',
        Share: '📤', File: '📁', Image: '🖼️', PDF: '📄', Text: '📝',
        XCircle: '❌', Back: '⬅️', PlusCircle: '➕', Upload: '⬆️',
        Delete: '🗑️',
        Edit: '✏️',
        Logout: '➔',     };

    // --- ÇIKIŞ YAPMA FONKSİYONU ---
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

    // --- DATA FETCHING FONKSİYONLARI ---
    const fetchUserDetails = async (userId, token) => {
        if (!userId || !token) {
            console.warn("fetchUserDetails: userId veya token eksik.");
            return;
        }
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
                message = 'Sunucuya ulaşılamadı. Kullanıcı detayları çekilemedi.';
            }
            setPageLoadError(prev => prev ? `${prev}\n${message}`.trim() : message);
            setUser(prevUser => ({ ...prevUser, university: 'Bilgi Çekilemedi', bio: 'Bilgi Çekilemedi', department: 'Bilgi Çekilemedi' }));
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
                setPageLoadError(prev => prev ? `${prev}\nKullanıcı dersleri beklenmeyen formatta geldi.`.trim() : 'Kullanıcı dersleri beklenmeyen formatta geldi.');
            }
        } catch (err) {
            console.error('Kullanıcı Dersleri Hatası:', err);
            setEnrolledCourses([]);
            setPageLoadError(prev => prev ? `${prev}\nDersler yüklenirken bir hata oluştu.`.trim() : 'Dersler yüklenirken bir hata oluştu.');
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
                setPageLoadError(prev => prev ? `${prev}\nPaylaşılan notlar beklenmeyen formatta geldi.`.trim() : 'Paylaşılan notlar beklenmeyen formatta geldi.');
            }
        } catch (err) {
            console.error('Kullanıcının Paylaştığı Notlar Hatası:', err);
            setPostedNotes([]);
            setPageLoadError(prev => prev ? `${prev}\nPaylaşılan notlar yüklenirken bir hata oluştu.`.trim() : 'Paylaşılan notlar yüklenirken bir hata oluştu.');
        }
    };

    const fetchUserLikedNotes = async (userId, token) => {
        if (!userId || !token) {
            console.warn("fetchUserLikedNotes çağrıldı ancak userId veya token eksik.");
            setUserLikedNotes([]);
            return;
        }
        try {
            const response = await axios.get(`https://localhost:7119/api/Likes/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                const likedItems = response.data;
                const formattedLikedNotes = likedItems.map(item => ({
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
                setPageLoadError(prev => prev ? `${prev}\nBeğenilen notlar listesi beklenmeyen formatta geldi.`.trim() : 'Beğenilen notlar listesi beklenmeyen formatta geldi.');
            }
        } catch (err) {
            console.error('Kullanıcının Beğendiği Notlar Listesi Hatası:', err);
            setUserLikedNotes([]);
            if (err.response && err.response.status === 404) {
                console.info(`GET /api/Likes/user/${userId} 404 yanıtı verdi. Kullanıcının beğenisi olmayabilir.`);
            } else {
                let message = 'Beğenilen notlar yüklenirken bir hata oluştu.';
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
                    setPageLoadError("Kullanıcı bilgileri token'dan alınamadı. Lütfen tekrar giriş yapın.");
                    setUserLikedNotes([]);
                    handleLogout(); // Token var ama bilgi yoksa çıkış yaptır
                }
            } catch (error) {
                console.error("Error decoding JWT or fetching data:", error);
                setPageLoadError("Kullanıcı bilgileri yüklenirken bir hata oluştu. Lütfen tekrar giriş yapın.");
                handleLogout(); 
            }
        } else {
            setPageLoadError("Giriş yapmanız gerekiyor. Lütfen giriş yapın.");
            handleLogout();
        }
    
    }, [navigate]); 
                  
                   


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setSelectedFile(file); else setSelectedFile(null);
        setAvatarError(''); setAvatarSuccess('');
    };
    const triggerFileInput = () => fileInputRef.current?.click();
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

    const handleDeleteNote = async (noteId) => {
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
            setEnrolledCourses(prev => [...prev, {id: newCourse.id, name: newCourse.name}]);
        } else { 
            const token = localStorage.getItem('token');
            if (user.id && token) fetchUserCourses(user.id, token);
        }
        setIsAddingCourse(false); 
    };
    
    const isProcessingCourseAction = isAddingCourse || isDeletingCourse;

    const contentPadding = "p-6 sm:p-8 md:p-10";

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
                        icons={Icons} // Icons objesi ProfileHeader'a gönderiliyor
                        pageLoadError={pageLoadError || courseError || noteDeletionError}
                        isOwnProfile={loggedInUserId === user.id && user.id !== null}
                        onEditProfile={handleEditProfileClick}
                        onLogout={handleLogout} // Çıkış yap fonksiyonu prop olarak eklendi
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
                            <div className="flex border-b border-gray-300 mb-8">
                                <button
                                    onClick={() => handleTabChange('posts')}
                                    disabled={isProcessingCourseAction && activeTab !== 'posts'}
                                    className={`flex-1 py-3.5 px-2 sm:px-4 text-center font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-60 rounded-t-lg ${activeTab === 'posts' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 border-b-2 border-transparent'} disabled:opacity-50`}
                                >
                                    Paylaşımlar ({postedNotes.length})
                                </button>
                                <button
                                    onClick={() => handleTabChange('liked')}
                                    disabled={isProcessingCourseAction && activeTab !== 'liked'}
                                    className={`flex-1 py-3.5 px-2 sm:px-4 text-center font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-60 rounded-t-lg ${activeTab === 'liked' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 border-b-2 border-transparent'} disabled:opacity-50`}
                                >
                                    Beğenilenler ({userLikedNotes.length})
                                </button>
                                <button
                                    onClick={() => handleTabChange('courses')}
                                    className={`flex-1 py-3.5 px-2 sm:px-4 text-center font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-60 rounded-t-lg ${activeTab === 'courses' ? 'text-indigo-700 border-b-2 border-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 border-b-2 border-transparent'} disabled:opacity-50`}
                                >
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