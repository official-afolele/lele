import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WeddingConfig, GalleryPhoto } from '../types';
import { normalizeImageUrl } from '../utils/imageUrl';
import { Sparkles, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface OurGallerySectionProps {
  config: WeddingConfig;
}

export const OurGallerySection: React.FC<OurGallerySectionProps> = ({ config }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Ambil daftar foto galeri dari config, atau fallback ke foto prewedding pilihan
  const photos: GalleryPhoto[] = (config.gallery && config.gallery.length > 0)
    ? config.gallery
    : [
        {
          id: 'gal_1',
          url: url: '/uploads/1.jpg',
          caption: ''
        },
        {
          id: 'gal_2',
          url: '/uploads/2.jpg',
          caption: ''
        },
        {
          id: 'gal_3',
          url: '/uploads/3.jpg',
          caption: ''
        },
        {
          id: 'gal_4',
          url: '/uploads/4.jpg',
          caption: ''
        },
        {
          id: 'gal_5',
          url: '/uploads/5.jpg',
          caption: ''
        },
        {
          id: 'gal_6',
          url: '/uploads/6.jpg',
          caption: ''
        }
      ];

  // Efek geser foto otomatis (Auto-slide Animation) setiap 3.5 detik
  useEffect(() => {
    if (photos.length <= 1 || isPaused || selectedPhotoIndex !== null) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      // Jika sudah mencapai ujung kanan, geser kembali ke awal secara halus
      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setCurrentIndex(0);
      } else {
        container.scrollBy({ left: 250, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [photos.length, isPaused, selectedPhotoIndex]);

  // Sinkronisasi posisi scroll dengan dot navigasi
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollWidth <= clientWidth) return;
    const maxScroll = scrollWidth - clientWidth;
    const fraction = Math.max(0, Math.min(1, scrollLeft / maxScroll));
    const index = Math.round(fraction * (photos.length - 1));
    setCurrentIndex(index);
  };

  const scrollToPhoto = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const items = container.querySelectorAll<HTMLElement>('.gallery-carousel-item');
    if (items[index]) {
      items[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentIndex(index);
    }
  };

  const handleScrollPrev = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };

  const handleScrollNext = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  const handleLightboxPrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  }, [selectedPhotoIndex, photos.length]);

  const handleLightboxNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  }, [selectedPhotoIndex, photos.length]);

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  // Navigasi keyboard (Panah Kiri, Kanan, dan Escape)
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleLightboxPrev();
      } else if (e.key === 'ArrowRight') {
        handleLightboxNext();
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, handleLightboxPrev, handleLightboxNext]);

  // Touch swipe untuk geser foto pada layar HP
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleLightboxNext();
      } else {
        handleLightboxPrev();
      }
    }
  };

  return (
    <section id="galeri" className="w-full py-8 text-center scroll-mt-6 select-none overflow-hidden">
      <div className="w-full max-w-sm sm:max-w-md mx-auto px-4">
        {/* Header Judul Our Gallery */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[#ef72b4] animate-pulse" />
          <h2 className="font-caveat text-4xl sm:text-5xl font-bold text-[#5d99d1]">
            Our Gallery
          </h2>
          <Sparkles className="w-5 h-5 text-[#ef72b4] animate-pulse" />
        </div>

        <p className="font-patrick text-base sm:text-lg text-[#527595] mb-5">
          Momen Indah &amp; Kenangan Prewedding Kami
        </p>
      </div>

      {/* Kontainer Carousel Horizontal - 1 Baris Bisa Digeser ke Samping */}
      <div 
        className="relative w-full overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        {/* Tombol Navigasi Panah Kiri */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={handleScrollPrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#5797d0] shadow-md hover:shadow-lg border border-[#5797d0]/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            aria-label="Geser foto ke kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Tombol Navigasi Panah Kanan */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={handleScrollNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#5797d0] shadow-md hover:shadow-lg border border-[#5797d0]/20 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            aria-label="Geser foto ke kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Track Carousel 1 Baris dengan Animasi Slide */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 px-6 sm:px-8 snap-x snap-mandatory scroll-smooth touch-pan-x scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((photo, index) => {
            const photoUrl = normalizeImageUrl(photo.url);
            return (
              <div
                key={photo.id || index}
                onClick={() => setSelectedPhotoIndex(index)}
                className="gallery-carousel-item shrink-0 w-[220px] sm:w-[250px] snap-center bg-white p-2.5 rounded-2xl shadow-md hover:shadow-xl border border-[#5797d0]/20 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 active:scale-[0.98]"
              >
                {/* Image Container dengan Aspect Ratio Portrait 3:4 */}
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#eaf4fa] relative group/img">
                  <img
                    src={photoUrl}
                    alt={photo.caption || 'Foto Galeri Prewedding'}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('couple-photo.jpg')) {
                        target.src = '/couple-photo.jpg';
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover/img:scale-108 transition-transform duration-500 ease-out"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-[#5797d0] flex items-center justify-center shadow-md transform scale-75 group-hover/img:scale-100 transition-transform">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Caption di Bawah Foto (Tanpa nomor urut) */}
                {photo.caption && (
                  <p className="font-patrick text-xs sm:text-sm text-[#5797d0] font-medium mt-2.5 truncate px-1 text-center">
                    {photo.caption}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Titik Navigasi (Dots Indicator Bersih Tanpa Teks Angka) */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {photos.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToPhoto(dotIdx)}
              aria-label={`Lihat foto ${dotIdx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === dotIdx
                  ? 'w-6 h-2 bg-[#5797d0]'
                  : 'w-2 h-2 bg-[#5797d0]/30 hover:bg-[#5797d0]/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal (Tampilan Layar Penuh saat Foto Dibuka) dengan Animasi Halus & Gesture Geser */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn transition-opacity duration-300"
        >
          {/* Tombol Tutup */}
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            aria-label="Tutup tampilan foto"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Tombol Geser Kiri Lightbox */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleLightboxPrev}
              className="absolute left-2 sm:left-6 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}

          {/* Frame Foto & Caption dengan Animasi Zoom & Slide Halus */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full max-h-[85vh] flex flex-col items-center transform transition-all duration-300 animate-scaleUp"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-black/40">
              <img
                key={selectedPhotoIndex}
                src={normalizeImageUrl(photos[selectedPhotoIndex].url)}
                alt={photos[selectedPhotoIndex].caption || 'Foto Galeri'}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[72vh] object-contain rounded-2xl transition-all duration-300 animate-fadeIn"
              />
            </div>

            {/* Caption Foto Bersih Tanpa Angka Urutan */}
            {photos[selectedPhotoIndex].caption && (
              <div className="mt-3 text-center text-white px-4">
                <p className="font-patrick text-base sm:text-lg font-bold drop-shadow-md">
                  {photos[selectedPhotoIndex].caption}
                </p>
              </div>
            )}
          </div>

          {/* Tombol Geser Kanan Lightbox */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleLightboxNext}
              className="absolute right-2 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
              aria-label="Foto Selanjutnya"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
