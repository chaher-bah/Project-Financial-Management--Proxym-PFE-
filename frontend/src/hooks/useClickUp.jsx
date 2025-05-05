import axios from "axios";
import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";


export const useClickUp = () => {
    const { keycloak } = useKeycloak();
    const [clickUpData, setClickUpData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({message: "", type: ""});
    
    useEffect(() => {
        const fetchClickUpData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/clickup/workspaces", {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
            });
            setInfo({message: "Données ClickUp récupérées avec succès", type: "success"});
            setClickUpData(response.data);
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des données ClickUp", type: "error"});
            console.error("Error fetching ClickUp data:", err);
        } finally {
            setLoading(false);
        }
        };
    
        fetchClickUpData();
    }, [keycloak.token]);
    
    //get all spaces (clients) of a workspace
    const getClients = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/clickup/spaces/${id}`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Clients récupérés avec succès", type: "success"});
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des clients", type: "error"});
            console.error("Error fetching ClickUp clients:", err);
        }
    };
    //get all folders(Projects) of a space (client)
    const getClientProjects = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/clickup/spaces/${id}/folders`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Projets récupérés avec succès", type: "success"});
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des projets", type: "error"});
            console.error("Error fetching ClickUp projects:", err);
        }
    };
    //get all folders(Projects) of a workspace
    const getAllProjects = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/clickup/spaces/${id}/folders/all`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            setInfo({message: "Projets récupérés avec succès", type: "success"});
            return response.data;
        } catch (err) {
            setInfo({message: "Erreur lors de la récupération des projets", type: "error"});
            console.error("Error fetching ClickUp projects:", err);
        }
    };


    return { clickUpData, loading, info, getClients, getClientProjects, getAllProjects };
}