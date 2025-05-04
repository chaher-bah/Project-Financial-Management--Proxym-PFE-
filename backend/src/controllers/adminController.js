const User = require("../models/user.js");
const axios = require("axios");
const Roles = require("../config/roles.js");

//to get all database users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};



// get keycloak users from keycloak directly
exports.getKeycloakUsers = async (req, res) => {
  const accessToken = req.kauth.grant.access_token.token;
  const iss= req.kauth.grant.access_token.content.iss;
  const baseUrl = iss.split('/realms')[0];
  const realm = iss.split('/realms/')[1];
  try {
    const request = await axios.get(
      `${baseUrl}/admin/realms/${realm}/users`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

      }
    );
    if (request.status !== 200) {
      return res.status(417).json({ message: "Error fetching users" });
    }else{
      const result= request.data;
    
    res.status(200).json({ message: "Users fetched successfully", result });}
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error syncing users", error: error.message });
  }
};

//get Keyckloak realm roles
exports.getKeycloakRealmRoles = async (req, res) => {
  const accessToken = req.kauth.grant.access_token.token;
  const iss= req.kauth.grant.access_token.content.iss;
  const baseUrl = iss.split('/realms')[0];
  const realm = iss.split('/realms/')[1];
  try {
    // Get all roles from our database

    
    // Get all roles from Keycloak
    const request = await axios.get(
      `${baseUrl}/admin/realms/${realm}/roles`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (request.status !== 200) {
      return res.status(417).json({ message: "Error fetching roles" });
    } else {
      const allKeycloakRoles = request.data;
      
      // Filter Keycloak roles to only include those that exist in our local roles
      const filteredRoles = allKeycloakRoles.filter(role => 
        Roles.includes(role.name)
      );
      
      res.status(200).json({ 
        message: "Roles fetched successfully", 
        result: filteredRoles 
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error syncing roles", error: error.message });
  }
};
//add role to keycloak realm
exports.addKeycloakRealmRole = async (req, res) => {
  const accessToken = req.kauth.grant.access_token.token;
  const iss= req.kauth.grant.access_token.content.iss;
  const baseUrl = iss.split('/realms')[0];
  const realm = iss.split('/realms/')[1];
  try {
    const { name } = req.body;

    console.log("role name",baseUrl,realm,name);
    const response = await axios.post(
      `${baseUrl}/admin/realms/${realm}/roles`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.status(201).json({ message: "Role created successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
};

//to delete user from DB by id
exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const user= await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  };
  // to get keycloak user token
  exports.getKeycloakAdminToken = async function() {
    try{
      const response = await axios.post('http://localhost:8080/realms/Proxym-IT/protocol/openid-connect/token', {
        'grant_type': 'password',
        'client_id': 'pfeFRONT',
        'username': 'paypalbahrichaher@gmail.com',
        'password': 'admin',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token;
    } catch(error){
      throw new Error("Error fetching Keycloak admin token:", error);
    }
  };

