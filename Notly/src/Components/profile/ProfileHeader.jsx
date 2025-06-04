import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- Eski İKONLAR (Değişiklik yok) ---
const IconBackDefault = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg> );
const IconSettingsDefault = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M11.49 3.17a.75.75 0 011.02 0l1.125 1.125a.75.75 0 010 1.02l-1.125 1.125a.75.75 0 01-1.02 0l-1.125-1.125a.75.75 0 010-1.02l1.125-1.125zM10 7a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V7.75A.75.75 0 0110 7zm.25 4.5a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5z" clipRule="evenodd" /><path d="M8.69 3.102a.75.75 0 00-1.02-.02l-1.125 1.125a.75.75 0 00-.02 1.02l1.125 1.125a.75.75 0 001.02.02l1.125-1.125a.75.75 0 00.02-1.02l-1.125-1.125zM3.102 8.69a.75.75 0 00-.02 1.02l1.125 1.125a.75.75 0 001.02.02l1.125-1.125a.75.75 0 00.02-1.02l-1.125-1.125a.75.75 0 00-1.02-.02zM13.78 8.91a.75.75 0 01.02-1.06l1.125-1.125a.75.75 0 011.06-.02l1.125 1.125a.75.75 0 01.02 1.06l-1.125 1.125a.75.75 0 01-1.06.02l-1.125-1.125zM8.91 13.78a.75.75 0 01-1.06.02l-1.125-1.125a.75.75 0 01-.02-1.06l1.125-1.125a.75.75 0 011.06.02l1.125 1.125a.75.75 0 01.02 1.06l-1.125 1.125a.75.75 0 01-.02-1.06z" clipRule="evenodd" /></svg>);
const IconErrorDefault = ({ className = "w-16 h-16" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg> );
const IconLogoutDefault = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v2a.75.75 0 01-1.5 0v-2A.5.5 0 0012.5 3h-9A.5.5 0 003 3.5v13a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-2a.75.75 0 011.5 0v2A1.5 1.5 0 0112.5 18h-9A1.5 1.5 0 012 16.5v-13z" clipRule="evenodd" /><path fillRule="evenodd" d="M15.53 10.53a.75.75 0 010-1.06l-3-3a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06-1.06l3-3z" clipRule="evenodd" /><path fillRule="evenodd" d="M7 10a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 017 10z" clipRule="evenodd" /></svg>);
const IconUniversityDefault = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M10.394 2.093a1 1 0 00-.788 0l-7 4A1 1 0 002 7v8a1 1 0 00.586.903l7 4a1 1 0 00.828 0l7-4A1 1 0 0018 15V7a1 1 0 00-.586-.903l-7-4zM10 14.61L4.097 11.091V7.909L10 11.39V14.61zm0-4.84L15.903 7.91v3.182L10 13.057V9.77zm6-3.627v.002l-6 3.428-6-3.428V6.143l6-3.428 6 3.428z" /></svg> );
// Kebab menu ikonunu Profile.js içinden buraya taşıdık, eğer orada artık kullanılmayacaksa.
// const IconKebabMenu = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg> );

// --- YENİ EKLENEN İKONLAR ---
const IconPencil = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a.5.5 0 00.134-.053L16.176 2.08a1.875 1.875 0 000-2.653L14.573.825a1.875 1.875 0 00-2.653 0L2.748 14.627a.5.5 0 00-.053.134z" /><path d="M4.5 16.5c-.222 0-.432-.038-.634-.112L1.927 15.25a.5.5 0 01.23-.966l1.488.595a.5.5 0 01.334.626l-.308.766A.498.498 0 014.5 16.5z" /></svg>);
const IconUserPlus = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM18.75 8.25a.75.75 0 000-1.5h-2.5a.75.75 0 000 1.5h2.5zM18.75 10.75a.75.75 0 000-1.5h-2.5a.75.75 0 000 1.5h2.5zM16.25 12.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-1.5 0v2.5zM16.25 15a.75.75 0 001.5 0v-2.5a.75.75 0 00-1.5 0v2.5z" /></svg>);
const IconChatBubble = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 001 4.5v8A1.5 1.5 0 002.5 14h2.563a.5.5 0 01.468.325l1.18 2.359A.5.5 0 007.175 17h5.65a.5.5 0 00.468-.316l1.18-2.359a.5.5 0 01.468-.325H17.5A1.5 1.5 0 0019 12.5v-8A1.5 1.5 0 0017.5 3H2.5zM4.5 6a.5.5 0 01.5-.5h10a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM5 8.5a.5.5 0 000 1h6a.5.5 0 000-1H5z" clipRule="evenodd" /></svg>);
const IconInfo = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;

const baseIcons = { 
    Back: IconBackDefault, 
    Settings: IconSettingsDefault, 
    Error: IconErrorDefault, 
    Logout: IconLogoutDefault, 
    University: IconUniversityDefault,
    // KebabMenu: IconKebabMenu, // Kebab menu ikonu Profile.js'den ProfileHeader'a taşındı, baseIcons'da artık gerekmeyebilir
    Pencil: IconPencil,
    UserPlus: IconUserPlus,
    ChatBubble: IconChatBubble,
    Info: IconInfo,
};

const DynamicIcon = ({ icon, className = '', defaultClassName = '' }) => {
    // ... (DynamicIcon bileşeni değişmedi)
    if (typeof icon === 'function') {
        const IconComponent = icon;
        return <IconComponent className={`${defaultClassName} ${className}`} />;
    }
    if (typeof icon === 'string') {
        return <span className={`${defaultClassName} ${className}`}>{icon}</span>;
    }
    return null;
};


const ProfileHeader = ({
    user,
    homePath = "/notes",
    postsCount = 0,
    coursesCount = 0,
    likesCount = 0,
    icons: customIcons = {},
    pageLoadError,
    isOwnProfile = true,
    onEditProfile,
    onLogout,
}) => {
    const icons = { ...baseIcons, ...customIcons };
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (pageLoadError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-rose-50 p-8 text-center rounded-b-2xl">
                <DynamicIcon icon={icons.Error} className="w-24 h-24 text-red-400 mb-6" />
                <h2 className="text-2xl sm:text-3xl font-bold text-red-700">Profil Yüklenemedi</h2>
                <p className="mt-2 text-lg text-red-600 max-w-md">{typeof pageLoadError === 'string' ? pageLoadError : 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}</p>
                <Link to={homePath || "/"} className="mt-10 inline-flex items-center gap-2 px-6 py-3 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <DynamicIcon icon={icons.Back} className="w-5 h-5" /> Anasayfaya Dön
                </Link>
            </div>
        );
    }

    if (!user || !user.id) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-slate-50 rounded-b-2xl">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
                <p className="mt-8 text-xl font-semibold text-slate-700">Profil Yükleniyor...</p>
            </div>
        );
    }
    
    const StatItem = ({ count, label }) => (
        <button className="text-center group transform transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 rounded-md p-2 -m-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{count}</span>
            <span className="block text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{label}</span>
        </button>
    );
    
    return (
        <div className="bg-gradient-to-b from-slate-200 to-slate-50 pb-12"> {/* Hafif gradyan eklendi */}
            {/* === BANNER === */}
            <div className="relative h-52 sm:h-60 md:h-72 bg-slate-700 group shadow-inner">
                <img
                    src={user.bannerUrl || 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2103&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                    alt="Kapak fotoğrafı"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute top-5 left-5 z-10">
                     <Link to={homePath} className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-white/10 rounded-full backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-md">
                        <DynamicIcon icon={icons.Back} className="w-4 h-4 sm:w-5 sm:h-5" /> Geri
                    </Link>
                </div>
                <div className="absolute top-5 right-5 z-10" ref={menuRef}>
                    {isOwnProfile && (
                         <button
                            onClick={() => setIsUserMenuOpen(prev => !prev)}
                            className="p-2.5 text-white bg-white/10 rounded-full backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-md"
                            title="Ayarlar"
                        >
                            <DynamicIcon icon={icons.Settings} className="w-5 h-5 sm:w-6 sm:h-6"/>
                        </button>
                    )}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-xl shadow-2xl z-20 py-2 border border-slate-200/70">
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 flex items-center gap-3 transition-colors duration-150 group"
                            >
                                <DynamicIcon icon={icons.Logout} className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                                <span className="font-semibold">Çıkış Yap</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* === ANA PROFİL BİLGİLERİ === */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 md:-mt-24 z-10">
                    <div className="relative flex-shrink-0 group">
                        <img
                             src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'X')}&background=random&size=180&font-size=0.4&bold=true&color=fff&format=svg`}
                            alt={`${user.name} avatarı`}
                            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover border-4 sm:border-[5px] border-slate-50 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                        />
                         {/* Avatar üzerine gelince hafif bir efekt */}
                        <div className="absolute inset-0 rounded-full ring-4 ring-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="flex-grow sm:ml-6 mt-5 sm:mt-0 text-center sm:text-left w-full">
                         <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-y-3">
                            <div className="sm:mb-1"> {/* İsim ve kullanıcı adı için dikey boşluk */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{user.name || user.username}</h1>
                                <p className="text-base text-slate-500 font-medium">@{user.username}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isOwnProfile ? (
                                    <button onClick={onEditProfile} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 rounded-lg shadow-sm transition-all duration-200">
                                        <DynamicIcon icon={icons.Pencil} className="w-4 h-4"/> Profili Düzenle
                                    </button>
                                ) : (
                                    <>
                                        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all">
                                            <DynamicIcon icon={icons.UserPlus} className="w-4 h-4"/> Takip Et
                                        </button>
                                        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 rounded-lg shadow-sm transition-all">
                                             <DynamicIcon icon={icons.ChatBubble} className="w-4 h-4"/> Mesaj
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    {/* İstatistikler (Daha belirgin ve aralıklı) */}
                    <div className="md:col-span-3 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-around items-center">
                            <StatItem count={postsCount} label="Paylaşım" />
                            <StatItem count={coursesCount} label="Ders" />
                            <StatItem count={likesCount} label="Beğeni" />
                        </div>
                    </div>

                    {/* Hakkında ve Eğitim (Ayrı kartlarda, daha şık) */}
                    {user.bio && (
                        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200/70">
                             <div className="flex items-center gap-3 mb-3">
                                <DynamicIcon icon={icons.Info} className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-slate-800">Hakkında</h3>
                             </div>
                             <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{user.bio}</p>
                        </div>
                     )}

                     {user.university && (
                         <div className={`${user.bio ? 'md:col-span-1' : 'md:col-span-3'} bg-white p-6 rounded-xl shadow-sm border border-slate-200/70`}>
                            <div className="flex items-center gap-3 mb-3">
                               <DynamicIcon icon={icons.University} className="w-6 h-6 text-indigo-600" />
                               <h3 className="text-lg font-semibold text-slate-800">Eğitim</h3>
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">{user.university}</p>
                                <p className="text-sm text-slate-500">{user.department}</p>
                            </div>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;