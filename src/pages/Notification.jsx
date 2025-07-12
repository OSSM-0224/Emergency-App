import Header from "../components/Header";

export default function Notification() {
    return (
        <div>
            <Header
                icon={
                    <img
                        src="https://img.icons8.com/fluency/48/appointment-reminders.png"
                        alt="Notifications"
                        style={{ width: 48, height: 48 }}
                    />
                }
            />
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <h2 style={{ color: "#60a5fa" }}>Notifications</h2>
                <p style={{ color: "#cbd5e1", fontSize: 18 }}>
                    Manage all your recent alerts and notifications here.
                </p>
                {/* Add your notification management components here */}
            </div>
        </div>
    );
}