var express = require('express');
var router = express.Router();
var path=require('path');

/* GET home page. */
router.get('/', function(req, res) {

  res.render('index', { title: 'Express' });
});

router.get('/tasks/listoftasks/:todolistid', function(req, res) {
   res.sendfile(path.resolve('./views','listoftasks.html'),(err)=>{
    console.log(err);
  });
});

router.get('/tasks/listoftasks/listoftaskopen/listoftasks.js', function(req, res) {
  res.sendfile(path.resolve('./views','listoftasks.js'),(err)=>{
    console.log(err);
  });
});

router.get('/edit/opentaskitems/:todoitemid', function(req, res) {
  res.sendfile(path.resolve('./views','./opentaskitem/opentaskitems.html'),(err)=>{
    console.log(err);
  });
});

router.get('/edit/opentaskitems/taskopen/opentaskitems.js', function(req, res) {
  res.sendfile(path.resolve('./views','./opentaskitem/opentaskitems.js'),(err)=>{
    console.log(err);
  });
});

module.exports = router;
