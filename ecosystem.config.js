module.exports = {
  apps: [
    {
      name: 'bbedits-backend',
      cwd: '/root/bbedits-lms',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/bbedits-backend-error.log',
      out_file: '/var/log/bbedits-backend-out.log',
      time: true,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      autorestart: true,
    },
    {
      name: 'bbedits-frontend',
      cwd: '/root/bbedits-lms/client',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/bbedits-frontend-error.log',
      out_file: '/var/log/bbedits-frontend-out.log',
      time: true,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      autorestart: true,
    },
  ],
};
