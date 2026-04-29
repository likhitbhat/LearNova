const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['student', 'instructor', 'admin'],
            default: 'student',
        },
        enrolledCourses: [
            {
                // Can be an internal course ID
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                },
                // Or external YouTube Playlist metadata
                title: { type: String },
                image: { type: String },
                youtubeUrl: { type: String },
                externalUrl: { type: String },
                enrolledAt: {
                    type: Date,
                    default: Date.now,
                },
                progress: {
                    type: Number,
                    default: 0,
                }
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
