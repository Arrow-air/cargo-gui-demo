<script setup>
import { ref, watch } from "vue";
import CalendarView from "./components/CalendarView.vue";
import "./assets/main.css";
import "./assets/base.css";
import NavBar from "./components/NavBar.vue";
import ClientHelperBox from "./components/ClientHelperBox.vue";

const pickUpLocation = ref("");
const pickUpLocations = ref([]);
const pickUpLocationCoordinates = ref([]);

const dropOffLocation = ref("");
const dropOffLocations = ref([]);
const dropOffLocationCoordinates = ref([]);

const googlePlacesService = ref(null);

const quotes = ref([]);
const fetchedQuotes = ref(false);

const handleClick = () => {};

const displaySuggestions = (locations) => (predictions, status) => {
  if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
    locations.value = [];
    return;
  }

  locations.value = predictions.map((prediction) => ({
    label: prediction.description,
    value: prediction.place_id,
  }));
};

const setLocationCoordinates = (place_obj, coordinates) => {
  var geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ placeId: place_obj.value }, (results, status) => {
    if (status !== "OK" || !results[0]) {
      return;
    }
    coordinates.value = [
      results[0].geometry.location.lat(),
      results[0].geometry.location.lng(),
    ];
  });
};

watch(pickUpLocation, (newValue) => {
  if (newValue === "") {
    pickUpLocations.value = [];
    pickUpLocationCoordinates.value = [];
    return;
  }
});

const searchLocation = (location, locations) => {
  if (googlePlacesService.value === null) {
    googlePlacesService.value =
      new window.google.maps.places.AutocompleteService();
  }

  googlePlacesService.value.getPlacePredictions(
    {
      input: location,
      types: ["(cities)"],
    },
    displaySuggestions(locations)
  );
};
</script>

<template>
  <div class="min-h-screen bg-slate-200">
    <NavBar />
    <div class="flex flex-col justify-center items-center">
      <div class="flex flex-1 mt-10">
        <div v-if="fetchedQuotes">
          <h1 class="font-black text-3xl pb-5">Select a quote</h1>
          <CalendarView />
        </div>
        <div v-else class="w-[50vw]">
          <h1 class="font-black text-3xl pb-5">Create shipment</h1>
          <div
            class="bg-white flex flex-wrap flex-col justify-center rounded-xl shadow-lg z-30 p-2 mb-20"
          >
            <div class="flex justify-center flex-wrap">
              <ui-autocomplete
                class="p-2"
                v-model="pickUpLocation"
                :source="pickUpLocations.value"
                remote
                @search="
                  (pickUpLocation) =>
                    searchLocation(pickUpLocation, pickUpLocations)
                "
                @selected="
                  (item) =>
                    setLocationCoordinates(item, pickUpLocationCoordinates)
                "
                >Pick up location</ui-autocomplete
              >

              <ui-autocomplete
                class="p-2"
                v-model="dropOffLocation"
                :source="dropOffLocations.value"
                remote
                @search="searchLocation(dropOffLocation, dropOffLocations)"
                @selected="
                  (item) =>
                    setLocationCoordinates(item, dropOffLocationCoordinates)
                "
                >Drop off location</ui-autocomplete
              >
            </div>
            <div class="flex justify-center my-2">
              <button
                class="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:hover:bg-black"
                @click="handleClick"
                :disabled="
                  !pickUpLocationCoordinates.value ||
                  !dropOffLocationCoordinates.value
                "
              >
                Get quotes
              </button>
            </div>
          </div>

          <ClientHelperBox />
        </div>
      </div>
    </div>
  </div>
</template>
