export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
}

let toasts = $state<Toast[]>([]);
let counter = 0;

const AUTO_DISMISS_MS = 5000;

export const toast = {
	get all(): Toast[] {
		return toasts;
	},

	show(type: ToastType, message: string, duration?: number): string {
		const id = `toast-${++counter}`;
		toasts.push({ id, type, message });

		if (type !== 'error') {
			const ms = duration ?? AUTO_DISMISS_MS;
			setTimeout(() => toast.dismiss(id), ms);
		}

		return id;
	},

	dismiss(id: string): void {
		toasts = toasts.filter((t) => t.id !== id);
	},

	clear(): void {
		toasts = [];
	},
};
