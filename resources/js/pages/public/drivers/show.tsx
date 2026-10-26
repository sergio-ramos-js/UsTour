import { Head } from '@inertiajs/react';
import { useState } from 'react';

const driver = {
    name: 'Marcos Benítez',
    city: 'Ushuaia',
    color: '#1d4e89',
    description:
        'Llevo turistas por Ushuaia y alrededores. Salidas al Canal Beagle, el Parque Nacional y la Laguna Esmeralda.',
    whatsapp: '5492901555000',
};

const vehicle = {
    brand: 'Toyota',
    model: 'Hiace',
    luggageRack: true,
    passengerCapacity: 8,
    trunkCapacity: '3 a 4 valijas medianas (Aprox. 450 L)',
};

const schedules = [
    { day: 'Lunes a sábado', from: '09:00', to: '18:00' },
    { day: 'Domingo', from: '10:00', to: '14:00' },
];

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
];

function PlaceCard({
    place,
}: {
    place: (typeof places)[number];
}) {
    const [failed, setFailed] = useState(false);

    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
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

export default function DriverPage({ slug }: { slug: string }) {
    return (
        <>
            <Head title={driver.name} />
            <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
                <header className="px-6 py-10 text-white" style={{ backgroundColor: driver.color }}>
                    <div className="mx-auto flex max-w-5xl flex-col gap-4">
                        <p className="text-sm text-white/80">Vista de prueba · /{slug}</p>
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">{driver.name}</h1>
                            <p className="mt-1 text-white/85">{driver.city}</p>
                        </div>
                        <p className="max-w-2xl text-white/90">{driver.description}</p>
                        <a
                            href={`https://wa.me/${driver.whatsapp}`}
                            className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900"
                        >
                            Escribir por WhatsApp
                        </a>
                    </div>
                </header>

                <div className="mx-auto grid max-w-5xl gap-4 px-6 py-8 md:grid-cols-2">
                    <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="text-lg font-semibold">Horarios</h2>
                        <ul className="mt-3 space-y-2 text-sm">
                            {schedules.map((schedule) => (
                                <li key={schedule.day} className="flex justify-between gap-4">
                                    <span>{schedule.day}</span>
                                    <span className="text-neutral-600 dark:text-neutral-300">
                                        {schedule.from} a {schedule.to}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="text-lg font-semibold">Vehículo</h2>
                        <p className="mt-3 text-xl font-medium">
                            {vehicle.brand} {vehicle.model}
                        </p>
                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt>Portaequipaje</dt>
                                <dd>{vehicle.luggageRack ? 'Sí' : 'No'}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Pasajeros</dt>
                                <dd>{vehicle.passengerCapacity}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Baúl</dt>
                                <dd>{vehicle.trunkCapacity}</dd>
                            </div>
                        </dl>
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
                        Fotos de los lugares: Wikimedia Commons. El chofer, el vehículo y los horarios son datos de prueba.
                    </p>
                </section>
            </main>
        </>
    );
}
