
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const AddCommentForm = ({ noteId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loggedInUserFullName, setLoggedInUserFullName] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Token'ınızdaki claim adları farklı olabilir, bunları doğrulayın
                const nameIdentifierClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
                const nameClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
                // const profilePictureClaim = 'profile_picture_url_claim_adı'; // Eğer token'da varsa

                setLoggedInUserId(decodedToken[nameIdentifierClaim] ? parseInt(decodedToken[nameIdentifierClaim], 10) : null);
                setLoggedInUserFullName(decodedToken[nameClaim] || 'Bilinmeyen Kullanıcı');
                // setLoggedInUserProfilePictureUrl(decodedToken[profilePictureClaim] || '');
            } catch (err) {
                console.error("Token decode error in AddCommentForm:", err);
                setError("Kullanıcı bilgileri alınamadı, yorum yapamazsınız.");
            }
        } else {
            setError("Yorum yapmak için giriş yapmalısınız.");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Yorum içeriği boş olamaz.');
            return;
        }
        if (!loggedInUserId) {
            setError('Yorum yapmak için giriş yapmalısınız veya kullanıcı ID\'niz alınamadı.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        const token = localStorage.getItem('token');
        const commentPayload = {
            noteId: parseInt(noteId, 10),
            content: content.trim(),
        };
        try {
            const response = await axios.post('https://localhost:7119/api/Comments', commentPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const newCommentFromApi = response.data;
            console.log("Yeni yorum eklendi (API Yanıtı):", newCommentFromApi);
            const displayComment = {
                ...newCommentFromApi, 
                userFullName: newCommentFromApi.userFullName || loggedInUserFullName, 
                userProfilePictureUrl: newCommentFromApi.userProfilePictureUrl 
            };
            onCommentAdded(displayComment); 
            setContent(''); // Formu temizle
        } catch (err) {
            console.error('Yorum ekleme hatası:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join(' ') 
                : (err.response?.data?.title || err.response?.data?.message || 'Yorumunuz gönderilirken bir hata oluştu.');
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
                <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Yorumunuzu Ekleyin
                </label>
                <textarea
                    id="commentContent"
                    rows="3" // Biraz daha kompakt
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={loggedInUserId ? "Düşüncelerinizi paylaşın..." : "Yorum yapmak için lütfen giriş yapın."}
                    disabled={isSubmitting || !loggedInUserId}
                />
                {!loggedInUserId && !error && <p className="text-xs text-gray-500 mt-1">Yorum yapmak için giriş yapmanız gerekmektedir.</p>}
            </div>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !loggedInUserId || !content.trim()}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-150 ${
                        isSubmitting || !loggedInUserId || !content.trim()
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                    {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                </button>
            </div>
        </form>
    );
};

export default AddCommentForm;
