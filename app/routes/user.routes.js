const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth.jwt')

router.get('/', async (req, res) => {
   try {
    const users = await User.find()
    res.json(users)
   } catch (err) {
    res.status(500).json({ message: err.message })
   }
})

router.get('/:id', getUser , (req, res) => {
    res.json(res.user)
})

// router.get("/allusers", (req, res) => {
//     User.find((err, users) => {
//         if (err) return res.status(400).json("Error: " + err);
//         if (!users) return res.status(404).json({ message: "No users found" });

//         if (req.params.userid === "allusers") {
//             let allUsers = [];
//             for (let i = 0; i < users.length; i++) {
//                 allUsers.push(users[i].userid);
//             }
//             return res.json(allUsers);
//         } else {
//             User.findById(req.params.userid, (err, user) => {
//                 if (err) return res.status(400).json("Error: " + err);
//                 if (!user) return res.status(404).json({ message: "User not found" });
//                 return res.json(user);
//             });
//         }
//     });
// });

router.get('/', async (req, res) => {
    try {
    const users = await User.find()
    res.json(users)
    } catch (err) {
    res.status(500).json({ message: err.message })
    }
    })



router.post('/signup',Duplicates, async (req, res) => {
    try{ 
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = new User({  

                        username: req.body.username,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        gender: req.body.gender,
                        hobbies: req.body.hobbies,
                        occupation: req.body.occupation,
                        password: hashedPassword,
                        address: req.body.address,
                        img: req.body.img
                        
                        })
            const newUser = await user.save()
            res.status(201).json(newUser)
            console.log(salt)
            console.log(hashedPassword)
    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.post('/signin', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      const token = await jwt.sign({ _id: user._id, post: user.post }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        occupation: user.occupation,
        hobbies: user.hobbies,
        gender: user.gender,
        img: user.img,
        accessToken: token,
        join_date: user.join_date,
        _id: user._id

      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

router.patch('/:id',[getUser,verifyToken], async (req, res) => {
    if(req.params.id != req.userId){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.hobbies !=null){
        res.user.hobbies =  req.body.hobbies
    }
    if(req.body.firstname !=null){
        res.user.firstname =  req.body.firstname
    }
    if(req.body.lastname !=null){
        res.user.lastname =  req.body.lastname
    }
    if(req.body.gender !=null){
        res.user.gender =  req.body.gender
    }
    if(req.body.occupation !=null) {
        res.user.occupation = req.body.occupation
    }
    if(req.body.password !=null){
        res.user.password =  req.body.password
    }
    if(req.body.address !=null){
        res.user.address =  req.body.address
    }
    if(req.body.img !=null){
        res.user.img =  req.body.img
    }
    
    try{
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id',[getUser,verifyToken], async (req, res) => {
    try{
        if(req.params.id != req.userId){
            return res.status(401).send({ message: "Unauthorized!" });
        }
        await res.user.remove()
        res.json({ message:'Deleted User'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 


 async function getUser(req, res, next) {
     let user
    try{
        user = await User.findById(req.params.id)
       if(user == null){
           return res.status(404).json({ message:'Cannot find User' })
       } 
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}


async function Duplicates(req, res, next) {
    let user;

    try {
        user = await User.findOne({username: req.body.username});
        if (user) {
            return res.status(404).send({ message: "Username already exists"});
        }
    } catch (err) {
        return res.status(500).send({ message: err.message});
    }

    next();
}


module.exports = router