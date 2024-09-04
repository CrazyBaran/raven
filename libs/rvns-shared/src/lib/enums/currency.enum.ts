export enum Currency {
  USD = 'USD',
  GBP = 'GBP',
  EUR = 'EUR',
  AED = 'AED',
}

export const CurrencyData = [
  Currency.USD,
  Currency.GBP,
  Currency.EUR,
  Currency.AED,
];

export const CurrencySymbol: Record<string, string> = {
  [Currency.USD]: '$',
  [Currency.GBP]: '£',
  [Currency.EUR]: '€',
  [Currency.AED]: 'AED',
};
