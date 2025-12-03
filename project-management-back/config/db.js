import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://final_project:Kv4mCMDkCuu3CZLG@cluster0.gwquyzz.mongodb.net/All-data?appName=Cluster0');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Error: ", error.message);
        process.exit(1);
    }
};

export default connectDB;
