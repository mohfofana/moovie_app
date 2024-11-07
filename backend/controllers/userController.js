// streaming-site/controllers/userController.js

import User from '../models/User.js';

// Contrôleur pour créer un nouvel utilisateur
export const registerUserController = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erreur lors de l\'inscription de l\'utilisateur.' });
  }
};

// Contrôleur pour obtenir tous les utilisateurs
export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
  }
};
