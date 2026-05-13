import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://****_project:****************.mongodb.net/All-data?appName=Clust***');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Error: ", error.message);
        process.exit(1);
    }
};

export default connectDB;
