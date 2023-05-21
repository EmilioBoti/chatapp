const mysql = require("../../db/dbConnection")
const { updateImageQuery } = require("./profileQueries")


const cloudinary = require("cloudinary").v2
cloudinary.config({ secure: true })



const updateIemageDb = (userId, { public_id, secure_url }, callBackFun) => {
    try {
        mysql.query(updateImageQuery, [public_id, secure_url, userId], (err, result) => {
            if (err) throw err
            callBackFun(true)
        })
    } catch (error) {
        callBackFun(false)
    }
}

const uploadImageCloudinary = async (file) => {

    const options = {
        user_filename: true,
        unique_filename: true,
        overrite: true,
    }

    try {
        const result = await cloudinary.uploader.upload(file.path, options)
        return result

    } catch (error) {
        console.error(error)
        return null
    }
}

module.exports = {
    uploadImageCloudinary,
    updateIemageDb,
    cloudinary
}