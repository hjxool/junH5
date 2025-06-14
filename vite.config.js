import { fileURLToPath, URL } from 'node:url';
const 启用https = false;

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	server: {
		port: 启用https ? 443 : 80,
		host: '0.0.0.0',
		https: 启用https,
		open: true,
	},
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		chunkSizeWarningLimit: 10 * 1024, // 将警告阈值设为10mb
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // or 'modern'
			},
		},
	},
});
