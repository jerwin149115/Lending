import { useNavigate } from 'react-router-dom';

function Logout({ setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login"); 
    };

    React.useEffect(() => {
        handleLogout();
    }, []);

    return null; 
}

export default Logout;
