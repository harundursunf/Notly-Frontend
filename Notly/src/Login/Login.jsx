import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios'u import ediyoruz

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Yüklenme durumu için state
    const [error, setError] = useState(''); // Hata mesajı için state
    const navigate = useNavigate();

    const handleSubmit = async (e) => { // Async fonksiyon yaptık
        e.preventDefault();
        setError(''); // Her denemede hatayı temizle

        setLoading(true); // Yükleniyor durumunu başlat
        try {
            // Backend'deki giriş endpoint'inize POST isteği gönderin
            const response = await axios.post('https://localhost:7119/api/Auth/login', {
                email,
                password,
            });

            console.log('Giriş Başarılı:', response.data);

            // ************************************
            // ÖNEMLİ: Backend'den gelen token'ı localStorage'a kaydet
            // response.data'nın yapısını kontrol ederek token'ın hangi alanda geldiğini doğrulayın.
            // Sizin çıktınızda 'accessToken' alanında geliyordu.
            if (response.data && response.data.accessToken) {
                 localStorage.setItem('token', response.data.accessToken);
                 console.log('Token localStorage kaydedildi.');
            } else {
                 console.warn('Giriş başarılı ancak token yanıtında bulunamadı.');
                 setError('Giriş başarılı ancak kimlik doğrulama bilgisi alınamadı.');
                 // Token alınamazsa yönlendirme yapmamak veya hata göstermek daha doğru olabilir.
                 setLoading(false); // Yükleniyor durumunu bitir
                 return; // Token yoksa devam etme
            }
            // ************************************


            // Başarılı giriş sonrası ana sayfaya veya yönlendirmek istediğiniz yere git
            navigate('/notes');

        } catch (err) {
            console.error('Giriş Hatası:', err);
            // Hata durumunda kullanıcıya bilgi ver
             if (axios.isAxiosError(err)) { // Axios hatası mı kontrol et
                 if (err.response) {
                    // Backend'den gelen hata yanıtı var
                    // Backend'inizin döndürdüğü hata formatına göre burayı ayarlamanız gerekebilir.
                    const backendError = err.response.data;
                    if (backendError && backendError.message) {
                         setError(backendError.message);
                    } else if (typeof backendError === 'string') {
                         setError(backendError);
                    }
                    else {
                        setError(backendError.title || 'Giriş sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
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
        <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-gradient-shift">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-16 p-10 bg-white bg-opacity-95 rounded-2xl shadow-3xl backdrop-blur-sm">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 drop-shadow-lg">
                        Tekrar <span className="text-sky-600">Hoş Geldiniz</span>
                    </h1>
                    <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-semibold mb-6 drop-shadow-md">
                        Giriş Yap ve <span className="text-indigo-600">Keşfet</span>
                    </p>
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                        Hesabınıza giriş yaparak paylaşımlarınıza devam edin, yeni içerikleri keşfedin ve toplulukla etkileşimde bulunun.
                    </p>
                </div>

                <div className="w-full md:w-1/2 p-6 bg-gray-50 rounded-xl shadow-inner">
                    <h2 className="mt-0 mb-6 text-center text-3xl font-extrabold text-gray-900">
                        Hesabınıza Giriş Yapın
                    </h2>
                    <p className="mt-2 mb-8 text-center text-sm text-gray-600">
                        veya{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                            yeni bir hesap oluşturun
                        </Link>
                    </p>

                    {/* Hata mesajını göster */}
                    {error && (
                        <div className="mb-4 text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div>
                            <label htmlFor="email-address" className="sr-only">E-posta adresi</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="E-posta adresi"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Şifre</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-150 ease-in-out"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Beni Hatırla
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                                    Şifreni mi unuttun?
                                </a>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading} // Yüklenirken butonu devre dışı bırak
                            >
                                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} {/* Yüklenme durumuna göre buton metni */}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
