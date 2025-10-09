import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      // Accept only images
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        return cb(null, true)
      }
      cb(new Error("Only image files are allowed"))
    }, 
})
