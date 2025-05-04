const Role = require("../models/role");
const User = require("../models/user");
let Roles = require("../config/roles");
const fs = require("fs").promises;
const path = require("path");



exports.AddRole = async (req, res) => {
    try {
      const { name } = req.body;
      if (!Roles.includes(name)) {
        // Add the role to the local Roles array
        Roles.push(name);
        
        // Update the roles.js file to persist the change
        const rolesFilePath = path.join(__dirname, "../config/roles.js");
        const updatedRolesContent = `const ROLEHIERARCHY = ${JSON.stringify(Roles, null, 2)};\nmodule.exports = ROLEHIERARCHY; // Export the array for use in other files`;
        
        await fs.writeFile(rolesFilePath, updatedRolesContent, "utf8");
    }
      const role = await Role.create({ name });
      return res.status(201).json({
        message: "Rôle créé avec succès",
        role
      });
    } catch (error) {
      console.error("Erreur lors de la création du rôle :", error);
      return res.status(500).json({ message: "Erreur lors de la création du rôle :", error });
    }
  };

exports.getAllRoles = async (req, res) => {
  try {
    const createdRoles = [];

    // Check if default roles exist, create if not
    for (const roleName of Roles) {
      const existingRole = await Role.findOne({ name: roleName });
      if (!existingRole) {
        const newRole = new Role({ name: roleName });
        await newRole.save();
        createdRoles.push(newRole);
        console.log(`Created default role: ${roleName}`);
      }
    }

    // Get all roles from database
    const roles = await Role.find();

    // Add information about newly created roles to the response
    const response = {
      message: "Rôles récupérés avec succès",
      roles,
    };

    if (createdRoles.length > 0) {
      response.createdRoles = createdRoles;
      response.message = `${createdRoles.length} default realm roles created. All roles fetched successfully`;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des rôles :", error });
  }
};
//delete role by name after checking if it is not assigned to any user
// exports.deleteRoleByName = async (req, res) => {
//   try {
//     const { name } = req.params;

//     // Find the role by name
//     const role = await Role.findOne({ name });

//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     // Check if any users have this role
//     const usersWithRole = await User.find({ role: role._id });

//     if (usersWithRole.length > 0) {
//       return res.status(400).json({
//         message: "Cannot delete role as it is assigned to users",
//         usersCount: usersWithRole.length,
//       });
//     }

//     // If no users have this role, delete it
//     await Role.findByIdAndDelete(role._id);

//     return res.status(200).json({ message: "Role deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting role:", error);
//     return res.status(500).json({ message: "Error deleting role", error });
//   }
// };

exports.deleteRoleByName = async (req, res) => {
    try {
      const { name } = req.params;
      // Find the role by name
      const role = await Role.findOne({ name });
      if (!role) {
        return res.status(404).json({ message: "Rôle non trouvé" });
      }
  
      // Check if any users have this role
      const usersWithRole = await User.find({ role: role._id });
  
      if (usersWithRole.length > 0) {
        return res.status(400).json({
          message: "Impossible de supprimer le rôle car il est attribué aux utilisateurs.",
          usersCount: usersWithRole.length,
        });
      }
  
      // If no users have this role, delete it from the database
      await Role.findByIdAndDelete(role._id);
  
      // Remove the role from the ROLEHIERARCHY array
      if (Roles.includes(name)) {
        Roles = Roles.filter(r => r !== name);
  
        // Update the roles.js file to persist the change
        const rolesFilePath = path.join(__dirname, "../config/roles.js");
        const updatedRolesContent = `const ROLEHIERARCHY = ${JSON.stringify(Roles, null, 2)};\nmodule.exports = ROLEHIERARCHY;`;
  
        await fs.writeFile(rolesFilePath, updatedRolesContent, "utf8");
  
        // Update the in-memory Roles array by re-importing the updated file
        delete require.cache[require.resolve("../config/roles")]; // Clear the module cache
        Roles = require("../config/roles"); // Reload the updated ROLEHIERARCHY
      }
  
      return res.status(200).json({ message: "Rôle supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting role:", error);
      return res.status(500).json({ message: "Échec de la suppression du rôle. Veuillez réessayer.", error: error.message });
    }
  };


//get role name by id
exports.getRoleNameById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.find({ _id: { $in: id } }).select("name");
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json({ message: "Role fetched successfully", role });
  } catch (error) {
    console.error("Error fetching role:", error);
    return res.status(500).json({ message: "Error fetching role", error });
  }
};

exports.getRoleNames = async (req, res) => {
  try {
    const { roleIds } = req.body;
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return res
        .status(400)
        .json({ message: "roleIds must be a non-empty array" });
    }

    const roles = await Role.find({ _id: { $in: roleIds } });
    const roleMap = roles;

    res.status(200).json({ message: "Role name", roles }); // e.g., { "60d5f23b...": "Admin", "60d5f24b...": "User" }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des noms de rôle", error: error.message });
  }
};
// Add a role to a user after checking he doesn't have it already
exports.addRoleToUser = async (req, res) => {
    try {
        const { userId, roleName } = req.body;
        if (!userId || !roleName) {
        return res.status(400).json({ message: "L'ID utilisateur et l'ID de rôle sont requis" });
        }
        const roleObj=await Role.findOne({ name: roleName });
        if (!roleObj) {
        return res.status(404).json({ message: "Rôle non trouvé" });
        }
        // Check if the user already has the role
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        if (user.role.includes(roleObj._id)) {
            // If the user already has the role, return an error message
        return res.status(400).json({ message: "L'utilisateur a déjà ce rôle" });
        }
   
    
        // Add the role to the user
        user.role.push(roleObj._id);
        await user.save();
    
        return res.status(200).json({ message: "Rôle ajouté à l'utilisateur avec succès", user });
    } catch (error) {
        console.error("Error adding role to user:", error);
        return res.status(500).json({ message: "Erreur lors de l'ajout du rôle à l'utilisateur", error });
    }
    }
// Remove a role from a user
exports.removeRoleFromUser = async (req, res) => {
    try {
        const { userId, roleName } = req.body;
        if (!userId || !roleName) {
            return res.status(400).json({ message: "User ID and role name are required" });
        }
        const roleObj = await Role.findOne({ name: roleName });
        if (!roleObj) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Check if the user has the role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.role.includes(roleObj._id)) {
            // If the user doesn't have the role, return an error message
            return res.status(400).json({ message: "User does not have this role" });
        }
    
        // Remove the role from the user
        user.role = user.role.filter(role => role.toString() !== roleObj._id.toString());
        await user.save();
    
        return res.status(200).json({ message: "Le rôle a été supprimé de l'utilisateur avec succès", user });
    } catch (error) {
        console.error("Error removing role from user:", error);
        return res.status(500).json({ message: "Erreur lors de la suppression du rôle de l'utilisateur", error });
    }
}