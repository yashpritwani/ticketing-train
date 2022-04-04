require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodeCron = require("node-cron");
const fs=require("fs");
const csv = require('csvtojson');
const connUri = process.env.MONGO_LOCAL_CONN_URL;
let PORT = process.env.PORT || 5000;
const app = express();
const User = require('./Model/user');
const Train = require("./Model/train");

const {google} = require('googleapis');
const keys = require('./keys.json');
const { serialize } = require('v8');
const spreadsheetId = process.env.SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets", 
});
async function googleClient(){
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
    return googleSheetsInstance
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.promise = global.Promise;
mongoose.connect(connUri, { useNewUrlParser: true});

const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB connection established successfully!'));
connection.on('error', (err) => {
    console.log("MongoDB connection error." + err);
    process.exit();
});

async function sheetDetails(){
    var googleSheetsInstance = await googleClient();
    const sheetInfo = await googleSheetsInstance.spreadsheets.get({
        auth,
        spreadsheetId,
    });
    return sheetInfo.data.sheets
}
let trainString = "abc";
sheetDetails()
async function readTrainData(sheet){
    var googleSheetsInstance = await googleClient();
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `${sheet}!A:ZZZ`, 
    })
    var arr = readData.data.values
    let final = ""
    arr.map(v => {
        v.map((v1,i) =>{
            if(v.length-1 !== i)
                final += v1+",";
            else
                final += v1;
        })
        final += "\n";
    })
    if(final===trainString) final="";
    else trainString=final
    return final;
}

const CSVtoJson = async (filePath) => {
    const result = await csv(filePath).fromFile(filePath)
    return result
}

async function saveDataToCSV(){
    var final = await readTrainData("Train");
    var path = 'train.csv';
    fs.open(path, 'a', function(err, fd) {
        if(err) {
            //console.log('Cant open file');
        }else {
            fs.write(fd, final, (err, bytes)=>{
                if(err) console.log(err.message);
            })
        }
    });
    saveTrainDataToDB(path);
}

async function saveTrainDataToDB(){
    var jsonArr = await CSVtoJson("./train.csv");
    jsonArr.map(async js =>{
        const m = await Train.findOne({index: js.index});
        if(m===null){
            const Mess = new Train(js);
            await Mess.save();
        }
        else
        await Train.findOneAndUpdate({ "_id": m._id}, {"$set": {"id": js.id, "index": js.index, "name": js.name , "weekDays" : js.weekDays , "stations" : js.stations}});
    })
}


nodeCron.schedule("*/10 * * * * *", async function () {
    try {
        await saveDataToCSV();
    } catch (error) {
        console.log(error)
    }
});

app.post('/register',async (req,res)=>{
    try {
        const { phoneNum } = req.body;
        let user = await User.findOne({ phoneNum:phoneNum });
        if (user) return res.status(201).json({status:'success' , message: 'Proceed to book tickets.' , user});
        const newUser = new User({ ...req.body});
        user = await newUser.save();
        res.status(200).json({ status:'success', message: `Successfully registered, proceed to book tickets.` , user})
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
});

app.get("/user/:id", async (req,res)=>{
    const user = await User.findById(req.params.id);
    res.send(user)
});

app.get("/train/:id", async (req,res)=>{
    const train = await Train.findById(req.params.id);
    res.send(train)
});

app.get("/trains", async (req,res)=>{
    const trains = await Train.find();
    res.send(trains)
});

app.post("/bookingHistory", async (req,res)=>{
    const id = req.body.userId
    const user = await User.findById(id);
    let bookedTrains = []
    let len = user.bookings.length
    for(var i = 0 ; i < len ; i++){
        let train = await Train.findById(user.bookings[i].trainId);
        let booked =  {trainDetails : train,bookingDetails : user.bookings[i]};
        bookedTrains[i]=booked
    }
    // user.bookings.map(async (booking,i) =>{
    //     let train = await Train.findById(booking.trainId);
    //     let booked =  {
    //         trainDetails : train,
    //         bookingDetails : booking
    //     }
    //     // console.log(bookedTrains)
    //     bookedTrains[i]=booked
    //     console.log(i,bookedTrains.length-i,bookedTrains.length)
    //     if ( bookedTrains.length-i === bookedTrains.length) res.status(200).json({bookedTrains})
    // })
    res.status(200).json({bookedTrains})
    // console.log(bookedTrains)
});

app.post("/train/data", async(req, res) => {
    try{
        const {fromStation , toStation} = req.body
        console.log(fromStation , toStation)
        let trains = await Train.find();
        let reqtrains = []
        let c = 0
        trains.map(singletrain=>{
            console.log(singletrain)
            if(singletrain.stations.includes(fromStation) && singletrain.stations.includes(toStation)){
                reqtrains[c]=singletrain
                c++
            }
        })
        console.log(reqtrains)
        if(reqtrains.length === 0) res.status(500).json({"message": "No trains found for this route"})
        else res.status(200).json({"message": "trains present" , reqtrains})
    } catch(err){
        res.status(405).json({err})
    }
})

app.post("/bookTrain", async(req, res) => {
    try{
        const {trainId , userId , bookingdate , bookedSeat} = req.body;
        const user = await User.findById(userId);
        const train = await Train.findById(trainId);
        let noOfBookings = 0
        if(user.bookings.length !== 0){
            user.bookings.map(singleBooking =>{
                if (singleBooking.trainId === trainId) noOfBookings++;
            })
        }
        if ( noOfBookings === 6) res.status(500).json({message: "maximum seats are already booked"})
        let modBookings = user.bookings
        let newBook = {
            trainId: train._id,
            date: bookingdate,
            seat: bookedSeat
        }
        modBookings.push(newBook)
        const newBooking = await User.findOneAndUpdate({ "_id": userId}, {"bookings": modBookings});
        res.status(200).json({message: "Booked successfully",newBooking})
    } catch(err) {
        res.send({err: err})
    }
})


app.listen(PORT, () => console.log('Server running on '+PORT));