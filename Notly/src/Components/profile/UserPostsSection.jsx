import React from 'react';
const UserPostsSection = ({
    postedNotes,
    icons,
    onDeleteNote, 
    isDeletingNote, 
    noteError 
}) => {
    const handleLocalDelete = (noteId) => {
        if (typeof onDeleteNote === 'function') {
            onDeleteNote(noteId);
        } else {
            console.warn("onDeleteNote fonksiyonu UserPostsSection'a sağlanmamış.");
        }
    };
    return (
        <div className="space-y-6">
            {noteError && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{noteError}</div>}
            {postedNotes && postedNotes.length > 0 ? (
                <ul className="space-y-6">
                    {postedNotes.map((note, index) => (
                        <li 
                            key={(note && (note.id !== null && typeof note.id !== 'undefined')) ? note.id : `posted-note-${index}`}
                            className="bg-white p-5 rounded-xl shadow-lg border border-slate-200"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-semibold text-indigo-700">{note?.title || 'Başlık Yok'}</h4>
                                    <p className="text-xs text-slate-500">
                                        {note?.course || 'Ders Bilgisi Yok'} • {note?.date || 'Tarih Bilgisi Yok'}
                                    </p>
                                </div>
                                {typeof onDeleteNote === 'function' && (
                                    <button
                                        onClick={() => note && handleLocalDelete(note.id)}
                                        disabled={isDeletingNote === note?.id || isDeletingNote === true} 
                                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                        title="Notu Sil"
                                    >
                                        {(icons && icons.Delete) || '🗑️'} 
                                    </button>
                                )}
                            </div>
                            {typeof note?.likes === 'number' && (
                                <p className="text-sm text-slate-600 mt-2 flex items-center">
                                    <span className="text-red-500 mr-1">{(icons && icons.ThumbUp) || '👍'}</span> {note.likes} Beğeni
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
            
                <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-lg">
                    <p className="text-xl mb-2">{(icons && icons.File) || '📁'}</p>
                    <p className="font-semibold">Henüz paylaşılmış bir notunuz bulunmuyor.</p>
                </div>
            )}
        </div>
    );
};
export default UserPostsSection;
