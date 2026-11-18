import { Head } from '@inertiajs/react';
import { Car, ChevronLeft, ChevronRight, Clock, MapPin, Moon, Phone, Sun, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePublicAppearance } from '@/hooks/use-appearance';
import { descripcionPorDefecto } from '@/lib/descripcion-chofer';
import drivers from '@/routes/drivers';

/* const driver = {
    name: 'Marcos Benítez',
    city: 'Ushuaia',
    description: descripcionPorDefecto,
    whatsapp: '5492901555000',
    photo: null as string | null,
    telefono: '+54 9 2901 555000',
    telefono2: '+54 9 2901 555001',
    email: 'marcos@ushuaia-tours.com'
}; */

type ChoferPublico = {
    nombre: string;
    ciudad: string | null;
    descripcion: string | null;
    telefono: string | null;
    telefono_secundario: string | null;
    correo: string | null;
    whatsapp: string | null;
    foto_url: string | null;
    fondo: 'masculino' | 'femenino';
    horarios: HorarioPublico[] | null;
    vehiculo: VehiculoPublico | null;
    lugares: LugarPublico[];
}

type VehiculoPublico = {
    marca: string;
    modelo: string;
    anio: number | null;
    color: string | null;
    capacidad_pasajeros: number;
    capacidad_baul: string | null;
    portaequipaje: boolean;
}

type LugarPublico = {
    nombre: string;
    descripcion: string | null;
    fotos: string[];
}

type HorarioPublico = {
    dia: string;
    empieza: string;
    termina: string;
    // nota: string | null;
}

/* const schedules = [
    { day: 'Lunes a sábado', from: '09:00', to: '18:00' },
    { day: 'Domingo', from: '10:00', to: '14:00' },
]; */

function PlaceCard({ place }: { place: LugarPublico }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-500">
            <FotosDelLugar nombre={place.nombre} fotos={place.fotos} />
            <div className="space-y-1 p-4">
                <h3 className="font-semibold">{place.nombre}</h3>
                {place.descripcion && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{place.descripcion}</p>
                )}
            </div>
        </article>
    );
}

function FotosDelLugar({ nombre, fotos }: { nombre: string; fotos: string[] }) {
    const cinta = useRef<HTMLDivElement>(null);
    const arrastre = useRef<{ x: number; left: number } | null>(null);
    const movio = useRef(false);
    const [indice, setIndice] = useState(0);
    const [abierta, setAbierta] = useState<number | null>(null);
    const [fallidas, setFallidas] = useState<number[]>([]);
    const [arrastrando, setArrastrando] = useState(false);
    const varias = fotos.length > 1;

    if (fotos.length === 0) {
        return <FotoVacia nombre={nombre} />;
    }

    function posicion(): number {
        const nodo = cinta.current;

        if (!nodo || nodo.clientWidth === 0) {
            return 0;
        }

        return Math.round(nodo.scrollLeft / nodo.clientWidth);
    }

    function ir(hacia: number) {
        const nodo = cinta.current;

        if (!nodo || nodo.clientWidth === 0) {
            return;
        }

        const siguiente = (posicion() + hacia + fotos.length) % fotos.length;
        nodo.scrollTo({ left: siguiente * nodo.clientWidth, behavior: 'smooth' });
    }

    function alDesplazar() {
        setIndice(posicion());
    }

    function alPresionar(event: React.PointerEvent<HTMLDivElement>) {
        if (!varias || event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }

        arrastre.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
        movio.current = false;
    }

    function alMover(event: React.PointerEvent<HTMLDivElement>) {
        if (!arrastre.current) {
            return;
        }

        const delta = event.clientX - arrastre.current.x;

        if (!movio.current) {
            if (Math.abs(delta) < 10) {
                return;
            }

            movio.current = true;
            setArrastrando(true);
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        event.currentTarget.scrollLeft = arrastre.current.left - delta;
    }

    function abrir(foto: number) {
        if (movio.current) {
            return;
        }

        setAbierta(foto);
    }

    function cerrarLuz() {
        if (abierta !== null && cinta.current && cinta.current.clientWidth > 0) {
            cinta.current.scrollTo({ left: abierta * cinta.current.clientWidth });
            setIndice(abierta);
        }

        setAbierta(null);
    }

    function alSoltar(event: React.PointerEvent<HTMLDivElement>) {
        if (!arrastre.current) {
            return;
        }

        const fueArrastre = movio.current;
        arrastre.current = null;
        setArrastrando(false);

        if (fueArrastre) {
            const nodo = cinta.current;

            if (nodo && nodo.clientWidth > 0) {
                const destino = Math.round(nodo.scrollLeft / nodo.clientWidth) * nodo.clientWidth;
                nodo.scrollTo({ left: destino, behavior: 'smooth' });
            }

            window.setTimeout(() => {
                movio.current = false;
            }, 0);

            return;
        }

        const foto = fotoSeñalada(event.target);

        if (foto !== null && !fallidas.includes(foto)) {
            setAbierta(foto);
        }
    }

    function alCancelar() {
        arrastre.current = null;
        movio.current = false;
        setArrastrando(false);
    }

    return (
        <div className="relative">
            <div
                ref={cinta}
                onScroll={alDesplazar}
                onPointerDown={alPresionar}
                onPointerMove={alMover}
                onPointerUp={alSoltar}
                onPointerCancel={alCancelar}
                tabIndex={varias ? 0 : undefined}
                aria-label={varias ? `Fotos de ${nombre}` : undefined}
                className={`flex overflow-x-auto select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    arrastrando ? 'cursor-grabbing snap-none [&_button]:cursor-grabbing' : 'snap-x snap-mandatory'
                }`}
            >
                {fotos.map((url, i) =>
                    fallidas.includes(i) ? (
                        <FotoVacia key={`${url}-${i}`} nombre={nombre} />
                    ) : (
                        <button
                            key={`${url}-${i}`}
                            type="button"
                            data-foto={i}
                            onClick={() => abrir(i)}
                            aria-label={`Ver foto de ${nombre} en grande`}
                            className="h-44 min-w-full shrink-0 cursor-zoom-in snap-start"
                        >
                            <img
                                src={url}
                                alt=""
                                draggable={false}
                                className="h-full w-full object-cover"
                                onError={() =>
                                    setFallidas((actual) => (actual.includes(i) ? actual : [...actual, i]))
                                }
                            />
                        </button>
                    ),
                )}
            </div>
            {varias && (
                <>
                    <button
                        type="button"
                        onClick={() => ir(-1)}
                        aria-label="Foto anterior"
                        className="absolute top-1/2 left-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => ir(1)}
                        aria-label="Foto siguiente"
                        className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                    <span className="pointer-events-none absolute right-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                        {indice + 1} / {fotos.length}
                    </span>
                </>
            )}
            {abierta !== null && (
                <LuzDeFoto
                    nombre={nombre}
                    fotos={fotos}
                    indice={abierta}
                    alCambiar={setAbierta}
                    alCerrar={cerrarLuz}
                />
            )}
        </div>
    );
}

function fotoSeñalada(target: EventTarget | null): number | null {
    if (!(target instanceof Element)) {
        return null;
    }

    const foto = target.closest('[data-foto]')?.getAttribute('data-foto');
    const indice = Number(foto);

    return Number.isInteger(indice) ? indice : null;
}

function FotoVacia({ nombre }: { nombre: string }) {
    return (
        <div className="flex h-44 min-w-full shrink-0 snap-start items-end bg-neutral-200 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {nombre}
        </div>
    );
}

function LuzDeFoto({
    nombre,
    fotos,
    indice,
    alCambiar,
    alCerrar,
}: {
    nombre: string;
    fotos: string[];
    indice: number;
    alCambiar: (indice: number) => void;
    alCerrar: () => void;
}) {
    const panel = useRef<HTMLDivElement>(null);
    const inicio = useRef<number | null>(null);
    const varias = fotos.length > 1;

    useEffect(() => {
        panel.current?.focus();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflow;
        };
    }, []);

    useEffect(() => {
        function tecla(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                alCerrar();
            }

            if (!varias) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                alCambiar((indice - 1 + fotos.length) % fotos.length);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                alCambiar((indice + 1) % fotos.length);
            }
        }

        document.addEventListener('keydown', tecla);

        return () => document.removeEventListener('keydown', tecla);
    }, [alCerrar, alCambiar, fotos.length, indice, varias]);

    function paso(hacia: number) {
        alCambiar((indice + hacia + fotos.length) % fotos.length);
    }

    return createPortal(
        <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={`Foto de ${nombre}`}
            tabIndex={-1}
            onClick={alCerrar}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 outline-none"
        >
            <p className="absolute top-4 left-4 max-w-[70%] text-sm text-white">{nombre}</p>
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    alCerrar();
                }}
                aria-label="Cerrar"
                className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
                <X className="size-5" aria-hidden="true" />
            </button>
            {varias && (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        paso(-1);
                    }}
                    aria-label="Foto anterior"
                    className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
            )}
            <img
                src={fotos[indice]}
                alt={nombre}
                draggable={false}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => {
                    inicio.current = event.clientX;
                }}
                onPointerUp={(event) => {
                    if (inicio.current === null || !varias) {
                        inicio.current = null;

                        return;
                    }

                    const delta = event.clientX - inicio.current;
                    inicio.current = null;

                    if (delta > 50) {
                        paso(-1);
                    } else if (delta < -50) {
                        paso(1);
                    }
                }}
                className={`max-h-[85vh] object-contain ${varias ? 'max-w-[calc(100%-5.5rem)]' : 'max-w-full'}`}
            />
            {varias && (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        paso(1);
                    }}
                    aria-label="Foto siguiente"
                    className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                >
                    <ChevronRight className="size-5" aria-hidden="true" />
                </button>
            )}
            {varias && (
                <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white">
                    {indice + 1} / {fotos.length}
                </span>
            )}
        </div>,
        document.body,
    );
}

function PaginaNoEncontrada() {
    return (
        <>
            <Head title="404" />
            <main className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
                <div className="text-center">
                    <p className="text-7xl font-semibold tracking-tight">404</p>
                    <h1 className="mt-2 text-xl text-neutral-500">Not Found</h1>
                </div>
            </main>
        </>
    );
}

export default function DriverPage({ chofer }: { slug: string; chofer: ChoferPublico | null }) {
    if (!chofer) {
        return <PaginaNoEncontrada />;
    }

    return <PaginaChofer chofer={chofer} />;
}

function PaginaChofer({ chofer }: { chofer: ChoferPublico }) {
    const { resolvedAppearance, updateAppearance } = usePublicAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <>
            <Head title={chofer.nombre} />
            <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
                <header className="relative bg-neutral-950 text-white">
                    <img
                        src="/images/ushuaia-header.jpg"
                        alt="Vista aérea de Ushuaia, con las montañas nevadas y el puerto"
                        className="block h-[70vh] w-full object-cover object-center sm:h-[90vh]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
                    <div className="absolute inset-x-0 top-0 z-10">
                        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
                            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">Ushuaia</p>
                            <button
                                type="button"
                                onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
                                className="cursor-pointer inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-950 px-3 py-1.5 text-sm text-white shadow-md ring-1 ring-white/80 hover:bg-neutral-800"
                                aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
                            >
                                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                {isDark ? 'Claro' : 'Oscuro'}
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent">
                        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:gap-4 sm:px-6 sm:py-10">
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">UsTour</h1>
                            <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                                Aquí encontrarás chofer para ir a distintos puntos turísticos de esta bella ciudad.
                                <br />
                                El viaje es particular: consultás con el chofer el destino, la duración y el precio.
                                <br />
                                ¡Que tengas un hermoso paseo y disfrutes cada momento!
                            </p>
                        </div>
                    </div>
                </header>

                <div className="mx-auto grid max-w-5xl gap-4 px-6 py-8 sm:grid-cols-2">
                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-500">
                        <div
                            className="relative h-48 bg-cover bg-center"
                            style={{
                                backgroundImage: `url('${
                                    chofer.fondo === 'femenino'
                                        ? '/images/chofer-card-femenino.jpg'
                                        : '/images/chofer-card.jpg'
                                }')`,
                            }}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent dark:from-neutral-900" />
                            <h2 className="absolute right-5 bottom-2 left-5 flex items-center gap-2 text-lg font-semibold">
                                <User className="size-5 shrink-0" aria-hidden="true" />
                                Chofer
                            </h2>
                        </div>
                        <div className="relative px-5 pt-5 pb-5">
                            <img
                                src={chofer.foto_url ?? '/images/chofer-sin-foto.jpg'}
                                alt=""
                                className="absolute -top-8 right-5 size-16 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900"
                            />
                            <p className="pr-20 text-xl font-medium">{chofer.nombre}</p>
                            <p className="mt-3 text-sm whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                                {chofer.descripcion?.trim() || descripcionPorDefecto}
                            </p>
                            {chofer.whatsapp && (
                                <a
                                    href={`https://wa.me/${chofer.whatsapp}`}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-neutral-600 dark:text-black hover:bg-[#1DA851]"
                                >
                                    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
                                        <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.3-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.7.6.6-3.6-.2-.3A9 9 0 1 1 12 21zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.8-2s-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4.1c.5.2 1 .4 1.5.5a3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.2-.3-.2-.6-.4z" />
                                    </svg>
                                    Escribir por WhatsApp
                                </a>
                            )}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-500">
                        <div
                            className="relative h-48 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('/images/horarios-contacto.jpg')",
                            }}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent dark:from-neutral-900" />
                            <h2 className="absolute right-5 bottom-2 left-5 flex items-center gap-2 text-lg font-semibold">
                                <Clock className="size-5 shrink-0" aria-hidden="true" />
                                Horarios
                            </h2>
                        </div>
                        {!chofer.horarios || chofer.horarios.length === 0 ? (
                            <p className="mt-3 px-5 text-sm text-neutral-600 dark:text-neutral-300">
                                Sin horarios cargados.
                            </p>
                        ) : (
                            <ul className="mt-3 space-y-2 px-5 text-sm">
                                {chofer.horarios.map((horario, index) => (
                                    <li key={`${horario.dia}-${horario.empieza}-${index}`}>
                                        <div className="flex justify-between gap-4">
                                            <span>{horario.dia}</span>
                                            <span className="text-neutral-600 dark:text-neutral-300">
                                                {horario.termina ? `${horario.empieza} a ${horario.termina}` : horario.empieza}
                                            </span>
                                        </div>
                                        {/* {horario.nota && <p className="text-neutral-500">{horario.nota}</p>} */}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <h2 className="mt-4 flex items-center gap-2 border-t border-neutral-200 px-5 pt-4 text-base font-semibold dark:border-neutral-800">
                            <Phone className="size-4 shrink-0" aria-hidden="true" />
                            Contacto
                        </h2>
                        <dl className="mt-3 space-y-2 px-5 pb-5 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt>Teléfono</dt>
                                <dd>{chofer?.telefono}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Teléfono 2</dt>
                                <dd>{chofer?.telefono_secundario}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Email</dt>
                                <dd>{chofer?.correo}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-500">
                        <div
                            className="relative h-48 bg-cover bg-center"
                            style={{ backgroundImage: "url('/images/vehiculo-prueba.jpg')" }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/55 to-white dark:via-neutral-900/70 dark:to-neutral-900" />
                            <h2 className="absolute right-5 bottom-0 left-5 flex items-center gap-2 text-lg font-semibold">
                                <Car className="size-5 shrink-0" aria-hidden="true" />
                                Vehículo
                            </h2>
                        </div>
                        <div className="px-5 pb-5">
                            {chofer.vehiculo ? (
                                <dl className="mt-3 space-y-2 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <dt>Marca, modelo y año</dt>
                                        <dd>
                                            {chofer.vehiculo.marca}, {chofer.vehiculo.modelo}, {chofer.vehiculo.anio ?? '—'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt>Color</dt>
                                        <dd>{chofer.vehiculo.color || '—'}</dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt>Pasajeros</dt>
                                        <dd>{chofer.vehiculo.capacidad_pasajeros}</dd>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <dt>Baúl</dt>
                                        <dd>{chofer.vehiculo.capacidad_baul || '—'}</dd>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <dt>Portaequipaje</dt>
                                        <dd>{chofer.vehiculo.portaequipaje ? 'Sí' : 'No'}</dd>
                                    </div>
                                </dl>
                            ) : (
                                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                                    Sin vehículo cargado.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-500">
                        <div
                            className="relative h-52 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://commons.wikimedia.org/wiki/Special:FilePath/Ushuaia,_Argentina_as_seen_by_Terra.jpg?width=960')",
                            }}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent dark:from-neutral-900" />
                            <h2 className="absolute right-5 bottom-2 left-5 flex items-center gap-2 text-lg font-semibold">
                                <MapPin className="size-5 shrink-0" aria-hidden="true" />
                                Viajes
                            </h2>
                        </div>
                        {chofer.lugares.length === 0 ? (
                            <p className="px-5 pt-1 pb-5 text-sm text-neutral-600 dark:text-neutral-300">
                                Sin lugares cargados.
                            </p>
                        ) : (
                            <ul className="grid grid-flow-col grid-rows-4 gap-x-4 gap-y-2 px-5 pt-1 pb-5 text-sm">
                                {chofer.lugares.map((lugar) => (
                                    <li key={lugar.nombre}>{lugar.nombre}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                <section className="mx-auto max-w-5xl px-6 pb-12">
                    <h2 className="text-lg font-semibold">Lugares</h2>
                    {chofer.lugares.length === 0 ? (
                        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">Sin lugares cargados.</p>
                    ) : (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {chofer.lugares.map((lugar, index) => (
                                <PlaceCard key={`${lugar.nombre}-${index}`} place={lugar} />
                            ))}
                        </div>
                    )}
                    <p className="mt-4 text-xs text-neutral-500">
                        Fotos del encabezado, de Chofer y de Horarios: archivos propios. La satelital de Viajes: Wikimedia Commons. La foto del vehículo es de muestra.
                    </p>
                </section>
            </main>
        </>
    );
}
