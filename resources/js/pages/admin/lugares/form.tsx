import { Form, Head, Link } from '@inertiajs/react';
import LugarController from '@/actions/App/Http/Controllers/Admin/LugarController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/lugares';

type LugarFoto = {
    id: number;
    url: string;
};

type LugarFormData = {
    id: number;
    nombre: string;
    descripcion: string | null;
    ciudad: string;
    fotos: LugarFoto[];
};

export default function LugarForm({ lugar }: { lugar: LugarFormData | null }) {
    const editing = lugar !== null;

    return (
        <>
            <Head title={editing ? 'Editar lugar' : 'Nuevo lugar'} />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">{editing ? 'Editar lugar' : 'Nuevo lugar'}</h1>
                    <p className="text-muted-foreground">
                        Este lugar queda en el catálogo y se puede ofrecer en la ficha de varios choferes.
                    </p>
                </div>

                <Form
                    {...(editing ? LugarController.update.form(lugar.id) : LugarController.store.form())}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input id="nombre" name="nombre" defaultValue={lugar?.nombre ?? ''} required />
                                <InputError message={errors.nombre} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ciudad">Ciudad</Label>
                                <Input id="ciudad" name="ciudad" defaultValue={lugar?.ciudad ?? 'Ushuaia'} required />
                                <InputError message={errors.ciudad} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    defaultValue={lugar?.descripcion ?? ''}
                                    rows={4}
                                    className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.descripcion} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="fotos">Fotos</Label>
                                <Input id="fotos" name="fotos[]" type="file" accept="image/*" multiple />
                                <InputError message={errors.fotos} />
                            </div>
                            <div className="flex items-center gap-3">
                                <Button disabled={processing}>{editing ? 'Guardar' : 'Crear'}</Button>
                                <Button variant="outline" asChild>
                                    <Link href={index()}>Volver</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {editing && lugar.fotos.length > 0 && (
                    <ul className="grid grid-cols-2 gap-3">
                        {lugar.fotos.map((foto) => (
                            <li key={foto.id} className="space-y-2">
                                <img src={foto.url} alt="" className="h-32 w-full rounded-md object-cover" />
                                <Form {...LugarController.destroyFoto.form([lugar.id, foto.id])}>
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            size="sm"
                                            variant="destructive"
                                            disabled={processing}
                                            onClick={(event) => {
                                                if (!window.confirm('¿Quitar esta foto?')) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        >
                                            Quitar foto
                                        </Button>
                                    )}
                                </Form>
                            </li>
                        ))}
                    </ul>
                )}

                {editing && (
                    <Form {...LugarController.destroy.form(lugar.id)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                                onClick={(event) => {
                                    if (!window.confirm('¿Eliminar este lugar del catálogo?')) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                Eliminar lugar
                            </Button>
                        )}
                    </Form>
                )}
            </div>
        </>
    );
}

LugarForm.layout = {
    breadcrumbs: [
        {
            title: 'Lugares',
            href: index(),
        },
    ],
};
