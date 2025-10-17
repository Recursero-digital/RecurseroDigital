import { useNavigate } from "react-router-dom";
import "../../styles/layouts/navbar.css";

export function NavBar({ tabs, activeTab, onTabChange, userRole}) {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    onTabChange(tab.id);
    navigate(tab.path);
  };

  return (
    <nav className={`navbar ${userRole}`}>
      <div className="navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab)} 
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}