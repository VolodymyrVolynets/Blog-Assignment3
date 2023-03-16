const express=require('express')
const router=express.Router()
router.get("/",(req,res)=>{
    res.render('pages/home');
})

router.get("/error",(req,res)=>{
    res.send('Error')
})

// //Error
// router.get('*', function(req, res, next) {
//     res.status(404);
  
//     // respond with html page
//     if (req.accepts('html')) {
//       res.send('Error');
//       return;
//     }
  
//     // respond with json
//     if (req.accepts('json')) {
//       res.json({ error: 'Not found' });
//       return;
//     }
  
//     // default to plain-text. send()
//     res.type('txt').send('Not found');
//   });

module.exports = router;