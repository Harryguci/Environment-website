import mongoose from 'mongoose';
const uri = 'mongodb+srv://harryguci:harryguci@cluster01.chrqhpv.mongodb.net/environment-website?retryWrites=true&w=majority';
const serverSelectionTimeoutMS = 5000;

async function connect() {
    // Prints "Failed 0", "Failed 1", "Failed 2" and then throws an
    // error. Exits after approximately 15 seconds.
    for (let i = 0; i < 3; ++i) {
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS })
            console.log('Connect to MongoDB successfully');
            break;
        } catch (error) {
            console.log('Connect to MongoDB Failed', i);
            if (i >= 2) {
                throw error;
            }
        }

    }
}
export { connect }
