import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const teamId = '550e8400-e29b-41d4-a716-446655440000';
    const userId = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

    await prisma.team.upsert({
        where: { id: teamId },
        update: {},
        create: {
            id: teamId,
            name: 'Team Demo',
        },
    });

    await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
            id: userId,
            teamId,
            name: 'Arnaud',
            email: 'arnaud.demo@example.com',
        },
    });

    console.log('Seed completed');
    console.log(`Team ID: ${teamId}`);
    console.log(`User ID: ${userId}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });