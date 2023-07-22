import { mergeConfig, loadEnv } from 'vite'
import baseConig from './vite.config.base'
const mode = 'development'
process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
}
export default mergeConfig(
    {
        mode,
        lintOnSave: false,

        server: {
            hmr: false,
            open: false,
            port: 3000,
            fs: {
                strict: true
            },
            proxy: {
                '/conf': {
                    target: process.env.VITE_API_BASE_URL,
                    changeOrigin: true
                }
            }
        },
        plugins: [
            //   eslint({
            //     cache: false,
            //     include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
            //     exclude: ['node_modules']
            //   })
        ],
    },
    baseConig
)
