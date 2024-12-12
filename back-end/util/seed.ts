import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const resetSequences = async () => {
    // Reset the sequence for each table with auto-incrementing IDs
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Group_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Message_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Report_id_seq" RESTART WITH 1;`;
};

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.report.deleteMany();
    await prisma.message.deleteMany();
    await prisma.group.deleteMany();
    await resetSequences();

    const marketingGroup = await prisma.group.create({
        data: {
            name: 'Marketing',
            description: 'Marketing and advertising group.',
        },
    });

    const computerScienceGroup = await prisma.group.create({
        data: {
            name: 'Computer Science',
            description: 'Computer science and technology discussions.',
        },
    });

    const businessGroup = await prisma.group.create({
        data: {
            name: 'Business',
            description: 'Business and entrepreneurship discussions.',
        },
    });

    const artGroup = await prisma.group.create({
        data: {
            name: 'Art',
            description: 'Art, literature, and creative works discussions.',
        },
    });

    const engineeringGroup = await prisma.group.create({
        data: {
            name: 'Engineering',
            description: 'Engineering and technology projects and discussions.',
        },
    });
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
            groups: {
                connect: [
                    { id: marketingGroup.id },
                    { id: computerScienceGroup.id },
                    { id: engineeringGroup.id },
                ],
            },
        },
    });

    const student2 = await prisma.user.create({
        data: {
            username: 'JaneDoe',
            email: 'jane.doe@gmail.com',
            password: await bcrypt.hash('JaneD123', 12),
            role: 'student',
            groups: {
                connect: [
                    { id: businessGroup.id },
                    { id: artGroup.id },
                    { id: engineeringGroup.id },
                ],
            },
        },
    });

    const lecturer = await prisma.user.create({
        data: {
            username: 'JackDOE',
            email: 'jack.doe@gmail.com',
            password: await bcrypt.hash('JackD123', 12),
            role: 'lecturer',
            groups: {
                connect: [{ id: computerScienceGroup.id }, { id: engineeringGroup.id }],
            },
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

    const messages = [
        {
            content:
                "Welcome to the Marketing group! Let's discuss the latest trends and strategies.",
            groupId: marketingGroup.id,
        },
        {
            content: 'Does anyone have ideas for the next marketing campaign? We need fresh ideas!',
            groupId: marketingGroup.id,
        },
        {
            content: 'How do you all feel about the latest digital marketing tools?',
            groupId: marketingGroup.id,
        },
        {
            content: "Hello everyone! Ready for the CS competition? Let's prepare together!",
            groupId: computerScienceGroup.id,
        },
        {
            content: 'Has anyone solved the algorithm problem in the last assignment?',
            groupId: computerScienceGroup.id,
        },
        {
            content: 'Hey all, can anyone help with debugging the code for the project?',
            groupId: computerScienceGroup.id,
        },
        {
            content: 'Who is up for the next Business seminar? We need to start planning.',
            groupId: businessGroup.id,
        },
        {
            content:
                'Does anyone have the answer to the business strategy question from last class?',
            groupId: businessGroup.id,
        },
        {
            content: "Hi all! Let's discuss the upcoming entrepreneurial event.",
            groupId: businessGroup.id,
        },
        {
            content: "What creative projects are you currently working on? Let's share!",
            groupId: artGroup.id,
        },
        {
            content: "Who here is passionate about modern art? Let's discuss the latest trends!",
            groupId: artGroup.id,
        },
        {
            content: 'Does anyone have suggestions for our next art exhibition?',
            groupId: artGroup.id,
        },
        {
            content: "Engineering students! Let's talk about the latest tech advancements.",
            groupId: engineeringGroup.id,
        },
        {
            content: 'Does anyone know the best platform to collaborate on engineering projects?',
            groupId: engineeringGroup.id,
        },
        {
            content: 'Hey engineers, can we start a discussion about the new robotics project?',
            groupId: engineeringGroup.id,
        },
    ];

    for (const message of messages) {
        await prisma.message.create({
            data: {
                content: message.content,
                groupId: message.groupId,
            },
        });
    }
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
