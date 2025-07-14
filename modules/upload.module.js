import AWS from 'aws-sdk'
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})
const fileFilter = (req, file, cb) => {
    const allowed = /jpg|jpeg|png|gif/;
    const ext = path.extname(file.originalname).toLowCase();
    if(allowed.text(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Allow only images file'), false);
    }
}

const upload = multer({
    storage: multerS3({ 
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = Date.now() + '-' + file.originalname;
            cb(null, fileName)
        }
    }),
    fileFilter
});

export default upload;
