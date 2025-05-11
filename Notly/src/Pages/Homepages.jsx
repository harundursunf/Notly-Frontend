import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
    const latestNotes = [
        { id: 1, title: 'Calculus I - Limit ve Süreklilik Detaylı Anlatım', course: 'Calculus I', author: 'Elif Aydın', likes: 45, date: '2025-05-10', avatar: 'https://ui-avatars.com/api/?name=Elif+Ayd%C4%B1n&background=random&color=fff&rounded=true&bold=true' },
        { id: 2, title: 'Python ile Nesne Yönelimli Programlama Esasları', course: 'Programlama Temelleri', author: 'Mehmet Özkan', likes: 62, date: '2025-05-09', avatar: 'https://ui-avatars.com/api/?name=Mehmet+%C3%96zkan&background=random&color=fff&rounded=true&bold=true' },
        { id: 3, title: 'Organik Kimya: Alkanlar, Alkenler ve Alkinler Konu Özeti', course: 'Organik Kimya', author: 'Zeynep Kaya', likes: 38, date: '2025-05-08', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=random&color=fff&rounded=true&bold=true' },
    ];

    const popularCourses = [
        { id: 1, name: 'Veri Yapıları ve Algoritmalar', noteCount: 120, icon: '📚', color: 'bg-sky-100 text-sky-700', hoverColor: 'hover:bg-sky-200' },
        { id: 2, name: 'İşletim Sistemleri', noteCount: 95, icon: '💻', color: 'bg-indigo-100 text-indigo-700', hoverColor: 'hover:bg-indigo-200' },
        { id: 3, name: 'Diferansiyel Denklemler', noteCount: 88, icon: '📈', color: 'bg-emerald-100 text-emerald-700', hoverColor: 'hover:bg-emerald-200' },
        { id: 4, name: 'Fizik I: Mekanik', noteCount: 75, icon: '⚙️', color: 'bg-amber-100 text-amber-700', hoverColor: 'hover:bg-amber-200' },
    ];

    const features = [
        { title: 'Kolay Arama', description: 'Binlerce nota ders, konu veya anahtar kelime ile anında ulaşın.', icon: '🔍', color: 'text-blue-500 bg-blue-100' },
        { title: 'Not Paylaş', description: 'Kendi notlarınızı yükleyerek diğer öğrencilere yardımcı olun.', icon: '📤', color: 'text-green-500 bg-green-100' },
        { title: 'Organize İçerik', description: 'Derslere ve konulara göre düzenlenmiş zengin not arşivini keşfedin.', icon: '📂', color: 'text-purple-500 bg-purple-100' },
        { title: 'Toplulukla Etkileşim', description: 'Notları oylayın, yorum yapın ve favorilerinize ekleyin.', icon: '💬', color: 'text-red-500 bg-red-100' },
    ];

    const Icons = {
        Search: '🔍',
        AddNote: '➕',
        Sparkles: '✨',
        ChevronRight: '❯',
        Calendar: '📅',
        ThumbUp: '👍',
        User: '👤'
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative bg-gradient-to-br from-indigo-700 via-blue-600 to-sky-500 text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
                        Üniversite Notlarının <span className="block sm:inline text-sky-300 drop-shadow-md">Yeni Adresi</span>
                    </h1>
                    <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
                        Aradığın tüm ders notlarına kolayca ulaş, kendi notlarını paylaşarak bilgi havuzuna katkıda bulun. Başarıya giden yolda en büyük yardımcın!
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                        <div className="relative w-full sm:w-auto max-w-md sm:max-w-lg flex-grow">
                            <input
                                type="text"
                                placeholder="Hangi dersi veya konuyu arıyorsun?"
                                className="w-full py-4 px-6 pr-14 text-gray-800 bg-white rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300/70 transition duration-300 placeholder-gray-500"
                            />
                            <button className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-2.5 text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition">
                                <span className="text-xl">{Icons.Search}</span>
                            </button>
                        </div>

                        <button className="w-full sm:w-auto bg-sky-400 hover:bg-sky-500 text-white font-semibold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center text-lg">
                            <span className="mr-2">{Icons.AddNote}</span> Not Ekle
                        </button>

                        <Link
                            to="/notes"
                            className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center text-lg hover:bg-white hover:text-indigo-700"
                        >
                            Tüm Paylaşımlara Göz At
                        </Link>

                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">Platformumuzla Neler Yapabilirsiniz?</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Öğrencilerin akademik hayatını kolaylaştırmak için tasarlanmış özellikler.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className={`text-3xl p-4 rounded-full mb-5 ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-10 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight mb-4 sm:mb-0">
                            <span className="text-indigo-500">{Icons.Sparkles}</span> Son Eklenen Notlar
                        </h2>
                        <a href="/notlar" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center group text-md px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors">
                            Tüm Notları Gör <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform">{Icons.ChevronRight}</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        {latestNotes.map(note => (
                            <div key={note.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col cursor-pointer">
                                <div className="p-6 flex-grow">
                                    <div className="flex items-center mb-4">
                                        <img src={note.avatar} alt={note.author} className="w-10 h-10 rounded-full mr-3 border-2 border-indigo-200" />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-700">{note.author}</span>
                                            <p className="text-xs text-gray-500">{note.course}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-indigo-700 group-hover:text-indigo-900 mb-2 min-h-[3em] line-clamp-2">{note.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-4 mt-auto">
                                        <span className="flex items-center"><span className="mr-1">{Icons.Calendar}</span> {note.date}</span>
                                        <span className="flex items-center text-red-500"><span className="mr-1">{Icons.ThumbUp}</span> <span className="font-medium">{note.likes} Beğeni</span></span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 group-hover:bg-indigo-500 text-center py-3.5 px-6 text-sm font-medium text-indigo-600 group-hover:text-white transition-all duration-300">
                                    Detayları Gör
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">Popüler Dersler</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">En çok not bulunan ve ilgi gören dersleri keşfedin, hemen öğrenmeye başlayın.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {popularCourses.map(course => (
                            <a href={`/dersler/${course.name.toLowerCase().replace(/\s+/g, '-')}`} key={course.id}
                                className={`block p-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 group ${course.color} ${course.hoverColor} hover:scale-105`}>
                                <div className="text-4xl mb-4">{course.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-inherit mb-1.5">{course.name}</h3>
                                <p className="text-sm opacity-80 group-hover:opacity-100">{course.noteCount} Not Mevcut</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 sm:py-28 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        Bilgi Paylaşım Ağına Katılın, Başarınızı Artırın!
                    </h2>
                    <p className="mt-5 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                        Hemen ücretsiz üye olun, notlarınızı paylaşmaya başlayın ve binlerce öğrencinin ders notlarına sınırsız erişim sağlayın.
                    </p>
                    <div className="mt-10">
                        {/* Bu a tag'inin yapısı düzeltildi */}
                        <a
                            href="/register"
                            className="inline-block bg-white text-indigo-600 font-semibold py-4 px-12 rounded-lg shadow-xl hover:bg-sky-100 transform hover:scale-105 transition duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-sky-300/50"
                        >
                            Hemen Ücretsiz Başla
                        </a>
                    </div>
                </div>
            </section>
        </div>
 );
};

export default Homepage;