import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		proxy: {
			'/api/v1': {
				target: 'http://10.10.10.111:8443',
				changeOrigin: true,
			},
		},
	}
});
