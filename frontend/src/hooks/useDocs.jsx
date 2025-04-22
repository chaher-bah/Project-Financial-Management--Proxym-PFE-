import axios from "axios";
import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";



export const useDocs = () => {
    const { keycloak } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ open: false, message: "" });
    



    //Upload the files to the server
    const uploadFiles= async (files, selectedCollaborators, dueDate,uploaderId,comments) => {
        setLoading(true);
        try{
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });
            formData.append("recipients", JSON.stringify(selectedCollaborators));
            formData.append("dueDate", dueDate);
            formData.append("uploader", uploaderId); 
            formData.append("comments", comments);
            //request
            const response = await axios.post(
                "http://localhost:3000/api/upload/send",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setLoading(false);
            return response.data;
        }catch(error){
            console.error("Error uploading files:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to upload files. Please try again.",
            });
        }
    };
    //get the Uploader files
    const getMyFiles = async (uploaderId) => {
        setLoading(true);
        try{
            const response = await axios.get(
                `http://localhost:3000/api/upload/getAll/${uploaderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setLoading(false);
            return response.data;
        }catch(error){
            console.error("Error fetching uploader files:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to fetch uploader files. Please try again.",
            });
        }
    };
    //get files sent to me
    const getFilesSentToMe = async (userId) => {
        setLoading(true);
        try{
            const response = await axios.get(
                `http://localhost:3000/api/upload/getRecieved/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setLoading(false);
            return response.data;
        }catch(error){
            console.error("Error fetching files sent to me:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to fetch files sent to me. Please try again.",
            });
        }
    };


    return{
        loading,
        error,
        uploadFiles,
        getMyFiles,
    }
}
