import axios from "axios";
import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";



export const useDocs = () => {
    const { keycloak } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ open: false, message: "" });
    const [sentDocuments,setSentDocuments]=useState({data:[],count:0});
    const [recievedDocuments,setReceivedDocuments]=useState({data:[],count:0});



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
                `http://localhost:3000/api/upload/getSent/${uploaderId}`,
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
    //second approach
    //fetch the document 
    
    const fetchDocuments = async (userId) => {
        setLoading(true);
        try{
            //fetch sent Docs
            const sentResponse = await axios.get(
                `http://localhost:3000/api/upload/getSent/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            if (sentResponse.data.uploads) {
                const sentDocuments = sentResponse.data.uploads.flatMap(upload => {
                    return upload.files.map(file => {
                        const recipientNames = upload.recipients.map(
                            r => `${r.firstName} ${r.familyName.toUpperCase()} ,`
                        );
                        return {
                            id: upload._id,
                            fileName: file.originalName,
                            recipients: recipientNames,
                            creationDate: new Date(upload.createdAt).toLocaleDateString(),
                            onOpen: () => console.log(`Opening ${file.originalName}`)
                        };
                    });
                });
                setSentDocuments({data:sentDocuments,count:sentResponse.data.count});
            }
            //fetch received Docs
            const receivedResponse = await axios.get(
                `http://localhost:3000/api/upload/getRecieved/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
     
            if (receivedResponse.data.uploads) {
                const receivedDocuments = receivedResponse.data.uploads.flatMap(upload => {
                    return upload.files.map(file => {

                        const senderName = upload.uploader
                            ? `${upload.uploader.firstName} ${upload.uploader.familyName.toUpperCase()}`
                            : "Unknown Sender";
                        return {
                            id: upload._id,
                            fileName: file.originalName,
                            sender: senderName,
                            dueDate: new Date(upload.dueDate).toLocaleDateString(),
                            recipients: upload.recipients.map(
                                r => `${r.firstName} ${r.familyName.toUpperCase()} `
                            ),
                            onOpen: () => console.log(`Opening ${file.originalName}`)
                        };
                    });
                });
                setReceivedDocuments({data:receivedDocuments,count:receivedResponse.data.count});
            }
            setLoading(false);  
        }catch(error){
            console.error("Error fetching documents:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to fetch documents. Please try again.",
            });
        }
    }

    const changeUploadStatus = async (uploadId, status) => {
        setLoading(true);
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/upload/${status}/${uploadId}`,{},
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error("Error changing upload status:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to change upload status. Please try again.",
            });
        }
    }

    const changeFileStatus = async (uploadId, fileName, newStatus) => {
        setLoading(true);
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/upload/file/${uploadId}/${fileName}/${newStatus}`,{},
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            );
            setLoading(false);
            return response.data;
        } catch (error) {
            console.error("Error changing file status:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to change file status. Please try again.",
            });
        }
    }



    const downloadFile = async (uploadId,originalName) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/upload/download/${uploadId}/${originalName}`,
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                    responseType: "blob",
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", originalName);
            document.body.appendChild(link);
            link.click();
            setLoading(false);
        } catch (error) {
            console.error("Error downloading file:", error);
            setLoading(false);
            setError({
                open: true,
                message: "Failed to download file. Please try again.",
            });
        }
    }


    //fethc document and group them 
    // In useDocs.js
const fetchDocuments2 = async (userId) => {
  setLoading(true);
  try {
    // Fetch sent documents
    const sentResponse = await axios.get(
      `http://localhost:3000/api/upload/getSent/${userId}`,
      { headers: { Authorization: `Bearer ${keycloak.token}` } }
    );

    const sentUploads = sentResponse.data.uploads.map((upload) => ({
      ...upload,      
      uploadType: "Envoyés",
      color: generateUploadColor(upload._id),
      code: generateUploadCode(upload.createdAt),
    }));
    setSentDocuments({
      data: groupFilesByUpload(sentUploads),
      count: sentResponse.data.count,
    });
    // Fetch received documents
    const receivedResponse = await axios.get(
      `http://localhost:3000/api/upload/getRecieved/${userId}`,
      { headers: { Authorization: `Bearer ${keycloak.token}` } }
    );
    const receivedUploads = receivedResponse.data.uploads.map((upload) => ({
      ...upload,
      uploadType: "received",
      color: generateUploadColor(upload._id),
      code: generateUploadCode(upload.createdAt),
      
    }));
    setReceivedDocuments({
      data: groupFilesByUpload(receivedUploads),
      count: receivedResponse.data.count,
    });

    setLoading(false);
  } catch (error) {
    // Error handling remains same
  }
};
  
  // Helper functions
  const generateUploadColor = (id) => {
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return `hsl(${hash % 360}, 70%, 80%)`;
  };
  
  const generateUploadCode = (createdAt) => {
    const date = new Date(createdAt);
    return `UP-${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1)
      .toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math
      .floor(Math.random() * 900 + 100)}`;
  };
  
  const groupFilesByUpload = (uploads) => {
    return uploads.map(upload => ({
      id: upload._id,
      code: upload.code,
      color: upload.color,
      date: new Date(upload.createdAt).toLocaleDateString(),
      dueDate: upload.dueDate ? new Date(upload.dueDate).toLocaleDateString() : null,
      sender: upload.uploader ? upload.uploader:'',
      recipients: upload.recipients.map(r => `${r.firstName} ${r.familyName.toUpperCase()}`),
      status: upload.status,
      files: upload.files.map(file => ({
        name: file.originalName,
        status: file.fileStatus,
        uploadDate: new Date(upload.createdAt).toLocaleDateString(),

      }))
    }));
  };


    return{
        loading,
        error,
        uploadFiles,
        sentDocuments,
        recievedDocuments,
        fetchDocuments,
        fetchDocuments2,
        getMyFiles,
        getFilesSentToMe,
        changeUploadStatus,
        changeFileStatus,
        downloadFile,
    }
}
