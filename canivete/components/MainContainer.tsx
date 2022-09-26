import Footer from './Footer'
import Navbar from './Navbar'
import Box from '@mui/material/Box';
import Toolbar from "@mui/material/Toolbar";
import Container from '@mui/material/Container';

export default function MainContainer({children} : any){
    return (
        <>
    
        <Box  sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',          
        }}>
            <Navbar />
            <Box   component="main"  sx={{ p: 2, width:'100%' }}>
            <Toolbar />            
                {children}
            </Box>
            
        </Box>
        
      
        <Footer />
        </>
    )
}