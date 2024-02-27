const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, { family: 4 });

        console.log("Database Connected");
        console.log("Connection Host: " + connect.connection.host);
        console.log("Connection Name: " + connect.connection.name);
        
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;