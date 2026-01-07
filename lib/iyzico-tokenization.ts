// iyzico.js type definitions
declare global {
  interface Window {
    Iyzipay: any;
  }
}

export interface IyzicoTokenResponse {
  status: string;
  locale: string;
  systemTime: number;
  conversationId: string;
  cardToken?: string;
  cardUserKey?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}

export interface CardData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

export interface TokenizedCard {
  cardToken: string;
  cardUserKey: string;
}

/**
 * Kart bilgilerini iyzico.js ile tokenize eder
 */
export async function tokenizeCard(cardData: CardData): Promise<TokenizedCard> {
  return new Promise((resolve, reject) => {
    // Check if iyzico.js is loaded
    if (!window.Iyzipay) {
      reject(new Error("iyzico.js yüklenmedi. Lütfen sayfayı yenileyin."));
      return;
    }

    // Sandbox credentials (production'da backend'den alınmalı)
    const iyzipay = new window.Iyzipay({
      apiKey: process.env.NEXT_PUBLIC_IYZICO_API_KEY || "sandbox-HfYILP1GQgSPLQQ8ULevS9kxRxL5nvcZ",
      secretKey: process.env.NEXT_PUBLIC_IYZICO_SECRET_KEY || "sandbox-y8cZocCPLQP2KuZ1LDL0J0N3xcwLzaVa",
      uri: process.env.NEXT_PUBLIC_IYZICO_URI || "https://sandbox-api.iyzipay.com",
    });

    // Format card number (remove spaces)
    const cardNumber = cardData.cardNumber.replace(/\s/g, "");

    // Validate card number length
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      reject(new Error("Kart numarası geçersiz"));
      return;
    }

    const request = {
      locale: "tr",
      conversationId: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cardNumber: cardNumber,
      expireYear: cardData.expiryYear,
      expireMonth: cardData.expiryMonth,
      cvc: cardData.cvv,
      cardHolderName: cardData.cardHolderName,
      registerCard: 0, // 0 = Tek kullanımlık, 1 = Kaydet
    };

    iyzipay.card.create(request, (response: IyzicoTokenResponse) => {
      if (response.status === "success" && response.cardToken && response.cardUserKey) {
        resolve({
          cardToken: response.cardToken,
          cardUserKey: response.cardUserKey,
        });
      } else {
        const errorMessage =
          response.errorMessage || response.errorCode || "Kart bilgileri tokenize edilemedi";
        reject(new Error(errorMessage));
      }
    });
  });
}

/**
 * Kart numarasını formatlar (4 haneli gruplar)
 */
export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return v;
  }
}

/**
 * CVV'yi formatlar (sadece rakam)
 */
export function formatCVV(value: string): string {
  return value.replace(/\D/g, "").substring(0, 3);
}

/**
 * Ay/Yıl formatını kontrol eder
 */
export function formatExpiryDate(value: string): string {
  const v = value.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 2) {
    return v.substring(0, 2) + "/" + v.substring(2, 4);
  }
  return v;
}

