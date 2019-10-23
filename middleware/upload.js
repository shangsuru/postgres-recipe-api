const multer = require('multer')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpg')
  }
})

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

module.exports = upload