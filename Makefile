
INIT_DIRS := ./fetched_data ./fetched_data_historical ./climate_data
DATA_FILE := ./climate_data/processed_data.json
ENV_FILE := .env

.PHONY: init
init: $(INIT_DIRS) $(DATA_FILE) $(ENV_FILE)
	@echo "✅ All folders and files initialized."


$(INIT_DIRS):
	@mkdir -p $@
	@echo "📁 Created directory: $@"


$(DATA_FILE):
	@if [ ! -f $@ ]; then \
		echo '{"processed_files": [], "data": {}}'' > $@ && \
		echo "📝 Created empty file: $@"; \
	else \
		echo "✔️ File already exists: $@"; \
	fi

$(ENV_FILE):
	@if [ ! -f $@ ]; then \
		echo "DMI_API_KEY=your_api_key_here" > $@ && \
		echo "LATITUDE=00.0000" >> $@ && \
		echo "LONGITUDE=00.0000" >> $@ && \
		echo "API_IDENTITY=your_app_name_or_email" >> $@ && \
		echo "🔐 Created .env with placeholder keys."; \
	else \
		echo "✔️ .env file already exists."; \
	fi

IMAGE_NAME := weather-wally-image
CONTAINER_NAME := WeatherWally
NETWORK_NAME := home_network
PORTS := -p 5173:5173 -p 3000:3000
VOLUME := ~/Workspace/WeatherWally/climate_data/processed_data.json:/app/climate_data/processed_data.json

build:
	@echo "Building Docker image: $(IMAGE_NAME)"
	docker build . -t $(IMAGE_NAME)

clean:
	@echo "Stop / rm Docker container: $(CONTAINER_NAME)"
	docker stop homemaint && docker rm homemaint

run:
	@echo "Running $(CONTAINER_NAME) w/ image $(IMAGE_NAME)"
	docker run -d --network $(NETWORK_NAME) --name $(CONTAINER_NAME) \
		-v $(VOLUME) $(PORTS) $(IMAGE_NAME)

update:
	-@docker stop $(CONTAINER_NAME)
	-@docker rm $(CONTAINER_NAME)
	@echo "Rebuilding image: $(IMAGE_NAME)"
	docker build . -t $(IMAGE_NAME)
	@echo "Restarting container..."
	docker run -d --network $(NETWORK_NAME) --name $(CONTAINER_NAME) \
		-v $(VOLUME) $(PORTS) $(IMAGE_NAME)