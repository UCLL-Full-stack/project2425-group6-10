import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.report.deleteMany();
    await prisma.group.deleteMany();
    await prisma.message.deleteMany();

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@gmail.com',
            password: await bcrypt.hash('admin123', 12),
            role: 'admin',
        },
    });

    const student1 = await prisma.user.create({
        data: {
            username: 'JohnDoe',
            email: 'john.doe@gmail.com',
            password: await bcrypt.hash('JohnD123', 12),
            role: 'student',
        },
    });

    const student2 = await prisma.user.create({
        data: {
            username: 'JaneDoe',
            email: 'jane.doe@gmail.com',
            password: await bcrypt.hash('JaneD123', 12),
            role: 'student',
        },
    });

    const lecturer = await prisma.user.create({
        data: {
            username: 'JackDOE',
            email: 'jack.doe@gmail.com',
            password: await bcrypt.hash('JackD123', 12),
            role: 'lecturer',
        },
    });

    const group1 = await prisma.group.create({
        data: {
            name: 'Group 1',
            description: 'This is the first group.',
        },
    });

    const group2 = await prisma.group.create({
        data: {
            name: 'Group 2',
            description: 'This is the second group.',
        },
    });

    const report1 = await prisma.report.create({
        data: {
            description: 'Unappropriate content.',
        },
    });

    const report2 = await prisma.report.create({
        data: {
            description: 'Spam content.',
        },
    });

    const message1 = await prisma.message.create({
        data: {
            content: 'Hello everyone.',
        },
    });

    const message2 = await prisma.message.create({
        data: {
            content: 'How are you?',
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
