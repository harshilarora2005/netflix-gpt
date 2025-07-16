export const DEFAULT_PROFILE = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"

export const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer' + import.meta.env.VITE_TMDB_KEY,
    }
};

export const IMG_CDN = "https://image.tmdb.org/t/p/w500/";