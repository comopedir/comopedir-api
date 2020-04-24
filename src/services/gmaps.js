import { Client, Status } from  "@googlemaps/google-maps-services-js";

class gmaps {
  constructor(options = {}) {
    this.options = options;

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error(
        'Google Maps API access requires a key as the GOOGLE_MAPS_API_KEY environment variable.'
      );
    }

    this.client = new Client({});

    this.client
      .placeAutocomplete({
        params: {
          input: 'Evvai',
          key: process.env.GOOGLE_MAPS_API_KEY,
        }
      }).then((r) => {
        if (r.data.status === Status.OK) {
          console.log(r.data);
        } else {
          console.log(r.data.error_message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

export default gmaps;