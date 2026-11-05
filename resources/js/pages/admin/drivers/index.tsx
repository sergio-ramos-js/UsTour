import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create, edit, index } from '@/routes/drivers';

type ChoferRow = {
    id: number;
    nombre: string;
    slug: string;
    telefono: string | null;
    activo: boolean;
};

export default function DriversIndex({ choferes }: { choferes: ChoferRow[] }) {
    return (
        <>
            <Head title="Choferes" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Choferes</h1>
                        <p className="text-muted-foreground">
                            Cargá, editá o quitá las páginas de los choferes.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>Nuevo chofer</Link>
                    </Button>
                </div>

                {choferes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Todavía no hay choferes.</p>
                ) : (
                    <ul className="divide-y rounded-xl border">
                        {choferes.map((chofer) => (
                            <li key={chofer.id} className="flex items-center justify-between gap-4 p-4">
                                <div>
                                    <p className="font-medium">{chofer.nombre}</p>
                                    <p className="text-sm text-muted-foreground">/{chofer.slug}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm">{chofer.activo ? 'Activo' : 'Inactivo'}</span>
                                    <Button variant="outline" asChild>
                                        <Link href={edit(chofer.slug)}>Editar</Link>
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
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
