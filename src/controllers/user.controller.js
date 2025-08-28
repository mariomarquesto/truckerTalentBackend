const userService = require('../services/user.service');


exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error al obtener todos los usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};


exports.getUserInfo = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "No se recibió un Id válido" });
  }

  try {
    const data = await userService.getUserInfo(id);
    if (!data.info) {
      return res.status(404).json({ message: "No info found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error while retrieving user info" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, surname, email, phone, city, state, zipCode, photo, position, aboutMe } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required to update profile" });

    const result = await userService.updateUserProfile({ name, surname, email, phone, city, state, zipCode, photo, position, aboutMe });
    res.status(200).json({ message: "Profile updated successfully", result });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

exports.updatePhoto = async (req, res) => {
  const { newPhotoUrl } = req.body;
  const userEmail = req.user?.email;
  if (!newPhotoUrl || !userEmail) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const updated = await userService.updateUserPhoto(userEmail, newPhotoUrl);
    res.status(200).json({ message: "Photo updated", user: updated });
  } catch (err) {
    console.error("Error updating photo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getContactInfo = async (req, res) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Falta el parámetro email" });
  }

  try {
    const user = await userService.getUserProfileByEmail(email);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserPersonalInfo = async (email) => {
  if (!email) throw new Error("Falta el parámetro email");

  const user = await userService.getUserProfileByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");

  return user;
};

// exports.getContactInfo = async (req, res) => {
//   const { email } = req.query;
//   if (!email) return res.status(400).json({ error: "Email is required" });

//   try {
//     const user = await userService.getUserProfileByEmail(email);
//     if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

//     res.status(200).json(user); // Esto es lo que tu frontend espera
//   } catch (error) {
//     console.error("Error fetching contact info:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


