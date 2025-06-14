This is a lightweight, small scale application using YR.no API (and DMI.dk once they fix their email provider) to fetch weather data over the course of the day, and record/log it for personal lookback purposes.

Either run `npm run init` or `make init` to initialize the required folders/files

If you do not manage to run either of the init scripts, then:
    Otherwise, manually, it requires 3 folders to be initialized: 
    - `climate_data` 
    - `fetched_data`
    - `fetched_data_historical`

    Create a file in `climate_data` called `processed_data.json` with an empty JSON object.
    Create a .env file with `API_IDENTITY`, `LATITUDE`, `LONGITUDE`, AND ~`DMI_API_KEY`~

Also an `npm run install:all`!



You must set an API_IDENTITY equal to a valid user agent in accordance to YR.no ToS: https://developer.yr.no/doc/TermsOfService/

Set LATITUDE/LONGITUDE equal to what you want, in accordance to YR.no ToS (truncate coordinate decimals to 4 places): https://developer.yr.no/doc/TermsOfService/

In order to use DMI data, you must create an account and generate an API KEY. Their email provider is down and their API is unstable, so currently this feature is not implemented


Cron job for fetching and processing weather data every 6 hours:

`2 */6 * * * cd <project_dir>WeatherWally && /usr/bin/node fetchWeather_YR.js && /usr/bin/node processWeatherData.js >> <logging_dir>cron_test.log 2>&1`


Docker build:

`docker build -t vite-express-dev .`

Docker run:

`docker run --rm -p 3000:3000 -p 5173:5173 vite-express-dev`
