// // src/routes/ProtectedRoute.jsx

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import LoadingSpinner from "./LoadingSpinner.jsx";

// export default function ProtectedRoute({ children, roles = [] }) {
//   const { user, loading } = useSelector((state) => state.auth);
//   const [showAlert, setShowAlert] = useState({ login: false, role: false });

//   // 1) 로그인 여부, 권한 검증 시점을 useEffect 안으로 이동
//   useEffect(() => {
//     if (!loading) {
//       if (!user || !user.email) {
//         setShowAlert({ login: true, role: false });
//       } else if (roles.length > 0 && !roles.includes(user.role)) {
//         setShowAlert({ login: false, role: true });
//       }
//     }
//   }, [loading, user, roles]);

//   // 2) 알림창은 렌더 직후(useEffect) 한 번만 띄우고 상태를 초기화
//   useEffect(() => {
//     if (showAlert.login) {
//       alert("로그인이 필요합니다.");
//       setShowAlert({ login: false, role: false });
//     } else if (showAlert.role) {
//       alert("권한이 없습니다.");
//       setShowAlert({ login: false, role: false });
//     }
//   }, [showAlert]);

//   // 3) 사용자 정보 조회 중에는 로딩 스피너
//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // 4) 로그인 필요 시 리다이렉트
//   if (!user || !user.email) {
//     return <Navigate to="/login" replace />;
//   }

//   // 5) 권한 부족 시 리다이렉트
//   if (roles.length > 0 && !roles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // 6) 조건 모두 통과 시 자식 컴포넌트 렌더링
//   return children;
// }

// src/routes/ProtectedRoute.jsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, replace, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useSelector((state) => state.auth);
  const [showAlert, setShowAlert] = useState({ login: false, role: false });
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const navigate = useNavigate();

  // 1) 로그인 여부, 권한 검증 시점을 useEffect 안으로 이동
  //   useEffect(() => {
  //     if (!loading) {
  //       if (!user || !user.email) {
  //         setOpenLoginModal({ login: true, role: false });
  //       } else if (roles.length > 0 && !roles.includes(user.role)) {
  //         setOpenLoginModal({ login: false, role: true });
  //       }
  //     }
  //   }, [loading, user, roles]);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.email) {
        setOpenLoginModal(true);
      }
    }
  }, [loading, user]);

  useEffect(() => {
    if (!loading) {
      if (roles.length > 0 && !roles.includes(user.role)) {
        setOpenRoleModal(true);
      }
    }
  }, [loading, user, roles]);

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
    navigate("/login", { replace: true });
  };

  const handleCloseRoleModal = () => {
    setOpenRoleModal(false);
  };

  // 2) 알림창은 렌더 직후(useEffect) 한 번만 띄우고 상태를 초기화
  //   useEffect(() => {
  //     if (showAlert.login) {
  //       alert("로그인이 필요합니다.");
  //       setShowAlert({ login: false, role: false });
  //     } else if (showAlert.role) {
  //       alert("권한이 없습니다.");
  //       setShowAlert({ login: false, role: false });
  //     }
  //   }, [showAlert]);

  // 3) 사용자 정보 조회 중에는 로딩 스피너
  if (loading) {
    return <LoadingSpinner />;
  }

  if (openLoginModal) {
    return (
      <Dialog
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        disableEscapeKeyDown
      >
        <DialogTitle>로그인이 필요합니다.</DialogTitle>
        <DialogContent>로그인 페이지로 이동하시겠습니까?</DialogContent>
        <Button onClick={handleCloseLoginModal} autoFocus>
          로그인 하러가기
        </Button>
      </Dialog>
    );
  }

  if (openRoleModal) {
    return (
      <Dialog
        open={openRoleModal}
        close={handleCloseRoleModal}
        disableEscapeKeyDownd
      >
        <DialogTitle>권한이 필요합니다.</DialogTitle>
        <DialogContent>권한을 확인해 주시길 바랍니다.</DialogContent>
        <Button onClick={handleCloseRoleModal} autoFocus>
          확인
        </Button>
      </Dialog>
    );
  }

  if (!user || !user.email) {
    return <LoadingSpinner />;
  }

  // 5) 권한 부족 시 리다이렉트
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 6) 조건 모두 통과 시 자식 컴포넌트 렌더링
  return children;
}
