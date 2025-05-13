import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ShareNote = ({
    setIsCreatingNote,
    setNotes,
    setCommunities,
    communities
}) => {
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteCourse, setNewNoteCourse] = useState('');
    const [newNoteDescription, setNewNoteDescription] = useState('');

    const handleCancelCreateClick = () => {
        setIsCreatingNote(false);
        setNewNoteTitle('');
        setNewNoteCourse('');
        setNewNoteDescription('');
    };

    const handleCreateNoteSubmit = (e) => {
        e.preventDefault();

        const associatedCommunity = communities.find(comm =>
            comm.courses.includes(newNoteCourse)
        );
        const communityId = associatedCommunity ? associatedCommunity.id : null;

        const newNoteId = Date.now();
        const newNote = {
            id: newNoteId,
            title: newNoteTitle,
            course: newNoteCourse,
            communityId: communityId,
            author: 'Mevcut Kullanıcı',
            authorAvatar: 'https://ui-avatars.com/api/?name=MK&background=random&color=fff&rounded=true&bold=true',
            likes: 0,
            commentsCount: 0,
            date: new Date().toISOString().slice(0, 10),
            description: newNoteDescription,
        };

        setNotes(prevNotes => [newNote, ...prevNotes]);

        if (communityId !== null) {
            setCommunities(prevCommunities =>
                prevCommunities.map(comm =>
                    comm.id === communityId ? { ...comm, noteCount: comm.noteCount + 1 } : comm
                )
            );
        }

        setNewNoteTitle('');
        setNewNoteCourse('');
        setNewNoteDescription('');
        setIsCreatingNote(false);

        console.log('Yeni Not Oluşturuldu:', newNote);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <form onSubmit={handleCreateNoteSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newNoteTitle" className="block text-sm font-medium text-gray-700">
                        Not Başlığı
                    </label>
                    <input
                        type="text"
                        id="newNoteTitle"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newNoteCourse" className="block text-sm font-medium text-gray-700">
                        Ders Adı (Örn: Veri Yapıları, Diferansiyel Denklemler)
                    </label>
                    <input
                        type="text"
                        id="newNoteCourse"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={newNoteCourse}
                        onChange={(e) => setNewNoteCourse(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newNoteDescription" className="block text-sm font-medium text-gray-700">
                        Not İçeriği / Açıklaması
                    </label>
                    <textarea
                        id="newNoteDescription"
                        rows="6"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        value={newNoteDescription}
                        onChange={(e) => setNewNoteDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleCancelCreateClick}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Notu Paylaş
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShareNote;
