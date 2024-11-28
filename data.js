const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import các models
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Notification = require('./models/Notification');
const Attachment = require('./models/Attachment');

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// Seed dữ liệu
const seedData = async () => {
    try {
        // Xóa dữ liệu cũ
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();
        await Notification.deleteMany();
        await Attachment.deleteMany();

        console.log('Old data cleared.');

        // Thêm Users
        const users = await User.insertMany([
            { name: 'Alice', email: 'alice@example.com', password: '123456', avatar: 'https://via.placeholder.com/150' },
            { name: 'Bob', email: 'bob@example.com', password: '123456', avatar: 'https://via.placeholder.com/150' },
            { name: 'Charlie', email: 'charlie@example.com', password: '123456', avatar: 'https://via.placeholder.com/150' },
        ]);

        console.log('Users added.');

        // Thêm Projects
        const projects = await Project.insertMany([
            {
                name: 'Project Alpha',
                description: 'This is the first project',
                owner: users[0]._id,
                members: [users[1]._id, users[2]._id],
                startDate: new Date('2024-01-01'),
                dueDate: new Date('2024-06-01'),
            },
            {
                name: 'Project Beta',
                description: 'This is the second project',
                owner: users[1]._id,
                members: [users[0]._id],
                startDate: new Date('2024-02-01'),
                dueDate: new Date('2024-07-01'),
            },
        ]);

        console.log('Projects added.');

        // Thêm Tasks
        const tasks = await Task.insertMany([
            {
                title: 'Task 1',
                description: 'Task for Project Alpha',
                priority: 'High',
                status: 'In Progress',
                dueDate: new Date('2024-03-01'),
                project: projects[0]._id,
                startDate: new Date('2024-01-10'),
                idUser: users[1]._id,
            },
            {
                title: 'Task 2',
                description: 'Task for Project Beta',
                priority: 'Medium',
                status: 'Completed',
                dueDate: new Date('2024-04-01'),
                project: projects[1]._id,
                startDate: new Date('2024-02-15'),
                idUser: users[0]._id,
            },
        ]);

        console.log('Tasks added.');

        // Thêm Notifications
        const notifications = await Notification.insertMany([
            {
                userId: users[0]._id,
                content: 'Your task has been updated',
                isRead: false,
                createdAt: new Date(),
            },
            {
                userId: users[1]._id,
                content: 'New member joined your project',
                isRead: true,
                createdAt: new Date(),
            },
        ]);

        console.log('Notifications added.');

        // Thêm Attachments
        const attachments = await Attachment.insertMany([
            {
                taskId: tasks[0]._id,
                fileUrl: 'https://example.com/file1.pdf',
                uploadedBy: users[1]._id,
                createdAt: new Date(),
            },
            {
                taskId: tasks[1]._id,
                fileUrl: 'https://example.com/file2.docx',
                uploadedBy: users[0]._id,
                createdAt: new Date(),
            },
        ]);

        console.log('Attachments added.');

        console.log('Seeding completed.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
