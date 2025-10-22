module.exports = {
  apps: [
    {
      name: "epi-backend",
      cwd: "./backend",
      script: "server.js",
      env: { NODE_ENV: "production", PORT: "4000" },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000
    }
  ]
}
