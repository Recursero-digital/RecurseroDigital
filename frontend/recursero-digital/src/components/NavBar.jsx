import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export function NavBar({ tabs, activeTab, onTabChange}) {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    onTabChange(tab.id);
    navigate(tab.path);
  };

  return (
    <nav className="navbar">
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