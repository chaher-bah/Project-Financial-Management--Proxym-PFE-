const User = require("../models/user.js");
const axios = require("axios");
const avatar=("../../../frontend/public/myAvatar.png");
const admincontroller = require("./adminController.js");


// Function to update the user in Keycloak
async function updateKeycloakUser(keycloakUserId, newName,newFamilyName, token) {
  try {
    await axios.put(`http://localhost:8080/admin/realms/Proxym-IT/users/${keycloakUserId}`, {
      firstName: newName,
      lastName: newFamilyName,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    throw new Error('Failed to update user in Keycloak');
  }
}
// Function to find a user in Keycloak
async function findKeycloakUser(email, token) {
  try {
    const response = await axios.get(`http://localhost:8080/admin/realms/Proxym-IT/users?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("keycloak user",response);
    return response.data[0]; // Returns the first matching user
  } catch (error) {
    throw new Error('Failed to find user in Keycloak');
  }
}


//to update the user info in the database
exports.updateUser = async (req, res) => {
  
  try {
    const { userId } = req.params;
    const { firstName,familyName,phone } = req.body;
    const user = await User.findByIdAndUpdate(userId, { firstName,familyName,phone }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //update in keycloak
    const token = await admincontroller.getKeycloakAdminToken();
    const keyUser= await findKeycloakUser(req.kauth.grant.access_token.content.email, token)
    if (keyUser) {
      await updateKeycloakUser(keyUser.id,firstName,familyName, token); // Update name in Keycloak
    } else {
      console.warn('User not found in Keycloak');
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


//to update the user photo in the database
exports.updateUserPhoto = async (req, res) => {
  try {
    const { email } = req.params;
    const { photo } = req.body; // Assuming the photo is sent in the request body
    const user = await User.findOneAndUpdate({ email }, { photo }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User photo updated successfully", user });
  } catch (error) {
    console.error("Error updating user photo:", error);
    res.status(500).json({ message: "Error updating user photo", error: error.message });
  }
};

//to get the user photo from the database
exports.getUserPhoto = async (req, res) => {
  try {
    const { email } = req.params; 
    const user = await User.findOne({ email });
    if (!user || !user.photo) {
      return res.status(404).json({ message: "User photo not found" });
    }
    const buf = Buffer.from(user.photo);
    const type="image/png";
    return res.json({ image: `data:${type};base64,${buf.toString("base64")}` });
  } catch (error) {
    console.error("Error fetching user photo:", error);
    return res.status(500).json({ message: "Error fetching user photo", error: error.message });
  }
};


//to Create or update user in the database
exports.createUserFromKeycloak = async (req, res) => {
  try {
    const { email, firstName,familyName,sub } = req.kauth.grant.access_token.content;
    let user =await User.findOne({email:email});
    // Check if the user already exists in the database
    if (user != null) {
      // If the user exists, update their information
      user.keyId = sub;
      user.firstName = firstName;
      user.familyName= familyName;
      user.email = email;
      // user.photo = avatar;
      await user.save();
      return res.status(200).json({ message: "User already exists", existingUser: user });
    }else{
      //create new user
      user = new User({
        keyId: sub,
        firstName: firstName,
        familyName:familyName,
        email: email,
        // photo: avatar,
      });
      await user.save();
    }
    return res.status(201).json({ message: "User created  successfully" , userInfo: user });
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return res.status(500).json({ message: "Error creating or updating user", error: error.message });
  }
};



// to get data raw from keycloak`
exports.getCurrentKeycloakUser = async (req, res) => {
  try {
    if (!req.kauth || !req.kauth.grant) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const token = req.kauth.grant.access_token.content;
    const keycloakId = token.sub; // Keycloak user ID
    const email = token.email;
    const familyName = token.familyName;
    const firstName =token.firstName;
    const roles = token.realm_access?.roles || [];

    const user = await User.findOne({ email: email });
   
    return res.status(200).json({
      keyId: keycloakId, // Keycloak ID
      email: email,
      roles: roles,
      firstName:firstName,
      familyName:familyName,
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
/// to get user form DB by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });
    // const base64= Buffer.from(user.photo).toString('base64');
    // const imageUrl = `data:image/png;base64,${base64}`;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // user.photo=imageUrl;
    res.status(200).json({ message: "User fetched successfully", user });
  }
  catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
}

//sync user data with keycloak and DB

exports.syncUser = async (req, res) => {
  try {
    const keycloakUser = req.kauth.grant.access_token.content; // Keycloak token data
    const existingUser = await User.findOne({ email: keycloakUser.email });
    // Merge data: DB values take priority over Keycloak values
    const userData = {
      firstName: existingUser?.firstName || keycloakUser.given_name,
      familyName: existingUser?.familyName || keycloakUser.family_name,
      email: keycloakUser.email,
      keyId: keycloakUser.sub,
      phone: existingUser?.phone || '',
      groupe: existingUser?.groupe || 'Not Assigned',
      role: keycloakUser.realm_access?.roles || existingUser?.role ||  [],
    };
    const user = existingUser 
      ? await User.findByIdAndUpdate(existingUser._id, userData, { new: true })
      : await User.create(userData);

    res.status(200).json({ message: "User synced successfully", user });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: "Error syncing user", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({message:"users from DB",users:users});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
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
