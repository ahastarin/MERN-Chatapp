import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
            .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}