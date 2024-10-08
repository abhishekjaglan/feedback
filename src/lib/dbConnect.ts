import mongoose from "mongoose";

// type to check connection status
type ConnectionObject = {
    isConnected?: number
};

// object to check connection status
const connection: ConnectionObject = {};

//function to connect to db
async function dbConnect(): Promise<void>{

    // connection already exists
    if(connection.isConnected){
        console.log('Already connected to database');
        return
    }

    // establishing connection to db
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '', {});
        console.log("DB :: ", db);
        
        // storing connection state/status
        connection.isConnected = db.connections[0].
        readyState;

        console.log('DB Connected Successfully');

    } catch (error) {
        console.log('Db Connection failed', error);
        process.exit(1);
    }
};

export default dbConnect;