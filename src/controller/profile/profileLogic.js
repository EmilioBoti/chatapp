const jwt = require("jsonwebtoken")

const { removeBearerToken } = require("./../utils/helpers")
const  { uploadImageCloudinary, updateIemageDb } = require("./profileService")



const uploadProfileImage = async (req, res) => {
    const file = req.file

    const token = removeBearerToken(req.headers.authorization)
    const verified = jwt.verify(token, process.env.JWTKEY)
    
    const image = await uploadImageCloudinary(file)
    
    updateIemageDb(verified.id, image, (data) => {
        if(image) {
            res.status(201).json(data)
        } else {
            res.status(500).json(da)
        }
    })

}


module.exports = {
    uploadProfileImage
}