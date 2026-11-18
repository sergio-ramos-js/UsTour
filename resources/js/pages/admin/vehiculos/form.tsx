import { Form, Head, Link } from '@inertiajs/react';
import VehiculoController from '@/actions/App/Http/Controllers/Admin/VehiculoController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/vehiculos';

type VehiculoFormData = {
    id: number;
    marca: string;
    modelo: string;
    anio: number | null;
    color: string | null;
    portaequipaje: boolean;
    capacidad_pasajeros: number;
    capacidad_baul: string | null;
};

export default function VehiculoForm({ vehiculo }: { vehiculo: VehiculoFormData | null }) {
    const editing = vehiculo !== null;
    const anioMaximo = new Date().getFullYear() + 1;

    return (
        <>
            <Head title={editing ? 'Editar vehículo' : 'Nuevo vehículo'} />
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">{editing ? 'Editar vehículo' : 'Nuevo vehículo'}</h1>
                    <p className="text-muted-foreground">
                        Este modelo queda en el catálogo y se puede asignar a varios choferes.
                    </p>
                </div>

                <Form
                    {...(editing ? VehiculoController.update.form(vehiculo.id) : VehiculoController.store.form())}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="marca">Marca</Label>
                                    <Input id="marca" name="marca" defaultValue={vehiculo?.marca ?? ''} required />
                                    <InputError message={errors.marca} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="modelo">Modelo</Label>
                                    <Input id="modelo" name="modelo" defaultValue={vehiculo?.modelo ?? ''} required />
                                    <InputError message={errors.modelo} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="anio">Año</Label>
                                    <Input
                                        id="anio"
                                        name="anio"
                                        type="number"
                                        min={1950}
                                        max={anioMaximo}
                                        defaultValue={vehiculo?.anio ?? ''}
                                        required
                                    />
                                    <InputError message={errors.anio} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="color">Color</Label>
                                    <Input id="color" name="color" defaultValue={vehiculo?.color ?? ''} />
                                    <InputError message={errors.color} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="capacidad_pasajeros">Pasajeros</Label>
                                    <Input
                                        id="capacidad_pasajeros"
                                        name="capacidad_pasajeros"
                                        type="number"
                                        min={1}
                                        max={60}
                                        defaultValue={vehiculo?.capacidad_pasajeros ?? ''}
                                        required
                                    />
                                    <InputError message={errors.capacidad_pasajeros} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="capacidad_baul">Baúl</Label>
                                    <Input
                                        id="capacidad_baul"
                                        name="capacidad_baul"
                                        defaultValue={vehiculo?.capacidad_baul ?? ''}
                                    />
                                    <InputError message={errors.capacidad_baul} />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="portaequipaje"
                                    value="1"
                                    defaultChecked={vehiculo?.portaequipaje ?? false}
                                />
                                Portaequipaje
                            </label>
                            <div className="flex items-center gap-3">
                                <Button disabled={processing}>{editing ? 'Guardar' : 'Crear'}</Button>
                                <Button variant="outline" asChild>
                                    <Link href={index()}>Volver</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {editing && (
                    <Form {...VehiculoController.destroy.form(vehiculo.id)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                                onClick={(event) => {
                                    if (!window.confirm('¿Eliminar este vehículo del catálogo?')) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                Eliminar vehículo
                            </Button>
                        )}
                    </Form>
                )}
            </div>
        </>
    );
}

VehiculoForm.layout = {
    breadcrumbs: [
        {
            title: 'Vehículos',
            href: index(),
        },
    ],
};
