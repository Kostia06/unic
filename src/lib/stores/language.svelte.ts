import type { Language } from '$types';

// Default language
const DEFAULT_LANGUAGE: Language = 'es';
const STORAGE_KEY = 'fam-unic-language';

// Create reactive state
let currentLanguage = $state<Language>(DEFAULT_LANGUAGE);

// Initialize from localStorage (browser only)
if (typeof window !== 'undefined') {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'es' || stored === 'en') {
		currentLanguage = stored;
	}
}

export const language = {
	get current() {
		return currentLanguage;
	},

	set(lang: Language) {
		currentLanguage = lang;
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, lang);
			// Update document lang attribute
			document.documentElement.lang = lang;
		}
	},

	toggle() {
		const newLang = currentLanguage === 'es' ? 'en' : 'es';
		this.set(newLang);
	}
};

// Helper to get localized value
export function localized<T extends { _es: string; _en?: string | null }>(
	obj: T,
	key: string
): string {
	const esKey = `${key}_es` as keyof T;
	const enKey = `${key}_en` as keyof T;

	if (currentLanguage === 'en' && obj[enKey]) {
		return obj[enKey] as string;
	}
	return obj[esKey] as string;
}

// Type-safe helper for objects with name_es/name_en pattern
export function getLocalizedName(obj: { name_es: string; name_en?: string | null }): string {
	if (currentLanguage === 'en' && obj.name_en) {
		return obj.name_en;
	}
	return obj.name_es;
}

// Type-safe helper for objects with description pattern
export function getLocalizedDescription(obj: {
	description_es?: string | null;
	description_en?: string | null;
}): string | null {
	if (currentLanguage === 'en' && obj.description_en) {
		return obj.description_en;
	}
	return obj.description_es ?? null;
}
