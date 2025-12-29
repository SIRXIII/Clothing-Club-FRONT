import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,

  // authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
  authEndpoint: "http://clothing-club-back.test/broadcasting/auth",

  auth: {
    withCredentials: true,
  },
});

export default echo;