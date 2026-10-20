import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { WeddingConfig } from '../types';

interface FooterSectionProps {
  config: WeddingConfig;
  onOpenAdmin?: () => void;
}

// Komponen Hati Animasi Hilang Muncul (Twinkling / Fading Heart)
const TwinkleHeart: React.FC<{
  className?: string;
  color?: string;
  outlineColor?: string;
  size?: number;
  delay?: string;
  duration?: string;
  rotate?: number;
}> = ({
  className = '',
  color = '#f6a8cf',
  outlineColor = '#ef72b4',
  size = 22,
  delay = '0s',
  duration = '3.2s',
  rotate = 0,
}) => {
  return (
    <div
      className={`absolute pointer-events-none select-none anim-heart-twinkle ${className}`}
      style={{
        animationDelay: delay,
        animationDuration: duration,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs"
      >
        {/* Fill lembut transparan */}
        <path
          d="M 16,28.5 C 15.2,27.8 2.5,17.2 2.5,9.8 C 2.5,4.6 6.6,1.5 11.2,1.5 C 13.9,1.5 15.3,2.8 16,3.6 C 16.7,2.8 18.1,1.5 20.8,1.5 C 25.4,1.5 29.5,4.6 29.5,9.8 C 29.5,17.2 16.8,27.8 16,28.5 Z"
          fill={color}
          opacity="0.85"
        />
        {/* Outline garis coretan manis */}
        <path
          d="M 16,28.5 C 15.2,27.8 2.5,17.2 2.5,9.8 C 2.5,4.6 6.6,1.5 11.2,1.5 C 13.9,1.5 15.3,2.8 16,3.6 C 16.7,2.8 18.1,1.5 20.8,1.5 C 25.4,1.5 29.5,4.6 29.5,9.8 C 29.5,17.2 16.8,27.8 16,28.5 Z"
          stroke={outlineColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Aksen kilau putih */}
        <path
          d="M 6.5 8 C 6.5 6 8.5 4 10.5 4"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export const FooterSection: React.FC<FooterSectionProps> = ({ config, onOpenAdmin }) => {
  const [clickCount, setClickCount] = useState(0);

  // Secret 5-clicks shortcut for couple to access admin without typing URL
  const handleSecretFooterClick = () => {
    if (!onOpenAdmin) return;
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 5) {
      setClickCount(0);
      onOpenAdmin();
    }
  };

  return (
    <footer className="w-full px-4 pt-8 pb-24 sm:pb-14 text-center select-none overflow-hidden relative">
      {/* Style Animasi Hilang Muncul (Fade In - Scale Up - Fade Out) */}
      <style>{`
        @keyframes heartFadeTwinkle {
          0% {
            opacity: 0;
            transform: scale(0.4) translateY(6px);
          }
          25% {
            opacity: 0.95;
            transform: scale(1.15) translateY(-2px);
          }
          45% {
            opacity: 1;
            transform: scale(1) translateY(-4px);
          }
          75% {
            opacity: 0.9;
            transform: scale(1.05) translateY(-6px);
          }
          100% {
            opacity: 0;
            transform: scale(0.5) translateY(-10px);
          }
        }

        .anim-heart-twinkle {
          animation: heartFadeTwinkle 3.4s ease-in-out infinite;
        }
      `}</style>

      <div className="relative max-w-sm sm:max-w-md mx-auto py-3">
        {/* ================= LOVE HILANG MUNCUL SISI KIRI (Sesuai Titik Merah) ================= */}
        {/* Titik 1: Kiri atas dekat See You at Our Wedding Day */}
        <TwinkleHeart
          className="left-[2%] top-[0%]"
          size={26}
          color="#facfe5"
          outlineColor="#ef72b4"
          rotate={-16}
          delay="0s"
          duration="3.2s"
        />

        {/* Titik 2: Kiri agak bawah (samping nama Jaka) */}
        <TwinkleHeart
          className="left-[6%] top-[34%]"
          size={20}
          color="#dbeafc"
          outlineColor="#5797d0"
          rotate={14}
          delay="1.1s"
          duration="3.6s"
        />

        {/* Titik 3: Kiri bawah (antara nama dan With Love) */}
        <TwinkleHeart
          className="left-[1%] top-[62%]"
          size={24}
          color="#fce4ec"
          outlineColor="#ef72b4"
          rotate={-22}
          delay="2.2s"
          duration="3.4s"
        />

        {/* Titik 4: Kiri paling bawah */}
        <TwinkleHeart
          className="left-[12%] top-[86%]"
          size={18}
          color="#dbeafc"
          outlineColor="#5797d0"
          rotate={10}
          delay="0.6s"
          duration="3.8s"
        />

        {/* ================= LOVE HILANG MUNCUL SISI KANAN (Sesuai Titik Merah) ================= */}
        {/* Titik 5: Kanan atas dekat See You at Our Wedding Day */}
        <TwinkleHeart
          className="right-[3%] top-[2%]"
          size={24}
          color="#dbeafc"
          outlineColor="#5797d0"
          rotate={18}
          delay="0.8s"
          duration="3.5s"
        />

        {/* Titik 6: Kanan agak bawah (samping nama Dian) */}
        <TwinkleHeart
          className="right-[5%] top-[36%]"
          size={22}
          color="#facfe5"
          outlineColor="#ef72b4"
          rotate={-14}
          delay="1.9s"
          duration="3.3s"
        />

        {/* Titik 7: Kanan bawah (antara nama dan With Love) */}
        <TwinkleHeart
          className="right-[2%] top-[64%]"
          size={25}
          color="#dbeafc"
          outlineColor="#5797d0"
          rotate={20}
          delay="0.3s"
          duration="3.7s"
        />

        {/* Titik 8: Kanan paling bawah */}
        <TwinkleHeart
          className="right-[10%] top-[88%]"
          size={20}
          color="#fce4ec"
          outlineColor="#ef72b4"
          rotate={-8}
          delay="1.5s"
          duration="3.4s"
        />

        {/* ================= TEKS KONTEN ================= */}
        <p className="font-patrick text-lg sm:text-xl text-[#5797d0] tracking-wide relative z-10">
          See You at Our Wedding Day
        </p>

        <div className="font-caveat text-4xl sm:text-5xl font-bold text-[#ef72b4] my-2 relative z-10 drop-shadow-xs">
          {config.groom.name} & {config.bride.name}
        </div>

        <p 
          onClick={handleSecretFooterClick}
          className="font-patrick text-base text-[#5797d0] mt-1 cursor-default relative z-10 transition-transform active:scale-95"
        >
          With Love ♡
        </p>

        {/* ================= LOGO BULAT CIRCLE UKURAN 60% (FACEBOOK, INSTAGRAM, WHATSAPP) ================= */}
        <div className="flex items-center justify-center gap-2.5 mt-3.5 relative z-10">
          {/* Facebook (Ukuran 60% = 24px) */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-xs hover:shadow-md hover:scale-115 active:scale-90 transition-all cursor-pointer"
            title="Facebook"
            aria-label="Facebook"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Instagram (Ukuran 60% = 24px) */}
          <a
            href={config.groom.instagram ? `https://instagram.com/${config.groom.instagram.replace('@', '')}` : 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xs hover:shadow-md hover:scale-115 active:scale-90 transition-all cursor-pointer"
            title="Instagram"
            aria-label="Instagram"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* WhatsApp (Ukuran 60% = 24px) */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs hover:shadow-md hover:scale-115 active:scale-90 transition-all cursor-pointer"
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </a>
        </div>

        {/* ================= TOMBOL KELOLA UNDANGAN (ADMIN) ================= */}
        {onOpenAdmin && (
          <div className="mt-5 pt-3 border-t border-[#5797d0]/15 flex flex-col items-center relative z-10">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-patrick text-[#527595] hover:text-[#5797d0] bg-white/70 hover:bg-white border border-[#5797d0]/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Masuk ke Panel Pengelola / Admin Undangan"
            >
              <Lock className="w-3.5 h-3.5 text-[#5797d0]" />
              <span>Kelola Undangan (Admin)</span>
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
