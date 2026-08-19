import { SimulationConfig } from "../types";
import { urlShortenerSimulation } from "./url-shortener";

/**
 * Every system this simulator can walk through. Adding one is a data-only
 * change: write its levels, then add it here.
 *
 * The first entry is what the app opens on.
 */
export const simulations: SimulationConfig[] = [urlShortenerSimulation];

export const getSimulation = (id: string): SimulationConfig =>
  simulations.find((simulation) => simulation.id === id) ?? simulations[0];
