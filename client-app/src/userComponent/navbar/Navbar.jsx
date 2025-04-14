// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Badge,
//   Box,
// } from "@mui/material";
// import {
//   AccountCircle,
//   Notifications as NotificationsIcon,
// } from "@mui/icons-material";
// import axios from "axios";

// export default function PrimarySearchAppBar() {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [user, setUser] = useState(null);

//   const isMenuOpen = Boolean(anchorEl);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8282/api/auth/me", { withCredentials: true })
//       .then((res) => {
//         setUser(res.data);
//       })
//       .catch((err) => {
//         console.error("유저 정보 불러오기 실패:", err);
//         setUser(null);
//       });
//   }, []);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // ✅ 로그아웃 처리 함수
//   const handleLogout = () => {
//     axios
//       .post(
//         "http://localhost:8282/api/auth/logout",
//         {},
//         { withCredentials: true }
//       )
//       .then(() => {
//         alert("로그아웃 되었습니다.");
//         setUser(null);
//         window.location.href = "/login";
//       })
//       .catch((err) => {
//         console.error("로그아웃 실패:", err);
//         alert("로그아웃 중 문제가 발생했습니다.");
//       });
//   };

//   const menuId = "primary-search-account-menu";
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <MenuItem disabled>
//         {user?.name ? `${user.name}님, 환영합니다` : "로그인되지 않음"}
//       </MenuItem>
//       <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
//       <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//       <MenuItem onClick={handleLogout}>Logout</MenuItem>
//     </Menu>
//   );

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography
//             variant="h6"
//             noWrap
//             component="div"
//             sx={{ display: { xs: "none", sm: "block" } }}
//           >
//             H@urXchange
//           </Typography>

//           <Box sx={{ flexGrow: 1 }} />

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <IconButton
//               size="large"
//               aria-label="show notifications"
//               color="inherit"
//             >
//               <Badge badgeContent={17} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>

//             <IconButton
//               size="large"
//               edge="end"
//               aria-label="account of current user"
//               aria-controls={menuId}
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               color="inherit"
//             >
//               {user?.name ? (
//                 <Typography variant="subtitle1">
//                   {user.name.charAt(0)}
//                 </Typography>
//               ) : (
//                 <AccountCircle />
//               )}
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       {renderMenu}
//     </Box>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
} from "@mui/material";
import {
  AccountCircle,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logoutUser } from "../../state/auth/Action";

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (!user && !isLoading && !error) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, isLoading, error]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        alert("로그아웃 되었습니다.");
        window.location.href = "/login";
      })
      .catch((err) => {
        console.error("로그아웃 실패:", err);
        alert("로그아웃 중 문제가 발생했습니다.");
      });
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem disabled>
        {user?.name
          ? `${user.name}님, 환영합니다`
          : isLoading
          ? "로딩 중..."
          : "로그인되지 않음"}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            H@urXchange
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user?.name ? (
                <Typography variant="subtitle1">
                  {user.name.charAt(0)}
                </Typography>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}
