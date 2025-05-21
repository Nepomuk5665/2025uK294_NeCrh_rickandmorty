import axios from 'axios';

export const API_URL = 'http://localhost:3030';


const api = axios.create({
  baseURL: API_URL
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const register = (values: { email: string; password: string }) => {
  return api.post('/register', values);
};

export const login = (values: { email: string; password: string }) => {
  return api.post('/login', values);
};

export const getUserData = (userId: string) => {
  return api.get(`/600/users/${userId}`);
};


export const fetchRickAndMortyCharacters = (start = 0, limit = 10) => {
  return api.get(`/rickandmorty?_start=${start}&_end=${limit}`);
};

export const fetchCharacterById = (id: string) => {
  return api.get(`/rickandmorty/${id}`);
};

export const updateCharacter = (id: string, characterData: any) => {
  return api.patch(`/rickandmorty/${id}`, characterData);
};

export const deleteCharacter = (id: string) => {
  return api.delete(`/rickandmorty/${id}`);
};

export const createCharacter = (characterData: any) => {
  return api.post('/rickandmorty', characterData);
};

// Local storage functions
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getUserId = () => {
  return localStorage.getItem('id');
};

export const setAuthData = (token: string, userId: string | number) => {
  localStorage.setItem('token', token);
  localStorage.setItem('id', JSON.stringify(userId));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('id');
};