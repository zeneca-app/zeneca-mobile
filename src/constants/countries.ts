import { countries } from "countries-list";

/**
 * List of countries with their codes and names, excluding certain countries and prioritizing others.
 *
 * EXCLUDED_COUNTRY_CODE: Array of country codes to be excluded from the list.
 * PRIORITY_COUNTRY_CODE: Array of country codes to be prioritized in the list.
 * COUNTRIES_LIST: Array of country objects with code and name, sorted by priority.
 * COUNTRIES: Original list of countries from the "countries-list" package.
 */

export const EXCLUDED_COUNTRY_CODE: string[] = [];

export const PRIORITY_COUNTRY_CODE: string[] = ["PA", "CO"];

export const COUNTRIES_LIST = Object.entries(countries)
  .reduce<{ code: string; name: string }[]>((acc, [key, value]) => {
    if (EXCLUDED_COUNTRY_CODE.includes(key)) return acc;
    return [...acc, { code: key, name: value.name }];
  }, [])
  .sort((a, b) => {
    if (PRIORITY_COUNTRY_CODE.includes(a.code)) return -1;
    if (PRIORITY_COUNTRY_CODE.includes(b.code)) return 1;
    return 0;
  });

export const COUNTRIES = countries;
