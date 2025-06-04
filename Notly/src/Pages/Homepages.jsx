import React from 'react';
import { Link } from 'react-router-dom';

const HomepageFullscreen = () => {

    // --- GÖRSELLERİNİZİ BURAYA EKLEYİN ---
    // Tam ekran arkaplanı için etkileyici bir görsel seçin.
    // Örneğin: ders çalışan öğrenciler, modern bir kütüphane, defter ve kalemler...
    const backgroundImageUrl = "/Logo.jpg"; // Örn: '/images/campus-background.jpg'


    return (
        // Ana Konteyner: Tüm ekranı kaplaması için 'h-screen' ve 'flex' kullanıldı.
        <div
            className="relative h-screen w-full flex flex-col items-center justify-center text-white text-center p-6 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        >
            {/* Arkaplan Karartma: Metnin okunabilirliğini artırmak için. */}
            <div className="absolute inset-0 bg-slate-800/70 backdrop-blur-sm"></div>

        

            {/* İçerik Konteyneri: Tüm içerik ortalanmış ve z-index ile karartma katmanının üzerinde. */}
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    <span className="block">Aradığın Tüm Ders Notları</span>
                    <span className="block text-indigo-400 mt-2">Tek Bir Yerde</span>
                </h1>

                <p className="mt-6 max-w-xl text-lg text-slate-200 font-medium">
                    Binlerce güncel nota anında ulaş, kendi notlarını paylaş ve başarıya giden yolda öne geç.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Ana Eylem Butonu */}
                    <Link
                        to="/register" // Kullanıcıyı kayıt olmaya veya notların olduğu ana sayfaya yönlendirin
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                    >
                        Hemen Başla
                    </Link>

                    {/* İkincil Eylem Butonu (Opsiyonel) */}
                     <Link
                        to="/login"
                        className="bg-transparent border-2 border-slate-400 hover:bg-slate-700/50 text-slate-200 font-bold text-lg px-10 py-4 rounded-xl transition-colors w-full sm:w-auto"
                    >
                        Giriş Yap
                    </Link>
                </div>
            </div>

            {/* Alt Bilgi: Ekranın altına sabitlendi. */}
            <div className="absolute bottom-6 z-10 text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Not Paylaşım Platformu. Tüm Hakları Saklıdır.
            </div>
        </div>
    );
};

export default HomepageFullscreen;