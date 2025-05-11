import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

const Community = () => {

    const { communityId } = useParams();

    const selectedCommunityId = parseInt(communityId, 10);


    const [notes, setNotes] = useState([
        {
            id: 1,
            title: 'Diferansiyel Denklemler - Temel Kavramlar ve Çözüm Yöntemleri',
            course: 'Diferansiyel Denklemler',
            communityId: 2, // Matematik
            author: 'Harun Yılmaz',
            authorAvatar: 'https://ui-avatars.com/api/?name=Harun+Y%C4%B1lmaz&background=60A5FA&color=fff&rounded=true&bold=true',
            likes: 25, // Duruyor

            date: '2025-04-20',
            description: 'Lineer, non-lineer, tam ve aykırı diferansiyel denklem çözüm yöntemlerine giriş...',
        },
        {
            id: 2,
            title: 'Veri Yapıları - Bağlı Listeler ve Uygulamaları',
            course: 'Veri Yapıları ve Algoritmalar',
            communityId: 1, // Bilgisayar Müh.
            author: 'Ayşe Demir',
            authorAvatar: 'https://ui-avatars.com/api/?name=Ay%C5%9Fe+Demir&background=random&color=fff&rounded=true&bold=true',
            likes: 18, // Duruyor
            // commentsCount: 3, // Kaldırıldı
            date: '2025-03-15',
            description: 'Tek yönlü, çift yönlü ve dairesel bağlı listelerin avantajları ve dezavantajları...',
        },
        {
            id: 3,
            title: 'İşletim Sistemleri - CPU Scheduling Algoritmaları Karşılaştırması',
            course: 'İşletim Sistemleri',
            communityId: 1, // Bilgisayar Müh.
            author: 'Mehmet Kaya',
            authorAvatar: 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=random&color=fff&rounded=true&bold=true',
            likes: 32, // Duruyor
            // commentsCount: 8, // Kaldırıldı
            date: '2025-02-28',
            description: 'FCFS, SJF, Priority, Round Robin algoritmalarının çalışma prensipleri ve performansları...',
        },
        {
            id: 4,
            title: 'Yapay Zeka - Temel Kavramlar ve Tarihçesi',
            course: 'Yapay Zeka Temelleri',
            communityId: 1, // Bilgisayar Müh.
            author: 'Gizem Arslan',
            authorAvatar: 'https://ui-avatars.com/api/?name=Gizem+Arslan&background=random&color=fff&rounded=true&bold=true',
            likes: 41, // Duruyor
            // commentsCount: 12, // Kaldırıldı
            date: '2025-05-01',
            description: 'AI nedir, Turing Testi, dar ve genel yapay zeka arasındaki farklar...',
        },
        {
            id: 5,
            title: 'Calculus I - Türev Uygulamaları: Optimizasyon Problemleri',
            course: 'Calculus I',
            communityId: 2, // Matematik
            author: 'Caner Kılıç',
            authorAvatar: 'https://ui-avatars.com/api/?name=Caner+K%C4%B1l%C3%A7&background=random&color=fff&rounded=true&bold=true',
            likes: 29, // Duruyor
            // commentsCount: 7, // Kaldırıldı
            date: '2025-04-25',
            description: 'Maksimum ve minimum değerlerin bulunması, kritik noktalar ve ikinci türev testi...',
        },
        {
            id: 6,
            title: 'Fizik I - Temel Mekanik Kavramları',
            course: 'Temel Fizik I',
            communityId: 3, // Fizik Topluluğu
            author: 'Elif Aydın',
            authorAvatar: 'https://ui-avatars.com/api/?name=Elif+Aydin&background=random&color=fff&rounded=true&bold=true',
            likes: 15, // Duruyor
            //  commentsCount: 4, // Kaldırıldı
            date: '2025-04-10',
            description: 'Hareket, kuvvet, enerji, iş ve güç konularına giriş...',
        },
        {
            id: 7,
            title: 'Kimya Mühendisliği Termodinamiği',
            course: 'Termodinamik',
            communityId: 4, // Kimya Topluluğu
            author: 'Deniz Arıkan',
            authorAvatar: 'https://ui-avatars.com/api/?name=Deniz+Arikan&background=random&color=fff&rounded=true&bold=true',
            likes: 10, // Duruyor
            //  commentsCount: 2, // Kaldırıldı
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

    // Basit ikon temsilleri - Yorum ikonu kaldırıldı, Beğeni ikonu duruyor
    const Icons = {
        Calendar: '📅',
        ThumbUp: '👍', // Duruyor
        // Comment: '💬', // Kaldırıldı
        Community: '👥',
        Note: '📄',
        PlusCircle: '➕',
    };

    // Seçili topluluğun bilgilerini bul
    const selectedCommunity = useMemo(() => {
        return communities.find(comm => comm.id === selectedCommunityId);
    }, [communities, selectedCommunityId]);

    // Seçili topluluğa ait notları filtrele
    const filteredCommunityNotes = useMemo(() => {
        // Eğer topluluk bulunamazsa veya id null/undefined ise boş liste döndür
        if (!selectedCommunityId) {
            return [];
        }
        return notes.filter(note => note.communityId === selectedCommunityId);
    }, [notes, selectedCommunityId]);


    const handleLike = (e, noteId) => {
        e.stopPropagation();
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === noteId ? { ...note, likes: note.likes + 1 } : note
            )
        );
        console.log(`Note ${noteId} liked in community.`);
    };


    if (!selectedCommunity) {
        return (
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <div className="text-center text-gray-600">
                    <p className="text-xl font-semibold mb-2">Topluluk Bulunamadı</p>
                    <p>Belirtilen ID ile eşleşen bir topluluk yok.</p>
                    <Link to="/notes" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sol Sütun: Topluluklar (Navigasyon İçin) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                            <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span> Topluluklar
                        </h3>
                        <ul className="space-y-3">
                            {/* Tüm Notları Göster seçeneği */}
                            <Link
                                to="/notes" // Ana not akışına yönlendirme
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                            >
                                <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({notes.length})
                            </Link>

                            {/* Topluluk Listesi - Aktif olanı vurgula */}
                            {communities.map(community => (
                                <Link
                                    key={community.id}
                                    to={`/community/${community.id}`} // Topluluk detay sayfasına yönlendirme
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer ${selectedCommunityId === community.id ? 'bg-indigo-100 text-indigo-800 font-bold' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium'}`}
                                >
                                    <span className="text-xl mr-3">{community.icon}</span>
                                    <span className="flex-grow text-sm">{community.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">{community.noteCount} Not</span>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="lg:col-span-3 space-y-6">
                    {/* Başlık: Topluluk Adı */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight mb-6">
                        {selectedCommunity.name} Notları
                    </h2>

                    {/* Not Listesi */}
                    {filteredCommunityNotes.length > 0 ? (
                        <div className="space-y-6">
                            {filteredCommunityNotes.map(note => (
                                <div key={note.id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col">

                                    <div className="flex items-center mb-4">
                                        <img src={note.authorAvatar} alt={note.author} className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-200" />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700">{note.author}</span>
                                            <p className="text-xs text-gray-500">{note.course}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-indigo-700 mb-2">{note.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.description}</p>


                                    <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100 mt-auto">
                                        <span className="flex items-center">
                                            {Icons.Calendar} <span className="ml-1.5">{note.date}</span>
                                        </span>
                                        <div className="flex items-center">

                                            <button
                                                onClick={(e) => handleLike(e, note.id)}
                                                className="flex items-center text-red-500 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                            >
                                                {Icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes}</span>
                                            </button>

                                        </div>
                                    </div>


                                    <Link
                                        to={`/not/${note.id}`} // Not detay sayfasına link
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
                            <p className="font-semibold">Bu toplulukta henüz not bulunmuyor.</p>
                            <p className="text-sm mt-1">İlk notu sen paylaş!</p>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;