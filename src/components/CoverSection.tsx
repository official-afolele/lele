import React from "react";
import { Mail } from "lucide-react";
import { WeddingConfig } from "../types";
import { normalizeImageUrl } from "../utils/imageUrl";
import { DEFAULT_COVER_PHOTO_BASE64 } from "./coverPhotoBase64";

interface CoverSectionProps {
  config: WeddingConfig;
  guestName: string;
  onOpenInvitation: () => void;
  onOpenAdmin?: () => void;
  onEditPhoto?: (role: 'groom' | 'bride') => void;
  onUpdateCoverPhoto?: (url: string) => void;
}

export const CoverSection: React.FC<CoverSectionProps> = ({
  config,
  guestName,
  onOpenInvitation,
  onOpenAdmin,
}) => {
  // Gunakan foto cover dari config jika ada, atau fallback ke file /couple-cover.jpg atau data base64
  const coupleCoverUrl = config.couplePhoto && !config.couplePhoto.includes("couple-photo.jpg")
    ? normalizeImageUrl(config.couplePhoto)
    : "/couple-cover.jpg";

  return (
    <section 
      id="cover-section"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden text-center select-none bg-[#1548a4]"
    >
      {/* Import Font Alex Brush & Playfair Display langsung di dalam komponen agar 100% aktif di Vercel */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap");
        .font-alex-brush {
          font-family: "Alex Brush", cursive !important;
        }
        .font-playfair-display {
          font-family: "Playfair Display", serif !important;
        }
      `}</style>

      {/* ================= BACKGROUND PORTRAIT (Dian di Kiri, Jaka di Kanan) ================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-[#1548a4]">
        <img
          src={coupleCoverUrl}
          alt="Dian & Jaka"
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback ke data base64 jika file gagal dimuat
            const target = e.currentTarget;
            if (target.src !== DEFAULT_COVER_PHOTO_BASE64) {
              target.src = DEFAULT_COVER_PHOTO_BASE64;
            }
          }}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Top Subtle Blue Gradient */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-44 sm:h-52 bg-gradient-to-b from-[#113e8d]/80 via-[#1548a4]/50 to-transparent pointer-events-none z-10" 
      />

      {/* Center Subtle Blue Blend */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1548a4]/25 to-transparent pointer-events-none z-10" 
      />

      {/* Bottom Royal Blue Gradient Overlay */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 bottom-0 h-72 sm:h-80 bg-gradient-to-t from-[#0e3373] via-[#124294]/85 to-transparent pointer-events-none z-10" 
      />



      {/* ================= TOP HEADER: Dian & Jaka ================= */}
      <div className="relative z-20 pt-14 sm:pt-16 px-4 flex flex-col items-center">
        {/* Slender Romantic Script Names: Dian & Jaka */}
        <h1 
          style={{ fontFamily: "'Alex Brush', cursive" }}
          className="font-alex-brush text-5xl sm:text-6xl md:text-7xl text-white font-normal tracking-wide drop-shadow-[0_2px_12px_rgba(7,25,58,0.7)] leading-tight select-none"
        >
          Dian &amp; Jaka
        </h1>

        {/* Wedding Date */}
        <p className="font-sans text-xs sm:text-sm text-sky-100/95 font-medium tracking-wide mt-1 drop-shadow-[0_1px_4px_rgba(7,25,58,0.7)]">
          {config.akad?.dateStr || config.resepsi?.dateStr || "Sabtu, 26 Desember 2026"}
        </p>
      </div>

      {/* Center Spacer */}
      <div className="relative z-20 flex-1" />

      {/* ================= BOTTOM INVITATION AREA ================= */}
      <div className="relative z-20 pb-12 sm:pb-16 px-4 sm:px-6 flex flex-col items-center max-w-sm sm:max-w-md mx-auto w-full">
        {/* Salutation */}
        <span className="font-sans text-xs sm:text-sm text-sky-100/90 font-normal tracking-wide drop-shadow-sm">
          Kepada Yth. Bpk/Ibu/Sdr/i
        </span>

        {/* Guest Name in Classic Bold Serif */}
        <h2 
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="font-playfair-display text-2xl sm:text-3xl font-bold text-white mt-1.5 mb-1 tracking-wide drop-shadow-[0_2px_10px_rgba(7,25,58,0.7)] break-words text-center max-w-full"
        >
          {guestName || "Nama Tamu"}
        </h2>

        {/* Courtesy Disclaimer */}
        <p 
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="font-playfair-display italic text-[11px] sm:text-xs text-sky-200/85 tracking-wide drop-shadow-sm text-center"
        >
          *) Mohon maaf apabila ada kesalahan dalam penulisan nama/gelar
        </p>

        {/* Glowing White Border Button */}
        <button
          id="open-invitation-btn"
          type="button"
          onClick={onOpenInvitation}
          className="mt-4 px-6 sm:px-7 py-2.5 rounded-xl bg-[#1d52a8]/70 hover:bg-[#2561c2]/85 active:scale-95 border-2 border-white/90 text-white font-sans text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md shadow-[0_0_18px_rgba(255,255,255,0.45)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group min-h-[42px]"
        >
          <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </section>
  );
};
