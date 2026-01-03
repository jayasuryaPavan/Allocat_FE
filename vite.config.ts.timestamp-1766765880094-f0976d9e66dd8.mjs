// vite.config.ts
import { defineConfig } from "file:///C:/Work%20Space/Allocat/Frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Work%20Space/Allocat/Frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Work Space\\Allocat\\Frontend";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      "@environments": resolve(__vite_injected_original_dirname, "src/environments"),
      "@core": resolve(__vite_injected_original_dirname, "src/core"),
      "@shared": resolve(__vite_injected_original_dirname, "src/shared"),
      "@features": resolve(__vite_injected_original_dirname, "src/features"),
      "@layouts": resolve(__vite_injected_original_dirname, "src/layouts"),
      "@assets": resolve(__vite_injected_original_dirname, "src/assets")
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router", "pinia"],
          ui: ["@vueuse/core", "@vueuse/head"]
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS configuration can be added here if needed
      }
    }
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXb3JrIFNwYWNlXFxcXEFsbG9jYXRcXFxcRnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFdvcmsgU3BhY2VcXFxcQWxsb2NhdFxcXFxGcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovV29yayUyMFNwYWNlL0FsbG9jYXQvRnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt2dWUoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgICAnQGVudmlyb25tZW50cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Vudmlyb25tZW50cycpLFxyXG4gICAgICAnQGNvcmUnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb3JlJyksXHJcbiAgICAgICdAc2hhcmVkJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvc2hhcmVkJyksXHJcbiAgICAgICdAZmVhdHVyZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9mZWF0dXJlcycpLFxyXG4gICAgICAnQGxheW91dHMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9sYXlvdXRzJyksXHJcbiAgICAgICdAYXNzZXRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYXNzZXRzJylcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNDIwMCxcclxuICAgIG9wZW46IHRydWUsXHJcbiAgICBjb3JzOiB0cnVlLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICBzb3VyY2VtYXA6IHRydWUsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgdmVuZG9yOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXHJcbiAgICAgICAgICB1aTogWydAdnVldXNlL2NvcmUnLCAnQHZ1ZXVzZS9oZWFkJ11cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgLy8gU0NTUyBjb25maWd1cmF0aW9uIGNhbiBiZSBhZGRlZCBoZXJlIGlmIG5lZWRlZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIF9fVlVFX09QVElPTlNfQVBJX186IHRydWUsXHJcbiAgICBfX1ZVRV9QUk9EX0RFVlRPT0xTX186IGZhbHNlXHJcbiAgfVxyXG59KVxyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUixTQUFTLG9CQUFvQjtBQUNuVCxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUNmLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDN0IsaUJBQWlCLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDdEQsU0FBUyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxNQUN0QyxXQUFXLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzFDLGFBQWEsUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDOUMsWUFBWSxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUM1QyxXQUFXLFFBQVEsa0NBQVcsWUFBWTtBQUFBLElBQzVDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLE9BQU8sY0FBYyxPQUFPO0FBQUEsVUFDckMsSUFBSSxDQUFDLGdCQUFnQixjQUFjO0FBQUEsUUFDckM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQTtBQUFBLE1BRU47QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04scUJBQXFCO0FBQUEsSUFDckIsdUJBQXVCO0FBQUEsRUFDekI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
