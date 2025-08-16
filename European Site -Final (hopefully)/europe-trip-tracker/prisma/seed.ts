import { PrismaClient } from '@prisma/client';
import { generateSlug } from '../lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample posts
  const posts = [
    {
      title: 'Arrival in Paris',
      caption: 'Finally made it to the City of Light! The Eiffel Tower is even more magnificent in person.',
      bodyMD: 'After a long flight, we arrived in Paris and immediately fell in love with the city. The architecture, the food, the atmosphere - everything is perfect.',
      takenAt: new Date('2024-03-15'),
      latitude: 48.8584,
      longitude: 2.2945,
      city: 'Paris',
      country: 'France',
      status: 'PUBLISHED' as const,
      media: [
        {
          type: 'IMAGE' as const,
          cldId: 'europe-trip/paris-eiffel-tower',
          width: 1920,
          height: 1080,
          order: 0,
        },
      ],
    },
    {
      title: 'Venice Canals',
      caption: 'Gondola ride through the magical canals of Venice. Pure magic!',
      bodyMD: 'Venice is like stepping into a fairy tale. The canals, the bridges, the history - it\'s absolutely breathtaking.',
      takenAt: new Date('2024-03-20'),
      latitude: 45.4408,
      longitude: 12.3155,
      city: 'Venice',
      country: 'Italy',
      status: 'PUBLISHED' as const,
      media: [
        {
          type: 'IMAGE' as const,
          cldId: 'europe-trip/venice-canals',
          width: 1920,
          height: 1080,
          order: 0,
        },
      ],
    },
    {
      title: 'Swiss Alps',
      caption: 'Hiking in the Swiss Alps with views that take your breath away.',
      bodyMD: 'The Swiss Alps are absolutely stunning. We spent the day hiking and taking in the incredible mountain views.',
      takenAt: new Date('2024-03-25'),
      latitude: 46.8182,
      longitude: 8.2275,
      city: 'Interlaken',
      country: 'Switzerland',
      status: 'PUBLISHED' as const,
      media: [
        {
          type: 'IMAGE' as const,
          cldId: 'europe-trip/swiss-alps',
          width: 1920,
          height: 1080,
          order: 0,
        },
      ],
    },
  ];

  for (const postData of posts) {
    const { media, ...postFields } = postData;
    const slug = generateSlug(postData.title);

    const post = await prisma.post.create({
      data: {
        ...postFields,
        slug,
        media: {
          create: media.map((mediaItem, index) => ({
            ...mediaItem,
            order: index,
          })),
        },
      },
    });

    console.log(`✅ Created post: ${post.title}`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
