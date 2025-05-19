// src/Components/UserPostsSection.jsx (Yeni dosya)
import React from 'react';
import ShareNote from '../../Pages/ShareNote'; // ShareNote'un doğru yolunu belirtin

const UserPostsSection = ({
    postedNotes,
    isSharingNote,
    onShareNoteClick,
    onSetIsSharingNote, // ShareNote'un kendini kapatabilmesi için
    onNoteShared,       // Yeni not paylaşıldığında ana bileşeni bilgilendirmek için
    enrolledCoursesForSharing, // ShareNote için ders listesi
    icons
}) => {
    const getFileIcon = (fileType) => { // Bu yardımcı fonksiyonu buraya taşıyabilir veya dışarıdan alabilirsiniz
        if (!fileType) return icons.File;
        if (fileType.startsWith('text/')) return icons.Text;
        if (fileType.startsWith('image/')) return icons.Image;
        if (fileType === 'application/pdf') return icons.PDF;
        return icons.File;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className={`mr-2 text-blue-600`}>{icons.PDF}</span> Paylaştığı Notlar
                </h3>
                {!isSharingNote && (
                    <button
                        onClick={onShareNoteClick}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
                    >
                        <span className="mr-2 text-lg">{icons.PlusCircle}</span> Not Paylaş
                    </button>
                )}
            </div>
            {!isSharingNote ? (
                postedNotes.length > 0 ? (
                    <ul className="space-y-6">
                        {postedNotes.map(note => (
                            <li key={note.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group cursor-pointer">
                                <h4 className="text-lg font-semibold text-indigo-800 group-hover:text-indigo-900 transition-colors">{note.title}</h4>
                                <p className="text-xs text-gray-600 mt-1 mb-3">Ders: <span className="font-medium text-indigo-600">{note.course}</span></p>
                                {note.file && ( // Eğer dosya bilgisi varsa
                                    <div className="flex items-center text-sm text-gray-700 mb-2">
                                        {getFileIcon(note.file.type)} <span className="ml-1.5">{note.file.name}</span>
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                                    <span className="flex items-center mb-2 sm:mb-0">
                                        {icons.Calendar} <span className="ml-1.5">{note.date}</span>
                                    </span>
                                    <span className="flex items-center text-red-600">
                                        {icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes} Beğeni</span>
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-lg">
                        <p className="text-xl mb-2">{icons.PDF}</p>
                        <p className="font-semibold">Henüz paylaşılmış not bulunmuyor.</p>
                        <p className="text-sm mt-1">İlk notunu paylaşmak için yukarıdaki butonu kullan!</p>
                    </div>
                )
            ) : (
                <ShareNote
                    setIsCreatingNote={onSetIsSharingNote}
                    onNoteShared={onNoteShared}
                    enrolledCourses={enrolledCoursesForSharing}
                    // communities={communities} // Eğer ShareNote toplulukları kullanıyorsa
                />
            )}
        </div>
    );
};

export default UserPostsSection;