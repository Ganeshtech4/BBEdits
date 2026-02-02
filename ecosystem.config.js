module.exports = {
  apps: [
    {
      name: 'anilweb-server',
      cwd: '/var/www/anilweb',
      script: 'build/server.js',  // Run pre-built server
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      error_file: '/var/log/anilweb-server-error.log',
      out_file: '/var/log/anilweb-server-out.log',
      time: true,
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'anilweb-client',
      cwd: '/var/www/anilweb/client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',  // Run Next.js in production mode
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/anilweb-client-error.log',
      out_file: '/var/log/anilweb-client-out.log',
      time: true,
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
