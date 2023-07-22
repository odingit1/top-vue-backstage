import { mergeConfig, loadEnv } from 'vite';
import baseConig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configStyleImportPlugin from './plugin/styleImport';
import configImageminPlugin from './plugin/imagemin';
const mode = 'production'
process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
}
export default mergeConfig(
    {
        mode: mode,
        plugins: [
            configCompressPlugin('gzip'),
            configVisualizerPlugin(),
            configArcoResolverPlugin(),
            configStyleImportPlugin(),
            configImageminPlugin(),
        ],
        build: {
            outDir: '.output',
            rollupOptions: {
                output: {
                    manualChunks: {
                        arco: ['@arco-design/web-vue'],
                        chart: ['echarts', 'vue-echarts'],
                        vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
                    },
                },
            },
            chunkSizeWarningLimit: 2000,
        },
    },
    baseConig
);
