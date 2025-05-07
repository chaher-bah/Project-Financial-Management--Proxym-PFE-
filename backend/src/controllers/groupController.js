const Group = require('../models/group');

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
    const { name, variants,special } = req.body;
    try {
        const updatedGroup = await Group.findByIdAndUpdate(id, { name, variants,special }, { new: true });
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

