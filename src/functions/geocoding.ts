// GeoDB Cities API + Google Maps API para btener el Pais , Provincia y Ciudad en Tiempo real
import axios from "axios";
import { AddressComponent, LocationDetails} from "../Interfaces/iGoogleMaps";

export const getLocationDetails = async (
  lat: number,
  lng: number,
  apiKey: string
): Promise<LocationDetails | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const res = await axios.get(url);
    const data = res.data;

    if (data.status !== "OK") {
      console.error("Google Maps Geocoding API error:", data.status);
      return null;
    }

    let country = "";
    let state = "";
    let city = "";

    // Normalmente la info más fiable está en results[0].address_components
    const components = data.results[0]?.address_components;

    if (!components) return null;

    components.forEach((component: AddressComponent) => {
      const types = component.types;

      if (types.includes("country")) {
        country = component.short_name;
      } else if (types.includes("administrative_area_level_1")) {
        state = component.short_name;
      } else if (
        types.includes("locality") ||
        types.includes("sublocality") ||
        types.includes("administrative_area_level_2")
      ) {
        city = component.long_name;
      }
    });

    return { country, state, city };
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
};

