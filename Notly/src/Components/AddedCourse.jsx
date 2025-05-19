import React, { useState } from 'react';
import axios from 'axios';

const AddedCourse = ({ userId, token, userFullName, onCourseAdded, setIsAddingCourse }) => {
    const [courseName, setCourseName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseName.trim()) {
            setError('Ders adı boş bırakılamaz.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const payload = {
                name: courseName,
                userId: parseInt(userId), // Ensure userId is an integer if your backend expects it
                userFullName: userFullName // Included as per your Swagger definition
            };

            const response = await axios.post(
                `https://localhost:7119/api/Courses`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Ders ekleme başarılı:', response.data);
            setSuccessMessage(`"${courseName}" dersi başarıyla eklendi.`);
            setCourseName(''); // Clear input after successful submission

            if (onCourseAdded) {
                onCourseAdded(response.data); // Pass the new course data back to Profile
            }
            setTimeout(() => {
                if (typeof setIsAddingCourse === 'function') {
                    setIsAddingCourse(false);
                }
            }, 2000); // Close after 2 seconds
        } catch (err) {
            console.error('Ders ekleme hatası:', err);
            if (axios.isAxiosError(err) && err.response) {
                const backendError = err.response.data;
                const errorMessage = backendError.errors?.Name?.[0] || // Example for FluentValidation style error
                                   backendError.message ||
                                   backendError.title ||
                                   'Ders eklenirken bir sunucu hatası oluştu.';
                setError(errorMessage);
            } else if (err.request) {
                setError('Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.');
            } else {
                setError('Ders eklenirken beklenmedik bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Yeni Ders Ekle</h4>
                <button
                    onClick={() => setIsAddingCourse(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    aria-label="Kapat"
                    disabled={loading}
                >
                    &times; 
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                        Ders Adı
                    </label>
                    <input
                        type="text"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Örn: İleri Programlama Teknikleri"
                        disabled={loading}
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
                {successMessage && <p className="text-sm text-green-600 mb-3">{successMessage}</p>}

                <div className="flex items-center justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsAddingCourse(false)}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !courseName.trim()}
                    >
                        {loading ? 'Ekleniyor...' : 'Dersi Ekle'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddedCourse;