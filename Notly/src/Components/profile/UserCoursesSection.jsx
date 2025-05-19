import React from 'react';
import AddedCourse from '../../Components/AddedCourse'; 

const UserCoursesSection = ({
    enrolledCourses,
    isAddingCourse,
    onAddCourseClick,
    userId,
    token,
    userFullName,
    onCourseAdded,
    onSetIsAddingCourse,
    icons,
    onDeleteCourse, 
    isProcessing, 
    errorMessage 
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="text-indigo-600 mr-2">{icons.Course}</span> Kayıtlı Dersler
                </h3>
                {!isAddingCourse && userId && (
                    <button
                        onClick={onAddCourseClick}
                        disabled={isProcessing} // İşlem devam ederken butonu pasif yap
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <span className="mr-2 text-lg">{icons.PlusCircle}</span> Ders Ekle
                    </button>
                )}
            </div>

            {errorMessage && <p className="text-sm text-red-600 mb-3">{errorMessage}</p>}

            {isAddingCourse && userId && token ? (
                <AddedCourse
                    userId={userId}
                    token={token}
                    userFullName={userFullName}
                    onCourseAdded={onCourseAdded}
                    setIsAddingCourse={onSetIsAddingCourse}
                />
            ) : enrolledCourses.length > 0 ? (
                <ul className="space-y-3">
                    {enrolledCourses.map((course) => (
                        <li 
                            key={course.id} 
                            className="flex justify-between items-center p-4 bg-sky-50 hover:bg-sky-100 transition-all duration-200 rounded-lg text-gray-700 text-sm font-medium shadow-sm hover:shadow-md border border-sky-100"
                        >
                            <span>{course.name}</span>
                            <button
                                onClick={() => onDeleteCourse(course.id)}
                                disabled={isProcessing} // İşlem devam ederken butonu pasif yap
                                className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                title="Dersi Sil"
                            >
                              
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-600 py-16 bg-gray-50 rounded-lg">
                    <p className="text-xl mb-2">{icons.Course}</p>
                    <p className="font-semibold">Henüz kayıtlı olduğun bir ders yok.</p>
                    {userId && <p className="text-sm mt-1">Yeni ders eklemek için yukarıdaki "Ders Ekle" butonunu kullan.</p>}
                </div>
            )}
        </div>
    );
};

export default UserCoursesSection;