import axios from 'axios';

export const API_URL = 'http://localhost:3030';

export const register = (values: { email: string; password: string }) => {
  return axios.post(`${API_URL}/register`, values);
};

export const login = (values: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, values);
};

export const getUserData = (userId: string, token: string) => {
  return axios.get(`${API_URL}/600/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchCharacters = (page = 1) => {
  return axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);
};

export const fetchRickAndMortyCharacters = (start = 0, limit = 10, token: string) => {
  return axios.get(`${API_URL}/rickandmorty?_start=${start}&_end=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchCharacterById = (id: string, token: string) => {
  return axios.get(`${API_URL}/rickandmorty/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const updateCharacter = (id: string, characterData: any, token: string) => {
  return axios.patch(`${API_URL}/rickandmorty/${id}`, characterData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const deleteCharacter = (id: string, token: string) => {
  return axios.delete(`${API_URL}/rickandmorty/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createCharacter = (characterData: any, token: string) => {
  return axios.post(`${API_URL}/rickandmorty`, characterData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

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