import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import styleImport, {VantResolve} from 'vite-plugin-style-import';
// @ts-nocheck
import {svgstore} from './src/vite_plugins/svgstore';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx({
            transformOn: true,
            mergeProps: true
        }),
        svgstore(),
        styleImport({
            resolves: [VantResolve()],
            libs: [
                {
                    libraryName: 'vant',
                    esModule: true,
                    resolveStyle: (name) => `../es/${name}/style`
                }
            ]
        }),
    ],
    server: {
        proxy: {
            '/api/v1': {
                target: 'http://121.196.236.94:8080/',
            }
        }
    }
})