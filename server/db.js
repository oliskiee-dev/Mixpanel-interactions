// mongodb+srv://admin:<db_password>@admindeck.0c1gs.mongodb.net/?retryWrites=true&w=majority&appName=AdminDeck

//The password is "1234"
const mongoose = require('mongoose')

const connectDB = async () => {
    try{                                                                 //Can remove the Teaming between '/' and '?'  in order to create another Database
        const conn = await mongoose.connect('mongodb+srv://admin:1234@admindeck.0c1gs.mongodb.net/Teamian?retryWrites=true&w=majority&appName=AdminDeck');
        console.log(`MongoDB Connected`)
    }catch(error){
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;