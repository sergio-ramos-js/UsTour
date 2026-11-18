import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            if (data.type === 'success') {
                toast.success(data.message, {
                    position: 'top-right',
                    style: {
                        background: '#15803d',
                        color: '#ffffff',
                        border: '1px solid #166534',
                    },
                });

                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}
