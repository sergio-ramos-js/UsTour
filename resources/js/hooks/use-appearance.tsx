import { router } from '@inertiajs/react';
import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const clavePanel = 'appearance';
const clavePublica = 'appearance_public';

const oyentesPanel = new Set<() => void>();
const oyentesPublicos = new Set<() => void>();
let modoPanel: Appearance = 'system';
let modoPublico: Appearance = 'system';

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const leer = (clave: string): Appearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    return (localStorage.getItem(clave) as Appearance) || 'system';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const paginaPublica = (): boolean => {
    return document.documentElement.dataset.appearanceScope === 'public';
};

const aplicarActivo = (): void => {
    applyTheme(paginaPublica() ? modoPublico : modoPanel);
};

const asegurar = (clave: string): void => {
    if (localStorage.getItem(clave)) {
        return;
    }

    localStorage.setItem(clave, 'system');
    setCookie(clave, 'system');
};

const subscribe = (oyentes: Set<() => void>) => (callback: () => void) => {
    oyentes.add(callback);

    return () => oyentes.delete(callback);
};

const notify = (oyentes: Set<() => void>): void => oyentes.forEach((listener) => listener());

const mediaQuery = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    asegurar(clavePanel);
    asegurar(clavePublica);
    modoPanel = leer(clavePanel);
    modoPublico = leer(clavePublica);
    aplicarActivo();

    mediaQuery()?.addEventListener('change', aplicarActivo);

    router.on('navigate', (event) => {
        const publica = event.detail.page.component.startsWith('public/');
        document.documentElement.dataset.appearanceScope = publica ? 'public' : 'admin';
        aplicarActivo();
    });
}

function useStoredAppearance(
    actual: () => Appearance,
    oyentes: Set<() => void>,
    guardar: (mode: Appearance) => void,
): UseAppearanceReturn {
    const appearance: Appearance = useSyncExternalStore(subscribe(oyentes), actual, () => 'system');

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance) ? 'dark' : 'light';

    const updateAppearance = (mode: Appearance): void => {
        guardar(mode);
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}

export function useAppearance(): UseAppearanceReturn {
    return useStoredAppearance(
        () => modoPanel,
        oyentesPanel,
        (mode) => {
            modoPanel = mode;
            localStorage.setItem(clavePanel, mode);
            setCookie(clavePanel, mode);

            if (!paginaPublica()) {
                applyTheme(mode);
            }

            notify(oyentesPanel);
        },
    );
}

export function usePublicAppearance(): UseAppearanceReturn {
    return useStoredAppearance(
        () => modoPublico,
        oyentesPublicos,
        (mode) => {
            modoPublico = mode;
            localStorage.setItem(clavePublica, mode);
            setCookie(clavePublica, mode);

            if (paginaPublica()) {
                applyTheme(mode);
            }

            notify(oyentesPublicos);
        },
    );
}
