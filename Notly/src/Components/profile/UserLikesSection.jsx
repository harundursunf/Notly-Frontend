// src/Components/UserLikesSection.jsx (Yeni dosya)
import React from 'react';

const UserLikesSection = ({ userLikedNotes, icons }) => {
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-rose-600 mr-2">{icons.LikeFill}</span> Beğendiği Notlar
            </h3>
            {userLikedNotes.length > 0 ? (
                <ul className="space-y-6">
                    {userLikedNotes.map((note, index) => (
                        <li key={note.id ?? index} className="p-6 bg-rose-50 hover:bg-rose-100 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer border border-rose-100">
                            <p className="font-medium text-sm text-gray-800">{note.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{icons.UserCircle} {note.author} • {note.course}</p>
                            {typeof note.likes === 'number' && (
                                <span className="flex items-center text-red-600 text-sm mt-2">
                                    {icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes} Beğeni</span>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-lg">
                    <p className="text-xl mb-2">{icons.LikeFill}</p>
                    <p className="font-semibold">Henüz beğendiğin bir not yok.</p>
                    <p className="text-sm mt-1">Ana sayfadaki notlara göz at!</p>
                </div>
            )}
        </div>
    );
};

export default UserLikesSection;