import axios from "axios";

export default function PostForm(data, url) {
  const formData = new FormData();
  for (let key in data) {
    formData.append(key.toString(), data[key].toString());
  }

  console.log(formData);
  //   formData.append("accessToken", localStorage.getItem("accessToken"));

  return axios.post(url, formData, {
    "Content-Type": "multipart/form-data",
  });
}
