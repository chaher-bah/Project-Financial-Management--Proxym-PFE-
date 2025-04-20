const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: (req, file, callback) => {
        // Assuming req.user.name is available from your authentication middleware
        const userName = req.kauth.grant.access_token.content ? req.kauth.grant.access_token.content.name : 'unknown'
        callback(null, userName + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })
module.exports = upload