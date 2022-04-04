# ticketing-train

# Github Link - https://github.com/yashpritwani/ticketing-train

# Hosted Frontend Link - https://ticketing-train.netlify.app/

# Hosted backend link - https://ticketing-train.herokuapp.com/


# Backend :-
# 1. Install dependencies using :- npm i
# 2. Start server using npm start

# Frontend :-
# 1. Install dependencies using :- npm i
# 2. Start server using npm start

# Frontend will start on localhost:3000 and backend runs on localhost:5000

# Spreadsheet link used to feed data for train journeys - https://docs.google.com/spreadsheets/d/1Oqtjz3IictMrpH4BYdxCmb1OutJfHQxcduqdrO4qHZ4/edit#gid=0

# Data is fetched dynamically from spreadsheet every 1 minute

# Data fetched from Spreadsheet passes to mongo db databse and is then represented on UI in realtime basis

# .env can be made with the following 2 fields and addded to folder of backend for backend testing :-

# SPREADSHEET_ID= //Document ID
# MONGO_LOCAL_CONN_URL= //Conn URL of Mongo DB


# Using the app is simple :-

## 1. Open the home page 
## 2. Fill the details , click on register
## 3. Check on train list which is dynamically fetched from google sheet through databse layer
## 4. Book ticket of any if you want
## 5. For filttering use Find Train button and selct stations
## 6. List of trains having stations is returned , book ticket for any
## 7. Click on View details in table to see stations of train
## 8. Click on Booked Tickets to check on booked tickets for any train
## 9. Try booking tickets random numbers are genereated for seats
## 10. At max 6 seats can be booked in one train by single user 



### ------------------------ THANKS - THE END --------------------------
