
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem'; 
import AddCommentForm from './AddCommentForm'; 

const CommentSection = ({ noteId }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

 
    const fetchComments = useCallback(async () => {
        if (!noteId) {
 
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`https://localhost:7119/api/Comments/note/${noteId}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {} // Token varsa gönder
            });
            console.log(`--- Note ID ${noteId} için YORUMLAR (API Yanıtı) ---`);
            // KONTROL: Her yorum objesi userFullName, userProfilePictureUrl, content, createdAt gibi alanları içeriyor mu?
            console.log(response.data);

            if (Array.isArray(response.data)) {
                // Yorumları tarihe göre sırala (en yeni üstte)
                setComments(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } else {
                console.error("Yorumlar API'den dizi formatında gelmedi:", response.data);
                setError("Yorumlar yüklenemedi (beklenmeyen format).");
                setComments([]); // Hata durumunda yorumları temizle
            }
        } catch (err) {
            console.error(`Yorumları çekme hatası (Note ID: ${noteId}):`, err.response?.data || err.message);
            if (err.response && err.response.status === 404) {
                setComments([]); 
                setError(null); // Kullanıcıya "yorum yok" mesajı gösterilecek
            } else {
                setError(err.response?.data?.message || err.message || "Yorumlar yüklenirken bir sorun oluştu.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [noteId]); 
    useEffect(() => {
        fetchComments();
    }, [fetchComments]); 

    const handleCommentAdded = (newComment) => {
    
        setComments(prevComments => [newComment, ...prevComments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Yorumlar <span className="text-base font-normal text-gray-500">({comments.length})</span>
            </h2>

            {/* Yorum Ekleme Formu */}
            <AddCommentForm noteId={noteId} onCommentAdded={handleCommentAdded} />

            {/* Yorum Listesi */}
            {isLoading && <p className="text-gray-500 mt-6 text-center">Yorumlar yükleniyor...</p>}
            {!isLoading && error && <p className="text-red-600 mt-6 text-center">Hata: {error}</p>}
            
            {!isLoading && !error && comments.length === 0 && (
                <p className="text-gray-500 mt-8 text-center">Henüz hiç yorum yapılmamış. İlk yorumu sen yap!</p>
            )}

            {!isLoading && !error && comments.length > 0 && (
                <div className="mt-6 space-y-0"> {/* Yorumlar arası border için CommentItem'a border-b eklendi */}
                    {comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
