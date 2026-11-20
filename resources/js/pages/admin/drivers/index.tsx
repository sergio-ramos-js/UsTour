import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { create, edit, index } from '@/routes/drivers';

type ChoferRow = {
    id: number;
    nombre: string;
    slug: string;
    telefono: string | null;
    correo: string | null;
    activo: boolean;
    vehiculo: string | null;
};

type PaginaChoferes = {
    data: ChoferRow[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

export default function DriversIndex({ choferes, busqueda }: { choferes: PaginaChoferes; busqueda: string }) {
    const [texto, setTexto] = useState(busqueda);

    useEffect(() => {
        setTexto(busqueda);
    }, [busqueda]);

    useEffect(() => {
        const limpio = texto.trim();

        if (limpio === busqueda) {
            return;
        }

        const espera = window.setTimeout(() => {
            router.get(index.url({ query: limpio === '' ? {} : { q: limpio } }), {}, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => window.clearTimeout(espera);
    }, [texto, busqueda]);

    function ir(page: number) {
        const query: Record<string, string | number> = {};

        if (busqueda !== '') {
            query.q = busqueda;
        }

        if (page > 1) {
            query.page = page;
        }

        router.get(index.url({ query }), {}, { preserveState: true, preserveScroll: true });
    }

    const vacio = busqueda === '' ? 'Todavía no hay choferes.' : 'Ningún chofer coincide con la búsqueda.';
    const resumen =
        choferes.total === 0
            ? ''
            : choferes.last_page <= 1
                ? choferes.total === 1
                    ? '1 chofer'
                    : `${choferes.total} choferes`
                : `Mostrando ${choferes.from}–${choferes.to} de ${choferes.total}`;

    return (
        <>
            <Head title="Choferes" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-xl font-semibold">Choferes</h1>

                    </div>
                    <p className="text-muted-foreground">Cargá, editá o quitá las páginas de los choferes.</p>
                </div>


                <div className="flex max-w-9/12 flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="grid max-w-sm gap-2">
                            <Label htmlFor="buscar">Buscar</Label>
                            <Input
                                id="buscar"
                                value={texto}
                                onChange={(event) => setTexto(event.target.value)}
                                placeholder="Nombre, slug, teléfono o @"
                            />
                        </div>
                        <Button asChild className="self-end">
                            <Link href={create()}>Nuevo chofer</Link>
                        </Button>
                    </div>
                    <div className="rounded-xl border">

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre y apellido</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Correo</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {choferes.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                            {vacio}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    choferes.data.map((chofer) => (
                                        <TableRow
                                            key={chofer.id}
                                            className="cursor-pointer"
                                            onClick={() => router.visit(edit(chofer.slug))}
                                        >
                                            <TableCell>
                                                <Link
                                                    href={edit(chofer.slug)}
                                                    className="font-medium hover:underline"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    {chofer.nombre}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">/{chofer.slug}</TableCell>
                                            <TableCell>{chofer.vehiculo ?? 'Sin vehículo'}</TableCell>
                                            <TableCell>{chofer.telefono ?? 'Sin teléfono'}</TableCell>
                                            <TableCell>{chofer.correo ?? 'Sin correo'}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={chofer.activo ? 'default' : 'destructive'}
                                                    className={
                                                        chofer.activo
                                                            ? 'border-transparent bg-[#15803d] text-white dark:bg-[#15803d]'
                                                            : 'dark:bg-destructive'
                                                    }
                                                >
                                                    {chofer.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>


                {choferes.total > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">{resumen}</p>
                        {choferes.last_page > 1 && (
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" disabled={choferes.current_page <= 1} onClick={() => ir(choferes.current_page - 1)}>
                                    Anterior
                                </Button>
                                <span className="text-sm">
                                    {choferes.current_page} de {choferes.last_page}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={choferes.current_page >= choferes.last_page}
                                    onClick={() => ir(choferes.current_page + 1)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </div>
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
