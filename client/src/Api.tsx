import axios from 'axios';

const initiateAuthFlow = () => {
  window.location.assign('http://localhost:3000/login')
}

const getItems = (type: any, time_range: any, access_token: any): any => {
  const response = axios.get('http://localhost:3000/items', {
    params: {
      type,
      time_range,
      access_token
    }
  })

  return response;
}

const API = {
  initiateAuthFlow,
  getItems
}

export default API;
