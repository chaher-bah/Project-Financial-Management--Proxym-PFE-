import { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";

export const useGroups = () => {
    const [groupData, setGroupData] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState({type:"",message:""});
    const { keycloak } = useKeycloak();

    useEffect(() => {
        const fetchAllGroups = async () => {
            if (!keycloak.authenticated || !keycloak.token) return;
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/group/",
                    {
                        headers: {
                            Authorization: `Bearer ${keycloak.token}`,
                        },
                    }
                );
                setInfo({type:'info',message:response.data.message});
                setGroupData(response.data.data); 
            } catch (err) {
                console.error("Error fetching all groups:", err);
                setInfo({type:"error",message:err.message});
            } finally {
                setLoading(false);
            }
        };
        fetchAllGroups();
    }, [keycloak.token]);

    const addGroup = async (groupName, variants, special) => {
        if (!keycloak.authenticated || !keycloak.token) return;
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/group/",
                { name: groupName, variants, special },
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setInfo({type:"success",message:response.data.message});
            setGroupData((prevGroupData) => [...prevGroupData, response.data.data]);
        } catch (err) {
            console.error("Error adding group:", err);
            setInfo({type:"error",message:err.message});
        } finally {
            setLoading(false);
        }
    };

    const updateGroup = async (groupId, groupName, variants, special) => {
        if (!keycloak.authenticated || !keycloak.token) return;
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:3000/api/group/${groupId}`,
                { name: groupName, variants, special },
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setInfo({type:"success",message:response.data.message});
            setGroupData((prevGroupData) =>
                prevGroupData.map((group) =>
                    group._id === groupId ? response.data.data : group
                )
            );
        } catch (err) {
            console.error("Error updating group:", err);
            setInfo({type:"error",message:err.message});
        } finally {
            setLoading(false);
        }
    }
    const deleteGroup = async (groupId) => {
        if (!keycloak.authenticated || !keycloak.token) return;
        setLoading(true);
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/group/${groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setInfo({type:"warning",message:response.data.message});
            setGroupData((prevGroupData) =>
                prevGroupData.filter((group) => group._id !== groupId)                

            );
        } catch (err) {
            console.error("Error deleting group:", err);
            setInfo({type:"error",message:err.message});
        } finally {
            setLoading(false);
        }
    };

    const setGroupToUser = async (userId, groupId, position) => {
        if (!keycloak.authenticated || !keycloak.token) return;
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/group/setGroupToUser",
                { userId, groupId, position },
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setInfo({type:"success",message:response.data.message});
        } catch (err) {
            console.error("Error setting group to user:", err);
            setInfo({type:"error",message:err.message});
        } finally {
            setLoading(false);
        }
    };

    return { groupData,updateGroup,deleteGroup,addGroup,setGroupToUser, loading, info };
}