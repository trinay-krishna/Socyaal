import { useNavigate } from "react-router-dom";

function getAPIURL() {
    const API_URL = import.meta.env.VITE_API_URL;

    return API_URL;
}

function getClientURL() {
    const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

    return CLIENT_URL;
}

function checkAuth( res ) {

    if ( !res.success && res.auth === false ){
        window.location.href = `${getClientURL()}/`;
        return false;
    } 
    
    return true;
}

export { getAPIURL, checkAuth, getClientURL };
