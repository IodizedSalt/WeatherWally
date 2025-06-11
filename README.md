This is a lightweight, small scale application using YR.no API (and DMI.dk once they fix their email provider) to fetch weather data over the course of the day, and record/log it for personal lookback purposes.

It requires 3 folders to be initialized: `climate_data`, `fetched_data`, `fetched_data_historical`

Also an npm install


Create a .env file with `API_IDENTITY`, `LATITUDE`, `LONGITUDE`, AND ~`DMI_API_KEY`~
You must set an API_IDENTITY equal to a valid user agent in accordance to YR.no ToS: https://developer.yr.no/doc/TermsOfService/
Set LATITUDE/LONGITUDE equal to what you want, in accordance to YR.no ToS (truncate coordinate decimals to 4 places): https://developer.yr.no/doc/TermsOfService/

In order to use DMI data, you must create an account and generate an API KEY. Their email provider is down and their API is unstable, so currently this feature is not implemented