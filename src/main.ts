import axios from "axios";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

type latLng = { lat: number; lng: number };
type googleGeoCodingRes = {
  results: { geometry: { location: latLng } }[];
  status: "OK" | "ZERO_RESULTS";
};

const form = document.querySelector("form") as HTMLFormElement;
const addressInput = document.getElementById("address") as HTMLInputElement;
const mapEl = document.getElementById("map") as HTMLDivElement;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

setOptions({ key: GOOGLE_API_KEY, v: "weekly" });
const { Map } = await importLibrary("maps");
await google.maps.importLibrary("marker");

async function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = encodeURI(addressInput.value);

  try {
    const response = await axios.get<googleGeoCodingRes>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${GOOGLE_API_KEY}`
    );

    if (response.data.status !== "OK")
      throw new Error("Could not fetch location!");

    const coordinates = response.data.results[0].geometry.location;

    const map = new Map(mapEl, {
      center: coordinates,
      zoom: 15,
      mapId: crypto.randomUUID(),
    });

    new google.maps.marker.AdvancedMarkerElement({
      map,
      position: coordinates,
    });
  } catch (error: any) {
    alert(error.message);
    console.log(error);
  }
}

form.addEventListener("submit", searchAddressHandler);
