import React from 'react';

interface BsiLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const BsiLogo: React.FC<BsiLogoProps> = ({ className = 'h-6 w-auto', variant = 'full' }) => {
  if (variant === 'icon') {
    // Compact BSI Symbol (BSI letters + golden star)
    return (
      <svg 
        viewBox="0 0 160 120" 
        className={className} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo BSI"
      >
        {/* Golden Diamond Star */}
        <path 
          d="M108 8 C112 20 120 28 132 32 C120 36 112 44 108 56 C104 44 96 36 84 32 C96 28 104 20 108 8 Z" 
          fill="#F5A623" 
        />
        {/* Letter B */}
        <path 
          d="M10 26 H46 C60 26 69 33 69 45 C69 53 64 59 56 62 C66 65 72 73 72 85 C72 99 61 106 46 106 H10 V26 Z M30 43 V56 H44 C49 56 52 53 52 49.5 C52 46 49 43 44 43 H30 Z M30 73 V90 H45 C51 90 54 86.5 54 81.5 C54 76.5 51 73 45 73 H30 Z" 
          fill="#00A39D" 
        />
        {/* Letter S */}
        <path 
          d="M82 92 C88 95 96 97 104 97 C116 97 122 92 122 84 C122 68 83 72 83 47 C83 33 95 24 112 24 C121 24 128 26 134 29 L129 44 C124 41 118 39 112 39 C104 39 99 43 99 49 C99 64 139 59 139 85 C139 100 125 108 106 108 C96 108 87 105 80 101 L82 92 Z" 
          fill="#00A39D" 
        />
        {/* Letter I */}
        <path 
          d="M148 26 C155 26 160 31 160 38 V106 H142 V26 H148 Z" 
          fill="#00A39D" 
        />
      </svg>
    );
  }

  // Full Horizontal BSI Logo (BSI + Golden Star + Bank Syariah Indonesia)
  return (
    <svg 
      viewBox="0 0 520 130" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Bank Syariah Indonesia (BSI)"
    >
      {/* Golden 4-pointed Star */}
      <path 
        d="M174 12 C178 26 187 35 201 39 C187 43 178 52 174 66 C170 52 161 43 147 39 C161 35 170 26 174 12 Z" 
        fill="#F5A623" 
      />

      {/* Letter B */}
      <path 
        d="M18 30 H65 C82 30 94 39 94 54 C94 64 87 71 78 75 C89 79 97 88 97 102 C97 119 83 128 65 128 H18 V30 Z M41 49 V66 H62 C69 66 73 62 73 57.5 C73 53 69 49 62 49 H41 Z M41 84 V109 H63 C71 109 75 104 75 96.5 C75 89 71 84 63 84 H41 Z" 
        fill="#00A39D" 
      />

      {/* Letter S */}
      <path 
        d="M112 108 C120 113 131 116 142 116 C158 116 167 109 167 98 C167 78 115 84 115 54 C115 37 130 27 151 27 C163 27 172 30 180 34 L173 50 C167 47 159 44 151 44 C141 44 134 49 134 56 C134 74 187 69 187 99 C187 117 170 128 145 128 C132 128 120 125 110 119 L112 108 Z" 
        fill="#00A39D" 
      />

      {/* Letter I with curve */}
      <path 
        d="M200 30 C209 30 215 36 215 45 V128 H193 V30 H200 Z" 
        fill="#00A39D" 
      />

      {/* Text "BANK SYARIAH" */}
      <text 
        x="242" 
        y="75" 
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
        fontSize="34" 
        fontWeight="700" 
        fill="#00A39D" 
        letterSpacing="2"
      >
        BANK SYARIAH
      </text>

      {/* Text "INDONESIA" */}
      <text 
        x="242" 
        y="118" 
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
        fontSize="34" 
        fontWeight="700" 
        fill="#00A39D" 
        letterSpacing="3"
      >
        INDONESIA
      </text>
    </svg>
  );
};
