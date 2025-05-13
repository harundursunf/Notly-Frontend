import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }

        console.log('Kayıt Denemesi:', { name, email, password });
        alert('Kayıt Başarılı (Simülasyon)');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12 p-10 bg-white rounded-xl shadow-2xl">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                        Fikirlerini <span className="text-indigo-600">Paylaş</span>
                    </h1>
                    <p className="text-2xl sm:text-3xl text-gray-700 font-semibold mb-6">
                        Bilgi Paylaştıkça <span className="text-purple-600">Çoğalır</span>
                    </p>
                    <p className="text-lg text-gray-600">
                        Topluluğumuza katıl, notlarını, düşüncelerini ve deneyimlerini paylaşarak diğerlerine ilham ver. Birlikte öğrenelim, büyüyelim.
                    </p>
                </div>

                <div className="w-full md:w-1/2">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Yeni Hesap Oluşturun
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        veya{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            mevcut hesabınıza giriş yapın
                        </Link>
                    </p>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Adınız Soyadınız
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Adınız Soyadınız"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="email-address" className="sr-only">
                                    E-posta adresi
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="E-posta adresi"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="password" className="sr-only">
                                    Şifre
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Şifre"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="confirm-password" className="sr-only">
                                    Şifreyi Onayla
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Şifreyi Onayla"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105"
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
