const routes = require('express').Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


//authnectication
const validationSignup = require('../middlewares/validationSignup');
const validationLogin = require('../middlewares/vakidationLogin');
const signup = require('./auth/Signup');
const login = require('./auth/Login');
const logout = require('./auth/Logout');
const profile = require('./auth/Profile');

//notes
const AddNote = require('./notes/AddNotes')
const getNotes = require('./notes/GetNotes')
const deleteNote = require("./notes/DeleteNote");
const updateNote = require("./notes/UpdateNote");

//folders
const addFolder = require("./folders/AddFolder");
const getFolders = require("./folders/GetFolders");
const updateFolder = require("./folders/UpdateFolder");
const deleteFolder = require("./folders/DeleteFolder");
const deleteFolderFile = require("./folders/DeleteFolderFile");

//home
const getRecent = require("./home/GetRecent");
const search = require("./home/Search");

//activity
const getAcitity = require('./activitylog/GetActivity');

//face
const saveFace = require('./face/SaveFace');
const verifyFace = require('./face/VerifyFace');

//trash
const getTrash = require('./trash/GetTrash');
const restoreItem = require('./trash/Restore');
const deleteForever = require('./trash/DeleteForever');


const verifyToken = require('../utils/VerifyToken');
const { isAllowedFile, MAX_FILE_SIZE } = require('../utils/allowedFiles');
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 25 * 1024 * 1024 }
});

const folderUpload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
  fileFilter: (req, file, cb) => {
    if (isAllowedFile(file)) {
      return cb(null, true);
    }
    const err = new Error(`Unsupported file type: ${file.originalname}`);
    err.code = "UNSUPPORTED_FILE_TYPE";
    cb(err);
  }
});



//auth
routes.post("/signup", validationSignup, signup);
routes.post("/login", validationLogin, login);
routes.post("/logout", verifyToken, logout);
routes.get("/profile", verifyToken, profile);

//face
routes.post("/saveface", verifyToken, saveFace);
routes.post("/verifyface", verifyToken, verifyFace);

//search
routes.get("/search", verifyToken, search);

//notes
routes.post("/addnote", verifyToken, upload.array('files', 10), AddNote);
routes.post("/updatenote/:id", verifyToken, upload.array('files', 10), updateNote);
routes.get("/getnotes/:type{/:id}", verifyToken, getNotes)
routes.delete("/deletenote/:id", verifyToken, deleteNote);

//folders
routes.post("/addfolder", verifyToken, folderUpload.array('files', 10), addFolder);
routes.post("/updatefolder/:id", verifyToken, folderUpload.array('files', 10), updateFolder);
routes.get("/getfolders/:type{/:id}", verifyToken, getFolders);
routes.delete("/deletefolder/:id", verifyToken, deleteFolder);
routes.delete("/deletefolderfile/:id/:index", verifyToken, deleteFolderFile);

//trash
routes.get("/trash", verifyToken, getTrash);
routes.post("/restore/:type/:id", verifyToken, restoreItem);
routes.delete("/deleteforever/:type/:id", verifyToken, deleteForever);

//home
routes.get("/getrecent", verifyToken, getRecent);

//activity
routes.get("/getactivity", verifyToken, getAcitity);


module.exports = routes