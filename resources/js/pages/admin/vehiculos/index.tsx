import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create, edit, index } from '@/routes/vehiculos';

type VehiculoRow = {
    id: number;
    marca: string;
    modelo: string;
    anio: number | null;
    color: string | null;
    capacidad_pasajeros: number;
};

export default function VehiculosIndex({ vehiculos }: { vehiculos: VehiculoRow[] }) {
    return (
        <>
            <Head title="Vehículos" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Vehículos</h1>
                        <p className="text-muted-foreground">
                            El catálogo de modelos. Después se elige uno en la ficha de cada chofer.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>Nuevo vehículo</Link>
                    </Button>
                </div>

                {vehiculos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Todavía no hay vehículos.</p>
                ) : (
                    <ul className="divide-y rounded-xl border">
                        {vehiculos.map((vehiculo) => (
                            <li key={vehiculo.id}>
                                <Link href={edit(vehiculo.id)} className="block p-4 hover:bg-muted/40">
                                    <span className="block font-medium hover:underline">
                                        {vehiculo.marca} {vehiculo.modelo}
                                        {vehiculo.anio ? ` ${vehiculo.anio}` : ''}
                                    </span>
                                    <span className="block text-sm text-muted-foreground">
                                        {[vehiculo.color, `${vehiculo.capacidad_pasajeros} pasajeros`]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

VehiculosIndex.layout = {
    breadcrumbs: [
        {
            title: 'Vehículos',
            href: index(),
        },
    ],
};
