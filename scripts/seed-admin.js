const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
const connectionString = match[1].trim();

const client = new Client({ connectionString });

const ADMIN_EMAIL = "admin@a2zpharma.com";
const ADMIN_PASSWORD = "Admin@12345"; // Baad me change karna

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const existing = await client.query(
      'SELECT id FROM "AdminUser" WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      console.log(`Admin already exists. Updating password...`);
      await client.query(
        'UPDATE "AdminUser" SET password = $1 WHERE email = $2',
        [hashedPassword, ADMIN_EMAIL]
      );
    } else {
      await client.query(
        'INSERT INTO "AdminUser" (id, email, password, role) VALUES ($1, $2, $3, $4)',
        ["admin_1", ADMIN_EMAIL, hashedPassword, "ADMIN"]
      );
      console.log(`✓ Admin created`);
    }

    console.log(`\n📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`\n⚠️  Ye password change kar sakte ho baad me.`);
    console.log(`✅ Done!`);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
})();
