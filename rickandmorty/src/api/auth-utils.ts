import { getUserData, getAuthToken, getUserId, clearAuthData, setAuthData } from "./axios-functions";

export interface AuthCheckResult {
  isAuthenticated: boolean;
  userData?: any;
}

export const checkAuthentication = async (): Promise<AuthCheckResult> => {
  const token = getAuthToken();
  const id = getUserId();
  
  if (!token || !id) {
    console.log("No token or user ID found");
    return { isAuthenticated: false };
  }
  
  console.log("User ID: ", id);
  console.log("Token found: ", token);

  try {
    const response = await getUserData(id as string, token);
    console.log('Data:', response.data);
    console.log("YOU ARE SIGNED IN");
    return { 
      isAuthenticated: true,
      userData: response.data
    };
  } catch (error) {
    console.error('Error:', error);
    return { isAuthenticated: false };
  }
};

export const logout = () => {
  clearAuthData();
  console.log("Logged out");
  return false;
};