import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, TextField } from '@mui/material';

const Reports = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Handle file upload logic here
    console.log('File uploaded:', selectedFile);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          type="file"
          onChange={handleFileChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mt: 2 }}
        >
          Upload
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Documents to be revised</Typography>
              {/* Add content here */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Documents revised</Typography>
              {/* Add content here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;