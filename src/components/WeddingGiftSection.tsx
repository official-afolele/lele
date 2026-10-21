
import React, { useState } from 'react';
import { WeddingConfig } from '../types';
import { CreditCard, Gift, Copy, Check, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface WeddingGiftSectionProps {
  config: WeddingConfig;
}

export const WeddingGiftSection: React.FC<WeddingGiftSectionProps> = ({ config }) => {
  const [activePanel, setActivePanel] = useState<'rekening' | 'alamat' | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const accounts =
    config.bankAccounts?.length > 0
      ? config.bankAccounts
      : config.bank
        ? [config.bank]
        : [];

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      window.prompt('Salin teks berikut:', text);
    }
  };

  const togglePanel = (panel: 'rekening' | 'alamat') => {
    setActivePanel((current) => current === panel ? null : panel);
  };

  return (
    <section id="kado" className="w-full px-4 py-8 text-center scroll-mt-6">
      <div className="max-w-sm sm:max-w-md mx-auto">
        <h2 className="font-caveat text-4xl sm:text-5xl font-bold text-[#5d99d1] mb-2">
          Wedding Gift
        </h2>

        <p className="font-patrick text-base sm:text-lg text-[#527595] leading-relaxed mb-6 px-2">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
          Jika ingin berbagi tanda kasih, Anda dapat memilih cara berikut.
        </p>

        <div className="space-y-3 text-left">
          {/* TOMBOL TRANSFER */}
          <button
            type="button"
            onClick={() => togglePanel('rekening')}
            aria-expanded={activePanel === 'rekening'}
            className="w-full flex items-center gap-3 rounded-2xl border border-[#5797d0]/25 bg-white p-4 shadow-sm hover:shadow-md transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-[#eaf3fa] flex items-center justify-center text-[#5797d0] shrink-0">
              <CreditCard className="w-5 h-5" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-[#2d3748]">Kirim Hadiah via Transfer</span>
              <span className="block text-xs text-[#527595] mt-1">Lihat nomor rekening mempelai</span>
            </span>
            {activePanel === 'rekening'
              ? <ChevronUp className="w-5 h-5 text-[#5797d0]" />
              : <ChevronDown className="w-5 h-5 text-[#5797d0]" />}
          </button>

          {activePanel === 'rekening' && (
            <div className="space-y-3 animate-fade-in">
              {accounts.map((account, index) => (
                <div
                  key={`${account.accountNumber}-${index}`}
                  className="rounded-2xl border border-[#5797d0]/20 bg-white p-5 shadow-sm"
                >
                  <p className="font-bold text-[#2d3748]">{account.bankName}</p>
                  <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-[#ef72b4] my-2 break-all">
                    {account.accountNumber}
                  </p>
                  <p className="text-sm text-[#527595]">
                    a.n. <strong className="text-[#2d3748]">{account.accountHolder}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(account.accountNumber, `bank-${index}`)}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2d3748] px-3 py-2 text-xs font-medium text-white hover:bg-[#1a202c] transition-colors"
                  >
                    {copiedKey === `bank-${index}`
                      ? <><Check className="w-4 h-4 text-green-300" /> Tersalin!</>
                      : <><Copy className="w-4 h-4" /> Salin No. Rekening</>}
                  </button>
                </div>
              ))}
              {accounts.length === 0 && (
                <p className="rounded-xl bg-white p-4 text-sm text-[#527595]">
                  Informasi rekening belum tersedia.
                </p>
              )}
            </div>
          )}

          {/* TOMBOL ALAMAT KIRIM KADO */}
          <button
            type="button"
            onClick={() => togglePanel('alamat')}
            aria-expanded={activePanel === 'alamat'}
            className="w-full flex items-center gap-3 rounded-2xl border border-[#ef72b4]/25 bg-white p-4 shadow-sm hover:shadow-md transition-all"
          >
            <span className="w-11 h-11 rounded-xl bg-[#fff0f7] flex items-center justify-center text-[#ef72b4] shrink-0">
              <Gift className="w-5 h-5" />
            </span>
            <span className="flex-1">
              <span className="block font-bold text-[#2d3748]">Kirim Hadiah ke Alamat</span>
              <span className="block text-xs text-[#527595] mt-1">Lihat alamat pengiriman kado fisik</span>
            </span>
            {activePanel === 'alamat'
              ? <ChevronUp className="w-5 h-5 text-[#ef72b4]" />
              : <ChevronDown className="w-5 h-5 text-[#ef72b4]" />}
          </button>

          {activePanel === 'alamat' && (
            <div className="rounded-2xl border border-[#ef72b4]/20 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#ef72b4]">
                <MapPin className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-[#2d3748]">Alamat Pengiriman</h3>
              </div>
              <p className="text-sm text-[#527595] mb-1">Penerima:</p>
              <p className="font-bold text-[#2d3748]">
                {config.giftAddress?.recipient || 'Penerima belum diatur'}
              </p>
              <p className="text-sm leading-relaxed text-[#527595] mt-2">
                {config.giftAddress?.fullAddress || 'Alamat pengiriman belum tersedia.'}
              </p>
              {config.giftAddress?.fullAddress && (
                <button
                  type="button"
                  onClick={() => handleCopy(
                    `Penerima: ${config.giftAddress.recipient}\nAlamat: ${config.giftAddress.fullAddress}`,
                    'address'
                  )}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2d3748] px-3 py-2 text-xs font-medium text-white hover:bg-[#1a202c] transition-colors"
                >
                  {copiedKey === 'address'
                    ? <><Check className="w-4 h-4 text-green-300" /> Alamat Tersalin!</>
                    : <><Copy className="w-4 h-4" /> Salin Alamat</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
