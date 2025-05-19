import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios'u import ediyoruz

const Register = () => {
    const [name, setName] = useState(''); // Kullanıcının girdiği ad/soyad veya kullanıcı adı
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState(''); // Şifreyi Onayla state'i kaldırıldı
    const [loading, setLoading] = useState(false); // Yüklenme durumu için state
    const [error, setError] = useState(''); // Hata mesajı için state (string olacak)
    const navigate = useNavigate();

    const handleSubmit = async (e) => { // Async fonksiyon yaptık
        e.preventDefault();
        setError(''); 

        setLoading(true); 
        try {

            const response = await axios.post('https://localhost:7119/api/Auth/register', {
                username: name, // Frontend'deki 'name' state'ini backend'e 'username' olarak gönder
                email,
                password,
            });

            console.log('Kayıt Başarılı:', response.data);
            // Başarılı kayıt sonrası kullanıcıyı giriş sayfasına yönlendir
            navigate('/login');

        } catch (err) {
            console.error('Kayıt Hatası:', err);
            // Hata durumunda kullanıcıya bilgi ver
            if (axios.isAxiosError(err)) { // Axios hatası mı kontrol et
                if (err.response) {
                    // Backend'den gelen hata yanıtı var
                    const backendError = err.response.data;

                    // Backend'in döndürdüğü hata yapısını kontrol et
                    if (backendError && backendError.errors) {
                        // ASP.NET Core ValidationProblemDetails gibi bir yapı
                        const validationErrors = backendError.errors;
                        let errorMessages = [];
                        for (const key in validationErrors) {
                            if (validationErrors.hasOwnProperty(key)) {

                                const fieldErrors = validationErrors[key].join(' ');
                                errorMessages.push(`${key}: ${fieldErrors}`); // Alan adını da ekleyerek daha bilgilendirici yap
                            }
                        }
                        setError(errorMessages.join(' | ')); // Hata mesajlarını ayırarak göster
                    } else if (backendError && (backendError.message || typeof backendError === 'string')) {
                         // Daha basit bir hata mesajı yapısı veya sadece string yanıt
                        setError(backendError.message || backendError);
                    }
                     else {
                        // Beklenmedik bir hata yanıtı formatı
                        setError(backendError.title || 'Kayıt sırasında beklenmedik bir hata oluştu.');
                    }
                } else if (err.request) {
                    // İstek gönderildi ancak yanıt alınamadı (ağ hatası vb.)
                    setError('Sunucuya ulaşılamadı. Lütfen backend sunucusunun çalıştığından emin olun.');
                } else {
                    // İstek oluşturulurken bir hata oluştu
                    setError('İstek hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
                }
            } else {
                 // Axios hatası olmayan diğer hatalar
                 setError('Beklenmedik bir hata oluştu.');
            }
        } finally {
            setLoading(false); // Yükleniyor durumunu bitir
        }
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
                                {/* Label ve input artık kullanıcı adını temsil ediyor */}
                                <label htmlFor="name" className="sr-only">
                                    Kullanıcı Adınız
                                </label>
                                <input
                                    id="name" // ID'yi şimdilik name olarak bırakabiliriz veya username yapabiliriz
                                    name="name" // Name attribute'u da aynı şekilde
                                    type="text"
                                    autoComplete="username" // autocomplete'i username olarak ayarla
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Kullanıcı Adınız" // Placeholder'ı güncelle
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
                           
                        </div>

                        {/* Hata mesajını göster */}
                        {error && (
                            <div className="text-sm text-red-600 text-center mt-4">
                                {error}
                            </div>
                        )}

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading} // Yüklenirken butonu devre dışı bırak
                            >
                                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'} {/* Yüklenme durumuna göre buton metni */}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
