import type { Currency } from '$types';

// Default currency and exchange rate
const DEFAULT_CURRENCY: Currency = 'MXN';
const DEFAULT_EXCHANGE_RATE = 17.5; // MXN to USD
const STORAGE_KEY = 'fam-unic-currency';

// Create reactive state
let currentCurrency = $state<Currency>(DEFAULT_CURRENCY);
let exchangeRate = $state<number>(DEFAULT_EXCHANGE_RATE);

// Initialize from localStorage (browser only)
if (typeof window !== 'undefined') {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'MXN' || stored === 'USD') {
		currentCurrency = stored;
	}
}

export const currency = {
	get current() {
		return currentCurrency;
	},

	get rate() {
		return exchangeRate;
	},

	set(curr: Currency) {
		currentCurrency = curr;
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, curr);
		}
	},

	toggle() {
		const newCurrency = currentCurrency === 'MXN' ? 'USD' : 'MXN';
		this.set(newCurrency);
	},

	setExchangeRate(rate: number) {
		exchangeRate = rate;
	},

	// Convert MXN to current currency
	convert(amountMxn: number): number {
		if (currentCurrency === 'USD') {
			return amountMxn / exchangeRate;
		}
		return amountMxn;
	},

	// Format price in current currency
	format(amountMxn: number): string {
		const amount = this.convert(amountMxn);
		const formatter = new Intl.NumberFormat(currentCurrency === 'MXN' ? 'es-MX' : 'en-US', {
			style: 'currency',
			currency: currentCurrency,
			minimumFractionDigits: currentCurrency === 'MXN' ? 0 : 2,
			maximumFractionDigits: currentCurrency === 'MXN' ? 0 : 2
		});
		return formatter.format(amount);
	},

	// Format with both currencies for display
	formatWithAlternate(amountMxn: number): { primary: string; secondary: string } {
		const mxnFormatter = new Intl.NumberFormat('es-MX', {
			style: 'currency',
			currency: 'MXN',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		});

		const usdFormatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});

		const usdAmount = amountMxn / exchangeRate;

		if (currentCurrency === 'MXN') {
			return {
				primary: mxnFormatter.format(amountMxn),
				secondary: `≈ ${usdFormatter.format(usdAmount)}`
			};
		} else {
			return {
				primary: usdFormatter.format(usdAmount),
				secondary: `≈ ${mxnFormatter.format(amountMxn)}`
			};
		}
	}
};
