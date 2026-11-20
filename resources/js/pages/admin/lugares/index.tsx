import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { create, edit, index } from '@/routes/lugares';

type LugarRow = {
    id: number;
    nombre: string;
    ciudad: string;
    foto_url: string | null;
};

export default function LugaresIndex({ lugares }: { lugares: LugarRow[] }) {
    return (
        <>
            <Head title="Lugares" />
            <div className="flex h-ful w-6/12 l flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Lugares</h1>
                        <p className="text-muted-foreground">
                            El catálogo de lugares turísticos. Después se eligen en la ficha de cada chofer.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create()}>Nuevo lugar</Link>
                    </Button>
                </div>

                {lugares.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Todavía no hay lugares.</p>
                ) : (
                    <ul className="divide-y rounded-xl border">
                        {lugares.map((lugar) => (
                            <li key={lugar.id} className="flex items-center justify-between gap-4 p-4">
                                <Link href={edit(lugar.id)} className="flex min-w-0 flex-1 items-center gap-3">
                                    {lugar.foto_url ? (
                                        <img src={lugar.foto_url} alt="" className="size-12 rounded-md object-cover" />
                                    ) : (
                                        <span className="size-12 rounded-md bg-muted" />
                                    )}
                                    <span>
                                        <span className="block font-medium hover:underline">{lugar.nombre}</span>
                                        <span className="block text-sm text-muted-foreground">{lugar.ciudad}</span>
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

LugaresIndex.layout = {
    breadcrumbs: [
        {
            title: 'Lugares',
            href: index(),
        },
    ],
};
