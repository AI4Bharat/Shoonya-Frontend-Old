const ACCESS_TOKEN = 'shoonya_access_token';
const REFRESH_TOKEN = 'shoonya_refresh_token';

export const login = (res) => {
    localStorage.setItem(ACCESS_TOKEN, res.data.access);
    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
};

export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
}

export const isLogin = () => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
        return true;
    }
    return false;
}