import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        try {
            const res = await mongoose.connection.collection('users').updateMany(
                { role: 'mentor', $or: [{ name: /Rakshit/i }, { 'mentorProfile.verification.isVerified': null }] },
                { $set: { 'mentorProfile.verification.isVerified': false, 'mentorProfile.verification.applicationStatus': 'pending' } }
            );
            console.log('Update result:', res);
        } catch (err) {
            console.error(err);
        } finally {
            process.exit(0);
        }
    });
