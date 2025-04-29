import { Typography, Grid } from "@mui/material";

const DataField = ({ label, value }) => (
  <Grid item xs={12}>
    <Typography variant="subtitle1" fontWeight="bold">
      {label}
    </Typography>

    {Array.isArray(value) ? (
      value.map((role, idx) => (
        <Typography key={idx} variant="body1" sx={{ mt: 2,mb: 2 }}>
          - {role.toUpperCase()}
        </Typography>
      ))
    ) : (
      <Typography variant="body1" sx={{ m: 1 ,mb: 2 }}>
        {value}
      </Typography>
    )}
  </Grid>
);

export default DataField;
