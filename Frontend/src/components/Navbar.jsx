import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import AddExpenseModal from "./AddExpenseModal.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../api/axios";

// 3D Animated Logo Component
function NavLogo3D() {
  return (
    <div className="logo-3d-container">
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }} style={{ width: 40, height: 40 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 2, 2]} intensity={1} />
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.3}>
          <mesh>
            <torusGeometry args={[0.3, 0.12, 16, 32]} />
            <MeshDistortMaterial color="#22c55e" speed={3} distort={0.4} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}

const PREBUILT_AVATARS = [
  { id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar1' },
  { id: '2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar2' },
  { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar3' },
  { id: '4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar4' },
  { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar5' },
  { id: '6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar6' },
  { id: '7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar7' },
  { id: '8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=avatar8' }
];

const Navbar = ({ theme, toggleTheme }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const res = await api.get("/profile");
          setProfile(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const getAvatarUrl = () => {
    // Priority: Google profile picture > uploaded avatar > generated avatar
    if (user?.profilePicture) {
      return user.profilePicture;
    }
    if (!profile) return 'https://via.placeholder.com/32';
    if (profile.avatarType === 'upload') {
      return profile.avatarData;
    } else {
      const avatar = PREBUILT_AVATARS.find(a => a.id === profile.avatarData);
      return avatar ? avatar.url : PREBUILT_AVATARS[0].url;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        {/* 3D Background Effect */}
        <div className="navbar-3d-bg">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <mesh position={[-3, 0, -1]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <MeshDistortMaterial color="#22c55e" speed={2} distort={0.3} transparent opacity={0.4} />
              </mesh>
            </Float>
            <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
              <mesh position={[3, 0, -1]}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <MeshDistortMaterial color="#3b82f6" speed={2.5} distort={0.3} transparent opacity={0.4} />
              </mesh>
            </Float>
          </Canvas>
        </div>
        
        <div className="navbar-left">
          <NavLogo3D />
          <span className="logo-text">SmartSpend</span>
        </div>
        <nav className="navbar-middle">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Expenses
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Budget
          </NavLink>
          <NavLink to="/split" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Split View
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Profile
          </NavLink>
        </nav>
        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <div className="nav-user-info">
                <img src={getAvatarUrl()} alt="Avatar" className="nav-avatar" />
                <span className="nav-user">{user.name}</span>
              </div>
              <button className="secondary-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
          <button
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            + Add Expense
          </button>
        </div>
      </header>

      {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} />}
    </>
  );
};

export default Navbar;