import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import ChoferController from '@/actions/App/Http/Controllers/Admin/ChoferController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { descripcionPorDefecto } from '@/lib/descripcion-chofer';
import { index } from '@/routes/drivers';
import { create as nuevoLugar } from '@/routes/lugares';
import { create as nuevoVehiculo } from '@/routes/vehiculos';
import HorarioController from '@/actions/App/Http/Controllers/Admin/HorarioController';

type ChoferFormData = {
    nombre: string;
    slug: string;
    descripcion: string | null;
    telefono: string | null;
    telefono_secundario: string | null;
    correo: string | null;
    activo: boolean;
    fondo: 'masculino' | 'femenino';
    vehiculo_id: number | null;
    foto_url: string | null;
    horarios: HorarioFormData[];
};
type VehiculoOpcion = {
    id: number;
    marca: string;
    modelo: string;
    anio: number | null;
    color: string | null;
};

type LugarOpcion = {
    id: number;
    nombre: string;
    ciudad: string;
    elegido: boolean;
    orden: number;
};

type HorarioFormData = {
    id: number;
    dia: string;
    empieza: string;
    termina: string | null;
    // nota: string | null;
};

function HorariosNuevos({ errors }: { errors: Record<string, string> }) {
    const [filas, setFilas] = useState([0]);
    const siguiente = useRef(1);

    return (
        <section className="space-y-4 ">
            <div>
                <h2 className="text-md font-semibold">Horarios</h2>
                <p className="text-sm text-muted-foreground">
                    El día puede ser un texto, por ejemplo “Lunes a sábado”. La hora de fin es opcional.
                    Se guardan al crear el chofer.
                </p>
            </div>

            {filas.map((fila, index) => (
                <div key={fila} className="space-y-3 rounded-md border p-4">
                    <div className="grid gap-2">
                        <Label htmlFor={`dia-nuevo-${fila}`}>Día</Label>
                        <Input id={`dia-nuevo-${fila}`} name={`horarios[${index}][dia]`} placeholder="Lunes a sábado" />
                        <InputError message={errors[`horarios.${index}.dia`]} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor={`empieza-nuevo-${fila}`}>Empieza</Label>
                            <Input id={`empieza-nuevo-${fila}`} name={`horarios[${index}][empieza]`} type="time" />
                            <InputError message={errors[`horarios.${index}.empieza`]} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`termina-nuevo-${fila}`}>Termina</Label>
                            <Input id={`termina-nuevo-${fila}`} name={`horarios[${index}][termina]`} type="time" />
                            <InputError message={errors[`horarios.${index}.termina`]} />
                        </div>
                    </div>
                    {/* <div className="grid gap-2">
                        <Label htmlFor={`nota-nuevo-${fila}`}>Nota</Label>
                        <Input id={`nota-nuevo-${fila}`} name={`horarios[${index}][nota]`} />
                        <InputError message={errors[`horarios.${index}.nota`]} />
                    </div> */}
                    <Button type="button" variant="outline" onClick={() => setFilas(filas.filter((item) => item !== fila))}>
                        Quitar
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setFilas([...filas, siguiente.current]);
                    siguiente.current += 1;
                }}
            >
                Otro horario
            </Button>
        </section>
    );
}

function HorariosDelChofer({ slug, horarios }: { slug: string; horarios: HorarioFormData[] }) {
    const errores = usePage().props.errors as Record<string, unknown>;
    const erroresNuevo = errores['horario-nuevo'];
    const hayErrores = !!erroresNuevo && typeof erroresNuevo === 'object' && Object.keys(erroresNuevo).length > 0;
    const [pedido, setPedido] = useState(false);
    const mostrarNuevo = pedido || hayErrores;

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-md font-semibold">Horarios</h2>
                <p className="text-sm text-muted-foreground">
                    El día puede ser un texto, por ejemplo “Lunes a sábado”.
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
                                {/* <div className="grid gap-2">
                                    <Label htmlFor={`nota-${horario.id}`}>Nota</Label>
                                    <Input id={`nota-${horario.id}`} name="nota" defaultValue={horario.nota ?? ''} />
                                    <InputError message={errors.nota} />
                                </div> */}
                                <div className="flex items-center gap-2">
                                    <Button size="sm" disabled={processing}>
                                        Guardar horario
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        type="submit"
                                        form={`eliminar-horario-${horario.id}`}
                                        disabled={processing}
                                        onClick={(event) => {
                                            if (!window.confirm('¿Eliminar este horario?')) {
                                                event.preventDefault();
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                    <Form
                        {...HorarioController.destroy.form([slug, horario.id])}
                        id={`eliminar-horario-${horario.id}`}
                        className="hidden"
                    >
                        <span className="hidden" />
                    </Form>
                </div>
            ))}

            {mostrarNuevo ? (
                <Form
                    {...HorarioController.store.form(slug)}
                    errorBag="horario-nuevo"
                    resetOnSuccess
                    onSuccess={() => setPedido(false)}
                    className="space-y-3 rounded-md border p-4"
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
                            {/* <div className="grid gap-2">
                                <Label htmlFor="nota-nuevo">Nota</Label>
                                <Input id="nota-nuevo" name="nota" />
                                <InputError message={errors.nota} />
                            </div> */}
                            <div className="flex items-center gap-2">
                                <Button size="sm" disabled={processing}>
                                    Guardar horario
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setPedido(false)}>
                                    Quitar
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            ) : (
                <Button type="button" size="sm" variant="outline" onClick={() => setPedido(true)}>
                    Otro horario
                </Button>
            )}
        </section>
    );
}

function textoVehiculo(vehiculo: VehiculoOpcion): string {
    return [vehiculo.marca, vehiculo.modelo, vehiculo.anio, vehiculo.color].filter(Boolean).join(' ');
}

function VehiculoDelChofer({
    vehiculos,
    elegido,
    error,
}: {
    vehiculos: VehiculoOpcion[];
    elegido: number | null;
    error?: string;
}) {
    const inicial = elegido && vehiculos.some((vehiculo) => vehiculo.id === elegido) ? String(elegido) : 'ninguno';
    const [valor, setValor] = useState(inicial);

    if (vehiculos.length === 0) {
        return (
            <div className="grid gap-2">
                <Label>Vehículo</Label>
                <p className="text-sm text-muted-foreground">
                    Todavía no hay vehículos en el catálogo.{' '}
                    <Link href={nuevoVehiculo()} className="underline">
                        Cargar el primero
                    </Link>
                    .
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-2">
            <Label htmlFor="vehiculo_id">Vehículo</Label>
            <Select value={valor} onValueChange={setValor}>
                <SelectTrigger id="vehiculo_id" className="w-full">
                    <SelectValue placeholder="Sin vehículo" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                    <SelectItem value="ninguno">Sin vehículo</SelectItem>
                    {vehiculos.map((vehiculo) => (
                        <SelectItem key={vehiculo.id} value={String(vehiculo.id)}>
                            {textoVehiculo(vehiculo)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <input type="hidden" name="vehiculo_id" value={valor === 'ninguno' ? '' : valor} />
            <p className="text-sm text-muted-foreground">El mismo modelo puede asignarse a varios choferes.</p>
            <InputError message={error} />
        </div>
    );
}

function LugaresDelChofer({ lugares }: { lugares: LugarOpcion[] }) {
    if (lugares.length === 0) {
        return (
            <section className="space-y-2 border-t pt-6">
                <h2 className="text-md font-semibold">Lugares</h2>
                <p className="text-sm text-muted-foreground">
                    Todavía no hay lugares en el catálogo.{' '}
                    <Link href={nuevoLugar()} className="underline">
                        Cargar el primero
                    </Link>
                    .
                </p>
            </section>
        );
    }

    return (
        <section className="space-y-3 border-t pt-6">
            <div>
                <h2 className="text-md font-semibold">Lugares</h2>
                <p className="text-sm text-muted-foreground">
                    Marcá los que este chofer ofrece. El número define el orden en su página.
                </p>
            </div>
            <ul className="space-y-2">
                {lugares.map((lugar) => (
                    <li key={lugar.id} className="flex items-center gap-3">
                        <input type="hidden" name={`lugares[${lugar.id}][id]`} value={lugar.id} />
                        <input
                            id={`lugar-${lugar.id}`}
                            type="checkbox"
                            name={`lugares[${lugar.id}][elegido]`}
                            value="1"
                            defaultChecked={lugar.elegido}
                        />
                        <Label htmlFor={`lugar-${lugar.id}`} className="min-w-0 flex-1">
                            {lugar.nombre}
                            <span className="ml-2 text-xs text-muted-foreground">{lugar.ciudad}</span>
                        </Label>
                        <Input
                            name={`lugares[${lugar.id}][orden]`}
                            type="number"
                            min={0}
                            defaultValue={lugar.orden}
                            className="w-20"
                            aria-label={`Orden de ${lugar.nombre}`}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function ChoferForm({
    chofer,
    lugares,
    vehiculos,
}: {
    chofer: ChoferFormData | null;
    lugares: LugarOpcion[];
    vehiculos: VehiculoOpcion[];
}) {
    const editing = chofer !== null;

    return (
        <>
            <Head title={editing ? 'Editar chofer' : 'Nuevo chofer'} />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 lg:max-w-5xl">
                <div>
                    <h1 className="text-xl font-semibold">{editing ? 'Editar chofer' : 'Nuevo chofer'}</h1>
                    <p className="text-muted-foreground">
                        Estos datos son los que ve el turista en la página pública.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-14 lg:gap-y-8">
                    <Form
                        {...(editing ? ChoferController.update.form(chofer.slug) : ChoferController.store.form())}
                        className="contents"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="order-1 space-y-6 lg:col-start-1 lg:row-start-1">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nombre">Nombre y apellido</Label>
                                        <Input id="nombre" name="nombre" defaultValue={chofer?.nombre ?? ''} required />
                                        <InputError message={errors.nombre} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">URL slug</Label>
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

                                    <div className="grid gap-2">
                                        <Label>Fondo de la card</Label>
                                        <div className="flex gap-4 text-sm">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="fondo"
                                                    value="masculino"
                                                    defaultChecked={(chofer?.fondo ?? 'masculino') === 'masculino'}
                                                />
                                                Masculino
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="fondo"
                                                    value="femenino"
                                                    defaultChecked={chofer?.fondo === 'femenino'}
                                                />
                                                Femenino
                                            </label>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Es la foto de fondo de la card. La redonda sigue siendo la que subas.
                                        </p>
                                        <InputError message={errors.fondo} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="descripcion">Descripción</Label>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            defaultValue={chofer?.descripcion ?? ''}
                                            placeholder={descripcionPorDefecto}
                                            rows={4}
                                            className="border-input placeholder:text-muted-foreground w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.descripcion} />
                                    </div>

                                    <VehiculoDelChofer
                                        vehiculos={vehiculos}
                                        elegido={chofer?.vehiculo_id ?? null}
                                        error={errors.vehiculo_id}
                                    />
                                </div>

                                {!editing && (
                                    <div className="order-2 lg:col-start-2 lg:row-start-1">
                                        <HorariosNuevos errors={errors} />
                                    </div>
                                )}

                                <div className="order-3 lg:col-span-2 lg:row-start-2">
                                    <LugaresDelChofer lugares={lugares} />
                                </div>

                                <div className="order-4 space-y-4 lg:col-span-2 lg:row-start-3">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" name="activo" value="1" defaultChecked={chofer?.activo ?? true} />
                                        Activo. Si lo desmarcás, el turista ve el aviso de página no disponible.
                                    </label>

                                    <div className="flex items-center gap-3 mt-2">
                                        <Button disabled={processing}>{editing ? 'Guardar' : 'Crear'}</Button>
                                        <Button variant="outline" asChild>
                                            <Link href={index()}>Volver</Link>
                                        </Button>
                                        {editing && (
                                            <a className="text-sm underline" href={`/${chofer.slug}`} target="_blank" rel="noreferrer">
                                                Ver página
                                            </a>
                                        )}
                                        {editing && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button type="button" variant="destructive">
                                                        Eliminar
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>
                                                        ¿Seguro que querés eliminar a {chofer.nombre}?
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Se borran la página pública y los horarios. Esta acción no se puede deshacer.
                                                    </DialogDescription>
                                                    <Form {...ChoferController.destroy.form(chofer.slug)}>
                                                        {({ processing }) => (
                                                            <DialogFooter className="gap-2">
                                                                <DialogClose asChild>
                                                                    <Button type="button" variant="secondary">
                                                                        Cancelar
                                                                    </Button>
                                                                </DialogClose>
                                                                <Button type="submit" variant="destructive" disabled={processing}>
                                                                    Eliminar
                                                                </Button>
                                                            </DialogFooter>
                                                        )}
                                                    </Form>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>

                                </div>
                            </>
                        )}
                    </Form>

                    {editing && (
                        <div className="order-2 lg:col-start-2 lg:row-start-1">
                            <HorariosDelChofer slug={chofer.slug} horarios={chofer.horarios} />
                        </div>
                    )}


                </div>
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
