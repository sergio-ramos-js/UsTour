import { Head, Link } from '@inertiajs/react';
import { Car, MapPin, Users } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as choferes } from '@/routes/drivers';
import { index as lugares } from '@/routes/lugares';
import { index as vehiculos } from '@/routes/vehiculos';

type Conteos = {
    choferes: number;
    lugares: number;
    vehiculos: number;
};

const accesos = [
    {
        titulo: 'Choferes',
        clave: 'choferes',
        href: choferes(),
        icono: Users,
        uno: 'chofer',
        varios: 'choferes',
    },
    {
        titulo: 'Lugares',
        clave: 'lugares',
        href: lugares(),
        icono: MapPin,
        uno: 'lugar',
        varios: 'lugares',
    },
    {
        titulo: 'Vehículos',
        clave: 'vehiculos',
        href: vehiculos(),
        icono: Car,
        uno: 'vehículo',
        varios: 'vehículos',
    },
] as const;

export default function Dashboard({ conteos }: { conteos: Conteos }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                    <p className="text-muted-foreground">Lo que hay cargado en el panel.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {accesos.map((acceso) => {
                        const cantidad = conteos[acceso.clave];
                        const Icono = acceso.icono;

                        return (
                            <Link
                                key={acceso.clave}
                                href={acceso.href}
                                className="rounded-xl border p-5 transition-colors hover:bg-muted/40"
                            >
                                <Icono className="size-5 text-muted-foreground" aria-hidden="true" />
                                <p className="mt-4 text-3xl font-semibold">{cantidad}</p>
                                <p className="font-medium">{acceso.titulo}</p>
                                <p className="text-sm text-muted-foreground">
                                    {cantidad === 1 ? acceso.uno : acceso.varios} · Ver la lista
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
