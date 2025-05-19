// src/components/CommentItem.jsx
import React from 'react';

const CommentItem = ({ comment }) => {
    
    const formattedDate = comment.createdAt 
        ? new Date(comment.createdAt).toLocaleString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : 'Tarih bilgisi yok';

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userFullName || 'Kullanıcı')}&background=random&color=fff&rounded=true&bold=true`;

    return (
        <div className="flex space-x-3 py-4 border-b border-gray-200 last:border-b-0">
            <img
                className="h-10 w-10 rounded-full object-cover" // Profil resminin düzgün görünmesi için object-cover
                src={comment.userProfilePictureUrl || defaultAvatar}
                alt={comment.userFullName || 'Kullanıcı'}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }} // Resim yüklenemezse varsayılanı göster
            />
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">{comment.userFullName || 'Anonim Kullanıcı'}</h3>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                
            </div>
        </div>
    );
};

export default CommentItem;
