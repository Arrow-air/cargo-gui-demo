import { createApp } from "vue";
import App from "./App.vue";
import Vue3Lottie from "vue3-lottie";
import VCalendar from "v-calendar";
import "v-calendar/dist/style.css";
import BalmUI from "balm-ui"; // Official Google Material Components

import "balm-ui-css";

const script = document.createElement("script");
script.setAttribute(
  "src",
  `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=places&region=us`
);
script.setAttribute("defer", "true");
document.head.appendChild(script);

const app = createApp(App).use(BalmUI).use(VCalendar).use(Vue3Lottie);
app.provide("google", window.google);

app.mount("#app");
