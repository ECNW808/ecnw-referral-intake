import { db } from '@/lib/db/client';
import { facilities } from '@/lib/db/schema';
import { generateToken, hashToken, createMagicLink } from '@/lib/utils/token';

const FACILITIES = [
  {
    name: 'Swedish Medical Center - First Hill',
    email: 'discharge@swedish.org',
    phone: '206-744-8000',
    address: '747 Broadway',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98122',
  },
  {
    name: 'Swedish Medical Center - Cherry Hill',
    email: 'discharge@swedish.org',
    phone: '206-744-8000',
    address: '500 17th Avenue',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98122',
  },
  {
    name: 'UW Medicine - Harborview',
    email: 'discharge@hmc.washington.edu',
    phone: '206-744-3000',
    address: '325 9th Avenue',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98104',
  },
  {
    name: 'Virginia Mason Franciscan Health',
    email: 'discharge@vmfh.org',
    phone: '206-223-6600',
    address: '1100 9th Avenue',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
  },
  {
    name: 'Overlake Medical Center',
    email: 'discharge@overlakehealthcare.org',
    phone: '425-688-5000',
    address: '1035 116th Avenue NE',
    city: 'Bellevue',
    state: 'WA',
    zipCode: '98004',
  },
  {
    name: 'EvergreenHealth',
    email: 'discharge@evergreenhealthcare.org',
    phone: '425-899-1000',
    address: '12040 NE 128th Street',
    city: 'Kirkland',
    state: 'WA',
    zipCode: '98034',
  },
  {
    name: 'UW Medicine - Montlake',
    email: 'discharge@hmc.washington.edu',
    phone: '206-598-3300',
    address: '1959 NE Pacific Street',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98195',
  },
];

async function setupFacilities() {
  console.log('Setting up facilities...\n');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const magicLinks: Array<{ facility: string; link: string }> = [];

  for (const facility of FACILITIES) {
    try {
      const token = generateToken(32);
      const tokenHash = await hashToken(token);
      const magicLink = createMagicLink(baseUrl, token);

      await db.insert(facilities).values({
        name: facility.name,
        email: facility.email,
        phone: facility.phone,
        address: facility.address,
        city: facility.city,
        state: facility.state,
        zipCode: facility.zipCode,
        magicToken: token,
        magicTokenHash: tokenHash,
        isActive: true,
      });

      magicLinks.push({
        facility: facility.name,
        link: magicLink,
      });

      console.log(`✓ Created facility: ${facility.name}`);
    } catch (error) {
      console.error(`✗ Failed to create facility: ${facility.name}`, error);
    }
  }

  console.log('\n=== Magic Links ===\n');
  magicLinks.forEach(({ facility, link }) => {
    console.log(`${facility}:`);
    console.log(`${link}\n`);
  });

  console.log('\n=== Instructions ===');
  console.log('1. Copy the magic links above');
  console.log('2. Share each link with the corresponding facility');
  console.log('3. Facilities can use their link to submit referrals');
  console.log('4. Each link is unique and secure (non-guessable)\n');
}

setupFacilities()
  .then(() => {
    console.log('Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
