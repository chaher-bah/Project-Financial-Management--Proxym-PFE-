import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useParams,useNavigate } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable"; // Adjust path as needed
import { useClickUp } from "../../hooks/useClickUp";
import Loader from "../../Components/Loader/Loader";
const ProjectDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { projectId: selectedProjectId } = useParams();

  const [selectedProject, setSelectedProject] = useState(() => {
    if (location.state?.selectedProject) {
      return location.state.selectedProject;
    }
    const json = window.sessionStorage.getItem("selectedProject");
    return json ? JSON.parse(json) : undefined;
  });    
  const { loading, setLoading, info, getFolderTasksByType, clickUpData } =useClickUp();
  const workspaceId = import.meta.env.VITE_CLICKUP_WORKSPACE_ID;
  






  const [value, setValue] = useState(0);
  const [taskTypes, setTaskTypes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [response, setResponse] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      window.sessionStorage.setItem(
        "selectedProject",
        JSON.stringify(selectedProject)
      );
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      // e.g. redirect back to listing
      console.error("Redirecting...", selectedProject);

      navigate("/gestion-projets");
      return;
    }
    const fetchTasks = async () => {
      if (!selectedProjectId) return; // Guard against undefined projectId

      setLoading(true);
      try {
        const resp = await getFolderTasksByType(selectedProjectId); // This uses the hook

        if (resp && resp.tasks) {
          setResponse(resp); // resp is already the data part like { message, total, tasks: groupedByType }
          const types = Object.keys(resp.tasks || {});
          setTaskTypes(types.map((type, index) => ({ id: index, label: type })));

          const allTasks = types.flatMap((type) =>
            (resp.tasks[type] || []).map((task) => ({
              id: task.id,
              name: task.name,
              taskType: type,
              assignee: task.assignee && task.assignee.length > 0 ? task.assignee[0].name : "Non assigné",
              startDate: task.start_date
                ? new Date(Number(task.start_date)).toLocaleDateString() 
                : "Non défini",
              estimate_time: task.time_estimate || "Non défini",
              spent_time: task.time_spent || "Non défini",
              dueDate: task.due_date
                ? new Date(Number(task.due_date)).toLocaleDateString() 
                : "Non défini",
              files: [],
            }))
          );
          setTasks(allTasks);
          setSelectedTaskType(null); // Reset to show all tasks initially
        } else {
          console.error("Failed to fetch tasks or tasks data is missing:", resp);
          setTasks([]);
          setTaskTypes([]);
          setResponse(null);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
        setTaskTypes([]);
        setResponse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [ navigate,selectedProjectId, selectedProject, getFolderTasksByType]); // Ensure this is the correct dependency
  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  console.log("taks:", tasks);


  const displayedTasks = selectedTaskType
  ? tasks.filter(task => task.taskType === selectedTaskType)
  : tasks;

  console.log("Selected Project:", displayedTasks);


  // DataTable columns configuration
  const columns = [
    { field: "name", headerName: "Nom de tache", width: 200 },
    { field: "taskType", headerName: "Type de tache", width: 150 },
    { field: "assignee", headerName: "Assignee", width: 200 },
    { field: "startDate", headerName: "Date de démarrage", width: 150 },
    { field: "estimate_time", headerName: "Temps estimee", width: 150 },
    { field: "spent_time", headerName: "Temps passé", width: 150 },
    { field: "dueDate", headerName: "Date Limite", width: 150 },
  ];

  return (
    <Container maxWidth="xl" sx={{}}>
      {info && (
        <Snackbar open={true} autoHideDuration={2000}>
          <Alert
            severity={info.type}
            sx={{ borderRadius: "10px", fontWeight: "1.2rem", m: 2 }}
          >{`${info.message}`}</Alert>
        </Snackbar>
      )}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project: {selectedProject?.name || "Project Name"}
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          color="text.secondary"
          gutterBottom
        >
          Client: {selectedProject?.spaceName || "Client Name"}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "#333",
            fontFamily: "sans-serif",
            fontSize: "1.8rem",
          }}
        >
          Taches:
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Chip
            key="all-types"
            label="Toutes les tâches"
            onClick={() => setSelectedTaskType(null)}
            color={selectedTaskType === null ? "primary" : "default"}
            variant={selectedTaskType === null ? "filled" : "outlined"}
            sx={{
              px: 2,
              py: 2.5,
              borderRadius: "16px",
              "&.MuiChip-filledPrimary": { 
                backgroundColor: "var(--dark-color)",
                color: "white",
              },
            }}
          />

          {taskTypes.map((type) => (
            <Chip
              key={type.id}
              label={type.label}
              onClick={() => setSelectedTaskType(type.label)}
              color={selectedTaskType === type.label  ? "primary" : "default"}
              variant={selectedTaskType === type.label ? "filled" : "outlined"}
              sx={{
                px: 2,
                py: 2.5,
                borderRadius: "16px",
                "&.MuiChip-filled": {
                  backgroundColor: "var(--dark-color)",
                  color: "white",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* {loading ? (
        <Typography sx={{ color: "#333", fontSize: "1.5rem" }}>
          Chargement des tâches...
        </Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={displayedTasks}
          expand={false}
          backPath={"/gestion-projets"}
        />
      )} */}
      {loading ? (
  <Typography sx={{ color: "#333", fontSize: "1.5rem" }}>
    Chargement des tâches...
  </Typography>
) : Array.isArray(displayedTasks) ? (
  <DataTable
    columns={columns}
    rows={displayedTasks}
    expand={false}
    backPath={"/gestion-projets"}
  />
) : (
  <Typography sx={{ color: "red", fontSize: "1.5rem" }}>
    Erreur : Impossible de charger les tâches. Veuillez réessayer plus tard.
  </Typography>
)}
    </Container>
  );
};

export default ProjectDetailsPage;
