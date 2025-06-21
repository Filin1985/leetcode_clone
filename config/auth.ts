// config/auth.js
const auth = {
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-here", // Use environment variable in production
  jwtExpiration: process.env.JWT_EXPIRATION || "24h", // Token expiration time
  saltRounds: process.env.SALT_ROUNDS || 10, // For password hashing
}

export default auth
