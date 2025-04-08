import { Typography, Grid } from "@mui/material";

const DataField = ({ label, value }) => (
  <Grid item xs={12}>
    <Typography variant="subtitle1" fontWeight="bold">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
      {value}
    </Typography>
  </Grid>
);

export default DataField;