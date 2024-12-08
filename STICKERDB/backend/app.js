const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stickerRoutes = require("./routes/stickerRoutes");
const mongoose = require('mongoose');
const app = express();
const path = require('path');

app.use(cors());

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname,'uploads')));

app.use('/', stickerRoutes);

app.get('/', (req,res) =>{
  res.send('Backend Server is Running');
});
mongoose.connect('mongodb://localhost:27017/stickerdb',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then()
  .catch(error => console.error('Error Connecting to MongoDB: ',error));

const PORT = 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
})