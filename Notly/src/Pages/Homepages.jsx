import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

// SVG Icons for features (simple placeholders, replace with your own or a library like Heroicons)
const IconSearch = () => <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const IconUpload = () => <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>;
const IconCollection = () => <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
const IconCommunity = () => <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;


const HomepageHeader = ({ logoSrc }) => {
    return (
        <header className="bg-white/95 backdrop-blur-lg shadow-md sticky top-0 z-50 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 group" aria-label="Anasayfa">
                            <img
                                className="h-10 sm:h-12 w-auto transition-transform duration-300 ease-in-out group-hover:scale-110"
                                src={logoSrc}
                                alt="Site Logosu"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            to="/login" // Or your main content/notes page
                            className="hidden sm:inline-block text-sm font-medium text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                        >
                            Notlara Göz At
                        </Link>
                        <Link
                            to="/register" // Or your login page
                            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Giriş Yap / Kayıt Ol
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

const Homepage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Işık Hızında Arama',
            description: 'Ders kodu, profesör adı veya en ince detayına kadar anahtar kelimelerle aradığın nota saniyeler içinde ulaş. Zamanın kıymetli!',
            icon: <IconSearch />,
            accentColor: 'text-sky-500',
            bgColor: 'bg-sky-50',
        },
        {
            title: 'Bilgini Paylaş, İz Bırak',
            description: 'Özenle hazırladığın notlarını yükle, binlerce öğrenciye ilham ol. Bilgi paylaştıkça çoğalır, etkin de öyle!',
            icon: <IconUpload />,
            accentColor: 'text-emerald-500',
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Kusursuz Düzen, Kolay Erişim',
            description: 'Fakülte, ders ve konulara göre özenle sınıflandırılmış devasa not arşivinde kaybolmadan aradığını bulmanın keyfini çıkar.',
            icon: <IconCollection />,
            accentColor: 'text-purple-500',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Canlı Topluluk, Güçlü Etkileşim',
            description: 'Notları oyla, yapıcı yorumlar bırak, favorilerini belirle ve diğer öğrencilerle aktif bir öğrenme ağı kur.',
            icon: <IconCommunity />,
            accentColor: 'text-rose-500',
            bgColor: 'bg-rose-50',
        },
    ];

    // **IMPORTANT**: Replace this with the actual path to YOUR beautiful photo that includes your logo
    const userHeroImageWithPath = "/Logo.jpg"; // e.g., '/images/my-brand-hero.png'
    // You can also use the image I generated: 'REPLACE_WITH_GENERATED_IMAGE_CONTENT_ID' (see link above the code)

    // This is for your separate logo file (e.g., a transparent PNG of just the logo mark/text)
    const siteLogoPath = "/logo3.jpg"; // e.g., '/images/site-logo.png'

    return (
        <div className="min-h-screen bg-slate-50 antialiased">
            <HomepageHeader logoSrc={siteLogoPath} />

            {/* HERO SECTION - Designed for your "beautiful photo with logo" */}
            <section
                className="relative bg-cover bg-center text-white py-28 md:py-40 px-6 flex items-center justify-center"
                style={{ backgroundImage: `url('${userHeroImageWithPath}')` }} // Here's where your image goes!
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-slate-900/70 backdrop-blur-sm"></div> {/* Dark overlay for text readability */}
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                        <span className="block">Bilgiye Ulaşmanın <span className="text-sky-400">En Akıllı</span> Yolu</span>
                        <span className="block text-indigo-400 text-3xl sm:text-4xl md:text-5xl mt-2">Kampüs Notların Hep Yanında</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium">
                        Sınav haftası kabuslarına son! Binlerce güncel ders notu, çıkmış soru ve öğrenci deneyimiyle dolu dev bir arşiv, parmaklarının ucunda. Paylaş, öğren, başar!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button
                            onClick={() => navigate('/notes')} // Navigate to notes Browse page
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            Notları Keşfetmeye Başla
                        </button>
                         <button
                            onClick={() => navigate('/upload-note')} // Navigate to note upload page
                            className="bg-slate-100 hover:bg-slate-200 text-indigo-700 font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-indigo-200"
                        >
                            Kendi Notunu Yükle
                        </button>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 sm:mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Neden Bizimle Başarmalısın?</h2>
                        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
                            Çünkü biz, öğrenciden öğrenciye bilginin en saf halini taşıyor, akademik yolculuğunu kolaylaştırıyoruz.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`relative flex flex-col items-center text-center p-6 pt-10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group ${feature.bgColor} border-t-4 ${feature.accentColor.replace('text-','border-')}`} // Themed top border
                            >
                                <div className={`absolute -top-7 flex items-center justify-center p-4 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 ${feature.accentColor} text-white`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-5">{feature.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed flex-grow">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-16 sm:py-24 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">Sadece 3 Adımda Bilgiye Ulaş!</h2>
                    <p className="text-lg text-slate-600 mb-16 max-w-xl mx-auto">Platformumuzu kullanmak işte bu kadar basit ve hızlı.</p>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">1</div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Kayıt Ol & Keşfet</h3>
                            <p className="text-slate-600 text-sm">Hızlıca üye ol, arama çubuğuna dersini yaz veya kategorilere göz at.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">2</div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">İncele & İndir</h3>
                            <p className="text-slate-600 text-sm">İlgini çeken notları incele, yorumları oku ve ihtiyacın olanı anında indir.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">3</div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Paylaş & Değer Kat</h3>
                            <p className="text-slate-600 text-sm">Kendi notlarını yükleyerek topluluğa katkıda bulun, puanları topla!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA SECTION */}
            <section className="py-20 sm:py-28 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
                        Başarıya Giden Yolda Yalnız Değilsin!
                    </h2>
                    <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                        Hemen aramıza katıl, binlerce öğrencinin kolektif bilgeliğinden faydalan. Unutma, en iyi yatırımı kendine yaparsın!
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-white text-indigo-700 font-bold px-12 py-4 rounded-xl shadow-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 text-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-70"
                    >
                        Ücretsiz Hesabını Oluştur
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 bg-slate-800 text-center">
                 <Link to="/" className="inline-block mb-4" aria-label="Anasayfa">
                    <img
                        className="h-12 w-auto transition-transform duration-300 ease-in-out hover:scale-110 mx-auto"
                        src={siteLogoPath} // Using your site logo here
                        alt="Site Logosu Altbilgi"
                    />
                </Link>
                <p className="text-slate-400 text-sm mb-2">
                    &copy; {new Date().getFullYear()} Not Paylaşım Platformu. Tüm Hakları Saklıdır.
                </p>
                <p className="text-slate-500 text-xs">
                    Öğrenmek ve paylaşmak için buradayız!
                </p>
            </footer>
        </div>
    );
};

export default Homepage;