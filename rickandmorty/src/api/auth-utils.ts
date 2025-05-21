import { getUserData, getAuthToken, getUserId, clearAuthData } from "./axios-functions";

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
    const response = await getUserData(id as string);
    console.log('Data:', response.data);
    console.log("YOU ARE SIGNED IN");
    return { 
      isAuthenticated: true,
      userData: response.data
    };
  } catch (error) {
    console.error('Error:', error);
    // Handle token expiration - if 401 Unauthorized, clear the token
    if (error.response && error.response.status === 401) {
      console.log("Token expired or invalid. Logging out...");
      logout();
    }
    return { isAuthenticated: false };
  }
};

export const logout = () => {
  clearAuthData();
  console.log("Logged out");
  return false;
};