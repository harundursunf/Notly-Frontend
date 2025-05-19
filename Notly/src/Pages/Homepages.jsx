import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Kolay Arama',
            description: 'Binlerce nota ders, konu veya anahtar kelime ile anında ulaşın.',
            icon: '🔍',
            color: 'text-blue-500 bg-blue-100',
        },
        {
            title: 'Not Paylaş',
            description: 'Kendi notlarınızı yükleyerek diğer öğrencilere yardımcı olun.',
            icon: '📤',
            color: 'text-green-500 bg-green-100',
        },
        {
            title: 'Organize İçerik',
            description: 'Derslere ve konulara göre düzenlenmiş zengin not arşivini keşfedin.',
            icon: '📂',
            color: 'text-purple-500 bg-purple-100',
        },
        {
            title: 'Toplulukla Etkileşim',
            description: 'Notları oylayın, yorum yapın ve favorilerinize ekleyin.',
            icon: '💬',
            color: 'text-red-500 bg-red-100',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* HERO */}
            <section className="bg-gradient-to-br from-indigo-700 via-blue-600 to-sky-500 text-white py-16 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Üniversite Notlarının <span className="text-sky-300">Yeni Adresi</span>
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 mb-6">
                        Aradığın notlara kolayca ulaş, bilgi paylaşımıyla akademik başarıya ulaş.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100 transition"
                    >
                        Göz At
                    </button>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800">Platformda Neler Yapabilirsiniz?</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Öğrencilerin akademik hayatını kolaylaştırmak için tasarlandı.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl shadow-md hover:shadow-xl transition"
                            >
                                <div className={`text-3xl p-4 rounded-full mb-5 ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
