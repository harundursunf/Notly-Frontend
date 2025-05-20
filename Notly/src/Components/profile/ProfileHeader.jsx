import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

// Icon components (assuming these are defined as in your original code)
const IconBackDefault = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const IconSettingsDefault = ({ className = "w-5 h-5 sm:w-6 sm:h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.242 1.417l-.97.97a1.125 1.125 0 01-1.667 0l-.97-.97a1.125 1.125 0 01.242-1.417l-1.296-2.247a1.125 1.125 0 01-1.37-.49l-1.217-.456c-.355.133-.75.072-1.075-.124a1.125 1.125 0 01-.22-.127c-.332-.183-.582-.495-.646-.87l-.213-1.281zm-2.678 14.082c.09.542.56.94 1.11.94h2.594c.55 0 1.02-.398 1.11-.94l.213-1.281c.063-.374.313.686.646-.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.242 1.417l-.97.97a1.125 1.125 0 01-1.667 0l-.97-.97a1.125 1.125 0 01.242-1.417l-1.296-2.247a1.125 1.125 0 01-1.37-.49l-1.217-.456c-.355-.133-.75-.072-1.075-.124a1.125 1.125 0 01-.22-.127c-.332-.183-.582-.495-.646-.87l-.213-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconErrorDefault = ({ className = "w-16 h-16 text-red-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const IconLogoutDefault = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
  </svg>
);

const IconUniversityDefault = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.394 2.093a1 1 0 00-.788 0l-7 4A1 1 0 002 7v8a1 1 0 00.586.903l7 4a1 1 0 00.828 0l7-4A1 1 0 0018 15V7a1 1 0 00-.586-.903l-7-4zM10 14.61L4.097 11.091V7.909L10 11.39V14.61zm0-4.84L15.903 7.91v3.182L10 13.057V9.77zm6-3.627v.002l-6 3.428-6-3.428V6.143l6-3.428 6 3.428z" />
  </svg>
);

const IconKebabMenu = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

const baseIcons = {
  Back: IconBackDefault,
  Settings: IconSettingsDefault,
  Error: IconErrorDefault,
  Logout: IconLogoutDefault,
  University: IconUniversityDefault,
  KebabMenu: IconKebabMenu,
};

const DynamicIcon = ({ icon, className, defaultClassName }) => {
  if (typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent className={className || defaultClassName} />;
  }
  if (typeof icon === 'string') {
    return <span className={className || defaultClassName}>{icon}</span>;
  }
  return null;
};


const ProfileHeader = ({
  user,
  homePath = "/notes", 
  logoSrc = "/logo3.jpg", 
  avatarError,
  avatarSuccess,
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
      const menuButton = document.getElementById('user-menu-button');
      if (menuButton && menuButton.contains(event.target)) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  if (pageLoadError) {
    return (
      <div className="p-6 sm:p-10 bg-red-50 rounded-lg m-4 sm:m-6 md:m-8 border border-red-200 text-center flex flex-col items-center justify-center min-h-[400px] relative">
        {homePath && ( // Changed to use homePath for Link
          <Link
            to={homePath}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold group transition-colors duration-200 py-2 px-3 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            <DynamicIcon icon={icons.Back} className="w-5 h-5 mr-1.5 transform transition-transform group-hover:-translate-x-0.5" />
            Anasayfaya Dön
          </Link>
        )}
        <div className="py-8">
          <DynamicIcon icon={icons.Error} className="w-20 h-20 text-red-400 mb-6" />
          <p className="text-2xl font-semibold text-red-700">Profil Yüklenirken Bir Sorun Oluştu.</p>
          <p className="text-md text-gray-600 mt-3 max-w-md mx-auto whitespace-pre-line">
            {typeof pageLoadError === 'string' ? pageLoadError : 'Beklenmedik bir hata oluştu. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.'}
          </p>
        </div>
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <div className="p-6 sm:p-10 min-h-[400px] flex flex-col justify-center items-center text-center bg-gray-50 m-4 sm:m-6 md:m-8 rounded-lg border border-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-8"></div>
        <p className="text-gray-700 text-xl font-medium">Kullanıcı bilgileri yükleniyor...</p>
        <p className="text-gray-500 text-base mt-2">Lütfen bekleyiniz.</p>
      </div>
    );
  }

  const StatItem = ({ count, label }) => (
    <div className="text-center px-2 py-1 group">
      <p className="text-2xl sm:text-3xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors duration-200">{count}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
    </div>
  );

  return (
    <>
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-2xl">
        {/* === MODIFIED SECTION: Logo as Homepage Link === */}
        <Link 
          to={homePath} 
          className="flex-shrink-0 flex items-center group" 
          title="Anasayfaya Dön"
        >
          <img
            src={logoSrc}
            alt="Site Logosu"
            className="h-9 sm:h-10 md:h-11 object-contain transition-transform duration-300 ease-in-out group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white rounded-sm"
          />
       
        </Link>
    

        <div className="flex items-center">
          {isOwnProfile && (
            <div className="relative">
              <button
                id="user-menu-button"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                title="Kullanıcı Menüsü"
                className="text-slate-600 hover:text-indigo-600 p-2 sm:p-2.5 rounded-full hover:bg-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-100"
              >
                <DynamicIcon icon={icons.KebabMenu} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              </button>

              {isUserMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 py-1 border border-slate-200 transition-opacity duration-150 ease-out"
                  style={{ opacity: 1 }} 
                >
                  <button
                    onClick={() => {
                      if(onEditProfile) onEditProfile();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-indigo-600 flex items-center transition-colors duration-150 rounded-t-md group" 
                  >
                    <DynamicIcon icon={icons.Settings} className="w-5 h-5 mr-3 text-slate-500 group-hover:text-indigo-500 transition-colors duration-150" />
                    Profili Düzenle
                  </button>
                  <div className="border-t border-slate-100 mx-1"></div>
                  <button
                    onClick={() => {
                      if(onLogout) onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition-colors duration-150 rounded-b-md group" // Added group for icon hover
                  >
                    <DynamicIcon icon={icons.Logout} className="w-5 h-5 mr-3 group-hover:text-red-700 transition-colors duration-150" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}
          {!isOwnProfile && (
            
            <div className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px]"></div> 
          )}
        </div>
      </div>

    
      <div className="p-6 sm:p-8 md:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
          <div className="flex-shrink-0 mb-6 sm:mb-0 sm:mr-8 md:mr-10 relative group cursor-pointer" title={isOwnProfile ? "Profil fotoğrafını değiştir" : ""}>
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'X')}&background=random&size=180&font-size=0.4&bold=true&color=fff&format=svg`}
              alt={`${user.name || user.username} avatarı`}
              className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full border-4 border-white object-cover shadow-xl group-hover:shadow-2xl transition-all duration-300 ring-4 ring-indigo-500/50 group-hover:ring-indigo-500"
            />
          </div>

          <div className="flex-grow mt-4 sm:mt-0">
            <div className="mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {user.username || user.name}
              </h1>
              {user.name && user.username && user.name.toLowerCase() !== user.username.toLowerCase() && (
                <p className="text-lg text-slate-500 font-medium">{user.name}</p>
              )}
            </div>
            
            {!isOwnProfile && ( 
              <div className="mt-2 mb-5 flex flex-wrap justify-center sm:justify-start gap-4">
                <button className="inline-flex items-center px-6 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
                  Takip Et
                </button>
                <button className="inline-flex items-center px-6 py-3 text-base font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-slate-400 focus:ring-opacity-50">
                  Mesaj Gönder
                </button>
              </div>
            )}

            <div className="flex sm:flex lg:hidden justify-center sm:justify-start space-x-6 md:space-x-8 border-y border-slate-200 py-4">
              <StatItem count={postsCount} label="Paylaşım" />
              <StatItem count={coursesCount} label="Ders" />
              <StatItem count={likesCount} label="Beğeni" />
            </div>
            <div className="hidden lg:flex items-center justify-center sm:justify-start space-x-6 md:space-x-8 pt-4">
              <StatItem count={postsCount} label="Paylaşım" />
              <StatItem count={coursesCount} label="Ders" />
              <StatItem count={likesCount} label="Beğeni" />
            </div>
          </div>
        </div>

        {(user.university || user.bio) && (
            <div className="mt-10 pt-8 pb-6 border-t border-slate-200 text-left px-2 sm:px-0">
            {user.university && (
              <div className="mb-7 flex items-start space-x-3 sm:space-x-4">
                <div className="flex-shrink-0 pt-1">
                  <DynamicIcon
                    icon={icons.University}
                    className="w-6 h-6 text-indigo-600"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-slate-800 leading-tight">
                    {user.university}
                  </h4>
                  {user.department && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {user.department}
                    </p>
                  )}
                </div>
              </div>
            )}
            {user.bio && (
              <div className={`${user.university ? 'mt-8 pt-8 border-t border-slate-200' : 'mt-4'}`}>
                <div>
                  <h5 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2.5">
                    Hakkında
                  </h5>
                  <div className="bg-slate-50/80 p-4 rounded-lg ring-1 ring-slate-200/90">
                    <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line selection:bg-indigo-100">
                      {user.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(avatarError || avatarSuccess) && (
          <div className="mt-6">
            {avatarError && <div className="text-sm font-medium text-red-700 p-4 bg-red-50 border border-red-200 rounded-lg shadow-md">{avatarError}</div>}
            {avatarSuccess && <div className="text-sm font-medium text-green-700 p-4 bg-green-50 border border-green-200 rounded-lg shadow-md">{avatarSuccess}</div>}
          </div>
        )}
      </div>

      <div className="sm:hidden flex justify-around py-5 border-t border-slate-200 bg-slate-100 px-2 rounded-b-2xl">
        <StatItem count={postsCount} label="Paylaşım" />
        <StatItem count={coursesCount} label="Ders" />
        <StatItem count={likesCount} label="Beğeni" />
      </div>
    </>
  );
};

export default ProfileHeader;