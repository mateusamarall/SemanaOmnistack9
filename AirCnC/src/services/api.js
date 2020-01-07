import axios from 'axios';

const api = axios.create({
	baseURL: 'http://youriphere:3333' //put your ip here before the ':'
});

export default api;
