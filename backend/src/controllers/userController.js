const User = require("../models/user.js");
const axios = require("axios");

//for testing purpose
const keycloakurl=process.env.KEYCLOAK_URL || "http://localhost:8080";
const keycloakrealm=process.env.KEYCLOAK_REALM || "Proxym-IT";

//to update the user in the database
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email,phone } = req.body;
    console.log(name, email,phone)
    const user = await User.findByIdAndUpdate(userId, { name, email,phone }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


//to Create or update user in the database
exports.createUserFromKeycloak = async (req, res) => {
  try {
    const { email, name,sub } = req.kauth.grant.access_token.content;
    let user =await User.findOne({email:email});
    // Check if the user already exists in the database
    if (user != null) {
      return res.status(200).json({ message: "User already exists", existingUser: user });
    }else{
      //create new user
      user = new User({
        keyId: sub,
        name: name,
        email: email,
      });
      await user.save();
    }
    return res.status(201).json({ message: "User created  successfully" , userInfo: user });
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return res.status(500).json({ message: "Error creating or updating user", error: error.message });
  }
};



// to get data raw from keycloak
exports.getCurrentKeycloakUser = async (req, res) => {
  try {
    if (!req.kauth || !req.kauth.grant) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const token = req.kauth.grant.access_token.content;
    const keycloakId = token.sub; // Keycloak user ID
    const email = token.email;
    const name = token.name;
    const roles = token.realm_access?.roles || [];

    const user = await User.findOne({ email: email });
   
    return res.status(200).json({
      keyId: keycloakId, // Keycloak ID
      email: email,
      roles: roles,
      name: name,
      user: user,
      
    });

  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//to get user form DB by id
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};






// exports.updateUserDetails = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { name, email, numTel } = req.body;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (name) {
//       user.name = name;
//     }
//     if (email) {
//       user.email = email;
//     }
//     if (numTel) {
//       user.phone = numTel;
//     }
//     await user.save();
//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating user", error: error.message });
//   }
// };
