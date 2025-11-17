import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${import.meta.env.VITE_API_URL || 'https://travelclothingclub-partner.online/api'}/broadcasting/auth`,
  auth: {
    headers: {
      get Authorization() {
        return `Bearer ${localStorage.getItem("auth_token")}`;
      },
    },
  },
});

export default echo;
