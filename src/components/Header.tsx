import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// import AdbIcon from '@mui/icons-material/Adb';
import robotronics from "../assets/Robotrinic.svg";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: '#f5f5f5', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
        color: 'black',          
        margin: '16px 0px', 
        padding: '10px 0px',       
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for medium screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', mr: 2 }}>
            <Box
              component="img"
              src={robotronics}
              alt="Robotronics"
              sx={{
                width: { xs: '30px', md: '30px' }, 
                height: 'auto',                   
              }}
            />
          </Box>

          {/* Text Logo */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Robotronics
          </Typography>

          {/* Menu Icon for small screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Spacer for alignment */}
          <Box sx={{ flexGrow: 1 }} />

          {/* User Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* User Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
                John Doe
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                Software Engineer
              </Typography>
            </Box>
            {/* User Avatar */}
            <Avatar alt="John Doe" src="/static/images/avatar/2.jpg" />
            {/* Logout Button */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => alert('Logged out')}
              sx={{
                textTransform: 'none',
                ml: 'auto',
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
