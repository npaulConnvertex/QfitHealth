import {AsyncStorage} from 'react-native';
  export const getData=async()=>{
    var access_token = await AsyncStorage.multiGet(['access_token']);
    return access_token;
  } 
   export const  getName=async()=>{
    var businessName = await AsyncStorage.getItem('businessName')
    return businessName;
  }