
import React, { useState } from 'react';
import { WeddingConfig } from '../types';
import { Gift, Copy, Check, X } from 'lucide-react';

interface WeddingGiftSectionProps {
  config: WeddingConfig;
}

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

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      window.prompt('Silakan salin teks berikut:', text);
    }
  };

  return (
    <section
      id="kado"
      className="w-full px-4 py-12 text-center scroll-mt-6"
    >
      <div className="max-w-sm sm:max-w-md mx-auto">
        <h2 className="font-caveat text-4xl sm:text-5xl font-bold text-[#5d99d1] mb-3">
          Wedding Gift
        </h2>

        <p className="font-patrick text-base sm:text-lg text-[#527595] leading-relaxed mb-8 px-2">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
          Jika ingin berbagi tanda kasih, Anda dapat mengirimkan hadiah
          melalui tombol di bawah ini.
        </p>

        {/* SATU TOMBOL KIRIM GIFT */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-[#3f4865] font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Gift className="w-5 h-5" />
          <span>Kirim Gift</span>
        </button>
      </div>

      {/* MODAL DETAIL GIFT */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-modal-title"
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 text-left shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup detail hadiah"
              className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf4fb] text-[#5797d0]">
                <Gift className="w-6 h-6" />
              </div>
              <h3
                id="gift-modal-title"
                className="font-caveat text-3xl font-bold text-[#5d99d1]"
              >
                Wedding Gift
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Terima kasih atas tanda kasih Anda.
              </p>
            </div>

            {/* REKENING */}
            <h4 className="mb-3 font-bold text-gray-700">
              Hadiah via Transfer
            </h4>

            <div className="space-y-3">
              {accounts.map((account, index) => (
                <div
                  key={`${account.accountNumber}-${index}`}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <p className="text-sm font-semibold text-gray-700">
                    {account.bankName}
                  </p>

                  <p className="my-2 break-all font-mono text-xl font-bold tracking-wide text-[#5797d0]">
                    {account.accountNumber}
                  </p>

                  <p className="text-sm text-gray-600">
                    a.n. {account.accountHolder}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(account.accountNumber, `bank-${index}`)
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#3f4865] px-3 py-2 text-xs text-white hover:opacity-90"
                  >
                    {copiedKey === `bank-${index}` ? (
                      <>
                        <Check className="h-4 w-4" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Salin No. Rekening
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* ALAMAT PENGIRIMAN */}
            <div className="mt-6">
              <h4 className="mb-3 font-bold text-gray-700">
                Kirim Kado Fisik
              </h4>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Penerima</p>
                <p className="font-semibold text-gray-800">
                  {config.giftAddress?.recipient || 'Belum diatur'}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {config.giftAddress?.fullAddress ||
                    'Alamat pengiriman belum tersedia.'}
                </p>

                {config.giftAddress?.fullAddress && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `Penerima: ${config.giftAddress.recipient}\nAlamat: ${config.giftAddress.fullAddress}`,
                        'address'
                      )
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#3f4865] px-3 py-2 text-xs text-white hover:opacity-90"
                  >
                    {copiedKey === 'address' ? (
                      <>
                        <Check className="h-4 w-4" />
                        Alamat Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Salin Alamat
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#7b91b8] py-3 font-semibold text-white hover:opacity-90"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
