import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
const NotesFeed = () => {

    const [isCreatingNote, setIsCreatingNote] = useState(false);

    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteCourse, setNewNoteCourse] = useState('');
    const [newNoteDescription, setNewNoteDescription] = useState('');


    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'Diferansiyel Denklemler - Temel Kavramlar ve Çözüm Yöntemleri',
            course: 'Diferansiyel Denklemler',
            communityId: 2,
            author: 'Harun Yılmaz',
            authorAvatar: 'https://ui-avatars.com/api/?name=Harun+Y%C4%B1lmaz&background=60A5FA&color=fff&rounded=true&bold=true',
            likes: 25,
            commentsCount: 5,
            date: '2025-04-20',
            description: 'Lineer, non-lineer, tam ve aykırı diferansiyel denklem çözüm yöntemlerine giriş...',
        },
        {
            id: 2,
            title: 'Veri Yapıları - Bağlı Listeler ve Uygulamaları',
            course: 'Veri Yapıları ve Algoritmalar',
            communityId: 1,
            author: 'Ayşe Demir',
            authorAvatar: 'https://ui-avatars.com/api/?name=Ay%C5%9Fe+Demir&background=random&color=fff&rounded=true&bold=true',
            likes: 18,
            commentsCount: 3,
            date: '2025-03-15',
            description: 'Tek yönlü, çift yönlü ve dairesel bağlı listelerin avantajları ve dezavantajları...',
        },
        {
            id: 3,
            title: 'İşletim Sistemleri - CPU Scheduling Algoritmaları Karşılaştırması',
            course: 'İşletim Sistemleri',
            communityId: 1,
            author: 'Mehmet Kaya',
            authorAvatar: 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=random&color=fff&rounded=true&bold=true',
            likes: 32,
            commentsCount: 8,
            date: '2025-02-28',
            description: 'FCFS, SJF, Priority, Round Robin algoritmalarının çalışma prensipleri ve performansları...',
        },
        {
            id: 4,
            title: 'Yapay Zeka - Temel Kavramlar ve Tarihçesi',
            course: 'Yapay Zeka Temelleri',
            communityId: 1,
            author: 'Gizem Arslan',
            authorAvatar: 'https://ui-avatars.com/api/?name=Gizem+Arslan&background=random&color=fff&rounded=true&bold=true',
            likes: 41,
            commentsCount: 12,
            date: '2025-05-01',
            description: 'AI nedir, Turing Testi, dar ve genel yapay zeka arasındaki farklar...',
        },
        {
            id: 5,
            title: 'Calculus I - Türev Uygulamaları: Optimizasyon Problemleri',
            course: 'Calculus I',
            communityId: 2,
            author: 'Caner Kılıç',
            authorAvatar: 'https://ui-avatars.com/api/?name=Caner+K%C4%B1l%C3%A7&background=random&color=fff&rounded=true&bold=true',
            likes: 29,
            commentsCount: 7,
            date: '2025-04-25',
            description: 'Maksimum ve minimum değerlerin bulunması, kritik noktalar ve ikinci türev testi...',
        },
        {
            id: 6,
            title: 'Fizik I - Temel Mekanik Kavramları',
            course: 'Temel Fizik I',
            communityId: 3,
            author: 'Elif Aydın',
            authorAvatar: 'https://ui-avatars.com/api/?name=Elif+Aydin&background=random&color=fff&rounded=true&bold=true',
            likes: 15,
            commentsCount: 4,
            date: '2025-04-10',
            description: 'Hareket, kuvvet, enerji, iş ve güç konularına giriş...',
        },
        {
            id: 7,
            title: 'Kimya Mühendisliği Termodinamiği',
            course: 'Termodinamik',
            communityId: 4,
            author: 'Deniz Arıkan',
            authorAvatar: 'https://ui-avatars.com/api/?name=Deniz+Arikan&background=random&color=fff&rounded=true&bold=true',
            likes: 10,
            commentsCount: 2,
            date: '2025-03-20',
            description: 'Birinci ve ikinci termodinamik yasaları, entropi ve Gibbs serbest enerjisi...',
        },
    ]);

    const [communities, setCommunities] = useState([
        { id: 1, name: 'Bilgisayar Mühendisliği', noteCount: 150, icon: '💻', courses: ['Veri Yapıları ve Algoritmalar', 'İşletim Sistemleri', 'Yapay Zeka Temelleri'] },
        { id: 2, name: 'Matematik', noteCount: 90, icon: '➕', courses: ['Diferansiyel Denklemler', 'Calculus I'] },
        { id: 3, name: 'Fizik', noteCount: 70, icon: '🔬', courses: ['Temel Fizik I'] },
        { id: 4, name: 'Kimya', noteCount: 60, icon: '🧪', courses: ['Termodinamik'] },
        { id: 5, name: 'Elektrik-Elektronik Müh.', noteCount: 110, icon: '⚡', courses: [] },
        { id: 6, name: 'Makine Mühendisliği', noteCount: 85, icon: '⚙️', courses: [] },
    ]);


    const Icons = {
        Calendar: '📅',
        ThumbUp: '👍',
        Comment: '💬',
        Community: '👥',
        Note: '📄',
        PlusCircle: '➕',
    };

    const handleCreateNoteClick = () => {
        setIsCreatingNote(true);
    };

    const handleCancelCreateClick = () => {
        setIsCreatingNote(false);

        setNewNoteTitle('');
        setNewNoteCourse('');
        setNewNoteDescription('');

    };

    const handleCreateNoteSubmit = (e) => {
        e.preventDefault();


        const associatedCommunity = communities.find(comm => comm.courses.includes(newNoteCourse));
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


        setNotes([newNote, ...notes]);

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

    const handleLike = (e, noteId) => {
        e.stopPropagation();
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === noteId ? { ...note, likes: note.likes + 1 } : note
            )
        );
        console.log(`Note ${noteId} liked.`);
    };

    const handleCommentClick = (e, noteId) => {
        e.stopPropagation();

        console.log(`Note ${noteId} yorumlar için tıklandı.`);

    };

    const sortedNotes = useMemo(() => {
        return [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [notes]);


    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sol Sütun: Topluluklar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                            <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span> Topluluklar
                        </h3>
                        <ul className="space-y-3">
                            {/* Tüm Notları Göster seçeneği */}
                            <Link
                                to="/notes"
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${!isCreatingNote && location.pathname === '/notes' ? 'bg-indigo-100 text-indigo-800 font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'}`}
                            >
                                <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({notes.length})
                            </Link>

                            {/* Topluluk Listesi - Link olarak değiştirildi */}
                            {communities.map(community => (
                                <Link
                                    key={community.id}
                                    to={`/community/${community.id}`}
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-gray-100 text-gray-700 font-medium`}
                                >
                                    <span className="text-xl mr-3">{community.icon}</span>
                                    <span className="flex-grow text-sm">{community.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">{community.noteCount} Not</span>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sağ Sütun: Notlar Akışı (Feed) veya Not Oluşturma Formu */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Başlık ve Butonlar */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Başlık artık sadece 'Son Paylaşımlar' veya 'Yeni Not Oluştur' olacak */}
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
                            {isCreatingNote ? 'Yeni Not Oluştur' : 'Son Paylaşımlar'}
                        </h2>
                        <div className="flex items-center space-x-3">
                            {/* Profile Butonu */}
                            {!isCreatingNote && (
                                <Link
                                    to="/profile"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Profil
                                </Link>
                            )}

                            {/* Not Oluştur / İptal Butonu */}
                            {!isCreatingNote ? (
                                <button
                                    onClick={handleCreateNoteClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <span className="mr-2 text-lg">{Icons.PlusCircle}</span> Not Oluştur
                                </button>
                            ) : (
                                <button
                                    onClick={handleCancelCreateClick}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    İptal
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Koşullu Render: Notları Göster veya Formu Göster */}
                    {!isCreatingNote ? (
                        sortedNotes.length > 0 ? (
                            <div className="space-y-6">
                                {sortedNotes.map(note => (
                                    <div key={note.id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col">
                                        {/* Not Kartı İçeriği */}
                                        <div className="flex items-center mb-4">
                                            <img src={note.authorAvatar} alt={note.author} className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-200" />
                                            <div>
                                                <span className="text-sm font-semibold text-gray-700">{note.author}</span>
                                                <p className="text-xs text-gray-500">{note.course}</p>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-indigo-700 mb-2">{note.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.description}</p>

                                        {/* Beğeni ve Yorum Butonları */}
                                        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                                            <span className="flex items-center">
                                                {Icons.Calendar} <span className="ml-1.5">{note.date}</span>
                                            </span>
                                            <div className="flex items-center space-x-4">
                                                {/* Beğeni Butonu */}
                                                     <button
                                                             onClick={(e) => handleLike(e, note.id)}
                                                             className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                                     >
                                                         {Icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes}</span>
                                                     </button>
                                                {/* Yorum Butonu / Linki */}
                                                     <Link
                                                         to={`/not/${note.id}#comments`}
                                                         onClick={(e) => handleCommentClick(e, note.id)}
                                                         className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                                     >
                                                         {Icons.Comment} <span className="ml-1.5 font-medium">{note.commentsCount}</span>
                                                     </Link>
                                            </div>
                                        </div>

                                        {/* Nota Detayı Oku Butonu */}
                                        <Link
                                            to={`/not/${note.id}`}
                                            className="mt-4 w-full text-sm text-indigo-600 font-semibold py-2.5 px-4 border-2 border-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                                        >
                                            Detayı Oku
                                        </Link>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow-lg">
                                <p className="text-xl mb-2">{Icons.Note}</p>
                                <p className="font-semibold">Henüz hiç not paylaşılmamış.</p>
                                <p className="text-sm mt-1">İlk notunu paylaşarak bu alanı canlandır!</p>
                            </div>
                        )
                    ) : (
                      
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
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Notu Paylaş
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default NotesFeed;