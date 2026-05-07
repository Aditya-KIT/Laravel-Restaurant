import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
<<<<<<< HEAD
import vue from '@vitejs/plugin-vue';
=======
import tailwindcss from '@tailwindcss/vite';
>>>>>>> 6d22108 (Update)

export default defineConfig({
    plugins: [
        laravel({
<<<<<<< HEAD
            input: 'resources/js/app.js',
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
=======
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
>>>>>>> 6d22108 (Update)
});
