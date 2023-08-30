import Axios from "axios";
const userAPI = {
  getUser: async () => {
    const res = await Axios.get("http://localhost:8000/user/get-user");
    return res.data;
  },
  login: async (username, password) => {
    try {
      const res = await Axios.post("http://localhost:8000/user/login/", {
        username,
        password,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  /*logout: async (username) => {
    const res = await Axios.delete("http://localhost:8000/user/logout/", {
      username,
    });
    return res.data;
  },*/
};
export default userAPI;
