import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { LoginDialog } from "./loginDialogue";
import { UserContext } from "../Context/userContext";
import { useContext } from "react";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const [openLoginDialogue, setOpenLoginDialogue] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const { login, user, logout, isUserAdmin } = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Login Dialoue
  const handleClickOpenLoginDialogue = () => {
    setOpenLoginDialogue(true);
  };

  const handleCloseLoginDialogue = () => {
    setOpenLoginDialogue(false);
  };

  const handleSubmit = async (username, password) => {
    await login(username, password);
    setOpenLoginDialogue(false);
    navigate("/books");
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate("/");
  };

  //Handle Profile Menues
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBorrowRequestsClick = () => {
    handleMenuClose();
    navigate("/books/admin/borrow-requests");
  };

  const handleBorrowedBooksByUser = () => {
    handleMenuClose();
    navigate("/books/borrowed-books");
  };

  const handleRequestedBooksByUser = () => {
    handleMenuClose();
    navigate("/books/requested-books");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isUserAdmin ? (
        <div>
          <MenuItem onClick={handleBorrowRequestsClick}>Requests</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </div>
      ) : (
        <div>
          <MenuItem onClick={handleBorrowedBooksByUser}>
            Borrowed Books
          </MenuItem>
          <MenuItem onClick={handleRequestedBooksByUser}>
            Requested Books
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontFamily: "Monospace", letterSpacing: 5 }}
          >
            Your Library
          </Typography>
          {user ? (
            <IconButton
              size="small"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
          ) : (
            <Button color="inherit" onClick={handleClickOpenLoginDialogue}>
              Login
            </Button>
          )}

          <LoginDialog
            open={openLoginDialogue}
            handleSubmit={handleSubmit}
            handleClose={handleCloseLoginDialogue}
          />
        </Toolbar>

        <div>
          <NotificationContainer />
        </div>
      </AppBar>
      {renderMenu}
    </Box>
  );
};
