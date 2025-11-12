This is a lightweight, small scale application using YR.no API (and DMI.dk once they fix their email provider) to fetch weather data over the course of the day, and record/log it for personal lookback purposes.

# Init
Either run `npm run init` or `make init` to initialize the required folders/files

If you do not manage to run either of the init scripts, then:
    Otherwise, manually, it requires 3 folders to be initialized: 
    - `climate_data` 
    - `fetched_data`
    - `fetched_data_historical`

    Create a file in `climate_data` called `processed_data.json` with an empty JSON object.
    Create a .env file with `API_IDENTITY`, `LATITUDE`, `LONGITUDE`, AND ~`DMI_API_KEY`~

Also an `npm run install:all`!


# Local dev:
dont use docker.

    cd frontend/ 
    npm run dev

Another terminal
    node app.js


# YR API
You must set an API_IDENTITY equal to a valid user agent in accordance to YR.no ToS: https://developer.yr.no/doc/TermsOfService/

Set LATITUDE/LONGITUDE equal to what you want, in accordance to YR.no ToS (truncate coordinate decimals to 4 places): https://developer.yr.no/doc/TermsOfService/


# DMI API
In order to use DMI data, you must create an account and generate an API KEY.

# CRON
Cron job for fetching and processing weather data every 6 hours:

`2 */6 * * * cd <project_dir>WeatherWally && /usr/bin/node fetchWeather_YR.js && /usr/bin/node processWeatherData.js >> <logging_dir>cron_test.log 2>&1`

# Docker commands
Docker build:

`docker build -t vite-express-dev .`

Docker run:


` docker run -d --network home_network --name vite-app -v ~/Workspace/WeatherWally/climate_data/processed_data.json:/app/climate_data/processed_data.json -p 5173:5173 -p 3000:3000 vite-express-dev`

# CRON Script for backing up file dirs
Backup Files script

    #!/bin/bash

    # Get the current date in DDMMYY format
    current_date=$(date +"%d%m%y")

    # Set the backup directory based on the current date
    backup_directory="/home/overlord/BackupData/$current_date"

    # Create the backup directory if it doesn't exist
    mkdir -p "$backup_directory"

    # Source and destination directories
    source_directory="/home/overlord/Workspace/HomeMaintenance/src/app/data"

    # Declare an array of source files
    source_files=("home_maintenance_tasks_status.json" "notepad.txt" "home_maintenance_tasks.json")

    # Iterate over the source files and copy them to the destination directory
    for file in "${source_files[@]}"; do
        cp "$source_directory/$file" "$backup_directory/$file"
    done

    cp "/home/overlord/Workspace/WeatherWally/climate_data/processed_data.json" "$backup_directory/processed_data.json"

`0 1 * * * /home/overlord/Workspace/scripts/backup_data_files.sh`


################
local dev:
################
dont use docker.

    cd frontend/ 
    npm run dev

Another terminal
    node app.js





