const express=require('express')
const router=express.Router()
router.get("/",(req,res)=>{
    res.render('pages/home');
})

router.get("/auth",(req,res)=>{
    res.send('Auth')
})


module.exports = router;