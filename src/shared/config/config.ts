import { Platform } from 'react-native';

const getBaseUrl = () => {
  // For Android Emulator with adb reverse (run: adb reverse tcp:3000 tcp:3000)
  if (Platform.OS === 'android' && __DEV__) {
    // Using localhost with adb reverse is more reliable than 10.0.2.2
    return "http://localhost:3000/api/v1";
  }
  
  // For iOS Simulator or physical iOS device on same network
  if (Platform.OS === 'ios' && __DEV__) {
    // iOS Simulator can use localhost directly
    return "http://localhost:3000/api/v1";
  }
  
  // Production URL (update this when deploying)
  return "https://your-production-api.com/api/v1";
};

export const BASE_API_URL = getBaseUrl();

// Debug: Log the API URL in development
if (__DEV__) {
  console.log('🔗 API Base URL:', BASE_API_URL);
}
