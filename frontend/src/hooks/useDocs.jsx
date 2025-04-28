import axios from "axios";
import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

export const useDocs = () => {
  const { keycloak } = useKeycloak();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, message: "" });
  const [sentDocuments, setSentDocuments] = useState({ data: [], count: 0 });
  const [recievedDocuments, setReceivedDocuments] = useState({
    data: [],
    count: 0,
  });

  const [sentDocuments2, setSentDocuments2] = useState({ data: [], count: 0 });
  const [otherStatusDocs, setOtherStatusDocs] = useState({});

  //Upload the files to the server
  const uploadFiles = async (
    files,
    selectedCollaborators,
    dueDate,
    uploaderId,
    comments
  ) => {
    setLoading(true);
    try {
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
    } catch (error) {
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
    try {
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
    } catch (error) {
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
    try {
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
    } catch (error) {
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
    try {
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
        const sentDocuments = sentResponse.data.uploads.flatMap((upload) => {
          return upload.files.map((file) => {
            const recipientNames = upload.recipients.map(
              (r) => `${r.firstName} ${r.familyName.toUpperCase()} ,`
            );
            return {
              id: upload._id,
              fileName: file.originalName,
              recipients: recipientNames,
              creationDate: new Date(upload.createdAt).toLocaleDateString(),
              onOpen: () => console.log(`Opening ${file.originalName}`),
            };
          });
        });
        setSentDocuments({
          data: sentDocuments,
          count: sentResponse.data.count,
        });
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
        const receivedDocuments = receivedResponse.data.uploads.flatMap(
          (upload) => {
            return upload.files.map((file) => {
              const senderName = upload.uploader
                ? `${
                    upload.uploader.firstName
                  } ${upload.uploader.familyName.toUpperCase()}`
                : "Unknown Sender";
              return {
                id: upload._id,
                fileName: file.originalName,
                sender: senderName,
                dueDate: new Date(upload.dueDate).toLocaleDateString(),
                recipients: upload.recipients.map(
                  (r) => `${r.firstName} ${r.familyName.toUpperCase()} `
                ),
                onOpen: () => console.log(`Opening ${file.originalName}`),
              };
            });
          }
        );
        setReceivedDocuments({
          data: receivedDocuments,
          count: receivedResponse.data.count,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setLoading(false);
      setError({
        open: true,
        message: "Failed to fetch documents. Please try again.",
      });
    }
  };

  const changeUploadStatus = async (uploadId, status) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/upload/${status}/${uploadId}`,
        {},
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
  };

  const changeFileStatus = async (uploadId, fileName, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/upload/file/${uploadId}/${fileName}/${newStatus}`,
        {},
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
  };

  const downloadFile = async (uploadId, originalName,userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/upload/download/${uploadId}/${originalName}/${userId}`,
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
  };

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
    const hash = id
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return `hsl(${hash % 2000}, 70%, 80%)`;
  };

  const generateUploadCode = (createdAt,id) => {
    const date = new Date(createdAt);
    return `UP-${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}-${id.slice(-3)}`;
  };

  const groupFilesByUpload = (uploads) => {
    return uploads.map((upload) => ({
      id: upload._id,
      code: upload.code,
      color: upload.color,
      date: new Date(upload.createdAt).toLocaleDateString(),
      dueDate: upload.dueDate
        ? new Date(upload.dueDate).toLocaleDateString()
        : null,
      sender: upload.uploader ? upload.uploader : "",
      recipients: upload.recipients.map(
        (r) => `${r.firstName} ${r.familyName.toUpperCase()}`
      ),
      status: upload.status,
      files: upload.files.map((file) => ({
        name: file.originalName,
        status: file.fileStatus,
        uploadDate: new Date(upload.createdAt).toLocaleDateString(),
      })),
    }));
  };

  //other approach
//   const fetchDocuments3 = async (userId) => {
//     setLoading(true);
//     setError({ open: false, message: "" });
  
//     try {
//       // 1) pull down exactly what your aggregation gives you:
//       //    [ { status, uploads: [ { …, isUploader, files[], uploader, recipients } ] }, … ]
//       const resp = await axios.get(
//         `http://localhost:3000/api/upload/getAll/${userId}`,
//         { headers: { Authorization: `Bearer ${keycloak.token}` } }
//       );
//       const groups = resp.data;
  
//       // 2) flatten into one array, but remember each upload’s “originalStatus”
//       const allUploads = groups.flatMap(grp =>
//         grp.uploads.map(up => ({ ...up, originalStatus: grp.status }))
//       );
  
//       // 3) split into sent vs received
//       const sent = allUploads.filter(up => up.isUploader);
//       const received = allUploads.filter(up => !up.isUploader);
  
//       // 4) map sent → your view shape
//       const sentView = sent.map(up => ({
//         id: up._id,
//         code: generateUploadCode(up.createdAt,up._id),
//         color: generateUploadColor(up._id),
//         date: new Date(up.createdAt).toLocaleDateString(),
//         dueDate: new Date(up.dueDate).toLocaleDateString(),
//         status: up.originalStatus,
//         comments: up.comnts,
//         recipients: up.recipients.map(r => `${r.firstName} ${r.familyName.toUpperCase()}`),
//         files: up.files.map(f => ({
//           name: f.originalName,
//           status: f.fileStatus,
//           uploadDate: new Date(up.createdAt).toLocaleDateString()
//         })),
//         sender: {
//           _id:   up.uploader._id,
//           name:  `${up.uploader.firstName} ${up.uploader.familyName.toUpperCase()}`,
//           email: up.uploader.email
//         }
//       }));
  
//       // 5) build received grouped by effectiveStatus
//       const othersMap = received.reduce((acc, up) => {
//         const eff = up.originalStatus === "Envoyee" ? "AReviser" : up.originalStatus;
//         if (!acc[eff]) acc[eff] = [];
//         acc[eff].push({
//           id: up._id,
//           code: generateUploadCode(up.createdAt,up._id),
//           color: generateUploadColor(up._id),
//           date: new Date(up.createdAt).toLocaleDateString(),
//           dueDate: new Date(up.dueDate).toLocaleDateString(),
//           recipients: up.recipients.map(r => `${r.firstName} ${r.familyName.toUpperCase()}`),
//           status: eff,
//           comments: up.comnts,
//           sender: {
//             _id:   up.uploader._id,
//             firstName:up.uploader.firstName,
//             familyName: up.uploader.familyName.toUpperCase(),
//             email: up.uploader.email
//           },
//           files: up.files.map(f => ({
//             name: f.originalName,
//             status: f.fileStatus,
//             uploadDate: new Date(up.createdAt).toLocaleDateString()
//           }))
//         });
//         return acc;
//       }, {});
  
//       // 6) finally shape both pieces into { count, data: […] }
//       setSentDocuments2({ data: sentView, count: sentView.length });
  
//       const formattedOthers = Object.fromEntries(
//         Object.entries(othersMap).map(([status, arr]) => [
//           status,
//           { count: arr.length, data: arr }
//         ])
//       );
//       setOtherStatusDocs(formattedOthers);
//     }
//     catch (err) {
//       console.error("Error fetching documents:", err);
//       setError({ open: true, message: "Failed to fetch documents. Please try again." });
//     }
//     finally {
//       setLoading(false);
//     }
//   };
  

  // Updated fetchDocuments3 to compute per-user effective file status
const fetchDocuments3 = async (userId) => {
    setLoading(true);
    setError({ open: false, message: "" });
  
    try {
      // 1) pull down aggregation from server
      const resp = await axios.get(
        `http://localhost:3000/api/upload/getAll/${userId}`,
        { headers: { Authorization: `Bearer ${keycloak.token}` } }
      );
      const groups = resp.data; // [ { status, uploads: [...] }, ... ]
  
      // 2) flatten to file-level entries preserving upload metadata
      const fileEntries = groups.flatMap(grp =>
        grp.uploads.flatMap(up =>
          up.files.map(file => ({
            uploadId: up._id,
            uploader: up.uploader,
            recipients: up.recipients,
            createdAt: up.createdAt,
            dueDate: up.dueDate,
            comnts: up.comnts,
            isUploader: up.isUploader,
            originalStatus: grp.status,
            file // includes originalName, fileStatus, downloadedBy[]
          }))
        )
      );
  
      // 3) split into sent vs received file items
      const sentFiles = fileEntries.filter(e => e.isUploader);
      const sentGrouped = sentFiles.reduce((acc, e) => {
        if (!acc[e.uploadId]) {
          acc[e.uploadId] = {
            uploadId:   e.uploadId,
            uploader:   e.uploader,
            recipients: e.recipients,
            createdAt:  e.createdAt,
            dueDate:    e.dueDate,
            comnts:     e.comnts,
            originalStatus: e.originalStatus,
            files:      []
          };
        }
        // push each file into that upload’s files array
        acc[e.uploadId].files.push({
          name:       e.file.originalName,
          status:     e.file.fileStatus,
          uploadDate: new Date(e.createdAt).toLocaleDateString()
        });
        return acc;
      }, {});
      const receivedFiles = fileEntries.filter(e => !e.isUploader);
      // 4) build view for sent
      const sentView = Object.values(sentGrouped).map(up => ({
        id: up.uploadId,
        code: generateUploadCode(up.createdAt, up.uploadId),
        color: generateUploadColor(up.uploadId),
        date: new Date(up.createdAt).toLocaleDateString(),
        dueDate: new Date(up.dueDate).toLocaleDateString(),
        status: up.originalStatus,
        comments: up.comnts,
        recipients: up.recipients.map(r => `${r.firstName} ${r.familyName.toUpperCase()}`),
        files: up.files,            // now contains all files for that upload
        sender: {
          _id:   up.uploader._id,
          name:  `${up.uploader.firstName} ${up.uploader.familyName.toUpperCase()}`,
          email: up.uploader.email
        }
      }));

      // 5) group received by effectiveStatus derived from downloadedBy
    //   const othersMap = receivedFiles.reduce((acc, e) => {
    //     // check if current user has downloaded this file
    //     const hasDownloaded = Array.isArray(e.file.downloadedBy) &&
    //       e.file.downloadedBy.some(d => d.user.toString() === userId);
  
    //     // derive effective status per user
    //     const effStatus = hasDownloaded ? 'EnAttente' : 'Envoyee';
  
    //     if (!acc[effStatus]) acc[effStatus] = [];
    //     acc[effStatus].push({
    //       id: e.uploadId,
    //       code: generateUploadCode(e.createdAt, e.uploadId),
    //       color: generateUploadColor(e.uploadId),
    //       date: new Date(e.createdAt).toLocaleDateString(),
    //       dueDate: new Date(e.dueDate).toLocaleDateString(),
    //       status: effStatus,
    //       comments: e.comnts,
    //       sender: {
    //         _id: e.uploader._id,
    //         firstName: e.uploader.firstName,
    //         familyName: e.uploader.familyName.toUpperCase(),
    //         email: e.uploader.email
    //       },
    //       files: [{
    //         name: e.file.originalName,
    //         status: effStatus,
    //         uploadDate: new Date(e.createdAt).toLocaleDateString()
    //       }]
    //     });
    //     return acc;
    //   }, {});


    const recvByStatus = receivedFiles.reduce((acc, e) => {
        // determine effective status per user
        console.log("heiijd",e);
        // const hasDownloaded = Array.isArray(e.file.downloadedBy) && e.file.downloadedBy.some(d => d.user.id.toString() === userId);
        // const effStatus = hasDownloaded ? 'EnAttente' : e.file.fileStatus === "Envoyee" ? "AReviser" : e.file.fileStatus;
        const hasDownloadedList = Array.isArray(e.file.downloadedBy) ? e.file.downloadedBy : [];
        const userDownloadEntry = hasDownloadedList.find(d => d.user && d.user.id && d.user.id.toString() === userId);
        const hasDownloaded = Boolean(userDownloadEntry);

        
        const effStatus = e.file.fileStatus === 'Envoyee' ? 'AReviser' : e.file.fileStatus;
        console.log("downloader",hasDownloaded)


        // initialize status bucket
        if (!acc[effStatus]) acc[effStatus] = {};
        // initialize upload bucket within status        

        if (!acc[effStatus][e.uploadId]) {
          acc[effStatus][e.uploadId] = {
            uploadId: e.uploadId,
            uploader: e.uploader,
            recipients: e.recipients,
            createdAt: e.createdAt,
            dueDate: e.dueDate,
            comnts: e.comnts,
            status: effStatus,
            files: []
          };
        }        console.log("effStatus",acc[effStatus][e.uploadId])

        // add this file to that upload
        acc[effStatus][e.uploadId].files.push({
          name: e.file.originalName,
          status: hasDownloaded ? "Téléchargé" : effStatus,
          uploadDate: new Date(e.createdAt).toLocaleDateString(),
          downloadedBy: hasDownloadedList.length>0? e.file.downloadedBy:[] ,
        });
        return acc;
      }, {});
  
      // 6) set state
      setSentDocuments2({ data: sentView, count: sentView.length });
    console.log("recvByStatus",recvByStatus)
    const formattedOthers = {};
    for (const [status, uploadsMap] of Object.entries(recvByStatus)) {
      formattedOthers[status] = {
        count: Object.keys(uploadsMap).length,
        data: Object.values(uploadsMap).map(up => ({

          id: up.uploadId,
          code: generateUploadCode(up.createdAt, up.uploadId),
          color: generateUploadColor(up.uploadId),
          date: new Date(up.createdAt).toLocaleDateString(),
          dueDate: new Date(up.dueDate).toLocaleDateString(),
          status: up.status,
          comments: up.comnts,
          recipients: up.recipients.map(r => `${r.firstName} ${r.familyName.toUpperCase()}`),
          sender: {
            _id: up.uploader._id,
            firstName: up.uploader.firstName,
            familyName: up.uploader.familyName.toUpperCase(),
            email: up.uploader.email
          },
          files: up.files
        }))
      };
    }
      setOtherStatusDocs(formattedOthers);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError({ open: true, message: "Failed to fetch documents. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  
  
  return {
    loading,
    error,
    uploadFiles,
    sentDocuments,
    sentDocuments2,
    otherStatusDocs,
    recievedDocuments,
    fetchDocuments,
    fetchDocuments2,
    fetchDocuments3,
    getMyFiles,
    getFilesSentToMe,
    changeUploadStatus,
    changeFileStatus,
    downloadFile,
  };
};
