const Match = require('../models/Match');

const postLike= async(req,res)=>{
    const {likedby, likedto} = req.body;
    await findOneAndUpdate({likedby,likedto})


}

const getLike= async(req,res)=>{
    const {likedby, likedto} = req.body;
    await findOneAndUpdate({likedby,likedto})


}

module.exports={
    postLike,getLike
}