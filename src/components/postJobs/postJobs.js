import axios from 'axios'

const instance = axios.create({
    baseURL:'https://jobs-project-76477.firebaseio.com/'
  })

  export default instance;