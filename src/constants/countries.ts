import { Country, ICountry } from "country-state-city";

export const LATIN_AMERICA_FLAGS: { [key: string]: string } = {
  AR: "🇦🇷", // Argentina
  BO: "🇧🇴", // Bolivia
  BR: "🇧🇷", // Brazil
  CL: "🇨🇱", // Chile
  CO: "🇨🇴", // Colombia
  CR: "🇨🇷", // Costa Rica
  DO: "🇩🇴", // Dominican Republic
  EC: "🇪🇨", // Ecuador
  SV: "🇸🇻", // El Salvador
  GT: "🇬🇹", // Guatemala
  HN: "🇭🇳", // Honduras
  MX: "🇲🇽", // Mexico
  PA: "🇵🇦", // Panama
  PY: "🇵🇾", // Paraguay
  PE: "🇵🇪", // Peru
  PR: "🇵🇷", // Puerto Rico
  UY: "🇺🇾", // Uruguay
};

export const EXCLUDED_COUNTRY_CODE: string[] = [
  // Also, in cooperation with U.S. Office of Foreign Assets Control (OFAC),
  // Financial Action Task Force (FATF), and other U.S. and international regulatory bodies,
  // we regretfully cannot support business activities in some countries:
  "AF", // Afghanistan
  "BY", // Belarus
  "BA", // Bosnia and Herzegovina
  "CF", // Central African Republic
  "HR", // Croatia
  "CU", // Cuba
  "CD", // Democratic Republic of Congo
  "ET", // Ethiopia
  "GW", // Guinea-Bissau
  "IR", // Iran
  "IQ", // Iraq
  "XK", // Kosovo (Note: Not all systems recognize this code)
  "LB", // Lebanon
  "LY", // Libya
  "MK", // North Macedonia
  "ML", // Mali
  "ME", // Montenegro
  "MM", // Myanmar
  "NI", // Nicaragua
  "KP", // North Korea
  "RU", // Russian Federation
  "RS", // Serbia
  "SI", // Slovenia
  "SO", // Somalia
  "SS", // South Sudan
  "SD", // Sudan
  "SY", // Syria
  "UA", // Ukraine
  "VE", // Venezuela
  "YE", // Yemen
  "ZW", // Zimbabwe
  //Dinari is in the process of securing proper licensing to operate:
  "US", // United States
  "CA", // Canada
];

export const LATIN_AMERICA_COUNTRY_CODE: string[] = [
  //"AR", // Argentina
  //"BO", // Bolivia
  //"BR", // Brazil
  //"CL", // Chile
  "PA", // Panama
  "CO", // Colombia
  "CR", // Costa Rica
  "DO", // Dominican Republic
  "EC", // Ecuador
  //"SV", // El Salvador
  "GT",
  "HN", // Honduras
  "MX", // Mexico */
  "CO", // Colombia
  // "PY", // Paraguay
  "PE", // Peru
  //"PR", // Puerto Rico
  //"UY", // Uruguay */
];

export const PRIORITY_COUNTRY_CODE: string[] = [
  "PA", // Panama
];

// Get all countries
export const COUNTRIES = Country.getAllCountries();

// Get countries list with priority and latin america countries
export const COUNTRIES_LIST = COUNTRIES.filter(
  (country: ICountry) =>
    !EXCLUDED_COUNTRY_CODE.includes(country.isoCode) &&
    LATIN_AMERICA_COUNTRY_CODE.includes(country.isoCode),
).sort((a: ICountry, b: ICountry) => {
  // First check for priority countries
  if (
    PRIORITY_COUNTRY_CODE.includes(a.isoCode) &&
    !PRIORITY_COUNTRY_CODE.includes(b.isoCode)
  )
    return -1;
  if (
    !PRIORITY_COUNTRY_CODE.includes(a.isoCode) &&
    PRIORITY_COUNTRY_CODE.includes(b.isoCode)
  )
    return 1;

  // If neither or both are priority countries, sort alphabetically by name
  return a.name.localeCompare(b.name);
});
