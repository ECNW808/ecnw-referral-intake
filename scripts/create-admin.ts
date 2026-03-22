import { db } from '@/lib/db/client';
import { adminUsers } from '@/lib/db/schema';
import { hashPassword, generatePassword } from '@/lib/utils/auth';

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'intake@elitecarenorthwest.com';
  const password = process.env.ADMIN_PASSWORD || generatePassword(16);

  console.log('Creating admin user...');
  console.log('Email:', email);

  try {
    // Check if admin already exists
    const existing = await db.select().from(adminUsers).limit(1);
    if (existing.length > 0) {
      console.log('Admin user already exists. Skipping...');
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin user
    await db.insert(adminUsers).values({
      email,
      name: 'Admin',
      passwordHash,
      isActive: true,
    });

    console.log('\n✓ Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\n⚠️  Save these credentials in a secure location.');
    console.log('You can change the password after first login.\n');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdmin().then(() => process.exit(0));
