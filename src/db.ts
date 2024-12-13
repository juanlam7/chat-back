import mongoose from 'mongoose';

const { MONGO_DB_URI } = process.env;

const connectionString: string = MONGO_DB_URI!;

if (!connectionString) {
  console.error('Make sure you have a .env file in the root of the project');
}

// mongodb connection
mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error(err);
  });

process.on('uncaughtException', (error) => {
  console.error(error);
  mongoose.disconnect();
});
