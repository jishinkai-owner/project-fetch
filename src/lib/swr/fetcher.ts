import axios from "axios";

const header = {
  "Content-Type": "application/json",
};

export const fetcher = (url: string) =>
  axios.get(url, { headers: header }).then((res) => res.data);
