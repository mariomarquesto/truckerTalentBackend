const express = require("express");
const pool = require("../db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadToS3, deleteFromS3, getOriginalFileNameFromUrl } = require("../util/aws-access");
const verifyToken = require("../middleware/authenticationToken");

function createFileRoutes({ folder, column }) {
  const subRouter = express.Router();

  // POST - subir archivo
  subRouter.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, originalname, mimetype } = req.file;
    const userEmail = req.user.email;
    console.log("User Email at POST request: ", userEmail);
    const s3Url = await uploadToS3(buffer, originalname, mimetype, folder, userEmail);
    
    const { rows } = await pool.query("SELECT * FROM documents WHERE user_email = $1", [userEmail]);
    if (rows.length === 0){
      await pool.query(`INSERT INTO documents (user_email, ${column}) VALUES ($1, $2)`, [userEmail, s3Url]);
    } else {
      await pool.query(`UPDATE documents SET ${column} = $1 WHERE user_email = $2`, [s3Url, userEmail]);
    }

    res.json({ message: 'File uploaded successfully', fileUrl: s3Url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

  // GET - obtener URL
  subRouter.get('/get', verifyToken, async (req, res) => {
    try {
      const userEmail = req.user.email;
      const { rows } = await pool.query(`SELECT ${column} FROM documents WHERE user_email = $1`, [userEmail]);

      if (!rows[0] || !rows[0][column]) {
        return res.status(404).json({ message: 'File not found' });
      }

      const fileUrl = rows[0][column];
      const originalName = getOriginalFileNameFromUrl(fileUrl, userEmail, folder);
      res.json({ fileUrl, originalName });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching file' });
    }
  });

  // PUT - reemplazar archivo
  subRouter.put('/update', verifyToken, upload.single('file'), async (req, res) => {
    try {
      const { buffer, originalname, mimetype } = req.file;
      const userEmail = req.user.email;

      const s3Url = await uploadToS3(buffer, originalname, mimetype, folder, userEmail);
      await pool.query(`UPDATE documents SET ${column} = $1 WHERE user_email = $2`, [s3Url, userEmail]);

      res.json({ message: 'File updated successfully', fileUrl: s3Url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error updating file' });
    }
  });

// DELETE - eliminar archivo
subRouter.delete('/delete', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { rows } = await pool.query(`SELECT ${column} FROM documents WHERE user_email = $1`, [userEmail]);

    if (!rows[0] || !rows[0][column]) {
      return res.status(404).json({ message: 'No file to delete' });
    }

    const fileUrl = rows[0][column];
    await deleteFromS3(fileUrl);

    // Clean photo_profile column in documents table
    await pool.query(`UPDATE documents SET ${column} = NULL WHERE user_email = $1`, [userEmail]);

    // Clean photo column in users table
    if (folder === "photos") {
      await pool.query(`UPDATE users SET photo = NULL WHERE email = $1`, [userEmail]);
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

  return subRouter;
}

module.exports = createFileRoutes;