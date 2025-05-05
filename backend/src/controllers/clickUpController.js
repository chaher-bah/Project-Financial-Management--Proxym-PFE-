require("dotenv").config();
const axios = require("axios");
const express = require("express");

const clickUpRequest = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: ` ${process.env.CLICKUP_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from ClickUp:", error.message);
    throw error;
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const url = `https://api.clickup.com/api/v2/team`;
    const data = await clickUpRequest(url);
    //get the team where the name is equal to the name in .env file
    const team = data.teams.find(
      (team) => team.name === process.env.CLICKUP_WORKSPACE_NAME
    );
    if (!team) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    // get the id , name and members of the team
    const { id, name, members } = team;
    // get the members of the team and their names
    const membersDetails = members.map((member) => {
      return {
        id: member.user.id,

        name: member.user.username,
        email: member.user.email,
      };
    });
    res
      .status(200)
      .json({
        message: "Les donness de votre workspace",
        data: { id, name, members: membersDetails },
      });
  } catch (error) {
    res.status(500).json({ error: "Error fetching workspaces" });
  }
};
//spaces are CLIENTS in our case
// get all spaces of the workspace
exports.getSpaces = async (req, res) => {
  try {
    const url = `https://api.clickup.com/api/v2/team/${req.params.id}/space`;
    const data = await clickUpRequest(url);
    //get the team where the name is equal to the name in .env file

    // get the spaces id and name
    const spacesDetails = data.spaces.map((space) => {
      return {
        id: space.id,

        name: space.name,
      };
    });
    res
      .status(200)
      .json({
        message: "Les donness de votre clients",
        data: { Spaces: spacesDetails },
      });
  } catch (error) {
    res.status(500).json({ error: "Error fetching workspaces" });
  }
};

exports.getAllFolders = async (req, res) => {
  try{
  const spacesData = await clickUpRequest(
    `https://api.clickup.com/api/v2/team/${req.params.wsId}/space`
  );
  const spaces = spacesData.spaces || [];

  const folderData= await Promise.all(
    spaces.map( (space) => clickUpRequest(
        `https://api.clickup.com/api/v2/space/${space.id}/folder`)
        .then((data)=>data.folders || [])
    )
  );

      // const foldersReturn= folderData.flat()
      // .map((folder) => ({
      //   id: folder.id,
      //   name: folder.name,
      //   spaceId: folder.space.id,
      //   spaceName: folder.space.name,
      // }));

      //approach 2
      const spacesWithFolders = spaces.map((space, index) => ({
        spaceId: space.id,
        spaceName: space.name,
        folders: folderData[index].map((folder) => ({
          id: folder.id,
          name: folder.name,
        })),
      }));
      return res.status(200).json({
        message: "Les Projets de votre clients",
        data: { Spaces: spacesWithFolders },
      });
  }catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ error: "Error fetching folders" });
  }
}




// folders are PROJECTS in our case
// get all folders of a space
exports.getFolders = async (req, res) => {
  try {
    const url = `https://api.clickup.com/api/v2/space/${req.params.id}/folder`;
    const data = await clickUpRequest(url);

    // get the spaces id and name
    const foldersDetails = data.folders.map((folder) => {
      return {
        id: folder.id,
        name: folder.name,
      };
    });
    res
      .status(200)
      .json({
        message: "Les donness de votre Project",
        data: { Folders: foldersDetails },
      });
  } catch (error) {
    res.status(500).json({ error: "Error fetching workspaces" });
  }
};
// get all tasks of a folder
exports.getTasks = async (req, res) => {
  try {
    console.log(req.params.listId);
    const url = `https://api.clickup.com/api/v2/list/${req.params.listId}/task`;
    const data = await clickUpRequest(url);

    // get the spaces id and name
    const tasksDetails = data.tasks.map((task) => {
      return {
        id: task.id,
        name: task.name,
      };
    });
    res
      .status(200)
      .json({
        message: "Les donness de votre Project",
        data: { Tasks: tasksDetails },
      });
  } catch (error) {
    res.status(500).json({ error: "Error fetching workspaces" });
  }
};

// exports.getFolderTasks = async (req, res) => {
//   const { folderId } = req.params;

//   try {
//     // 1️⃣ Fetch all lists in the folder
//     const listsData = await clickUpRequest(
//       `https://api.clickup.com/api/v2/folder/${folderId}/list`
//     );
//     const lists = listsData.lists || [];

//     // 2️⃣ For each list, fetch all pages of tasks
//     const allTasks = [];
//     for (const list of lists) {
//       let page = 0;
//       let hasMoreTasks = true;
//       let tasksPage;

//       while (hasMoreTasks) {
//         const tasksData = await clickUpRequest(
//           `https://api.clickup.com/api/v2/list/${list.id}/task?page=${page}`
//         );
//         const tasks = tasksData.tasks || [];

//         //get the nessecary data from the tasks
//         for (const task of tasks) {
//           const taskDetails = {
//             id: task.id,
//             name: task.name,
//             assignee: task.assignees.map((assignee) => ({
//               id: assignee.id,
//               name: assignee.username,
//               email: assignee.email,
//             })),
//             status: task.status.status,
//             due_date: task.due_date,
//             start_date: task.start_date,
//             tags: task.tags.map((tag) => tag.name),
//             list: {
//               id: task.list.id,
//               name: task.list.name,
//             },
//             project: {
//               id: task.folder.id,
//               name: task.folder.name,
//             },
//             client: {
//               id: task.space.id,
//             },
//           };
//           allTasks.push(taskDetails);
//         }
//         hasMoreTasks = tasks.length === 100;
//         page += 1;
//       }
//     }

//     // 3️⃣ Return aggregated tasks
//     res.status(200).json({
//       message: `All tasks in folder ${folderId}`,
//       total: allTasks.length,
//       tasks: allTasks,
//     });
//   } catch (error) {
//     console.error("Error fetching folder tasks:", error);
//     res.status(500).json({ error: "Could not fetch tasks for folder" });
//   }
// };


// controllers/folderController.js

// exports.getFolderTasks = async (req, res) => {
//   const { folderId } = req.params;
//   const teamId = process.env.CLICKUP_TEAM_ID||"9012800808";

//   try {
//     // 1️⃣ Get all Lists in the Folder
//     const listsData = await clickUpRequest(
//       `https://api.clickup.com/api/v2/folder/${folderId}/list`
//     );
//     const lists = listsData.lists || [];  // :contentReference[oaicite:2]{index=2}

//     // 2️⃣ Fetch time entries for the whole folder (one call)
//     //    span start_date=0 to now to get all entries
//     const now = Date.now();
//     const teData = await clickUpRequest(
//       `https://api.clickup.com/api/v2/team/${teamId}/time_entries?folder_id=${folderId}&start_date=0&end_date=${now}`
//     );
//     const timeEntries = teData.time_entries || [];
//     const timeMap = timeEntries.reduce((map, entry) => {
//       map[entry.task_id] = (map[entry.task_id] || 0) + entry.duration;
//       return map;
//     }, {});

//     // 3️⃣ Gather tasks and enrich
//     const allTasks = [];
//     for (const list of lists) {
//       let page = 0, fetched;
//       do {
//         const tasksData = await clickUpRequest(
//           `https://api.clickup.com/api/v2/list/${list.id}/task?page=${page}`
//         );
//         fetched = tasksData.tasks || [];

//         for (const task of fetched) {
//           allTasks.push({
//             id: task.id,
//             name: task.name,
//             assignees: task.assignees.map(a => ({
//               id: a.id,
//               username: a.username,
//               email: a.email
//             })),
//             // built‑in dates & estimate (ms)
//             start_date:   task.start_date,
//             end_date:     task.due_date,
//             time_estimate: task.time_estimate,
//             // sum of all time entries for this task (ms)
//             time_tracked: timeMap[task.id] || 0,
//             list:    { id: task.list.id,   name: task.list.name },
//             project: { id: task.folder.id, name: task.folder.name },
//             client:  { id: task.space.id,  name: task.space.name }
//           });
//         }

//         page += 1;
//       } while (fetched.length === 100);
//     }

//     // 4️⃣ Return
//     res.json({
//       message: `Tasks in folder ${folderId}`,
//       total:   allTasks.length,
//       tasks:   allTasks
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Could not fetch tasks for folder' });
//   }
// };

exports.getFolderTasks = async (req, res) => {
  const { folderId } = req.params;

  try {
    // 1️⃣ Fetch all lists in the folder
    const listsData = await clickUpRequest(
      `https://api.clickup.com/api/v2/folder/${folderId}/list`
    );
    const lists = listsData.lists || [];

    // 2️⃣ For each list, fetch all pages of tasks
    const allTasks = [];
    for (const list of lists) {
      let page = 0;
      let hasMoreTasks = true;

      while (hasMoreTasks) {
        const tasksData = await clickUpRequest(
          `https://api.clickup.com/api/v2/list/${list.id}/task?page=${page}`
        );
        const tasks = tasksData.tasks || [];

        for (const task of tasks) {


          const taskDetails = {
            id: task.id,
            name: task.name,
            assignee: task.assignees.map((a) => ({
              id: a.id,
              name: a.username,
              email: a.email,
            })),
            // ✅ STANDARD DATE FIELDS
            start_date: task.start_date,     
            end_date:   task.due_date,       

   

            // ⏱ TIME ESTIMATE & TRACKED
            time_estimate: task.time_estimate, // in ms :contentReference[oaicite:2]{index=2}
            time_tracked:  task.time_spent,    // in ms :contentReference[oaicite:3]{index=3}

            list: {
              id: task.list.id,
              name: task.list.name,
            },
            project: {
              id: task.folder.id,
              name: task.folder.name,
            },
            client: {
              id: task.space.id,
            },
          };
          allTasks.push(taskDetails);
        }

        hasMoreTasks = tasks.length === 100;
        page += 1;
      }
    }

    // 3️⃣ Return aggregated tasks
    res.status(200).json({
      message: `All tasks in folder ${folderId}`,
      total: allTasks.length,
      tasks: allTasks,
    });
  } catch (error) {
    console.error("Error fetching folder tasks:", error);
    res.status(500).json({ error: "Could not fetch tasks for folder" });
  }
};
