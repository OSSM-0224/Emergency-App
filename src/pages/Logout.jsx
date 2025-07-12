import { Logout } from "@mui/icons-material";
import Header from "../components/Header";

export default function LogoutPage() {
    return (
        <div>
        <Header 
        icon={
            <img
                src="https://img.icons8.com/fluency/48/logout-rounded-left.png"
                alt="Logout"
                style={{ width: 48, height: 48 }}
            />
        }
        />
        <div style={{ textAlign: "center", marginTop: 40 }}>
        <h2 style={{ color: "#60a5fa" }}>You have been logged out!</h2>
        <p style={{ color: "#cbd5e1", fontSize: 18 }}>
          Thank you for using the admin panel.<br />
          <a href="/" style={{ color: "#7dd3fc", textDecoration: "underline" }}>
            Go back to Dashboard
          </a>
        </p>
      </div>
    </div>
    )
}