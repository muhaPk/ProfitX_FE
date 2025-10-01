import { Platform } from 'react-native';

const getBaseUrl = () => {
  // For Android Emulator
  if (Platform.OS === 'android' && __DEV__) {
    // Use 10.0.2.2 for Android Emulator or your local IP for physical device
    // Change to your Mac's IP (192.168.0.102) if testing on physical device
    return "http://192.168.0.102:3000/api/v1";
  }
  
  // For iOS Simulator or physical iOS device on same network
  if (Platform.OS === 'ios' && __DEV__) {
    return "http://192.168.0.102:3000/api/v1";
  }
  
  // Production URL (update this when deploying)
  return "https://your-production-api.com/api/v1";
};

export const BASE_API_URL = getBaseUrl();
