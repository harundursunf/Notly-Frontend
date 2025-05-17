import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ShareNote from './ShareNote'; // ShareNote bileşenini import et

const Profile = () => {
    const navigate = useNavigate();


    const [isSharingNote, setIsSharingNote] = useState(false);


    const [activeTab, setActiveTab] = useState('posts');


    const user = {
        name: 'Harun Yılmaz',
        university: 'Atatürk Üniversitesi',
        department: 'Bilgisayar Mühendisliği',
        bio: '4. sınıf öğrencisi. Not paylaşmayı ve yeni şeyler öğrenmeyi sever. Kahve tutkunu.',
        avatar: 'https://ui-avatars.com/api/?name=Harun+Y%C4%B1lmaz&background=60A5FA&color=fff&font-size=0.5&bold=true&length=2&rounded=true',
    };


    const [enrolledCourses, setEnrolledCourses] = useState(['Diferansiyel Denklemler', 'Veri Yapıları ve Algoritmalar', 'İşletim Sistemleri', 'Yapay Zeka Temelleri', 'Algoritma Analizi', 'Bilgisayar Ağları', 'Veri Tabanı Sistemleri']);


    const [postedNotes, setPostedNotes] = useState([
        { id: 1, title: 'Diferansiyel Denklemler - Laplace Dönüşümleri ve Uygulamaları', likes: 25, date: '2025-04-20', course: 'Diferansiyel Denklemler' },
        { id: 2, title: 'Veri Yapıları - Kapsamlı Graf Algoritmaları Rehberi', likes: 18, date: '2025-03-15', course: 'Veri Yapıları ve Algoritmalar' },
        { id: 3, title: 'İşletim Sistemleri - Modern Bellek Yönetimi Teknikleri', likes: 32, date: '2025-02-28', course: 'İşletim Sistemleri' },
        { id: 8, title: 'Yapay Zeka - Regresyon Analizi', likes: 15, date: '2025-05-10', course: 'Yapay Zeka Temelleri' },
        { id: 9, title: 'Algoritma Analizi - Zaman ve Alan Karmaşıklığı', likes: 22, date: '2025-05-08', course: 'Algoritma Analizi' },
    ]);


    const [likedNotes, setLikedNotes] = useState([
        { id: 4, title: 'İşletim Sistemleri - CPU Scheduling Stratejileri', author: 'Ayşe Demir', course: 'İşletim Sistemleri', likes: 45 },
        { id: 5, title: 'Lineer Cebir - Vektör Uzayları ve Temel Kavramlar Özeti', author: 'Mehmet Kaya', course: 'Lineer Cebir', likes: 30 },
        { id: 10, title: 'Fizik II - Elektromanyetizma', author: 'Zeynep Çelik', course: 'Temel Fizik II', likes: 55 },
    ]);


    const [communities, setCommunities] = useState([
        { id: 1, name: 'Bilgisayar Mühendisliği', noteCount: 150, icon: '💻', courses: ['Veri Yapıları ve Algoritmalar', 'İşletim Sistemleri', 'Yapay Zeka Temelleri', 'Algoritma Analizi', 'Bilgisayar Ağları', 'Veri Tabanı Sistemleri'] },
        { id: 2, name: 'Matematik', noteCount: 90, icon: '➕', courses: ['Diferansiyel Denklemler', 'Calculus I'] },
        { id: 3, name: 'Fizik', noteCount: 70, icon: '🔬', courses: ['Temel Fizik I', 'Temel Fizik II'] },
        { id: 4, name: 'Kimya', noteCount: 60, icon: '🧪', courses: ['Termodinamik'] },
        { id: 5, name: 'Elektrik-Elektronik Müh.', noteCount: 110, icon: '⚡', courses: [] },
        { id: 6, name: 'Makine Mühendisliği', noteCount: 85, icon: '⚙️', courses: [] },
    ]);


    // Kullanılacak ikonlar
    const Icons = {
        Course: '🎓',
        LikeFill: '❤️',
        Calendar: '📅',
        ThumbUp: '👍',
        UserCircle: '👤',
        Share: '📤',
        File: '📁',
        Image: '🖼️',
        PDF: '📄',
        Text: '📝',
        XCircle: '❌',
        Back: '⬅️', // SVG yerine emoji ikon kullanıldı
        PlusCircle: '➕', // Not oluştur ikonu
    };


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setIsSharingNote(false);

    };


    const goToHomepage = () => {
        navigate('/notes');
    };


    const handleShareNoteClick = () => {
        setIsSharingNote(true);
        setActiveTab('posts');
    };


    const getFileIcon = (fileType) => {
        if (!fileType) return Icons.File;
        if (fileType.startsWith('text/')) return Icons.Text;
        if (fileType.startsWith('image/')) return Icons.Image;
        if (fileType === 'application/pdf') return Icons.PDF;
        return Icons.File;
    };


    const handleNewNoteShared = (newNote) => {
        setPostedNotes(prevNotes => [newNote, ...prevNotes]);

        if (newNote.communityId !== null) {
            setCommunities(prevCommunities =>
                prevCommunities.map(comm =>
                    comm.id === newNote.communityId ? { ...comm, noteCount: comm.noteCount + 1 } : comm
                )
            );
        }
        setIsSharingNote(false);
    };


    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">


                <div className="p-5 sm:p-7 border-b border-gray-200 flex justify-start items-center">
                    <button
                        onClick={goToHomepage}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold group transition-colors duration-200"
                    >

                        <span className="mr-2 text-lg transform transition-transform group-hover:-translate-x-1">{Icons.Back}</span> Anasayfaya Dön
                    </button>
                </div>

                {/* Kullanıcı Bilgileri */}
                <div className="relative pt-8 pb-10 text-center px-4 sm:px-6">
                    {/* Avatar */}
                    <img
                        src={user.avatar}
                        alt="avatar"
                        className="mx-auto w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl -mt-16 bg-white"
                    />
                    {/* İsim */}
                    <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">{user.name}</h1>
                    {/* Üniversite ve Bölüm */}
                    <p className="mt-2 text-md sm:text-lg text-indigo-700 font-medium">
                        {user.university} – {user.department}
                    </p>
                    {/* Biyografi */}
                    <p className="mt-4 max-w-xl mx-auto text-gray-700 leading-relaxed text-sm sm:text-base">
                        {user.bio}
                    </p>
                </div>

                {/* İstatistikler */}
                <div className="flex flex-wrap justify-around py-6 sm:py-7 border-t border-b border-gray-300 bg-gray-50 px-4 sm:px-6">
                    <div className="text-center p-2 min-w-[100px]">
                        <p className="text-2xl font-bold text-indigo-700">{postedNotes.length}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Paylaşım</p>
                    </div>
                    <div className="text-center p-2 min-w-[100px]">
                        <p className="text-2xl font-bold text-indigo-700">{enrolledCourses.length}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Ders</p>
                    </div>
                    <div className="text-center p-2 min-w-[100px]">
                        <p className="text-2xl font-bold text-indigo-700">{likedNotes.length}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Beğeni</p>
                    </div>
                </div>

                {/* Sekmeler ve İçerik */}
                <div className="p-8 sm:p-10">
                    {/* Sekme Butonları */}
                    <div className="flex border-b border-gray-300 mb-6">
                        <button
                            onClick={() => handleTabChange('posts')}
                            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors duration-200 ${activeTab === 'posts' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
                        >
                            Paylaşımlar ({postedNotes.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('liked')}
                            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors duration-200 ${activeTab === 'liked' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
                        >
                            Beğenilenler ({likedNotes.length})
                        </button>
                        <button
                            onClick={() => handleTabChange('courses')}
                            className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-colors duration-200 ${activeTab === 'courses' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:text-gray-800 border-b-2 border-transparent'}`}
                        >
                            Dersler ({enrolledCourses.length})
                        </button>
                    </div>

                    {/* Sekme İçeriği */}
                    <div className="tab-content">
                        {/* Paylaşımlar Sekmesi */}
                        {activeTab === 'posts' && (
                            <div>
                                {/* Başlık ve Not Paylaş Butonu */}
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                        {/* PDF ikonu sadece paylaşılan notlar için kullanıldı */}
                                        <span className={`mr-2 text-blue-600`}>{Icons.PDF}</span> Paylaştığı Notlar
                                    </h3>
                                    {!isSharingNote ? (
                                        <button
                                            onClick={handleShareNoteClick}
                                            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
                                        >
                                            <span className="mr-2 text-lg">{Icons.PlusCircle}</span> Not Paylaş
                                        </button>
                                    ) : (

                                        null
                                    )}
                                </div>


                                {!isSharingNote ? (

                                    postedNotes.length > 0 ? (
                                        <ul className="space-y-6">
                                            {postedNotes.map(note => (
                                                <li key={note.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 group cursor-pointer">
                                                    <h4 className="text-lg font-semibold text-indigo-800 group-hover:text-indigo-900 transition-colors">{note.title}</h4>
                                                    <p className="text-xs text-gray-600 mt-1 mb-3">Ders: <span className="font-medium text-indigo-600">{note.course}</span></p>
                                                    {note.file && (
                                                        <div className="flex items-center text-sm text-gray-700 mb-2">
                                                            {getFileIcon(note.file.type)} <span className="ml-1.5">{note.file.name}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                                                        <span className="flex items-center mb-2 sm:mb-0">
                                                            {Icons.Calendar} <span className="ml-1.5">{note.date}</span>
                                                        </span>
                                                        <span className="flex items-center text-red-600">
                                                            {Icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes} Beğeni</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (

                                        <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-lg">
                                            <p className="text-xl mb-2">{Icons.PDF}</p>
                                            <p className="font-semibold">Henüz paylaşılmış not bulunmuyor.</p>
                                            <p className="text-sm mt-1">İlk notunu paylaşmak için yukarıdaki butonu kullan!</p>
                                        </div>
                                    )
                                ) : (

                                    <ShareNote
                                        setIsCreatingNote={setIsSharingNote}
                                        setNotes={setPostedNotes}
                                        setCommunities={setCommunities}
                                        communities={communities}
                                    />
                                )}
                            </div>
                        )}


                        {activeTab === 'liked' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="text-rose-600 mr-2">{Icons.LikeFill}</span> Beğendiği Notlar
                                </h3>
                                {likedNotes.length > 0 ? (
                                    <ul className="space-y-6">
                                        {likedNotes.map(note => (
                                            <li key={note.id} className="p-6 bg-rose-50 hover:bg-rose-100 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer border border-rose-100">
                                                <p className="font-medium text-sm text-gray-800">{note.title}</p>
                                                <p className="text-xs text-gray-600 mt-1">{Icons.UserCircle} {note.author} • {note.course}</p>
                                                {note.likes !== undefined && (
                                                    <span className="flex items-center text-red-600 text-sm mt-2">
                                                        {Icons.ThumbUp} <span className="ml-1.5 font-medium">{note.likes} Beğeni</span>
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (

                                    <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-lg">
                                        <p className="text-xl mb-2">{Icons.LikeFill}</p>
                                        <p className="font-semibold">Henüz beğendiğin bir not yok.</p>
                                        <p className="text-sm mt-1">Ana sayfadaki notlara göz at!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dersler Sekmesi */}
                        {activeTab === 'courses' && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="text-indigo-600 mr-2">{Icons.Course}</span> Kayıtlı Dersler
                                </h3>
                                {enrolledCourses.length > 0 ? (
                                    <ul className="space-y-3">
                                        {enrolledCourses.map((course, index) => (
                                            <li key={index} className="p-4 bg-sky-50 hover:bg-sky-100 transition-all duration-200 rounded-lg text-gray-700 text-sm font-medium shadow-sm hover:shadow-md cursor-pointer border border-sky-100">
                                                {course}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (

                                    <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-lg">
                                        <p className="text-xl mb-2">{Icons.Course}</p>
                                        <p className="font-semibold">Henüz kayıtlı olduğun bir ders yok.</p>
                                        <p className="text-sm mt-1">Profilini güncelleyerek derslerini ekleyebilirsin!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
