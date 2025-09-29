import axios from "axios";

const form = document.querySelector("form") as HTMLFormElement;
const addressInput = document.getElementById("address") as HTMLInputElement;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
type googleGeoCodingRes = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = encodeURI(addressInput.value);

  axios
    .get<googleGeoCodingRes>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== "OK")
        throw new Error("Could not fetch location!");

      const coordinates = response.data.results[0].geometry.location;
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
}

form.addEventListener("submit", searchAddressHandler);
