import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Icons = {
    Liked: '❤️', 
    NotLiked: '🤍' 
};

const LikeButton = ({
    noteId,
    noteTitle, 
    initialLikesCount,
    initialIsLiked,
    initialCurrentUserLikeId, 
    currentUserId, 
    currentUserFullName, 
    onLikeStateChange 
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [currentUserLikeId, setCurrentUserLikeId] = useState(initialCurrentUserLikeId);
    const [isLoading, setIsLoading] = useState(false);

  
    useEffect(() => {
        setIsLiked(initialIsLiked);
        setLikesCount(initialLikesCount);
        setCurrentUserLikeId(initialCurrentUserLikeId);
    }, [initialIsLiked, initialLikesCount, initialCurrentUserLikeId, noteId]);

    const handleLikeToggle = async () => {
        if (isLoading) return;
        if (!currentUserId) {
            alert("Beğeni yapmak için kullanıcı bilgisi gerekli. Lütfen giriş yapın.");
            return;
        }
        setIsLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Beğeni yapmak için giriş yapmalısınız.");
            setIsLoading(false);
            return;
        }

        const previousState = { isLiked, likesCount, currentUserLikeId };
        let newOptimisticIsLiked = !isLiked;
        let newOptimisticLikesCount = newOptimisticIsLiked 
            ? (previousState.likesCount + 1) 
            : (previousState.likesCount - 1);
        newOptimisticLikesCount = Math.max(0, newOptimisticLikesCount); // Beğeni sayısı 0'ın altına düşmesin

      
        setIsLiked(newOptimisticIsLiked);
        setLikesCount(newOptimisticLikesCount);

        try {
            let updatedApiCurrentUserLikeId = previousState.currentUserLikeId;

            if (newOptimisticIsLiked) { 
                const payload = {
                    userId: currentUserId,
              
                    userFullName: currentUserFullName || "Bilinmeyen Kullanıcı", 
                    noteId: noteId,
                 
                    noteTitle: noteTitle || "Bilinmeyen Başlık"
                };
                console.log("Sending POST to /api/Likes with payload:", payload);
                const response = await axios.post(
                    'https://localhost:7119/api/Likes', // API endpoint'iniz
                    payload,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                if (response.data && response.data.id) {
                    updatedApiCurrentUserLikeId = response.data.id;
                    setCurrentUserLikeId(response.data.id); // Local state'i de güncelle
                } else {
                    console.warn("Backend /api/Likes POST yanıtında yeni Like ID'si dönmedi. Unlike işlemi için bu ID gereklidir.");
                }
                console.log('Note liked, API response:', response.data);

            } else { 
                if (!previousState.currentUserLikeId) {
                    console.error("Beğeni kaldırılamıyor: Mevcut beğeniye ait ID (currentUserLikeId) eksik!");
                 
                    throw new Error("Beğeni ID'si bulunamadığı için işlem yapılamadı. Sayfayı yenileyip tekrar deneyin veya backend'den 'currentUserLikeId' geldiğinden emin olun.");
                }
                await axios.delete(`https://localhost:7119/api/Likes/${previousState.currentUserLikeId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                updatedApiCurrentUserLikeId = null;
                setCurrentUserLikeId(null); // Local state'i de güncelle
                console.log('Note unliked');
            }

          
            if (onLikeStateChange) {
                onLikeStateChange(noteId, {
                    newLikesCount: newOptimisticLikesCount, 
                    newIsLiked: newOptimisticIsLiked,
                    newCurrentUserLikeId: updatedApiCurrentUserLikeId
                });
            }

        } catch (error) {
            console.error("Like/Unlike işlemi sırasında hata:", error.response?.data || error.message);
            alert("Beğeni işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
            
            setIsLiked(previousState.isLiked);
            setLikesCount(previousState.likesCount);
            setCurrentUserLikeId(previousState.currentUserLikeId);
            
             if (onLikeStateChange) {
                onLikeStateChange(noteId, { ...previousState });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={(e) => { e.stopPropagation(); handleLikeToggle(); }}
            disabled={isLoading || !currentUserId} 
            title={!currentUserId ? "Beğeni yapmak için giriş yapmalısınız" : (isLiked ? "Beğenmekten vazgeç" : "Beğen")}
            className={`flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isLiked
                ? 'text-red-500 hover:text-red-600 focus:ring-red-400' // Beğenilmişse kırmızı
                : 'text-gray-500 hover:text-red-500 focus:ring-gray-400' // Beğenilmemişse gri
            } ${isLoading || !currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-pressed={isLiked} // Erişilebilirlik için
            aria-label={isLiked ? "Beğenmekten vazgeç" : "Beğen"} // Erişilebilirlik için
        >
            {isLiked ? Icons.Liked : Icons.NotLiked}
            <span className="ml-1.5 font-medium">{likesCount}</span>
        </button>
    );
};

export default LikeButton;
