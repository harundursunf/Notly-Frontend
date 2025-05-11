import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const communities = [
    { id: 1, name: 'Bilgisayar Mühendisliği', noteCount: 150, icon: '💻', courses: ['Veri Yapıları ve Algoritmalar', 'İşletim Sistemleri', 'Yapay Zeka Temelleri'] },
    { id: 2, name: 'Matematik', noteCount: 90, icon: '➕', courses: ['Diferansiyel Denklemler', 'Calculus I'] },
    { id: 3, name: 'Fizik', noteCount: 70, icon: '🔬', courses: ['Temel Fizik I'] },
    { id: 4, name: 'Kimya', noteCount: 60, icon: '🧪', courses: ['Termodinamik'] },
    { id: 5, name: 'Elektrik-Elektronik Müh.', noteCount: 110, icon: '⚡', courses: [] },
    { id: 6, name: 'Makine Mühendisliği', noteCount: 85, icon: '⚙️', courses: [] },
];

const staticNotes = [
    {
        id: 1,
        title: 'Diferansiyel Denklemler - Temel Kavramlar ve Çözüm Yöntemleri',
        course: 'Diferansiyel Denklemler',
        communityId: 2,
        author: 'Harun Yılmaz',
        authorAvatar: 'https://ui-avatars.com/api/?name=Harun+Y%C4%B1lmaz&background=60A5FA&color=fff&rounded=true&bold=true',
        likes: 25,
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
        date: '2025-03-15',
        description: 'Tek yönlü, çift yönlü ve dairesel bağlı listelerin avantajları ve dezavantajları. Tek yönlü bağlı liste (Singly Linked List) temel tanımı, düğüm yapısı (node structure), ekleme (insertion), silme (deletion) ve arama (searching) işlemleri. Çift yönlü bağlı liste (Doubly Linked List) yapısı, avantajları ve temel operasyonları. Dairesel bağlı liste (Circular Linked List) tanımı ve kullanım alanları. Bağlı listelerin dizi (array) tabanlı verilere göre bellek kullanımı ve performans farkları. Gerçek dünya uygulamalarından örnekler.',
    },
    {
        id: 3,
        title: 'İşletim Sistemleri - CPU Scheduling Algoritmaları Karşılaştırması',
        course: 'İşletim Sistemleri',
        communityId: 1,
        author: 'Mehmet Kaya',
        authorAvatar: 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=random&color=fff&rounded=true&bold=true',
        likes: 32,
        date: '2025-02-28',
        description: 'CPU Scheduling algoritmalarının temel amacı, işlemçiyi verimli kullanarak sistem performansını artırmaktır. Bu notta, Yaygın olarak kullanılan algoritmalar incelenecektir: First-Come, First-Served (FCFS), Shortest Job Next (SJN), Priority Scheduling, Round Robin. Her bir algoritmanın çalışma prensibi, avantajları, dezavantajları ve performansı üzerindeki etkileri karşılaştırılacaktır. Gantt şemaları üzerinden örnek uygulamalar da not içinde yer almaktadır.',
    },
    {
        id: 4,
        title: 'Yapay Zeka - Temel Kavramlar ve Tarihçesi',
        course: 'Yapay Zeka Temelleri',
        communityId: 1,
        author: 'Gizem Arslan',
        authorAvatar: 'https://ui-avatars.com/api/?name=Gizem+Arslan&background=random&color=fff&rounded=true&bold=true',
        likes: 41,
        date: '2025-05-01',
        description: 'Yapay Zeka (AI) nedir? Temel tanımı, hedefleri ve farklı yaklaşımlar (dar AI, genel AI, süper AI). Turing Testi ve önemi. AI alanındaki önemli dönüm noktaları ve tarihsel gelişmeler. Sembolik AI dönemi, Makine Öğrenimi (Machine Learning) ve Derin Öğrenme (Deep Learning) kavramlarına giriş. Günümüzde AI\'ın kullanım alanları ve gelecekteki potansiyeli.',
    },
    {
        id: 5,
        title: 'Calculus I - Türev Uygulamaları: Optimizasyon Problemleri',
        course: 'Calculus I',
        communityId: 2,
        author: 'Caner Kılıç',
        authorAvatar: 'https://ui-avatars.com/api/?name=Caner+K%C4%B1l%C3%A7&background=random&color=fff&rounded=true&bold=true',
        likes: 29,
        date: '2025-04-25',
        description: 'Türevin fiziksel ve geometrik yorumları. Bir fonksiyonun maksimum ve minimum değerlerinin bulunması. Kritik noktalar, birinci türev testi ve ikinci türev testi kullanarak yerel ve mutlak ekstremumlerin belirlenmesi. Gerçek hayattan optimizasyon problemleri (alanı maksimize etme, maliyeti minimize etme gibi) ve bu problemlerin çözümünde türevin nasıl kullanıldığına dair örnekler.',
    },
    {
        id: 6,
        title: 'Fizik I - Temel Mekanik Kavramları',
        course: 'Temel Fizik I',
        communityId: 3,
        author: 'Elif Aydın',
        authorAvatar: 'https://ui-avatars.com/api/?name=Elif+Aydin&background=random&color=fff&rounded=true&bold=true',
        likes: 15,
        date: '2025-04-10',
        description: 'Fizik I dersinin temel mekanik konularına genel bakış. Kinematik: Bir ve iki boyutta hareket, yer değiştirme, hız, ivme kavramları. Dinamik: Newton\'un Hareket Yasaları, kuvvet, kütle, eylemsizlik. İş, Enerji ve Güç: İş-Enerji teoremi, potansiyel ve kinetik enerji, enerjinin korunumu yasası. Momentum ve İtme: Doğrusal momentumun korunumu.',
    },
    {
        id: 7,
        title: 'Kimya Mühendisliği Termodinamiği',
        course: 'Termodinamik',
        communityId: 4,
        author: 'Deniz Arıkan',
        authorAvatar: 'https://ui-avatars.com/api/?name=Deniz+Arikan&background=random&color=fff&rounded=true&bold=true',
        likes: 10,
        date: '2025-03-20',
        description: 'Kimya Mühendisliği bakış açısıyla termodinamiğin prensipleri. Sistem ve çevre kavramları. Termodinamiğin Sıfırıncı Yasası (Sıcaklık). Termodinamiğin Birinci Yasası: Enerjinin Korunumu, iç enerji, ısı ve iş. İdeal Gazlar ve Termodinamik Süreçler. Termodinamiğin İkinci Yasası: Entropi, geri dönüşümlü ve geri dönüşümsüz süreçler, Carnot Çevrimi, termodinamik verimlilik. Termodinamiğin Üçüncü Yasası. Gibbs Serbest Enerjisi ve Kimyasal Denge.',
    },
];

const Icons = {
    Calendar: '📅',
    ThumbUp: '👍',
    Community: '👥',
    Note: '📄',
    ArrowLeft: '⬅️',
};


const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [noteDetail, setNoteDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const noteId = parseInt(id, 10);

        const foundNote = staticNotes.find(note => note.id === noteId);

        if (foundNote) {
            setNoteDetail(foundNote);
            setLoading(false);
        } else {
            setError('Üzgünüz, aradığınız not bulunamadı.');
            setLoading(false);
        }


    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                                <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span> Topluluklar
                            </h3>
                            <ul className="space-y-3">
                                <Link
                                    to="/notes"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                                >
                                    <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({staticNotes.length})
                                </Link>
                                {communities.map(community => (
                                    <Link
                                        key={community.id}
                                        to={`/Community/${community.id}`}
                                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                                    >
                                        <span className="text-xl mr-3">{community.icon}</span>
                                        <span className="flex-grow text-sm">{community.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">{community.noteCount} Not</span>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-3 flex items-center justify-center">
                        <p className="text-gray-600 text-lg">Yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !noteDetail) {
        return (
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
                    <div className="lg:col-span-1">
                           <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                                    <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span> Topluluklar
                                </h3>
                                <ul className="space-y-3">
                                    <Link
                                         to="/notes"
                                         className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                                    >
                                         <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({staticNotes.length})
                                    </Link>
                                    {communities.map(community => (
                                         <Link
                                             key={community.id}
                                             to={`/Community/${community.id}`}
                                             className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                                         >
                                              <span className="text-xl mr-3">{community.icon}</span>
                                              <span className="flex-grow text-sm">{community.name}</span>
                                              <span className="text-xs text-gray-500 ml-2">{community.noteCount} Not</span>
                                         </Link>
                                    ))}
                                </ul>
                           </div>
                    </div>

                    <div className="lg:col-span-3 flex flex-col items-center justify-center text-center">
                           <p className="text-red-600 text-lg mb-4">{error || 'Not bulunamadı.'}</p>
                           <button
                                onClick={handleGoBack}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                           >
                                Anasayfaya Dön
                           </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sol Sütun: Topluluklar - Sabit Kalacak */}
                <div className="lg:col-span-1">
                   <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
                            <span className="text-indigo-500 mr-3 text-2xl">{Icons.Community}</span> Topluluklar
                        </h3>
                        <ul className="space-y-3">
                            <Link
                               to="/notes"
                               className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                            >
                                <span className="text-xl mr-3 text-gray-500">{Icons.Note}</span> Tüm Notlar ({staticNotes.length})
                            </Link>
                           {communities.map(community => (
                                <Link
                                    key={community.id}
                                    to={`/Community/${community.id}`}
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium`}
                                >
                                    <span className="text-xl mr-3">{community.icon}</span>
                                    <span className="flex-grow text-sm">{community.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">{community.noteCount} Not</span>
                                </Link>
                           ))}
                        </ul>
                    </div>
                </div>


                {/* Sağ Sütun: Not Detayları */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Geri Dön Butonu */}
                    <div className="mb-6">
                        <button
                            onClick={handleGoBack}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Anasayfaya Dön
                        </button>
                    </div>

                    {/* Not Detayı Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
                        {/* Yazar ve Ders */}
                        <div className="flex items-center border-b border-gray-100 pb-4">
                           <img src={noteDetail.authorAvatar} alt={noteDetail.author} className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-200" />
                           <div>
                                <span className="text-md font-semibold text-gray-700">{noteDetail.author}</span>
                                <p className="text-sm text-gray-500">{noteDetail.course}</p>
                           </div>
                        </div>

                        {/* Başlık */}
                       <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">{noteDetail.title}</h1>

                        {/* Not İçeriği / Açıklaması */}
                       <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{noteDetail.description}</p>

                        {/* Meta Bilgileri (Tarih ve Beğeni) */}
                        <div className="flex justify-start items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                             <span className="flex items-center mr-6">
                                  {Icons.Calendar} <span className="ml-1.5">{noteDetail.date}</span>
                             </span>
                             {/* Sadece beğeni kaldı */}
                             <span className="flex items-center text-red-500">
                                  {Icons.ThumbUp} <span className="ml-1.5 font-medium">{noteDetail.likes} Beğeni</span>
                             </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;