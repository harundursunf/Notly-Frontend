import React from 'react';
import { Link } from 'react-router-dom';

// Bu bileşen tek bir notun tüm görselini oluşturur.
const NoteCard = ({ note, Icons, onLike, onOpenDetail }) => {

    // PDF ismini URL'den çıkaran yardımcı fonksiyon
    const getPdfNameFromUrl = (url) => {
        try {
            const pathSegments = new URL(url).pathname.split('/');
            return decodeURIComponent(pathSegments[pathSegments.length - 1]);
        } catch (e) {
            const fallbackName = url.substring(url.lastIndexOf('/') + 1);
            return decodeURIComponent(fallbackName) || `PDF Dosyası`;
        }
    };

    return (
        <article className="bg-white p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out border border-slate-200/80 flex flex-col transform hover:-translate-y-1">
            {/* Kart Başlığı: Yazar Bilgileri */}
            <div className="flex items-center mb-4">
                <img
                    src={note.authorAvatar}
                    alt={note.author}
                    className="w-11 h-11 rounded-full mr-4 border-2 border-slate-100 object-cover shadow-sm"
                />
                <div>
                    <Link to={`/profil/${note.userId}`} className="text-base font-bold text-slate-800 hover:text-indigo-600 transition-colors block leading-tight">
                        {note.author}
                    </Link>
                    <Link to={`/notes?courseId=${note.courseId}`} className="text-sm text-slate-500 hover:text-indigo-500 transition-colors block">
                        {note.courseName}
                    </Link>
                </div>
            </div>

            {/* Not İçeriği */}
            <div className="flex-grow">
                <h2 className="text-lg font-bold text-slate-800 mb-2 hover:text-indigo-700 transition-colors">
                    <button onClick={() => onOpenDetail(note.id)} className="text-left hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-sm">
                        {note.title}
                    </button>
                </h2>
                <p className="text-sm text-slate-700 mb-4 line-clamp-3 leading-relaxed">
                    {note.description}
                </p>
            </div>
            
            {/* Resimler ve PDF'ler */}
            {note.imageUrls && note.imageUrls.length > 0 && (
                 <div className="my-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {note.imageUrls.slice(0, 4).map((url, index) => (
                         <button key={index} onClick={() => onOpenDetail(note.id)} className="focus:outline-none block group relative aspect-w-1 aspect-h-1">
                             <img src={url} alt={`Not için resim ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-md border group-hover:opacity-80 transition-opacity" />
                             {index === 3 && note.imageUrls.length > 4 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                    <span className="text-white font-bold text-xl">+{note.imageUrls.length - 4}</span>
                                </div>
                             )}
                         </button>
                    ))}
                 </div>
            )}

            {note.pdfUrls && note.pdfUrls.length > 0 && (
                <div className="my-3 space-y-2.5">
                    {note.pdfUrls.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors group" title={getPdfNameFromUrl(url)}>
                            <span className="text-2xl mr-3 text-red-500">{Icons.PDF}</span>
                            <span className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 truncate">{getPdfNameFromUrl(url)}</span>
                        </a>
                    ))}
                </div>
            )}

            {/* Kart Alt Bilgisi: Tarih ve Beğeni */}
            <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-200/80 mt-auto">
                <span className="flex items-center gap-1.5">
                    <span className="text-lg text-slate-400">{Icons.Calendar}</span>
                    {note.date}
                </span>
                <button onClick={() => onLike(note)} className={`flex items-center transition-colors duration-200 focus:outline-none group rounded-full px-3 py-1.5 -my-1.5 -mr-2 ${note.isLikedByCurrentUser ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`} title={note.isLikedByCurrentUser ? "Beğeniyi Geri Al" : "Beğen"}>
                    <span className={`text-lg transition-transform duration-200 ease-out transform ${note.isLikedByCurrentUser ? 'scale-110' : 'group-hover:scale-110'}`}>{Icons.ThumbUp}</span>
                    <span className="ml-1.5 font-semibold text-sm">{note.likes}</span>
                </button>
            </div>
        </article>
    );
};

export default NoteCard;