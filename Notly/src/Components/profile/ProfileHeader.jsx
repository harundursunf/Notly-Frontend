import React from 'react';

const ProfileHeader = ({
    user,
    onGoToHomepage,
    selectedFile,
    uploadingAvatar,
    avatarError,
    avatarSuccess,
    onFileChange,
    onUploadProfilePicture,
    onUploadButtonClick, 
    onClearSelectedFile, 
    fileInputRef,
    postsCount,
    coursesCount,
    likesCount,
    icons,
    pageLoadError 
}) => {
    return (
        <>
            <div className="p-5 sm:p-7 border-b border-gray-200 flex justify-start items-center">
                <button
                    onClick={onGoToHomepage}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold group transition-colors duration-200"
                >
                    <span className="mr-2 text-lg transform transition-transform group-hover:-translate-x-1">{icons.Back}</span> Anasayfaya Dön
                </button>
            </div>
            <div className="relative pt-8 pb-10 text-center px-4 sm:px-6">
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="mx-auto w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl -mt-16 bg-white object-cover"
                />
                <div className="mt-4 flex flex-col items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    {!selectedFile && (
                        <button
                            onClick={onUploadButtonClick}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={uploadingAvatar}
                        >
                            <span className="mr-2 text-lg">{icons.Upload}</span> Fotoğrafı Değiştir
                        </button>
                    )}
                    {selectedFile && (
                        <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">{selectedFile.name}</span>
                            <button
                                onClick={onUploadProfilePicture}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={uploadingAvatar}
                            >
                                {uploadingAvatar ? 'Yükleniyor...' : 'Yükle'}
                            </button>
                            <button
                                onClick={onClearSelectedFile}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={uploadingAvatar}
                            >
                                {icons.XCircle}
                            </button>
                        </div>
                    )}
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">{user.name}</h1>
                <p className="mt-2 text-md sm:text-lg text-indigo-700 font-medium">
                    {user.university} {user.department && `– ${user.department}`}
                </p>
                <p className="mt-4 max-w-xl mx-auto text-gray-700 leading-relaxed text-sm sm:text-base">
                    {user.bio}
                </p>
                {pageLoadError && (
                    <div className="text-sm text-red-600 text-center mt-4 whitespace-pre-line">
                        {pageLoadError}
                    </div>
                )}
              
                {avatarError && <div className="text-sm text-red-600 text-center mt-2">{avatarError}</div>}
                {avatarSuccess && <div className="text-sm text-green-600 text-center mt-2">{avatarSuccess}</div>}
            </div>

            
            <div className="flex flex-wrap justify-around py-6 sm:py-7 border-t border-b border-gray-300 bg-gray-50 px-4 sm:px-6">
                <div className="text-center p-2 min-w-[100px]">
                    <p className="text-2xl font-bold text-indigo-700">{postsCount}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Paylaşım</p>
                </div>
                <div className="text-center p-2 min-w-[100px]">
                    <p className="text-2xl font-bold text-indigo-700">{coursesCount}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Ders</p>
                </div>
                <div className="text-center p-2 min-w-[100px]">
                    <p className="text-2xl font-bold text-indigo-700">{likesCount}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Beğeni</p>
                </div>
            </div>
        </>
    );
};

export default ProfileHeader;