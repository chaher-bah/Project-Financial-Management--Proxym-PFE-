import { TextField, Box, Typography,Grid } from "@mui/material";

const InputField = ({ label, name, value, onChange }) => (
  <Grid item xs={12} > 
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ width: '30%', fontWeight: 'bold' }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        name={name}
        value={value}
        onChange={onChange}
      />
    </Box>
  </Grid>
);

export default InputField;