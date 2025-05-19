// src/Pages/Profile.jsx (En Güncel Hali)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Bölünmüş alt bileşenleri import et
// Bu yolların projenizdeki dosya yapısıyla eşleştiğinden emin olun
import ProfileHeader from '../Components//profile/ProfileHeader';
import UserPostsSection from '../Components/profile/UserPostsSection';
import UserLikesSection from '../Components/profile/UserLikesSection';
import UserCoursesSection from '../Components/profile/UserCoursesSection';

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        id: null,
        name: 'Yükleniyor...',
        university: 'Yükleniyor...',
        department: 'Yükleniyor...',
        bio: 'Biyografi yükleniyor...',
        avatar: 'https://ui-avatars.com/api/?name=User&background=cccccc&color=fff&font-size=0.5&bold=true&length=1&rounded=true',
    });

    const [isSharingNote, setIsSharingNote] = useState(false);
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

  
    const [pageLoadError, setPageLoadError] = useState(''); 
    const [avatarError, setAvatarError] = useState('');     
    const [avatarSuccess, setAvatarSuccess] = useState(''); 
    const [courseError, setCourseError] = useState('');     


    const [selectedFile, setSelectedFile] = useState(null);      
    const [uploadingAvatar, setUploadingAvatar] = useState(false); 
    const [isDeletingCourse, setIsDeletingCourse] = useState(false); 
    const fileInputRef = useRef(null);

   
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [postedNotes, setPostedNotes] = useState([]);
    const [userLikedNotes, setUserLikedNotes] = useState([]);


    const Icons = {
        Course: '🎓', LikeFill: '❤️', Calendar: '📅', ThumbUp: '👍', UserCircle: '👤',
        Share: '📤', File: '📁', Image: '🖼️', PDF: '📄', Text: '📝',
        XCircle: '❌', Back: '⬅️', PlusCircle: '➕', Upload: '⬆️',
    };

    // --- DATA FETCHING FONKSİYONLARI ---
    const fetchUserDetails = async (userId, token) => {
        try {
            const response = await axios.get(`https://localhost:7119/api/Users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(prevUser => ({
                ...prevUser,
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
        try {
            const response = await axios.get(`https://localhost:7119/api/Notes/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                const formattedNotes = response.data.map(note => ({
                    id: note.id,
                    title: note.title,
                    likes: note.likesCount || 0,
                    date: new Date(note.publishDate || note.createdAt).toLocaleDateString(),
                    course: note.courseName || 'Bilinmiyor',
                    // file: note.fileInfo // Eğer dosya bilgisi geliyorsa
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
        try {
            const response = await axios.get(`https://localhost:7119/api/Likes/user/${userId}`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (Array.isArray(response.data)) {
                const likedItems = response.data;
             
                const formattedLikedNotes = likedItems.map(item => ({
                    id: item.noteId, 
                    title: item.noteTitle || 'Başlık Bilinmiyor',
                    author: item.noteAuthorName || 'Yazar Bilinmiyor',
                    course: item.noteCourseName || 'Ders Bilinmiyor',
                    likes: typeof item.noteTotalLikes === 'number' ? item.noteTotalLikes : undefined, 
                    likeId: item.id 
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
                console.info(`GET /api/Likes/user/${userId} 404 yanıtı verdi. Kullanıcının beğenisi olmayabilir veya backend endpoint'i kontrol edin.`);
            } else {
                let message = 'Beğenilen notlar yüklenirken bir hata oluştu.';
                 if (axios.isAxiosError(err) && err.response) {
                    message = err.response.data?.message || err.response.data?.title || message;
                } else if (axios.isAxiosError(err) && err.request) {
                    message = 'Sunucuya ulaşılamadı.';
                }
                setPageLoadError(prev => prev ? `${prev}\n${message}`.trim() : message);
            }
        }
    };

    // --- useEffect (Token decode ve ilk data fetch) ---
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
                    setUser(prevUser => ({
                        ...prevUser,
                        id: userIdFromToken,
                        name: usernameFromToken,
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(usernameFromToken)}&background=60A5FA&color=fff&font-size=0.5&bold=true&length=2&rounded=true`,
                    }));
                    setPageLoadError('');

                    fetchUserDetails(userIdFromToken, token);
                    fetchUserCourses(userIdFromToken, token);
                    fetchPostedNotes(userIdFromToken, token);
                    fetchUserLikedNotes(userIdFromToken, token);
                } else {
                    setPageLoadError("Kullanıcı bilgileri token'dan alınamadı. Lütfen tekrar giriş yapın.");
                }
            } catch (error) {
                console.error("Error decoding JWT:", error);
                setPageLoadError("Kullanıcı bilgileri yüklenirken bir hata oluştu. Lütfen tekrar giriş yapın.");
            }
        } else {
            setPageLoadError("Giriş yapmanız gerekiyor. Lütfen giriş yapın.");
           
        }
    }, []);

  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setAvatarError('');
            setAvatarSuccess('');
        } else {
            setSelectedFile(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setAvatarError('');
        setAvatarSuccess('');
        if (fileInputRef.current) { 
            fileInputRef.current.value = "";
        }
    };

    const uploadProfilePicture = async () => {
        if (!selectedFile || !user.id) {
            setAvatarError('Yüklenecek dosya veya kullanıcı bilgisi eksik.');
            return;
        }
        setUploadingAvatar(true);
        setAvatarError('');
        setAvatarSuccess('');
        const formData = new FormData();
        formData.append('file', selectedFile);
        const token = localStorage.getItem('token');
        if (!token) {
            setAvatarError('Kimlik doğrulama tokenı bulunamadı. Lütfen tekrar giriş yapın.');
            setUploadingAvatar(false);
            return;
        }
        try {
            const response = await axios.post(`https://localhost:7119/api/Users/${user.id}/upload-profile-picture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` },
            });
            const newProfilePictureUrl = response.data.profilePictureUrl;
            if (newProfilePictureUrl) {
                setUser(prevUser => ({ ...prevUser, avatar: newProfilePictureUrl }));
                clearSelectedFile(); 
                setAvatarSuccess('Profil fotoğrafı başarıyla güncellendi.');
            } else {
                setAvatarError('Fotoğraf yüklendi ancak yeni URL alınamadı.');
            }
        } catch (err) {
            let specificErrorMessage = 'Profil fotoğrafı yüklenirken bir hata oluştu.';
            if (axios.isAxiosError(err)) {
                if (err.response) specificErrorMessage = err.response.data?.message || err.response.data?.title || 'Profil fotoğrafı yüklenirken bir sunucu hatası oluştu.';
                else if (err.request) specificErrorMessage = 'Sunucuya ulaşılamadı. Profil fotoğrafı yüklenemedi.';
            }
            setAvatarError(specificErrorMessage);
        } finally {
            setUploadingAvatar(false);
        }
    };

    // --- DERS SİLME FONKSİYONU ---
    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Bu dersi silmek istediğinizden emin misiniz?")) {
            return;
        }
        setIsDeletingCourse(true);
        setCourseError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setCourseError('Kimlik doğrulama tokenı bulunamadı.');
            setIsDeletingCourse(false);
            return;
        }
        try {
            await axios.delete(`https://localhost:7119/api/Courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEnrolledCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
            // setCourseSuccess('Ders başarıyla silindi.'); // Opsiyonel
        } catch (err) {
            console.error('Ders silme hatası:', err);
            let specificErrorMessage = 'Ders silinirken bir hata oluştu.';
            if (axios.isAxiosError(err) && err.response) {
                specificErrorMessage = err.response.data?.message || err.response.data?.title || `Ders silinirken bir hata oluştu (Hata ${err.response.status}).`;
            } else if (axios.isAxiosError(err) && err.request) {
                specificErrorMessage = 'Sunucuya ulaşılamadı.';
            }
            setCourseError(specificErrorMessage);
        } finally {
            setIsDeletingCourse(false);
        }
    };

    // --- TAB VE MODAL YÖNETİMİ ---
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsSharingNote(false);
        setIsAddingCourse(false);
        setCourseError(''); // Tab değiştirince ders hatalarını temizle
    };

    const goToHomepage = () => navigate('/notes');

    const handleShareNoteClick = () => {
        setIsSharingNote(true);
        setIsAddingCourse(false);
        // setActiveTab('posts'); // Zaten posts tabında olmalı
    };

    const handleAddCourseClick = () => {
        setIsAddingCourse(true);
        setIsSharingNote(false);
        // setActiveTab('courses'); // Zaten courses tabında olmalı
    };

    // --- CALLBACKS FOR CHILD COMPONENTS ---
    const handleNewNoteShared = (newNote) => {
        const formattedNewNote = {
            id: newNote.id,
            title: newNote.title,
            likes: newNote.likesCount || 0,
            date: new Date(newNote.publishDate || newNote.createdAt).toLocaleDateString(),
            course: newNote.courseName || 'Bilinmiyor',
        };
        setPostedNotes(prevNotes => [formattedNewNote, ...prevNotes]);
        setIsSharingNote(false);
    };

    const handleCourseAdded = (newCourse) => {
        
        if (newCourse && typeof newCourse.id !== 'undefined' && typeof newCourse.name !== 'undefined') {
            setEnrolledCourses(prevCourses => [...prevCourses, {id: newCourse.id, name: newCourse.name}]);
        } else { 
            console.warn('Eklenen ders beklenmeyen formatta döndü veya eksik bilgi içeriyor, ders listesi yeniden çekiliyor.', newCourse);
            const token = localStorage.getItem('token');
            if (user.id && token) fetchUserCourses(user.id, token);
        }
        setIsAddingCourse(false); 
    };

    
    const isProcessingCourseAction = isAddingCourse || isDeletingCourse;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <ProfileHeader
                    user={user}
                    onGoToHomepage={goToHomepage}
                    selectedFile={selectedFile}
                    uploadingAvatar={uploadingAvatar}
                    avatarError={avatarError}
                    avatarSuccess={avatarSuccess}
                    onFileChange={handleFileChange}
                    onUploadProfilePicture={uploadProfilePicture}
                    onUploadButtonClick={triggerFileInput}
                    onClearSelectedFile={clearSelectedFile}
                    fileInputRef={fileInputRef}
                    postsCount={postedNotes.length}
                    coursesCount={enrolledCourses.length}
                    likesCount={userLikedNotes.length}
                    icons={Icons}
                    pageLoadError={pageLoadError || courseError} 
                />

                <div className="p-8 sm:p-10"> {/* Tablar ve içerikleri için ana sarmalayıcı */}
                    <div className="flex border-b border-gray-300 mb-6">
                        <button
                            onClick={() => handleTabChange('posts')}
                            disabled={isProcessingCourseAction && activeTab !== 'posts'} // Başka bir sekmede ders işlemi varsa bu sekmeye geçişi engelle
                            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors duration-200 ${activeTab === 'posts' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'} disabled:opacity-50`}
                        >
                            Paylaşımlar ({postedNotes.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('liked')}
                            disabled={isProcessingCourseAction && activeTab !== 'liked'}
                            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors duration-200 ${activeTab === 'liked' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'} disabled:opacity-50`}
                        >
                            Beğenilenler ({userLikedNotes.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('courses')}
                            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors duration-200 ${activeTab === 'courses' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'} disabled:opacity-50`}
                        >
                            Dersler ({enrolledCourses.length})
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'posts' && (
                            <UserPostsSection
                                postedNotes={postedNotes}
                                isSharingNote={isSharingNote}
                                onShareNoteClick={handleShareNoteClick}
                                onSetIsSharingNote={setIsSharingNote}
                                onNoteShared={handleNewNoteShared}
                                enrolledCoursesForSharing={enrolledCourses}
                                icons={Icons}
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
            </div>
        </div>
    );
};

export default Profile;