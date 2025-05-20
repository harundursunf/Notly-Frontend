// src/Components/notes/ShareNote.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// onCancel prop'u artık modalı kapatmak için daha merkezi bir rol oynayacak.
export default function ShareNote({ onNoteShared, onCancel }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
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
                const nameIdentifier = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                setUserId(decodedToken[nameIdentifier]);
                setUserFullName(decodedToken[nameClaim] || 'Bilinmeyen Kullanıcı');
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
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (Array.isArray(response.data)) {
                        setUserCourses(response.data);
                    } else {
                        setUserCourses([]);
                        setUserCoursesError("Dersler beklenen formatta yüklenemedi.");
                    }
                } catch (err) {
                    setUserCoursesError(err.response?.data?.message || err.response?.data?.title || "Dersleriniz yüklenemedi.");
                    setUserCourses([]);
                } finally {
                    setLoadingUserCourses(false);
                }
            };
            fetchUserCourses();
        }
    }, [userId]);

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
        const courseName = selectedCourse ? selectedCourse.name : (userCourses.length === 0 && !selectedCourseId ? "Genel" : "");

        const noteData = {
            title: title.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString(),
            userId: parseInt(userId),
            userFullName: userFullName,
            courseId: selectedCourseId ? parseInt(selectedCourseId) : 0,
            courseName: courseName,
        };

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
            setSuccess(true);
            setTitle('');
            setContent('');
            setSelectedCourseId('');
            if (onNoteShared) {
                onNoteShared(response.data); // NotesFeed'e yeni not bilgisini gönder
            }
            setTimeout(() => { // Başarı mesajını gösterdikten sonra modalı kapat
                setSuccess(false); // Başarı mesajını temizle
                if (onCancel) onCancel(); // Modalı kapatmak için onCancel'ı çağır
            }, 1500);
        } catch (err) {
            let errorMessage = 'Not eklenirken bir hata oluştu.';
            // ... (hata mesajı işleme kısmı aynı kalabilir) ...
            if (err.response && err.response.data) {
                if (typeof err.response.data.errors === 'object') {
                    const errors = err.response.data.errors;
                    const fieldErrors = Object.values(errors).flat();
                    if (fieldErrors.length > 0) errorMessage = fieldErrors.join(' ');
                } else if (err.response.data.message) errorMessage = err.response.data.message;
                else if (err.response.data.title) errorMessage = err.response.data.title;
                else if (typeof err.response.data === 'string') errorMessage = err.response.data;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // handleCancel fonksiyonu artık prop olarak gelen onCancel'ı doğrudan çağıracak
    // Bu, modalın dışına tıklandığında veya "X" butonuna basıldığında çağrılacak.
    const handleInternalCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // Modalın kendisi için ana sarmalayıcı. Boyut ve gölge gibi stiller burada.
    // `py-8 w-full` gibi dışsal yerleşim stilleri kaldırıldı, bunlar modalı çağıran yerde yönetilecek.
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Yeni Not Paylaş</h2>
                <button
                    onClick={handleInternalCancel} // Değiştirildi
                    className="text-gray-400 hover:text-gray-600 transition-colors text-3xl leading-none"
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
                    <strong className="font-bold">Uyarı!</strong>
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
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
                    {loadingUserCourses ? (
                        <div className="mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500">Dersleriniz yükleniyor...</div>
                    ) : userCourses.length > 0 ? (
                        <select
                            id="course"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                            required={userCourses.length > 0} // Ders varsa seçmek zorunlu
                        >
                            <option value="">Bir Ders Seçin</option>
                            {userCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-sm text-gray-500 mt-1">
                            {userCoursesError ? "Dersler yüklenemedi." : "Paylaşılacak dersiniz bulunmuyor. Notunuz 'Genel' olarak paylaşılacaktır."}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="Notunuzun başlığı"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="6"
                        className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                        placeholder="Notunuzun içeriğini buraya yazın..."
                        required
                    ></textarea>
                </div>
                {userFullName && (
                    <p className="text-gray-600 text-sm">
                        Paylaşan: <span className="font-semibold">{userFullName}</span>
                    </p>
                )}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-2">
                    <button
                        type="button"
                        onClick={handleInternalCancel} // Değiştirildi
                        className="w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-slate-300 rounded-lg shadow-sm text-base font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className={`w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-all duration-150 ease-in-out ${loading || loadingUserCourses ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        disabled={loading || loadingUserCourses}
                    >
                        {loading ? 'Paylaşılıyor...' : 'Notu Paylaş'}
                    </button>
                </div>
            </form>
        </div>
    );
}