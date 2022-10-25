const CARGO_ENDPOINT =
  import.meta.env.VITE_CARGO_ENDPOINT || "http://localhost:8000/cargo";

const ENDPOINT_VERTIPORTS = `${CARGO_ENDPOINT}/vertiports`;
const ENDPOINT_QUERY = `${CARGO_ENDPOINT}/query`;
const ENDPOINT_CONFIRM = `${CARGO_ENDPOINT}/confirm`;
const ENDPOINT_CANCEL = `${CARGO_ENDPOINT}/cancel`;

import axios from "axios";

/**
 *
 * @param {float} latitude Latitude of a location.
 * @param {float} longitude Longitude of a location.
 * @returns {Array} A list of vertiports.
 */
export async function getVertiports(latitude, longitude) {
  try {
    const response = await axios.post(ENDPOINT_VERTIPORTS, {
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {string} departPortId Departure vertiport ID.
 * @param {string} arrivePortId Arrival vertiport ID.
 * @param {Date} startTime The start of the pad departure window
 * @param {Date} endTime   The end of the pad departure window
 * @param {float} weightKg The weight of the cargo in kilograms
 * @returns {Promise} A list of possible flights.
 */
export async function queryFlight(
  departPortId,
  arrivePortId,
  startTime,
  endTime,
  weightKg
) {
  // GET method with json body
  const response = await fetch(ENDPOINT_QUERY, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      departPortId,
      arrivePortId,
      startTime,
      endTime,
      weightKg,
    }),
  });
  return await response.json();
}

/**
 *
 * @param {string} flightId The flight ID
 * @returns {Promise} Status: 201 if successful, 409 if not.
 */
export async function confirmFlight(flightId) {
  // PUT method with json body
  const response = await fetch(ENDPOINT_CONFIRM, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fp_id: flightId,
    }),
  });
  return await response.json();
}

/**
 *
 * @param {string} flightId The flight ID
 * @returns {Promise} Status: 200 if successful, 400 if not.
 */
export async function cancelFlight(flightId) {
  // PUT method with json body
  const response = await fetch(ENDPOINT_CANCEL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fp_id: flightId,
    }),
  });
  return await response.json();
}
