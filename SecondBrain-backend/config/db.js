// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log(' MongoDB Connected');
//   } catch (err) {
//     console.error(' MongoDB Connection Failed:', err.message);
//     process.exit(1);
//   }
// };

// export default connectDB;
import mongoose from 'mongoose';

const connect = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connect;
