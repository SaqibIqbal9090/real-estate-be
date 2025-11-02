require('dotenv').config();

// Helper function to safely get and trim environment variables
// Also removes trailing commas that can occur from copy-paste errors
const getEnv = (key, defaultValue) => {
  const value = process.env[key];
  if (!value) return defaultValue;
  // Trim whitespace and remove trailing commas
  return value.trim().replace(/,$/, '');
};

// Helper function to parse port (also handles trailing commas)
const getPort = (defaultPort = 5432) => {
  const port = process.env.DB_PORT;
  if (!port) return defaultPort;
  // Trim and remove trailing commas before parsing
  const cleanedPort = port.trim().replace(/,$/, '');
  return parseInt(cleanedPort, 10) || defaultPort;
};

module.exports = {
  development: {
    username: getEnv('DB_USERNAME', 'postgres'),
    password: getEnv('DB_PASSWORD', 'admin'),
    database: getEnv('DB_NAME', 'real_estate'),
    host: getEnv('DB_HOST', 'localhost'),
    port: getPort(5432),
    dialect: 'postgres',
    logging: true,
  },

  test: {
    username: getEnv('DB_USERNAME', 'postgres'),
    password: getEnv('DB_PASSWORD', 'admin'),
    database: getEnv('DB_NAME', 'real_estate_test'),
    host: getEnv('DB_HOST', 'localhost'),
    port: getPort(5432),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: getEnv('DB_USERNAME', ''),
    password: getEnv('DB_PASSWORD', ''),
    database: getEnv('DB_NAME', ''),
    host: getEnv('DB_HOST', ''),
    port: getPort(5432),
    dialect: 'postgres',
    logging: false,
  }
}; 