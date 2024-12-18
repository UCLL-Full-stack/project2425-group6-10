import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const resetSequences = async () => {
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Group_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Message_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Report_id_seq" RESTART WITH 1;`;
};

const generateUniqueCode = async (): Promise<string> => {
    let code: string = '';
    let isUnique = false;

    while (!isUnique) {
        code = uuidv4().substring(0, 6);
        const existingGroup = await prisma.group.findUnique({
            where: { code },
        });

        if (!existingGroup) {
            isUnique = true;
        }
    }

    return code;
};

const main = async () => {
    await prisma.report.deleteMany();
    await prisma.message.deleteMany();
    await prisma.group.deleteMany();
    await prisma.user.deleteMany();
    await resetSequences();

    const marketingGroup = await prisma.group.create({
        data: {
            name: 'Marketing',
            description: 'Marketing and advertising group.',
            code: await generateUniqueCode(),
        },
    });

    const computerScienceGroup = await prisma.group.create({
        data: {
            name: 'Computer Science',
            description: 'Computer science and technology discussions.',
            code: await generateUniqueCode(),
        },
    });

    const businessGroup = await prisma.group.create({
        data: {
            name: 'Business',
            description: 'Business and entrepreneurship discussions.',
            code: await generateUniqueCode(),
        },
    });

    const artGroup = await prisma.group.create({
        data: {
            name: 'Art',
            description: 'Art, literature, and creative works discussions.',
            code: await generateUniqueCode(),
        },
    });

    const engineeringGroup = await prisma.group.create({
        data: {
            name: 'Engineering',
            description: 'Engineering and technology projects and discussions.',
            code: await generateUniqueCode(),
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

    const messages = [
        {
            content:
                "Welcome to the Marketing group! Let's discuss the latest trends and strategies.",
            groupId: marketingGroup.id,
            userId: student1.id,
        },
        {
            content: 'Does anyone have ideas for the next marketing campaign? We need fresh ideas!',
            groupId: marketingGroup.id,
            userId: student2.id,
        },
        {
            content: 'How do you all feel about the latest digital marketing tools?',
            groupId: marketingGroup.id,
            userId: lecturer.id,
        },
        {
            content: "Hello everyone! Ready for the CS competition? Let's prepare together!",
            groupId: computerScienceGroup.id,
            userId: student1.id,
        },
        {
            content: 'Has anyone solved the algorithm problem in the last assignment?',
            groupId: computerScienceGroup.id,
            userId: student2.id,
        },
        {
            content: 'Hey all, can anyone help with debugging the code for the project?',
            groupId: computerScienceGroup.id,
            userId: lecturer.id,
        },
        {
            content: 'Who is up for the next Business seminar? We need to start planning.',
            groupId: businessGroup.id,
            userId: student1.id,
        },
        {
            content:
                'Does anyone have the answer to the business strategy question from last class?',
            groupId: businessGroup.id,
            userId: student2.id,
        },
        {
            content: "Hi all! Let's discuss the upcoming entrepreneurial event.",
            groupId: businessGroup.id,
            userId: lecturer.id,
        },
        {
            content: "What creative projects are you currently working on? Let's share!",
            groupId: artGroup.id,
            userId: student1.id,
        },
        {
            content: "Who here is passionate about modern art? Let's discuss the latest trends!",
            groupId: artGroup.id,
            userId: student2.id,
        },
        {
            content: 'Does anyone have suggestions for our next art exhibition?',
            groupId: artGroup.id,
            userId: lecturer.id,
        },
        {
            content: "Engineering students! Let's talk about the latest tech advancements.",
            groupId: engineeringGroup.id,
            userId: student1.id,
        },
        {
            content: 'Does anyone know the best platform to collaborate on engineering projects?',
            groupId: engineeringGroup.id,
            userId: student2.id,
        },
        {
            content: 'Hey engineers, can we start a discussion about the new robotics project?',
            groupId: engineeringGroup.id,
            userId: lecturer.id,
        },
        {
            content: 'Spam message: Buy followers now at a low price!',
            groupId: marketingGroup.id,
            userId: student2.id,
        },
        {
            content: 'Offensive comment: This project is stupid and everyone here is dumb.',
            groupId: computerScienceGroup.id,
            userId: lecturer.id,
        },
    ];

    for (const message of messages) {
        await prisma.message.create({
            data: {
                content: message.content,
                groupId: message.groupId,
                userId: message.userId,
            },
        });
    }

    const inappropriateMessages = await prisma.message.findMany({
        where: {
            content: {
                in: [
                    'Spam message: Buy followers now at a low price!',
                    'Offensive comment: This project is stupid and everyone here is dumb.',
                ],
            },
        },
    });

    if (inappropriateMessages.length > 0) {
        await prisma.report.createMany({
            data: inappropriateMessages.map((message, index) => ({
                description:
                    index === 0
                        ? 'Spam detected in the message.'
                        : 'Offensive language used in the message.',
                messageId: message.id,
                userId: student1.id, // Assume JohnDoe reports these messages
            })),
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
