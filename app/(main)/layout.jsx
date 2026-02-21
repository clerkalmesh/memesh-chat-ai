
import DashboardProvider from "./provider";

export default function DashboardLayout({ children }) {
    
    return (
        <div>
            <DashboardProvider >
                {children}
            </DashboardProvider>
        </div>
    );
};