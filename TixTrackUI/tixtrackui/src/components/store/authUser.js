export const saveAuthUser = (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
};

export const getAuthUser = () => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
};

export const clearAuthUser = () => {
    localStorage.removeItem("authUser");
};