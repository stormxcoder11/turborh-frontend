import axios from "axios";
import { ref } from "vue";
// Response interceptor
export const axiosErrorResponseStatus = ref(0)


export const initInterceptors = (router) => {

  axios.interceptors.response.use(
    response => {
      // Handle successful response
      console.log('Response received:', response.status);
      return response;
    },
    error => {
      // Handle response error
      axiosErrorResponseStatus.value = error.response.status

      if(axiosErrorResponseStatus.value === 401 || axiosErrorResponseStatus.value === 403){
        router.replace("/login").catch(() => {});
      }

      return Promise.reject(error);
    }
  );
}
