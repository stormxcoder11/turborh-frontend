import axios from "axios";
import { getAxiosBaseUrl } from "src/services/profiles"
//Server turbomaquinas
// axios.defaults.baseURL = "http://192.168.20.59:8181" 

//Localhost
axios.defaults.baseURL = getAxiosBaseUrl(); 

export { axios };
