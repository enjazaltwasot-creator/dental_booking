import "dotenv/config";
import mysql from "mysql2/promise";
import crypto from "crypto";

/**
 * server/seed-admin.ts
 *
 * Usage (from repo root):
 *   node -r dotenv/config server/seed-admin.ts
 *
 * Environment variables used:
 * - DATABASE_URL       (required) MySQL connection URI, e.g. mysql://root:pass@127.0.0.1:3306/dbname
 * - ADMIN_OPENID       (optional) openId for the admin user. Defaults to "admin_local".
 * - ADMIN_NAME         (optional) admin display name.
 * - ADMIN_EMAIL        (optional) admin email.
 * - ADMIN_PASSWORD     (optional) if provided, the script will create a small `local_auth` table
 *                      and store the salted scrypt hash there as `salt:hash`. This does not
 *                      modify your drizzle schema — it's only a lightweight local-secret store
 *                      to support manual/admin logins if you add checks for it.
 *
 * Notes:
 * - The project uses OAuth in production; the users table (drizzle/schema.ts) does not include a
 *   password column. This script upserts a row in `users` and (optionally) stores a hashed
 *   password in a standalone `local_auth` table created by the script.
 */

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is required");
  process.exit(1);
}

const ADMIN_OPENID = process.env.ADMIN_OPENID ?? "admin_local";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? null;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? null;

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  try {
    console.log("Connected to database");

    // Upsert into users table. Use a safe INSERT ... ON DUPLICATE KEY UPDATE
    // The users table has unique(openId) so this will create or update the admin row.
    const insertUserSql = `
      INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
      VALUES (?, ?, ?, ?, 'admin', NOW(), NOW(), NOW())
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), role = VALUES(role), updatedAt = NOW()
    `;

    await conn.execute(insertUserSql, [ADMIN_OPENID, ADMIN_NAME, ADMIN_EMAIL, null]);
    console.log(`Upserted admin user (openId=${ADMIN_OPENID}) into users table`);

    if (ADMIN_PASSWORD) {
      console.log("ADMIN_PASSWORD provided — creating local_auth table (if needed) and storing hash...");

      const createAuthTableSql = `
        CREATE TABLE IF NOT EXISTS local_auth (
          open_id varchar(64) NOT NULL PRIMARY KEY,
          password_hash text NOT NULL,
          created_at timestamp DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `;
      await conn.execute(createAuthTableSql);

      // Hash password using scrypt + per-user salt
      const salt = crypto.randomBytes(16).toString("hex");
      const derivedKey = crypto.scryptSync(ADMIN_PASSWORD, salt, 64).toString("hex");
      const stored = `${salt}:${derivedKey}`;

      const upsertAuthSql = `
        REPLACE INTO local_auth (open_id, password_hash) VALUES (?, ?)
      `;
      await conn.execute(upsertAuthSql, [ADMIN_OPENID, stored]);

      console.log("Stored hashed admin password in local_auth table (open_id -> salt:hash)");
      console.log("NOTE: Application code does not read local_auth by default; add login logic if you need local auth.");
    } else {
      console.log("No ADMIN_PASSWORD provided — skipped creating local_auth table.");
      console.log("If you want to store a password, set ADMIN_PASSWORD in your environment and re-run this script.");
    }

    console.log("Done.");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
