import React from 'react';
import { Box, Typography } from '@mui/material';

const DateDiffIndicator = ({ dueDate }) => {
  // Convert dueDate string to Date object if it's not already
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();
  
  // Calculate difference in days (ignoring time)
  const diffTime = dueDateObj.setHours(0,0,0,0) - today.setHours(0,0,0,0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determine color based on days remaining
  let backgroundColor;
  if (diffDays >= 10) {
    backgroundColor = '#4caf50'; // Green
  } else if (diffDays >= 2) {
    backgroundColor = '#ff9800'; // Yellow/Orange
  } else {
    backgroundColor = '#f44336'; // Red
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderRadius: '16px',
        padding: '3px 10px',
        width: 'fit-content',
        minWidth: '40px',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      <Typography variant="caption">
        {diffDays > 0 ? `J-${diffDays}` : diffDays === 0 ? "Aujourd'hui" : `Retard ${Math.abs(diffDays)}j`}
      </Typography>
    </Box>
  );
};

export default DateDiffIndicator;