import { Head } from '@inertiajs/react';
import { Car, Clock, MapPin, Moon, Phone, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import drivers from '@/routes/drivers';

/* const driver = {
    name: 'Marcos Benítez',
    city: 'Ushuaia',
    description:
        '¿Necesitas ir a un lugar fuera de la ciudad y no encuentras transporte adecuado?\n  Yo te llevo! Soy chofer particular y te puedo llevar a los lugares más lindos de Ushuaia.',
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
    horarios: HorarioPublico[] | null;
}

type HorarioPublico = {
    dia: string;
    empieza: string;
    termina: string;
    nota: string | null;
}

const vehicle = {
    brand: 'Toyota',
    model: 'Hiace',
    luggageRack: true,
    passengerCapacity: 8,
    trunkCapacity: '3 a 4 valijas medianas (Aprox. 450 L)',
};

/* const schedules = [
    { day: 'Lunes a sábado', from: '09:00', to: '18:00' },
    { day: 'Domingo', from: '10:00', to: '14:00' },
]; */

const places = [
    {
        name: 'Canal Beagle',
        description: 'Navegación por el canal, con Ushuaia y las montañas de fondo.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ushuaia_-_Costa_del_Canal_de_Beagle_2.JPG?width=960',
    },
    {
        name: 'Faro Les Éclaireurs',
        description: 'El faro del canal, a unos 9 km al sureste de la ciudad.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Les_Eclaireurs_Lighthouse.jpg?width=960',
    },
    {
        name: 'Bahía Lapataia',
        description: 'El fin de la ruta nacional 3, dentro del Parque Nacional Tierra del Fuego.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lapataia_Bay.jpg?width=960',
    },
    {
        name: 'Tren del Fin del Mundo',
        description: 'El tren que entra al parque y recorre el antiguo trazado de los presos.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tren_del_Fin_del_Mundo_-_Recorrido_01.jpg?width=960',
    },
    {
        name: 'Glaciar Martial',
        description: 'Ascenso corto desde la ciudad hasta la base del glaciar.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Glaciar_Martial_Ushuaia.jpg?width=960',
    },
    {
        name: 'Laguna Esmeralda',
        description: 'Caminata entre turberas hasta la laguna, al norte de Ushuaia.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Laguna_Esmeralda,_Ushuaia,_Tierra_del_Fuego,_Argentina.jpg?width=960',
    },
    {
        name: 'Parque nacional Tierra del Fuego',
        description: 'Bosques y costa del Canal Beagle, a unos 12 km al oeste de la ciudad.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/PN_Tierra_del_Fuego_(global_view).jpg?width=960',
    },
    {
        name: 'Cerro Castor',
        description: 'Bosques y costa del Canal Beagle, a unos 12 km al oeste de la ciudad.',
        image: 'https://commons.wikimedia.org/wiki/Special:FilePath/PN_Tierra_del_Fuego_(global_view).jpg?width=960',
    },
];

function PlaceCard({
    place,
}: {
    place: (typeof places)[number];
}) {
    const [failed, setFailed] = useState(false);

    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-500">
            {failed ? (
                <div className="flex h-44 items-end bg-neutral-200 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {place.name}
                </div>
            ) : (
                <img
                    src={place.image}
                    alt={place.name}
                    className="h-44 w-full object-cover"
                    onError={() => setFailed(true)}
                />
            )}
            <div className="space-y-1 p-4">
                <h3 className="font-semibold">{place.name}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{place.description}</p>
            </div>
        </article>
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
    const { resolvedAppearance, updateAppearance } = useAppearance();
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
                            style={{ backgroundImage: "url('/images/chofer-card.jpg')" }}
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
                                {chofer.descripcion}
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
                                        {horario.nota && <p className="text-neutral-500">{horario.nota}</p>}
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
                            <dl className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt>Marca y modelo</dt>
                                    <dd>{vehicle.brand}, {vehicle.model}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt>Color</dt>
                                    <dd>Azul</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt>Pasajeros</dt>
                                    <dd>{vehicle.passengerCapacity}</dd>
                                </div>
                                <div className="flex justify-between gap-3">
                                    <dt>Baúl</dt>
                                    <dd>{vehicle.trunkCapacity}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt>Portaequipaje</dt>
                                    <dd>{vehicle.luggageRack ? 'Sí' : 'No'}</dd>
                                </div>
                            </dl>
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
                        <ul className="grid grid-flow-col grid-rows-4 gap-x-4 gap-y-2 px-5 pt-1 pb-5 text-sm">
                            {places.map((place) => (
                                <li key={place.name}>{place.name}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className="mx-auto max-w-5xl px-6 pb-12">
                    <h2 className="text-lg font-semibold">Lugares</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {places.map((place) => (
                            <PlaceCard key={place.name} place={place} />
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-neutral-500">
                        Fotos del encabezado, de Chofer y de Horarios: archivos propios. La satelital de Viajes y las de los lugares: Wikimedia Commons. El chofer, el vehículo y los horarios son datos de prueba.
                    </p>
                </section>
            </main>
        </>
    );
}
