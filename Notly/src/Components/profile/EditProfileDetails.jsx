import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EditProfileDetails = ({ currentUserDetails, token, onProfileUpdated, onCancel }) => {
    const [formData, setFormData] = useState({
        bio: '',
        university: '',
        department: ''
    });
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [isLoading, setIsLoading] = useState(false); 
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false); 

    const [error, setError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(''); 
    const [avatarStatusMessage, setAvatarStatusMessage] = useState({ type: '', text: '' }); 

    const fileInputRef = useRef(null); 

    useEffect(() => {
        if (currentUserDetails) {
            setFormData({
                bio: currentUserDetails.bio || '',
                university: currentUserDetails.university || '',
                department: currentUserDetails.department || ''
            });
            setAvatarPreview(currentUserDetails.avatar || null); // Mevcut avatarı göster
        }
    }, [currentUserDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (error) setError(null);
        if (successMessage) setSuccessMessage('');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setAvatarStatusMessage({ type: '', text: '' }); // Önceki avatar mesajlarını temizle
        }
    };

    const triggerAvatarInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUserDetails || !currentUserDetails.id || !token) {
            setError("Kullanıcı bilgileri veya yetkilendirme eksik, güncelleme yapılamıyor.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage('');
        setAvatarStatusMessage({ type: '', text: '' });
        let profileUpdatedSuccessfully = false;

        try {
           
            let newAvatarUrl = currentUserDetails.avatar; 
            if (selectedAvatarFile) {
                setIsUploadingAvatar(true);
                const avatarFormData = new FormData();
                avatarFormData.append('file', selectedAvatarFile);

                try {
                    const avatarResponse = await axios.post(
                        `https://localhost:7119/api/Users/${currentUserDetails.id}/upload-profile-picture`,
                        avatarFormData,
                        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
                    );
                    newAvatarUrl = avatarResponse.data.profilePictureUrl; // Backend'den dönen yeni URL
                    setAvatarStatusMessage({ type: 'success', text: 'Profil fotoğrafı başarıyla yüklendi.' });
                    setSelectedAvatarFile(null); // Yükleme sonrası seçili dosyayı temizle
                } catch (avatarErr) {
                    console.error("Avatar yükleme hatası:", avatarErr.response?.data || avatarErr.message);
                    const avatarErrMsg = avatarErr.response?.data?.message || "Avatar yüklenirken bir hata oluştu.";
                    setAvatarStatusMessage({ type: 'error', text: avatarErrMsg });
                    
                    setIsLoading(false);
                    setIsUploadingAvatar(false);
                    return; 
                } finally {
                    setIsUploadingAvatar(false);
                }
            }

          
            const textPayload = {
                bio: formData.bio,
                university: formData.university,
                department: formData.department
                
            };

            await axios.put(
                `https://localhost:7119/api/Users/${currentUserDetails.id}/profile-update`,
                textPayload,
                { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );

            setSuccessMessage('Profil bilgileriniz başarıyla güncellendi!');
            profileUpdatedSuccessfully = true;

        } catch (err) {
            console.error("Profil metin bilgilerini güncelleme hatası:", err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.response?.data?.title || err.message || "Profil bilgileri güncellenirken bir hata oluştu.";
            setError(errorMessage); 
        } finally {
            setIsLoading(false);
            if (profileUpdatedSuccessfully && onProfileUpdated) {
                onProfileUpdated();
            }
        }
    };

    const handleCancelClick = () => {
        if (onCancel) onCancel();
    };

    if (!currentUserDetails) {
        return <p className="text-center text-gray-500">Kullanıcı bilgileri yükleniyor...</p>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profil Bilgilerini Düzenle</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex flex-col items-center space-y-3">
                    <img
                        src={avatarPreview || 'https://ui-avatars.com/api/?name=?&background=cccccc&color=fff&size=100'}
                        alt="Profil Fotoğrafı Önizleme"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        onChange={handleAvatarChange}
                        ref={fileInputRef}
                        className="hidden" // Gizli input
                        id="avatarUpload"
                    />
                    <button
                        type="button"
                        onClick={triggerAvatarInput}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    >
                        Fotoğrafı Değiştir
                    </button>
                    {avatarStatusMessage.text && (
                        <p className={`text-xs ${avatarStatusMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                            {avatarStatusMessage.text}
                        </p>
                    )}
                </div>

              
                <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">Üniversite</label>
                    <input type="text" name="university" id="university" value={formData.university} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Üniversiteniz" />
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Bölüm</label>
                    <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Bölümünüz" />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biyografi</label>
                    <textarea name="bio" id="bio" rows="4" value={formData.bio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Kendinizden bahsedin..." />
                </div>

              
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {successMessage && !avatarStatusMessage.text && ( // Sadece metin güncelleme başarılıysa göster
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                        {successMessage}
                    </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button type="button" onClick={handleCancelClick} disabled={isLoading || isUploadingAvatar} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        İptal
                    </button>
                    <button type="submit" disabled={isLoading || isUploadingAvatar} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-indigo-400">
                        {(isLoading || isUploadingAvatar) ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileDetails;