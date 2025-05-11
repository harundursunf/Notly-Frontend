import React, { useState } from 'react'; // State yönetimi için useState
import { Link, useNavigate } from 'react-router-dom'; // Navigasyon için Link ve useNavigate

const Register = () => {
    // Form verilerini tutmak için state'ler
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Kayıt sonrası yönlendirme için

    // Form gönderildiğinde çalışacak fonksiyon
    const handleSubmit = (e) => {
        e.preventDefault(); // Sayfanın yenilenmesini engelle

        // Şifrelerin eşleşip eşleşmediğini kontrol et (basit kontrol)
        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }

        // Burada gerçek bir uygulamada API'ye kayıt isteği gönderilir
        console.log('Kayıt Denemesi:', { name, email, password });

        // Kayıt başarılı olursa kullanıcıyı giriş sayfasına veya anasayfaya yönlendir
        // Örneğin: navigate('/login'); veya navigate('/');
        alert('Kayıt Başarılı (Simülasyon)'); // Şimdilik sadece bir uyarı gösterelim
        navigate('/login'); // Kayıt sonrası giriş sayfasına yönlendir
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-sky-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Yeni Hesap Oluşturun
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        veya{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            mevcut hesabınıza giriş yapın
                        </Link>
                    </p>
                </div>
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
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Adınız Soyadınız"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                E-posta adresi
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="E-posta adresi"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Şifre
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">
                                Şifreyi Onayla
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Şifreyi Onayla"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
                        >
                            Kayıt Ol
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;