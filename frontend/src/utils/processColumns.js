export const processUploads = (uploads) => {
    return uploads.map(upload => ({
      id: upload.id,
      uploadCode: upload.code,
      from: upload.sender.name?upload.sender.name:upload.sender.firstName + " " + upload.sender.familyName.toUpperCase(),
      to: upload.recipients.join(", "),
      date: new Date(upload.dueDate).toLocaleDateString(),
      uploadColor: upload.color,
      comnts: upload.comments,
      status: upload.status,
      files: upload.files.map(file => ({
        
        id: file.name,
        fileName: file.name,
        parentId: upload.id,
        fileStatus: file.status,
        uploadDate: new Date(file.uploadDate).toLocaleDateString(),
        downloadedBy: Array.isArray(file.downloadedBy) && file.downloadedBy.length > 0
        ? file.downloadedBy.map(d => d.user? ` ${d.user.firstName} ${d.user.familyName.toUpperCase()}` : "Utilisateur").join(", ")
        : "Non téléchargé",        }))
    }));
  };



 export const processFileUploads = (uploads) => {
    // flatten uploads and files for table rows
    let rows = [];
    uploads.forEach((upload) => {
      upload.files.forEach((file) => {
        rows.push({
          id: `${upload.id}-${file.name}`,
          uploadCode: upload.code,
          fileName: file.name,
          from:
            upload.sender.firstName +
            " " +
            upload.sender.familyName.toUpperCase(),
          uploadDate: new Date(file.uploadDate).toLocaleDateString(),
          to: upload.recipients.join(", "),
          downloadedBy:
            Array.isArray(file.downloadedBy) && file.downloadedBy.length > 0
              ? file.downloadedBy
                  .map((d) =>
                    d.user
                      ? `${d.user.firstName} ${d.user.familyName.toUpperCase()}`
                      : "Utilisateur"
                  )
                  .join(", ")
              : "Non téléchargé",
          date: new Date(upload.dueDate).toLocaleDateString(),
          parentId: upload.id,
          files: [{ ...file, parentId: upload.id }],
        });
      });
    });
    return rows;
  };