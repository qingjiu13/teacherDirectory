import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  build: {
    // 关闭源码映射，提高构建速度
    sourcemap: false,
    // 启用最小化混淆，但减少某些优化以提高构建速度
    minify: 'terser',
    terserOptions: {
      compress: {
        // 关闭压缩，以提高构建速度
        drop_console: false,
        drop_debugger: false
      }
    }
  },
  server: {
    // 设置较高的超时时间
    hmr: {
      timeout: 30000
    },
    // 设置更大的超时时间
    watch: {
      usePolling: true,
      interval: 500
    },
    // 增加缓存设置
    fs: {
      strict: true,
      cachedChecks: true
    }
  }
}); 