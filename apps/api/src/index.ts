import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import tenantsRoutes from './routes/tenants.routes';
import { logger } from './config/logger';

const app = new Hono();

app.route('/api/tenants', tenantsRoutes);

tenantsRoutes.routes.forEach((route) => {
  logger.info(`Registering route: ${route.method} ${app.routes[0].path}${route.path}`);
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  logger.info(`Server is running on http://localhost:${info.port}`)
})