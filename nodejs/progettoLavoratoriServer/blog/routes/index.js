var express = require('express');
var router = express.Router();
const MongoClient=require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27019/?directConnection=true'; // Replace with your sharded MongoDB connection strings
const bodyParser = require('body-parser');
var parsebody=express.urlencoded({extended:true})

const client=new MongoClient(uri);

const cors = require('cors');
const { ObjectId } = require('mongodb');

router.use(cors());

const multer = require('multer');

const path = require('path');

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  client.connect()
  .then(()=>{
    console.log("Connected correctly to server");
    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("postBlog");

    return collection.find({}).toArray();
  })
  .then(documents=>{
    console.log("Contuenuto della collection prodotti: ");

    console.log(documents);

    res.render('index', { title: 'Express', posts : documents, username : req.query.username});
    
  })
  .catch(err=>{
    console.log(err);
  })
  .finally(()=>{
    client.close();
  });
});

router.get('/admin', function(req, res, next) {
  client.connect()
  .then(()=>{
    console.log("Connected correctly to server");
    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("postBlog");

    return collection.find({}).toArray();
  })
  .then(documents=>{
    console.log("Contuenuto della collection prodotti: ");

    console.log(documents);

    res.render('admin', { title: 'Admin', data : documents});
    
  })
  .catch(err=>{
    console.log(err);
  })
  .finally(()=>{
    client.close();
  });
});

router.post('/admin', upload.single('immagine'), function(req, res, next) {
  console.log(req.body);

  var titoloArticolo = req.body.titolo;
  var contenutoArticolo = req.body.contenuto;
  var immagine= req.file.filename;

  console.log(titoloArticolo);
  console.log(contenutoArticolo);
  console.log(immagine);

  client.connect()
  .then(()=>{
    console.log("Connected correctly to server");
    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("postBlog");

    var articolo = {
      titolo: titoloArticolo,
      contenuto: contenutoArticolo,
      immagine: immagine,
      commenti: [],
      risposte: []
    }

    return collection.insertOne(articolo);
  })
  .then(documents=>{
    console.log("Contuenuto della collection prodotti: ");

    console.log(documents);
    
  })
  .catch(err=>{
    console.log(err);
  });
  res.redirect('/admin');
});

router.post('/commenti', function(req, res, next) {
  var idPost = req.body.idPost;
  var commento = req.body.commento;
  var username = req.query.username;

  console.log(idPost);
  console.log(commento);

  var idPost = new ObjectId(idPost);

  client.connect()
  .then(()=>{
    console.log("Connected correctly to server");
    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("postBlog");

    return collection.updateOne(
      { _id: idPost },
      { $push: { commenti: commento } }
    );
  })

  res.redirect('/?username=' + username);
});

router.post('/risposte', function(req, res, next) {
  var idPost = req.body.idPost;
  var risposta = req.body.risposta;

  console.log(idPost);
  console.log(risposta);

  var idPost = new ObjectId(idPost);

  client.connect()
  .then(()=>{
    console.log("Connected correctly to server");
    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("postBlog");

    return collection.updateOne(
      { _id: idPost },
      { $push: { risposte: risposta } }
    );
  })

  res.redirect('/admin');
});

module.exports = router;