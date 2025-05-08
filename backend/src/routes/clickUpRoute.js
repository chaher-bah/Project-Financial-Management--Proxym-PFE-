const express = require('express');

const router = express.Router();
const clickUpController = require('../controllers/clickUpController');


router.get('/workspaces', clickUpController.getWorkspaces); // Get all workspaces from ClickUp

router.get('/spaces/:id', clickUpController.getSpaces); // Get all spaces (clients) of a workspace
router.get('/spaces/:id/folders', clickUpController.getFolders); // Get all folders of a space (client)
router.get('/spaces/:wsId/folders/all', clickUpController.getAllFolders); // Get all folders of a Workspace 

router.get('/spaces/lists/:listId/tasks', clickUpController.getTasks); 

router.get('/folder/:folderId/tasks', clickUpController.getFolderTasks);
router.get('/taskTypes/', clickUpController.getTaskTypes); // Get all task types

router.get('/folder/:projectId/tasks-by-type', clickUpController.getSpaceTasksByType); // Get all tasks of a space (client)

module.exports = router;