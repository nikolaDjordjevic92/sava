import App from './App';
import mongoose from 'mongoose';


const port = process.env.PORT;

let mongoDB = process.env.MONGO_DB;
mongoose.connect(mongoDB, {useNewUrlParser: true}).then(() => {
  console.log('Connected to database mongodb');
}).catch((err) => console.log(err));

App.listen(port, (err) => {
  if(err) {
    return console.log(err);
  } 

  return console.log('server is running on '+port);
})