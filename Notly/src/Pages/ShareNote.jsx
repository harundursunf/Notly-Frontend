import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // jwt-decode kütüphanesini kurduysanız

export default function ShareNote({ onNoteShared, onCancel, communities, setIsCreatingNote }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCommunityId, setSelectedCommunityId] = useState('');
    const [userCourses, setUserCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userFullName, setUserFullName] = useState('');
    const [loadingUserCourses, setLoadingUserCourses] = useState(false);
    const [userCoursesError, setUserCoursesError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
             
                console.log('--- ShareNote: Decoded JWT Token ---');
                console.log(decodedToken);
           

                const nameIdentifier = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

                setUserId(decodedToken[nameIdentifier]);
                setUserFullName(decodedToken[nameClaim] || 'Unknown User');
                console.log('--- ShareNote: UserFullName set from token ---', decodedToken[nameClaim] || 'Unknown User');


            } catch (err) {
                console.error("ShareNote: Token decoding error:", err);
                setError("Kullanıcı bilgileri alınamadı. Lütfen tekrar giriş yapın.");
            }
        } else {
            setError("Not paylaşmak için giriş yapmalısınız.");
        }
    }, []);


    useEffect(() => {
        if (userId) {
            const fetchUserCourses = async () => {
                setLoadingUserCourses(true);
                setUserCoursesError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    setUserCoursesError("Dersleri getirmek için kimlik doğrulama tokenı bulunamadı.");
                    setLoadingUserCourses(false);
                    return;
                }
                try {
                    const response = await axios.get(`https://localhost:7119/api/Courses/user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    // --- YENİ EKLENEN CONSOLE.LOG (Kullanıcının dersleri için) ---
                    console.log('--- ShareNote: Fetched User Courses (response.data) ---');
                    console.log(response.data);
                    // -------------------------------------------------------------
                    if (Array.isArray(response.data)) {
                        setUserCourses(response.data);
                    } else {
                        console.error("ShareNote: User courses data is not an array:", response.data);
                        setUserCourses([]);
                        setUserCoursesError("Dersler beklenen formatta yüklenemedi.");
                    }
                } catch (err) {
                    console.error("ShareNote: Error fetching user courses:", err);
                    setUserCoursesError(err.response?.data?.message || err.response?.data?.title || "Dersleriniz yüklenemedi.");
                    setUserCourses([]);
                } finally {
                    setLoadingUserCourses(false);
                }
            };
            fetchUserCourses();
        }
    }, [userId]);


    // --- Handle Note Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!userId) {
            setError("Kullanıcı kimlik doğrulaması başarısız. Lütfen giriş yapın.");
            setLoading(false);
            return;
        }
        if (!title.trim() || !content.trim()) {
            setError("Başlık ve içerik boş olamaz.");
            setLoading(false);
            return;
        }
        if (!selectedCourseId && userCourses.length > 0) {
            setError("Lütfen bir ders seçin.");
            setLoading(false);
            return;
        }

        const selectedCourse = userCourses.find(course => course.id.toString() === selectedCourseId.toString());
        // Eğer ders seçilmemişse veya dersler yüklenmemişse 'Genel' olarak ayarla, aksi halde dersin adını kullan
        const courseName = selectedCourse ? selectedCourse.name : (userCourses.length === 0 && !selectedCourseId ? "Genel" : "");


        const noteData = {
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString(),
            userId: parseInt(userId),
            userFullName: userFullName, // Token'dan gelen userFullName
            courseId: selectedCourseId ? parseInt(selectedCourseId) : 0,
            courseName: courseName, // Seçilen dersin adı veya "Genel"
        };

        if (selectedCommunityId) {
            noteData.communityId = parseInt(selectedCommunityId);
        }

      
        console.log('--- ShareNote: Sending noteData to backend ---');
        console.log(noteData);
      

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Not paylaşmak için kimlik doğrulaması gerekli. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://localhost:7119/api/Notes', noteData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            
            console.log('--- ShareNote: Note added successfully (response.data from POST) ---');
            console.log(response.data);
          

            setSuccess(true);
            setTitle('');
            setContent('');
            setSelectedCommunityId('');
            setSelectedCourseId('');

            if (onNoteShared) {
                onNoteShared(response.data); 
            }
            setTimeout(() => {
                setSuccess(false);
                if (onCancel) onCancel();
                else if (setIsCreatingNote) setIsCreatingNote(false);
            }, 1500);

        } catch (err) {
            console.error('ShareNote: Error adding note:', err.response?.data || err.message);
            let errorMessage = 'Not eklenirken bir hata oluştu.';
            if (err.response && err.response.data) {
                if (typeof err.response.data.errors === 'object') {
                    const errors = err.response.data.errors;
                    const fieldErrors = Object.values(errors).flat();
                    if (fieldErrors.length > 0) {
                        errorMessage = fieldErrors.join(' ');
                    }
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.title) {
                    errorMessage = err.response.data.title;
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (setIsCreatingNote) {
            setIsCreatingNote(false);
        }
    };


    return (
        <div className="flex justify-center items-start py-8 w-full">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Yeni Not Paylaş</h2>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
                        aria-label="Kapat"
                    >
                        &times;
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                        <strong className="font-bold">Hata!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}
                {userCoursesError && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                        <strong className="font-bold">Ders Yükleme Hatası!</strong>
                        <span className="block sm:inline"> {userCoursesError}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                        <strong className="font-bold">Başarılı!</strong>
                        <span className="block sm:inline"> Notunuz başarıyla paylaşıldı.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Community Dropdown */}
                    {communities && communities.length > 0 && (
                        <div>
                            <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
                                Topluluk (İsteğe Bağlı)
                            </label>
                            <select
                                id="community"
                                value={selectedCommunityId}
                                onChange={(e) => setSelectedCommunityId(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Bir Topluluk Seçin (Opsiyonel)</option>
                                {communities.map(community => (
                                    <option key={community.id} value={community.id}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* User Courses Dropdown */}
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                            Ders
                        </label>
                        {loadingUserCourses ? (
                            <p className="text-sm text-gray-500">Dersleriniz yükleniyor...</p>
                        ) : userCourses.length > 0 ? (
                            <select
                                id="course"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required={userCourses.length > 0}
                            >
                                <option value="">Bir Ders Seçin</option>
                                {userCourses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} {/* Dersin adı burada gösteriliyor */}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1">
                                {userCoursesError ? "Dersler yüklenemedi." : "Paylaşılacak dersiniz bulunmuyor. Genel bir not paylaşabilirsiniz."}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Başlık
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Notunuzun başlığı"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            İçerik
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="6"
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Notunuzun içeriği"
                            required
                        ></textarea>
                    </div>

                    {userFullName && (
                        <p className="text-gray-600 text-sm">
                            Paylaşan: <span className="font-semibold">{userFullName}</span>
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className={`w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${loading || loadingUserCourses ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            disabled={loading || loadingUserCourses}
                        >
                            {loading ? 'Paylaşılıyor...' : 'Notu Paylaş'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}