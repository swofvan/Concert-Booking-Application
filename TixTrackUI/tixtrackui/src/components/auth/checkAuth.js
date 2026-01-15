import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const checkAuth = (Component) => {

    function Wrapper(props) {
        const user = useSelector((store) => store.auth.user);
        const navigate = useNavigate();

        useEffect(() => {
            if (!user) {
                navigate("/login");
            }
        }, [user, navigate]);

        if (!user) return null; // prevent flicker

        return <Component {...props} />;
    }

    return Wrapper;
};

export default checkAuth;
