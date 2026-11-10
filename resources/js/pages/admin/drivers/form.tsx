import { Form, Head, Link } from '@inertiajs/react';
import ChoferController from '@/actions/App/Http/Controllers/Admin/ChoferController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/drivers';
import HorarioController from '@/actions/App/Http/Controllers/Admin/HorarioController';

type ChoferFormData = {
    nombre: string;
    slug: string;
    descripcion: string | null;
    telefono: string | null;
    telefono_secundario: string | null;
    correo: string | null;
    activo: boolean;
    foto_url: string | null;
    horarios: HorarioFormData[];
};
type HorarioFormData = {
    id: number;
    dia: string;
    empieza: string;
    termina: string | null;
    nota: string | null;
};

function HorariosDelChofer({ slug, horarios }: { slug: string; horarios: HorarioFormData[] }) {
    return (
        <section className="space-y-4 border-t pt-6">
            <div>
                <h2 className="text-lg font-semibold">Horarios</h2>
                <p className="text-sm text-muted-foreground">
                    El día puede ser un texto, por ejemplo “Lunes a sábado”. La hora de fin y la nota son opcionales.
                </p>
            </div>

            {horarios.map((horario) => (
                <div key={horario.id} className="space-y-3 rounded-md border p-4">
                    <Form
                        {...HorarioController.update.form([slug, horario.id])}
                        errorBag={`horario-${horario.id}`}
                        className="space-y-3"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor={`dia-${horario.id}`}>Día</Label>
                                    <Input id={`dia-${horario.id}`} name="dia" defaultValue={horario.dia} required />
                                    <InputError message={errors.dia} />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`empieza-${horario.id}`}>Empieza</Label>
                                        <Input
                                            id={`empieza-${horario.id}`}
                                            name="empieza"
                                            type="time"
                                            defaultValue={horario.empieza}
                                            required
                                        />
                                        <InputError message={errors.empieza} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`termina-${horario.id}`}>Termina</Label>
                                        <Input
                                            id={`termina-${horario.id}`}
                                            name="termina"
                                            type="time"
                                            defaultValue={horario.termina ?? ''}
                                        />
                                        <InputError message={errors.termina} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`nota-${horario.id}`}>Nota</Label>
                                    <Input id={`nota-${horario.id}`} name="nota" defaultValue={horario.nota ?? ''} />
                                    <InputError message={errors.nota} />
                                </div>
                                <Button disabled={processing}>Guardar horario</Button>
                            </>
                        )}
                    </Form>
                    <Form {...HorarioController.destroy.form([slug, horario.id])}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                                onClick={(event) => {
                                    if (!window.confirm('¿Eliminar este horario?')) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                Eliminar
                            </Button>
                        )}
                    </Form>
                </div>
            ))}

            <Form
                {...HorarioController.store.form(slug)}
                errorBag="horario-nuevo"
                resetOnSuccess
                className="space-y-3"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="dia-nuevo">Día</Label>
                            <Input id="dia-nuevo" name="dia" placeholder="Lunes a sábado" required />
                            <InputError message={errors.dia} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="empieza-nuevo">Empieza</Label>
                                <Input id="empieza-nuevo" name="empieza" type="time" required />
                                <InputError message={errors.empieza} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="termina-nuevo">Termina</Label>
                                <Input id="termina-nuevo" name="termina" type="time" />
                                <InputError message={errors.termina} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nota-nuevo">Nota</Label>
                            <Input id="nota-nuevo" name="nota" />
                            <InputError message={errors.nota} />
                        </div>
                        <Button disabled={processing}>Agregar horario</Button>
                    </>
                )}
            </Form>
        </section>
    );
}

export default function ChoferForm({ chofer }: { chofer: ChoferFormData | null }) {
    const editing = chofer !== null;

    return (
        <>
            <Head title={editing ? 'Editar chofer' : 'Nuevo chofer'} />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">{editing ? 'Editar chofer' : 'Nuevo chofer'}</h1>
                    <p className="text-muted-foreground">
                        Estos datos son los que ve el turista en la página pública.
                    </p>
                </div>

                <Form
                    {...(editing ? ChoferController.update.form(chofer.slug) : ChoferController.store.form())}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input id="nombre" name="nombre" defaultValue={chofer?.nombre ?? ''} required />
                                <InputError message={errors.nombre} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Dirección</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    defaultValue={chofer?.slug ?? ''}
                                    placeholder="juan-perez"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Si la dejás vacía, se arma con el nombre. La página queda en /juan-perez.
                                </p>
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    defaultValue={chofer?.descripcion ?? ''}
                                    rows={4}
                                    className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                />
                                <InputError message={errors.descripcion} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input id="telefono" name="telefono" defaultValue={chofer?.telefono ?? ''} />
                                    <InputError message={errors.telefono} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="telefono_secundario">Otro teléfono</Label>
                                    <Input
                                        id="telefono_secundario"
                                        name="telefono_secundario"
                                        defaultValue={chofer?.telefono_secundario ?? ''}
                                    />
                                    <InputError message={errors.telefono_secundario} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="correo">Correo</Label>
                                <Input id="correo" name="correo" type="email" defaultValue={chofer?.correo ?? ''} />
                                <InputError message={errors.correo} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="foto">Foto</Label>
                                {chofer?.foto_url && (
                                    <img src={chofer.foto_url} alt="" className="h-32 w-full rounded-md object-cover" />
                                )}
                                <Input id="foto" name="foto" type="file" accept="image/*" />
                                <InputError message={errors.foto} />
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" name="activo" value="1" defaultChecked={chofer?.activo ?? true} />
                                Activo. Si lo desmarcás, el turista ve el aviso de página no disponible.
                            </label>

                            <div className="flex items-center gap-3">
                                <Button disabled={processing}>{editing ? 'Guardar' : 'Crear'}</Button>
                                <Button variant="outline" asChild>
                                    <Link href={index()}>Volver</Link>
                                </Button>
                                {editing && (
                                    <a className="text-sm underline" href={`/${chofer.slug}`} target="_blank" rel="noreferrer">
                                        Ver página
                                    </a>
                                )}
                            </div>
                        </>
                    )}
                </Form>

                {editing && (
                    <Form {...ChoferController.destroy.form(chofer.slug)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                                onClick={(event) => {
                                    if (!window.confirm('¿Eliminar este chofer y sus datos?')) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                Eliminar
                            </Button>
                        )}
                    </Form>
                )}
                {editing && <HorariosDelChofer slug={chofer.slug} horarios={chofer.horarios} />}
            </div>
        </>
    );
}

ChoferForm.layout = {
    breadcrumbs: [
        {
            title: 'Choferes',
            href: index(),
        },
    ],
};
