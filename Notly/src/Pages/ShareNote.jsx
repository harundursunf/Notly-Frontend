// src/Components/notes/ShareNote.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedPdfs, setSelectedPdfs] = useState([]);


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
                    console.error("Fetch user courses error:", err);
                    setUserCoursesError(err.response?.data?.message || err.response?.data?.title || "Dersleriniz yüklenemedi.");
                    setUserCourses([]);
                } finally {
                    setLoadingUserCourses(false);
                }
            };
            fetchUserCourses();
        }
    }, [userId]);

    // --- DOSYA EKLEME FONKSİYONLARI GÜNCELLENDİ ---
    const handleImageChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Mevcut listenin üzerine yeni seçilenleri ekle
            setSelectedImages(prevImages => [...prevImages, ...newFiles]);
        }
    };

    const handlePdfChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Mevcut listenin üzerine yeni seçilenleri ekle
            setSelectedPdfs(prevPdfs => [...prevPdfs, ...newFiles]);
        }
    };

    // --- DOSYA SİLME FONKSİYONLARI EKLENDİ ---
    const handleRemoveImage = (fileNameToRemove) => {
        setSelectedImages(prevImages => prevImages.filter(file => file.name !== fileNameToRemove));
    };

    const handleRemovePdf = (fileNameToRemove) => {
        setSelectedPdfs(prevPdfs => prevPdfs.filter(file => file.name !== fileNameToRemove));
    };

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
        if (!title.trim()) {
            setError("Başlık boş olamaz.");
            setLoading(false);
            return;
        }
        if (!selectedCourseId) {
            setError("Lütfen bir ders seçin. Eğer dersiniz yoksa, önce bir ders eklemelisiniz.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content.trim());
        formData.append('createdAt', new Date().toISOString());
        formData.append('courseId', selectedCourseId);

        if (selectedImages.length > 0) {
            selectedImages.forEach((image) => {
                formData.append('imageFiles', image, image.name);
            });
        }

        if (selectedPdfs.length > 0) {
            selectedPdfs.forEach((pdf) => {
                formData.append('pdfFiles', pdf, pdf.name);
            });
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Not paylaşmak için kimlik doğrulama gerekli. Lütfen tekrar giriş yapın.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://localhost:7119/api/Notes', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess(true);
            setTitle('');
            setContent('');
            setSelectedCourseId(userCourses.length > 0 ? userCourses[0].id.toString() : '');
            setSelectedImages([]);
            setSelectedPdfs([]);

            const imageInput = document.getElementById('imageFilesInput');
            if (imageInput) imageInput.value = null;
            const pdfInput = document.getElementById('pdfFilesInput');
            if (pdfInput) pdfInput.value = null;

            if (onNoteShared) {
                onNoteShared(response.data);
            }
            setTimeout(() => {
                setSuccess(false);
                if (onCancel) onCancel();
            }, 1500);

        } catch (err) {
            console.error("Submit error:", err);
            let errorMessage = 'Not paylaşılırken bir hata oluştu.';
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.errors && typeof data.errors === 'object') {
                    const fieldErrors = Object.values(data.errors).flat();
                    errorMessage = fieldErrors.join(' ');
                } else {
                    errorMessage = data.message || data.title || (typeof data === 'string' ? data : errorMessage);
                }
            } else if (err.request) {
                errorMessage = "Sunucudan yanıt alınamadı. Lütfen ağ bağlantınızı kontrol edin.";
            } else {
                errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInternalCancel = () => {
        setTitle('');
        setContent('');
        setSelectedCourseId(userCourses.length > 0 ? userCourses[0].id.toString() : '');
        setSelectedImages([]);
        setSelectedPdfs([]);
        setError(null);
        setSuccess(false);
        const imageInput = document.getElementById('imageFilesInput');
        if (imageInput) imageInput.value = null;
        const pdfInput = document.getElementById('pdfFilesInput');
        if (pdfInput) pdfInput.value = null;

        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Yeni Not Paylaş</h2>
                <button
                    onClick={handleInternalCancel}
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
                        <div className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-500">Dersleriniz yükleniyor...</div>
                    ) : userCourses.length > 0 ? (
                        <select
                            id="course"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            required
                        >
                            <option value="">Bir Ders Seçin</option>
                            {userCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-sm text-red-500 mt-1">
                            {userCoursesError ? "Dersler yüklenemedi." : "Not paylaşabilmek için kayıtlı bir dersiniz olmalı. Lütfen önce bir ders ekleyin."}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                        type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Notunuzun başlığı" required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                    <textarea
                        id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Notunuzun içeriğini buraya yazın..."
                    ></textarea>
                </div>

                {/* --- DOSYA LİSTESİ VE SİLME BUTONLARI GÜNCELLENDİ --- */}
                <div>
                    <label htmlFor="imageFilesInput" className="block text-sm font-medium text-gray-700 mb-1">Resimler (İsteğe Bağlı)</label>
                    <input
                        type="file"
                        id="imageFilesInput"
                        accept="image/png, image/jpeg, image/gif"
                        multiple
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {selectedImages.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                            <p className="font-medium">Seçilen Resimler ({selectedImages.length} adet):</p>
                            <ul className="list-none pt-2 space-y-1 max-h-24 overflow-y-auto">
                                {selectedImages.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-1.5 rounded" title={file.name}>
                                        <span className="truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(file.name)}
                                            className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                                            aria-label={`'${file.name}' resmini kaldır`}
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="pdfFilesInput" className="block text-sm font-medium text-gray-700 mb-1">PDF'ler (İsteğe Bağlı)</label>
                    <input
                        type="file"
                        id="pdfFilesInput"
                        accept="application/pdf"
                        multiple
                        onChange={handlePdfChange}
                        className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {selectedPdfs.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                            <p className="font-medium">Seçilen PDF'ler ({selectedPdfs.length} adet):</p>
                            <ul className="list-none pt-2 space-y-1 max-h-24 overflow-y-auto">
                                {selectedPdfs.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-1.5 rounded" title={file.name}>
                                        <span className="truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePdf(file.name)}
                                            className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                                            aria-label={`'${file.name}' PDF'ini kaldır`}
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {userFullName && (
                    <p className="text-gray-600 text-sm mt-4">
                        Paylaşan: <span className="font-semibold">{userFullName}</span>
                    </p>
                )}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-4">
                    <button
                        type="button" onClick={handleInternalCancel}
                        className="w-full sm:w-auto inline-flex justify-center py-2.5 px-5 border border-slate-300 rounded-lg shadow-sm text-base font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className={`w-full sm:w-auto inline-flex justify-center py-2.5 px-5 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-all duration-150 ease-in-out ${loading || loadingUserCourses ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:bg-indigo-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        disabled={loading || loadingUserCourses || (userCourses.length === 0 && !userCoursesError)}
                    >
                        {loading ? 'Paylaşılıyor...' : 'Notu Paylaş'}
                    </button>
                </div>
            </form>
        </div>
    );
}