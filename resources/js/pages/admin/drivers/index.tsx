import { Head } from '@inertiajs/react';
import { index } from '@/routes/drivers';

export default function DriversIndex() {
    return (
        <>
            <Head title="Choferes" />
            <div className="flex h-full flex-1 flex-col gap-2 p-4">
                <h1 className="text-xl font-semibold">Choferes</h1>
                <p className="text-muted-foreground">
                    Acá vas a cargar, editar y quitar las páginas de los choferes.
                </p>
            </div>
        </>
    );
}

DriversIndex.layout = {
    breadcrumbs: [
        {
            title: 'Choferes',
            href: index(),
        },
    ],
};
