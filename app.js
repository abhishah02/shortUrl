const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./User");
const Link = require("./Link");
var url = require('url');

// const dbURL = process.env.MONGODB_URI;
// const dbName = process.env.DB_NAME;
// const mongoDb = "mongodb://localhost:27017/shortUrl";
// mongodb://localhost:27017
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

// const mongoDb = dbURL + dbName;

// console.log(mongoDb);

mongoose
  .connect("mongodb://127.0.0.1:27017/shortUrl", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.log("Error : ", err));

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.create({ username: username, password: password });

    return res.status(201).json({ msg: "success" });
  } catch (err) {
    return res.json({
      st: true,
      msg: err,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // console.log(username, password);
    const user = await User.findOne({ username: username });
    console.log(user);
    if (user === null) {
      return res.json({
        st: true,
        msg: "User Not Register",
      });
    }
    const pass = await User.findOne({ password: password });

    if (pass === null) {
      return res.json({
        st: true,
        msg: "Password Not match or invalid",
      });
    }

    return res.json({
      st: true,
      msg: "Login Succcessfully",
    });
  } catch (err) {
    return res.json({
      st: false,
      msg: err,
    });
  }
});

app.post("/createShortURL", async (req, res) => {
  const { url, uid } = req.body;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortenUrl = "";
  let shortUrl = "";
  for (let i = 0; i < 8; i++) {
    shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  shortenUrl = `${req.protocol}://${req.host}:${PORT}/${shortUrl}`;
  shortUrl = `${shortUrl}`;

  // console.log(url, "->", shortUrl);
  await Link.create({
    url: url,
    shortUrl: shortUrl,
    shortenUrl: shortenUrl,
    click: 0,
    uid: uid,
  });

  return res.json({
    st: true,
    msg: "Created",
  });
});

app.get("/getAll", async (req,res) => {
  console.log("1"+req.protocol);
  console.log("2"+req.host);

  return res.json({st:true,msg:"done"})
})

app.get("/update/:shortenUrl", async (req, res) => {
  const shortenUrl = req.params.shortenUrl;

  const url = await Link.findOne({ shortUrl: shortenUrl });
  console.log(url);

  if (!url) {
    return res.status(404).send("Not found");
  }

  let updateCount = parseInt(url.click) + 1;

  console.log(updateCount);
  // return res.json({ st: true, msg: "Count Added" });
  await Link.findOneAndUpdate(url._id, { click: updateCount });

  res.redirect(url.url);
});

app.get("/getAllUrl", async (req, res) => {
  const allURL = await Link.find({ isDelete: 0 });

  return res.json({ st: true, data: allURL });
});

app.get("/getUrlById/:id", async (req, res) => {
  const { id } = req.params;
  const IdByLink = await Link.findById(id);
  return res.json({ st: true, data: IdByLink });
});
app.post("/updateClickCount/", async (req, res) => {
  const { id } = req.body;
  const getCount = await Link.findOne({ _id: id });
  // console.log(getCount.click);

  let updateCount = parseInt(getCount.click) + 1;
  await Link.findOneAndUpdate(id, { click: updateCount });
  return res.json({ st: true, msg: "Count Added" });
});

app.post("/deleteURL", async (req, res) => {
  const { id } = req.body;
  await Link.findOneAndUpdate(id, { isDelete: 1 });

  return res.json({
    st: true,
    msg: "Deleted",
  });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
