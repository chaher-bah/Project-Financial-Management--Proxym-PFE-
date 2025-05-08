import axios from "axios";
import { useEffect, useState,useCallback } from "react";
import { useKeycloak } from "@react-keycloak/web";


export const useClickUp = () => {
    const { keycloak } = useKeycloak();
    const [clickUpData, setClickUpData] = useState(null);
    const clickupworkspaceId = import.meta.env.VITE_CLICKUP_WORKSPACE_ID;

    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({message: "", type: ""});
    
    // useEffect(() => {
    //     const fetchClickUpData = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await axios.get("http://localhost:3000/api/clickup/workspaces", {
    //         headers: {
    //             Authorization: `Bearer ${keycloak.token}`,
    //         },
    //         });
    //         setInfo({message: "Données ClickUp récupérées avec succès", type: "success"});
    //         setLoading(false);
    //         setClickUpData(response.data);
    //     } catch (err) {
    //         setInfo({message: "Erreur lors de la récupération des données ClickUp", type: "error"});
    //         console.error("Error fetching ClickUp data:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    //     };
    
    //     fetchClickUpData();
    // }, [keycloak.token]);
    
    //get all spaces (clients) of a workspace
    const getClients = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/clickup/spaces/${id}`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Clients récupérés avec succès", type: "success"});setLoading(false);
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des clients", type: "error"});
            setLoading(false);
            console.error("Error fetching ClickUp clients:", err);
        }
    };
    //get all folders(Projects) of a space (client)
    const getClientProjects = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/clickup/spaces/${id}/folders`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Projets récupérés avec succès", type: "success"});
            setLoading(false);
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des projets", type: "error"});
            setLoading(false);
            console.error("Error fetching ClickUp projects:", err);
        }
    };
    //get all folders(Projects) of a workspace id =wsID
    const getAllProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/clickup/spaces/${clickupworkspaceId}/folders/all`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Projets récupérés avec succès", type: "success"});
            setLoading(false);
            console.log("Response for all projects", response.data);
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des projets", type: "error"});
            setLoading(false);
            console.error("Error fetching ClickUp projects:", err);
        }
    };

    //get all tasks of a folder (project) grouped by type
    const getFolderTasksByType = useCallback(async (projectId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/clickup/folder/${projectId}/tasks-By-Type`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Tâches récupérées avec succès", type: "success"});
            setLoading(false);
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des tâches", type: "error"});
            setLoading(false);
            console.error("Error fetching ClickUp tasks:", err);
        }
    },[keycloak.token]);

    return { clickUpData, loading,setLoading, info, getClients, getClientProjects, getAllProjects, getFolderTasksByType };
}