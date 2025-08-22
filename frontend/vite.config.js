// import { defineConfig } from 'vite';

// export default defineConfig({
//     server: {
//         host: true,
//         port: 5173,
//         allowedHosts: ['vite-app', 'host.docker.internal', 'localhost']
//       }      
// });
import { defineConfig } from 'vite';

export default defineConfig({
//   base: '/routes/weather/',   // ensure assets resolve under /routes/weather
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['vite-app', 'host.docker.internal', 'localhost'],
  },
});
