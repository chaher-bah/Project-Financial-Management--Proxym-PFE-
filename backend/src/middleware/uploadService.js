// const multer = require('multer')
// const path = require('path')

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../../uploads'))
//     },
//     filename: (req, file, callback) => {
//         // Assuming req.user.name is available from your authentication middleware
//         const userName = req.kauth.grant.access_token.content ? req.kauth.grant.access_token.content.name : 'unknown'
        
//         // Get current date and format it
//         const date = new Date()
//         const formattedDate = date.toISOString().substring(0, 13).replace('T', 'H')
        
//         callback(null, userName + '-' + '(' + formattedDate + ')'+'-'+file.originalname)
//     }
// })
// const upload = multer({ storage: storage })
// module.exports = upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get username from authentication
        const userName = req.kauth.grant.access_token.content ? req.kauth.grant.access_token.content.name : 'unknown';
        
        // Format date for folder name
        const date = new Date();
        const formattedDate = date.toISOString().substring(0, 13).replace('T', 'H');
        
        // Create folder name with username and date
        const folderName = `${userName}-${formattedDate}`;
        
        // Full path to new folder
        const uploadPath = path.join(__dirname, '../../uploads', folderName);
        
        // Create folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        // Pass the custom folder path
        cb(null, uploadPath);
    },
    filename: (req, file, callback) => {
        // Just use the original filename since we're now organizing in folders
        callback(null, file.originalname);
    }
});
//to store new file versions
const storageVersion = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get the original file name from request params
        const { fileName } = req.params;
        const {uploadId} = req.params;

        // Create a versions folder for this specific file
        const versionsFolder = `${path.parse(fileName).name}-${(uploadId.slice(-5))}-VERSIONS`;
        
        // Full path to versions folder
        const uploadPath = path.join(__dirname, '../../uploads', versionsFolder);
        
        // Create folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        // Pass the versions folder path
        cb(null, uploadPath);
    },
    filename: (req, file, callback) => {
        // Get firstname and lastname from request body
        const userName = req.kauth.grant.access_token.content ? req.kauth.grant.access_token.content.name : 'unknown';
                const date = new Date();
                const formattedDate = date.toISOString().substring(5, 13).replace('T', 'H');
        // Extract the file's base name and extension
        const fileBase = path.parse(file.originalname).name;
        const fileExt = path.parse(file.originalname).ext;
        // Create filename with pattern: <originalNew-base>-<firstName>-<familyName>.<ext>
        const versionFileName = `${fileBase}-${userName}-(${formattedDate})${fileExt}`;
        
        callback(null, versionFileName);
    }
});

// Create a specific upload middleware for versions
const uploadVersion = multer({ storage: storageVersion });
const upload = multer({ storage: storage });

// Export both middlewares
module.exports = { 
    upload, 
    uploadVersion 
};



