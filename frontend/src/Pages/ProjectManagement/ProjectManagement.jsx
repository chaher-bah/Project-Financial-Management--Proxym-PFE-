import React, { useState ,useEffect} from "react";
import {
  Box,
  Typography,
  Snackbar,
  Button,
  Divider,
  Container,
  Chip,
  Alert,
} from "@mui/material";
import {FiXCircle} from "react-icons/fi";
import { useKeycloak } from "@react-keycloak/web";
import { useClickUp } from "../../hooks/useClickUp";
const ProjectManagement = () => {
  const { keycloak } = useKeycloak();
  const {
    clickUpData,
    loading: clickUpLoading,
    info: clickUpInfo,
    getClients,
    getAllProjects
  } = useClickUp();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // const fetchClients = async () => {
    //   if (clickUpData) {
    //     try {
    //       const response = await getClients(clickUpData.data.id);
    //       setClients(response.data.Spaces || []);
    //     } catch (error) {
    //       console.error("Error fetching clients:", error);
    //       setClients([]);
    //     }
    //   }
    // };
    // fetchClients();
    if (clickUpData && clickUpData.data) {
        const fetchProjects = async () => {
            try {
                const response = await getAllProjects(clickUpData.data.id);
                const spaces= response.data.Spaces || [];
                const folders = spaces.flatMap(space =>
                    space.folders.map(folder => ({
                      id: folder.id,
                      name: folder.name,
                      spaceId: space.spaceId,
                      spaceName: space.spaceName
                    }))
                  );
                setProjects(folders);

                // Extract unique clients from projects
                // const uniqueClients = Array.from(
                //     new Set(folders.map((folder) => JSON.stringify({ id: folder.spaceId, name: folder.spaceName })))
                // ).map((str) => JSON.parse(str));
                const uniqueClients = spaces.map(space => ({
                    id: space.spaceId,
                    name: space.spaceName
                  }));
                setClients(uniqueClients);
            } catch (error) {
                console.error("Error fetching projects:", error);
                setProjects([]);
                setClients([]);
            }
        };
        fetchProjects();
    }
  }, [clickUpData]);



  // State for tracking selections
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Handler for client selection
  const handleClientSelect = (clientId) => {
    setSelectedClient(clientId);
    setSelectedProject(null);
  };

  // Handler for project selection
  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };

  // Filter projects based on selected client
  const filteredProjects = selectedClient
    ? projects.filter((project) => project.spaceId === selectedClient)
    : projects;
  return (
    <Container sx={{ mb: 4 }}>
      {clickUpData && (
        <Snackbar open={true} autoHideDuration={2000}>
          <Alert
            severity="success"
            sx={{ borderRadius: "10px", fontWeight: "1.2rem", m: 2 }}
          >{`Vous avez connecter sur le Workspace "${clickUpData.data.name}" `}</Alert>
        </Snackbar>
      )}
      <Box sx={{ width: "99%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Management
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            p: 1.5,
            m: 3,
            height: "100%",
            borderRadius: "15px",
            backgroundColor: "background.paper",
            width: "20%",
            boxShadow: 8,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "sans-serif",
              color: "#333",
            }}
          >
            Liste des clients
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid #1D1616",
            borderRadius: "15px",
            padding: 2,
            m: 2,
            mb: 4,
            width: "95%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              overflowX: "auto",
              gap: 1,
              p: 1,
            }}
          >
            {clients.map((client) => (
              <Chip
                key={client.id}
                label={client.name}
                onClick={() => handleClientSelect(client.id)}
                color={selectedClient === client.id ? "primary" : "default"}
                variant={selectedClient === client.id ? "filled" : "outlined"}
                sx={{
                  m: 0.5,
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            p: 1.5,
            m: 3,
            height: "100%",
            borderRadius: "15px",
            backgroundColor: "background.paper",
            width: "20%",
            boxShadow: 8,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "sans-serif",
              color: "#333",
            }}
          >
            Liste des Projets
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
            {/*Display the projects */}

            <Box
          sx={{
            border: "1px solid #1D1616",
            borderRadius: "15px",
            padding: 2,
            m: 2,
            mb: 4,
            width: "95%",
          }}
        > 
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto",
            gap: 1,
            p: 1,
          }}
        >
          {selectedClient && filteredProjects.length === 0 ? (
              <Alert severity="info">Cette client ne possède aucun projet</Alert>
            ) : (
              filteredProjects.map((project) => (
                <Chip
                  key={project.id}
                  label={project.name}
                  onClick={() => handleProjectSelect(project.id)}
                  color={selectedProject === project.id ? "primary" : "default"}
                  variant={selectedProject === project.id ? "filled" : "outlined"}
                  sx={{
                    m: 0.6,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}
                />
              ))
            )}
        </Box>
</Box>
        <Box
          sx={{
            p: 2,
            mt: 7,
            ml: 5,
            display: "flex",
            width: "90%",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "var(--dark-color)",
            borderRadius: "20px",
            boxShadow: 5,
          }}
        >
          <Typography variant="body1" fontWeight="bold" fontSize="1.2rem">Selectionner un projet</Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: "20px",
              padding: "10px 20px",
              fontSize: "1rem",
              fontWeight: "bold",
                backgroundColor: "var(--design-color)",
            }}
            disabled={!selectedProject}
            onClick={() =>
              console.log("Proceeding with project:", selectedProject)
            }
          >
            Proceed
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ProjectManagement;
