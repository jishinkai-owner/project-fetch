import axios from "axios";
type HikeInfoEntryProps = {
  year: number | null;
  date: string | null;
  place: string | null;
};

const handleSubmit = (e: HikeInfoEntryProps) => {
  console.log("posting hike info...", e.year, e.date, e.place);

  const data = {
    year: e.year,
    date: e.date,
    place: e.place,
    activityType: "yama",
  };

  axios
    .post("/api/record", data)
    .then((res) => {
      console.log("response from server: ", res);
      if (res.status === 200) {
        console.log("hike info posted successfully");
      }
    })
    .catch((error) => {
      console.error("API Error while posting hike info data: ", error);
    });
};

export default handleSubmit;
