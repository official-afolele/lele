
import React, { useState } from 'react';
import { WeddingConfig } from '../types';
import { Gift, Copy, Check, X, CreditCard, MapPin } from 'lucide-react';

interface WeddingGiftSectionProps {
  config: WeddingConfig;
}

const BsiLogoSVG: React.FC<{ className?: string }> = ({
  className = 'w-[80px] h-auto',
}) => (
  <svg
    viewBox="0 0 520 140"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Bank Syariah Indonesia"
  >
    <path
      d="M174 12 C178 26 187 35 201 39 C187 43 178 52 174 66 C170 52 161 43 147 39 C161 35 170 26 174 12 Z"
      fill="#F5A623"
    />
    <path
      d="M18 30 H65 C82 30 94 39 94 54 C94 64 87 71 78 75 C89 79 97 88 97 102 C97 119 83 128 65 128 H18 V30 Z M41 49 V66 H62 C69 66 73 62 73 57.5 C73 53 69 49 62 49 H41 Z M41 84 V109 H63 C71 109 75 104 75 96.5 C75 89 71 84 63 84 H41 Z"
      fill="#00A39D"
    />
    <path
      d="M125 110 C134 114 145 117 156 117 C173 117 182 110 182 99 C182 78 126 84 126 49 C126 30 143 18 167 18 C180 18 190 21 199 25 L192 46 C185 42 176 39 167 39 C156 39 149 44 149 52 C149 73 205 66 205 101 C205 120 186 131 159 131 C145 131 132 127 122 121 L125 110 Z"
      fill="#00A39D"
    />
    <path
      d="M228 30 C238 30 245 37 245 47 V128 H219 V30 H228 Z"
      fill="#00A39D"
    />
    <text x="270" y="60" fill="#00A39D" fontSize="30" fontWeight="bold">
      BANK SYARIAH
    </text>
    <text x="270" y="98" fill="#F5A623" fontSize="26" fontWeight="bold">
      INDONESIA
    </text>
  </svg>
);

export const WeddingGiftSection: React.FC<WeddingGiftSectionProps> = ({
  config,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const accounts =
    config.bankAccounts?.length > 0
      ? config.bankAccounts
      : config.bank
        ? [config.bank]
        : [];

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      window.prompt('Salin teks berikut:', text);
    }
  };

  return (
    <section
      id="kado"
      className="w-full px-4 py-10 text-center scroll-mt-6"
    >
      <div className="mx-auto max-w-sm sm:max-w-md">
        <h2 className="mb-3 font-caveat text-4xl font-bold text-[#5d99d1] sm:text-5xl">
          Wedding Gift
        </h2>

        <p className="mb-7 px-2 font-patrick text-base leading-relaxed text-[#527595] sm:text-lg">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
          Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
          mengirimkan kado melalui:
        </p>

        {/* SATU TOMBOL SAJA */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-base font-medium text-[#3f4865] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Gift className="h-5 w-5" />
          Kirim Gift
        </button>
      </div>

      {/* POP-UP DETAIL HADIAH */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-title"
            className="relative max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-[#fffefa] p-4 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup"
              className="absolute right-3 top-3 z-10 rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5 pt-2 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf3fa] text-[#5797d0]">
                <Gift className="h-6 w-6" />
              </div>
              <h3
                id="gift-title"
                className="font-caveat text-3xl font-bold text-[#5d99d1]"
              >
                Wedding Gift
              </h3>
              <p className="mt-1 text-xs text-[#527595]">
                Terima kasih atas tanda kasih Anda.
              </p>
            </div>

            {/* KARTU REKENING DENGAN LOGO */}
            <div className="mb-5">
              <h4 className="mb-3 text-left font-patrick text-base font-bold text-[#527595]">
                Hadiah via Transfer
              </h4>

              <div className="space-y-3">
                {accounts.map((account, index) => {
                  const isBsi =
                    account.bankName.toLowerCase().includes('bsi') ||
                    account.bankName.toLowerCase().includes('syariah');

                  const accentColor =
                    account.accountHolder.toLowerCase().includes('jaka')
                      ? '#5797d0'
                      : '#ef72b4';

                  const copyKey = `bank-${index}`;

                  return (
                    <div
                      key={`${account.accountNumber}-${index}`}
                      className="rounded-2xl border border-[#5797d0]/20 bg-white p-4 text-left shadow-sm sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm font-bold text-[#2d3748] sm:text-base">
                            {account.bankName}
                          </p>

                          <p
                            className="my-2 break-all font-mono text-xl font-bold tracking-wide sm:text-2xl"
                            style={{ color: accentColor }}
                          >
                            {account.accountNumber}
                          </p>

                          <p className="font-sans text-sm text-[#527595]">
                            a.n.{' '}
                            <strong className="text-[#2d3748]">
                              {account.accountHolder}
                            </strong>
                          </p>
                        </div>

                        <div className="flex w-[76px] shrink-0 items-start justify-end pt-1">
                          {isBsi ? (
                            <BsiLogoSVG className="h-auto w-full" />
                          ) : (
                            <CreditCard
                              className="h-7 w-7"
                              style={{ color: accentColor }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end border-t border-[#edf2f7] pt-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            copyText(account.accountNumber, copyKey)
                          }
                          className="inline-flex items-center gap-1.5 rounded-md bg-[#2d3748] px-2.5 py-1.5 font-patrick text-xs text-white transition hover:bg-[#1a202c]"
                        >
                          {copiedKey === copyKey ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-300" />
                              Tersalin!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Salin No. Rekening
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {accounts.length === 0 && (
                <p className="rounded-xl border bg-white p-4 text-sm text-gray-500">
                  Informasi rekening belum tersedia.
                </p>
              )}
            </div>

            {/* KARTU ALAMAT PENGIRIMAN */}
            <div>
              <h4 className="mb-3 text-left font-patrick text-base font-bold text-[#527595]">
                Kirim Kado Fisik
              </h4>

              <div className="rounded-2xl border border-[#5797d0]/20 bg-white p-4 text-left shadow-sm sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f7] text-[#ef72b4]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#527595]">Penerima</p>
                    <p className="font-sans font-bold text-[#2d3748]">
                      {config.giftAddress?.recipient || 'Belum diatur'}
                    </p>

                    <p className="mt-2 break-words font-sans text-sm leading-relaxed text-[#527595]">
                      {config.giftAddress?.fullAddress ||
                        'Alamat pengiriman belum tersedia.'}
                    </p>
                  </div>
                </div>

                {config.giftAddress?.fullAddress && (
                  <div className="mt-3 flex justify-end border-t border-[#edf2f7] pt-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `Penerima: ${config.giftAddress.recipient}\nAlamat: ${config.giftAddress.fullAddress}`,
                          'address'
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#2d3748] px-2.5 py-1.5 font-patrick text-xs text-white transition hover:bg-[#1a202c]"
                    >
                      {copiedKey === 'address' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-300" />
                          Alamat Tersalin!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Salin Alamat
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full rounded-xl bg-[#7b91b8] py-3 font-patrick font-bold text-white transition hover:bg-[#687fa8]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
