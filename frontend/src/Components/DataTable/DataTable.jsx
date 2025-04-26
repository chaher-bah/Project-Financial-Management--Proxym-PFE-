import {useNavigate} from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import {Box, Container,Typography,Button} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const DataTable = ({ columns, rows,title ,backPath}) => {
    const navigate = useNavigate();

    return(
        <Container className="data-table-container">
            <Box className="data-table-header" sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{m:2.5,fontWeight:"600"}}>{title}</Typography>
            {backPath && (
                <Button onClick={() => navigate(backPath)} className="back-button" variant="contained" color="primary" sx={{marginLeft: 2}}>
                <ArrowBackIcon sx={{marginRight: 1}}/>
                Retour à la liste des documents
                </Button>
            )}
            </Box>
            <Box className="data-table-content" sx={{width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    width="100%"
                    disableSelectionOnClick 
                    getRowId={(row) => row.id} // Assuming each row has a unique 'id' field
                    sx={{
                        color: '#333',
                        '& .MuiDataGrid span': {
                            color: '#333',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#dbd8e3',
                            fontFamily: 'System-ui, sans-serif',
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-filler': {
                            backgroundColor: '#dbd8e3',
                        },
                        '& .MuiDataGrid-row': {
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                        },
                        '& .MuiDataGrid-cell': {
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-header': {
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: '#dbd8e3',
                        },
                       
                        '& .MuiPopper-root MuiDataGrid-panel': {
                            color: '#333',
                        },
                        '& .MuiDataGrid-columnHeaderTitleContainer': {
                            justifyContent: 'center',
                        },
                        
                    }}
                />
            </Box>

        </Container>
    )
}

export default DataTable;