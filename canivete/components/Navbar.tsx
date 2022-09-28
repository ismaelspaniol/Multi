import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import { supabase } from '../utils/supabase'
import { useState, useEffect } from 'react'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  {'caption':'Pares',
   'link':'/pares'}, 
  {'caption':'trade',
   'link':'/trade'},
   {'caption':'Perfil',
   'link':'/profile'},
   {'caption':'Fichas',
   'link':'/files'}
  ];


export default function Navbar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
      <Button href={'/'}  sx={{ color: '#fff' }}>
              Home
            </Button>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.caption} disablePadding>
            <ListItemButton href={item.link} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.caption} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const container = window !== undefined ? () => window().document.body : undefined;


    return (    
      <>
      
      <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          <Button href={'/'}  sx={{ color: '#fff' }}>
              Home
            </Button>
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            <Button href={item.link} key={item.caption} sx={{ color: '#fff' }}>
              {item.caption}
            </Button>
          ))}
          <Button onClick={() => supabase.auth.signOut()}  sx={{ color: '#fff' }}>
              LogOut
            </Button>
        </Box>
      </Toolbar>
    </AppBar> 

    <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

    </> 
    )
}