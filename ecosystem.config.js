{
  "apps": [
    {
      "name": "coderunner",
      "script": "backend/server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "error_file": "logs/pm2-error.log",
      "out_file": "logs/pm2-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "merge_logs": true,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "500M",
      "listen_timeout": 5000,
      "kill_timeout": 5000,
      "shutdown_with_message": true
    }
  ]
}
