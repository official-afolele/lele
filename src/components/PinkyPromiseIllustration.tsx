import React from 'react';

interface PinkyPromiseIllustrationProps {
  className?: string;
}

export const PinkyPromiseIllustration: React.FC<PinkyPromiseIllustrationProps> = ({
  className = 'w-full max-w-[460px] h-32 sm:h-36',
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center my-2 select-none">
      <svg
        viewBox="0 0 520 180"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Ilustrasi benang cinta dengan simpul hati menghubungkan jari cincin wanita dan pria"
      >
        <defs>
          <style>{`
            /* Animasi detak jantung halus pada simpul hati benang */
            @keyframes heartbeatThread {
              0%, 100% {
                transform: scale(1);
              }
              14% {
                transform: scale(1.18);
              }
              28% {
                transform: scale(1);
              }
              42% {
                transform: scale(1.1);
              }
              70% {
                transform: scale(1);
              }
            }

            /* Gelombang lembut tali benang cinta */
            @keyframes stringGentleWave {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-2px);
              }
            }

            /* Hati kecil melayang halus */
            @keyframes floatMiniLove {
              0% {
                transform: translateY(2px) scale(0.6);
                opacity: 0;
              }
              30% {
                opacity: 0.85;
              }
              75% {
                opacity: 0.7;
              }
              100% {
                transform: translateY(-20px) scale(1.05);
                opacity: 0;
              }
            }

            .anim-heart-node {
              animation: heartbeatThread 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
              transform-origin: 255px 62px;
            }

            .anim-thread-left {
              animation: stringGentleWave 3s ease-in-out infinite;
              transform-origin: 190px 65px;
            }

            .anim-thread-right {
              animation: stringGentleWave 3s ease-in-out 0.5s infinite;
              transform-origin: 325px 65px;
            }

            .anim-mini-float {
              animation: floatMiniLove 3s ease-in-out infinite;
              transform-origin: 255px 42px;
            }
          `}</style>
        </defs>

        {/* ================= TANGAN WANITA (KIRI) ================= */}
        {/* Garis-garis lipatan baju/lengan kiri (persis sesuai gambar Canva) */}
        <g stroke="#8cbfe3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Garis lipatan luar paling kiri */}
          <path d="M12 118 C20 135 24 150 25 168" strokeDasharray="1 0" />
          <path d="M28 112 C36 132 40 152 42 168" />
          <path d="M48 122 C52 140 54 156 55 168" strokeWidth="2.2" opacity="0.85" />

          {/* Pergelangan tangan ke telapak */}
          <path d="M48 95 C52 82 56 70 60 62" />
          <path d="M72 115 C75 100 78 88 80 75" />

          {/* Jari-jari kiri yang menekuk */}
          <path d="M52 64 C48 50 52 42 58 39 C64 36 68 45 66 56 C64 64 66 70 70 74" />
          <path d="M62 48 C64 40 68 36 74 38 C79 40 78 50 75 60" />
          <path d="M72 45 C74 38 78 35 83 37 C88 40 86 50 82 62" />

          {/* Jari yang terangkat lurus ke atas tempat benang terikat */}
          <path d="M82 62 C85 45 88 28 92 22 C97 17 103 21 101 34 C98 50 94 72 90 92" />

          {/* Garis lengan bawah kanan */}
          <path d="M90 92 C86 118 84 144 82 168" />
          <path d="M98 108 C102 130 102 152 100 168" strokeWidth="2.2" opacity="0.85" />
        </g>

        {/* ================= TANGAN PRIA (KANAN) ================= */}
        {/* Lengan Jas Pria - Solid Fill Biru Muda (persis sesuai crop gambar Canva) */}
        <path
          d="M428 168 L420 118 C424 110 432 104 442 100 L470 88 L505 168 Z"
          fill="#8cbfe3"
        />

        {/* Garis tangan & jari pria kanan */}
        <g stroke="#8cbfe3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          {/* Garis manset jas */}
          <path d="M420 118 C426 112 434 106 444 102" strokeWidth="2.4" />

          {/* Pergelangan tangan pria */}
          <path d="M422 110 C418 96 414 85 410 76" />
          <path d="M434 100 C430 88 426 80 422 72" />

          {/* Jari pria terangkat lurus ke atas dengan cincin */}
          <path d="M400 70 C398 52 396 34 400 24 C405 16 411 20 410 32 C408 46 406 60 404 72" />

          {/* Cincin di pangkal jari pria tempat benang terikat */}
          <ellipse
            cx="404"
            cy="46"
            rx="5.5"
            ry="2.8"
            transform="rotate(-8 404 46)"
            stroke="#8cbfe3"
            strokeWidth="2.2"
            fill="none"
          />

          {/* Jari-jari lain yang menekuk */}
          <path d="M408 52 C414 46 420 48 421 55 C422 62 418 70 412 76" strokeWidth="2.4" />
          <path d="M418 55 C424 52 429 55 430 62 C430 70 424 78 418 82" strokeWidth="2.4" />
          <path d="M426 64 C432 64 436 68 436 75 C434 84 428 90 422 94" strokeWidth="2.2" />
        </g>

        {/* ================= TALI BENANG DENGAN SIMPUL HATI ================= */}
        {/* Tali kiri dari jari wanita menuju simpul hati */}
        <path
          className="anim-thread-left"
          d="M98 32 C140 52 188 78 238 76"
          stroke="#8cbfe3"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Tali kanan dari simpul hati menuju cincin jari pria */}
        <path
          className="anim-thread-right"
          d="M272 76 C318 78 362 55 401 46"
          stroke="#8cbfe3"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Simpul Hati di Tengah (Center Heart Loop persis bentuk Canva) */}
        <g className="anim-heart-node">
          {/* Lilitan benang berbentuk hati yang anggun */}
          <path
            d="
              M 238 76
              C 232 66 226 50 238 40
              C 248 31 255 40 255 48
              C 255 40 262 31 272 40
              C 284 50 278 66 272 76
              C 265 85 255 94 255 94
              C 255 94 245 85 238 76 Z
            "
            stroke="#8cbfe3"
            strokeWidth="3"
            fill="#f7fbfe"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Aksen warna pink pastel lembut di dalam hati */}
          <path
            d="
              M 243 70
              C 238 62 234 50 242 44
              C 249 38 255 44 255 50
              C 255 44 261 38 268 44
              C 276 50 272 62 267 70
              C 261 78 255 85 255 85
              C 255 85 249 78 243 70 Z
            "
            fill="#facfe5"
            opacity="0.85"
          />
        </g>

        {/* Hati kecil melayang bergerak lembut ke atas */}
        <g className="anim-mini-float">
          <path
            d="M255 24 C251 18 244 19 243 24 C242 28 246 32 255 36 C264 32 268 28 267 24 C266 19 259 18 255 24 Z"
            fill="#f6a8cf"
            stroke="#ef72b4"
            strokeWidth="1.2"
          />
        </g>
      </svg>
    </div>
  );
};
