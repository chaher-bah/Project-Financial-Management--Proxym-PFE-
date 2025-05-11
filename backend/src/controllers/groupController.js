const Group = require('../models/group');
const User = require('../models/user');
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json({message: 'Groupes récupérés avec succès', data: groups});
    }catch (error) {
        res.status(500)
        .json({message: 'Erreur lors de la récupération des groupes', error: error.message});
    }
};

exports.createGroup = async (req, res) => {
    const { name, variants,special } = req.body;
    try {
        const newGroup = new Group({ name, variants, special });
        await newGroup.save();
        res.status(201).json({ message: 'Groupe créé avec succès', data: newGroup });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du groupe', error: error.message });
    }
}

exports.updateGroup = async (req, res) => {
    const { id } = req.params;
    const { name, variants, special } = req.body;
    
    try {
        // Filter out variants with tarif = 0 if variants array exists
        const filteredVariants = variants ? variants.filter(variant => 
            variant.tarif !== 0 && variant.tarif !== "0") : [];
        
        const updatedGroup = await Group.findByIdAndUpdate(
            id, 
            { name, variants: filteredVariants, special }, 
            { new: true }
        );
        
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }  
        res.status(200).json({ message: 'Groupe mis à jour avec succès', data: updatedGroup });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du groupe', error: error.message });
    }
}
exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedGroup = await Group.findByIdAndDelete(id);
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        res.status(200).json({ message: 'Groupe supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du groupe', error: error.message });
    }
}


exports.setGroupToUser = async (req, res) => {
    try{
        const {userId,groupId,position} = req.body;

        const group = await Group.findById(groupId).lean();
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        const possition = group.variants.find((variant) => variant.name === position);
        if (!possition) {
            return res.status(404).json({ message: 'Position non trouvée' });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, 
            { group: groupId, position:position },
            { new: true })
            .populate(  'group');
        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'User mis à jour avec succès', data: updatedUser });
    }catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
    }
}
