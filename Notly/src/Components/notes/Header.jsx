import React from 'react';
import { Link } from 'react-router-dom';

const DefaultUserIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
  </svg>
);

const Header = ({
  logoSrc = "/logo3.jpg",
  siteName = "",
  profilePath = "/profile",
  user,
  icons = {} 
}) => {
  const UserIconToDisplay = icons.UserCircle || DefaultUserIcon; 

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm h-16 sticky top-0 z-50 flex items-center border-b border-slate-200/75">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex-shrink-0 flex items-center group" title="Anasayfa">
          <img
            src={logoSrc}
            alt="Site Logosu"
            className="h-9  sm:h-15 w-auto transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          {siteName && (
            <span className="ml-2.5 text-xl sm:text-2xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300 ease-in-out hidden md:block">
              {siteName}
            </span>
          )}
        </Link>
        <div className='text-2xl font-semibold '> Bir Not Evreni</div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* "Not Oluştur" ve "İptal" butonları buradan kaldırıldı. */}

          <Link
            to={profilePath}
            title="Profilin"
            className="flex items-center p-1.5 rounded-full text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-white transition-colors duration-200 ease-in-out group"
          >
            {user && user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'Kullanıcı avatarı'}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-indigo-400 transition-all duration-300"
              />
            ) : (
              <UserIconToDisplay className="h-7 w-7 sm:h-8 sm:w-8 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            )}
            {user && user.name && (
              <span className="ml-2 hidden md:inline text-xs sm:text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                {user.name.split(' ')[0]}
              </span>
            )}
            {!user && (
              <span className="ml-1.5 hidden md:inline text-xs sm:text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                Profil
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;