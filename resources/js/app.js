document.addEventListener("alpine:init", () => {
    Alpine.data("MoonShineYandexMap", (config) => {
        let mapInstance = null;
        let selectedPlacemark = null;

        const {
            deletePlacemarkButtonLabel,
            fitToBoundsButtonLabel,
            defaultIconColor,
            selectedIconColor,
            defaultMapCenter,
            defaultMapZoom,
            mapSavedData
        } = config;

        const defaultMapData = {
            center: defaultMapCenter,
            zoom: defaultMapZoom,
            placemarks: [],
        };

        return {
            defaultIconColor,
            selectedIconColor,
            deletePlacemarkButtonLabel,
            fitToBoundsButtonLabel,
            mapDataToJson: "",
            mapData: {},

            init() {
                this.initializeDataBinding();
                this.initializeMap();
            },

            initializeDataBinding() {
                this.$watch("mapData", (value) => {
                    this.mapDataToJson = JSON.stringify(value);
                });
                
                try {
                    this.mapData = {
                        ...defaultMapData,
                        ...mapSavedData
                    };
                } catch (e) {
                    this.mapData = { ...defaultMapData };
                }
            },

            initializeMap() {
                ymaps.ready(() => {
                    this.createMapInstance();
                    this.setupMapControls();
                    this.setupMapEventListeners();
                    this.loadInitialPlacemarks();
                });
            },

            createMapInstance() {
                mapInstance = new ymaps.Map(this.$refs.map, {
                    center: this.mapData.center,
                    zoom: this.mapData.zoom,
                    controls: ["zoomControl", "searchControl"],
                });

                mapInstance.behaviors.disable("scrollZoom");
            },

            setupMapControls() {
                const deleteButton = this.createControlButton(
                    this.deletePlacemarkButtonLabel,
                    this.handleDeletePlacemark.bind(this)
                );

                const fitToBoundsButton = this.createControlButton(
                    this.fitToBoundsButtonLabel,
                    this.handleFitToBounds.bind(this)
                );

                mapInstance.controls
                    .add(deleteButton, { float: "right", floatIndex: 100 })
                    .add(fitToBoundsButton, { float: "right", floatIndex: 100 });
            },

            createControlButton(label, clickHandler) {
                const button = new ymaps.control.Button({
                    data: { content: label },
                    options: { selectOnClick: false, maxWidth: [30, 100, 150] },
                });

                button.events.add("click", clickHandler);
                return button;
            },

            setupMapEventListeners() {
                mapInstance.events.add("boundschange", (e) => {
                    this.mapData.zoom = e.get("newZoom");
                });

                mapInstance.events.add("actionend", () => {
                    this.mapData.center = mapInstance.getCenter();
                });

                mapInstance.events.add("click", (e) => {
                    this.addPlacemark(e.get("coords"));
                });
            },

            loadInitialPlacemarks() {
                this.mapData.placemarks.forEach(coords => {
                    this.addPlacemark(coords, false);
                });
            },

            resetIconColorPlacemark() {
                mapInstance.geoObjects.each((object) =>
                    object.options.set("iconColor", this.defaultIconColor)
                );
            },

            updatePlacemarksForMapData() {
                const placemarks = [];
                mapInstance.geoObjects.each((object) => {
                    placemarks.push(object.geometry.getCoordinates());
                });
                this.mapData.placemarks = placemarks;
            },

            addPlacemark(coords, updateData = true) {
                this.resetIconColorPlacemark();

                const placemark = new ymaps.Placemark(
                    coords,
                    {},
                    {
                        draggable: true,
                        preset: "islands#governmentCircleIcon",
                        iconColor: updateData ? this.selectedIconColor : this.defaultIconColor,
                    }
                );

                this.setupPlacemarkEventListeners(placemark);
                mapInstance.geoObjects.add(placemark);
                
                if (updateData) {
                    selectedPlacemark = placemark;
                    this.updatePlacemarksForMapData();
                }
            },

            setupPlacemarkEventListeners(placemark) {
                placemark.events
                    .add("dragstart", () => {
                        this.resetIconColorPlacemark();
                        placemark.options.set("iconColor", this.selectedIconColor);
                        selectedPlacemark = placemark;
                    })
                    .add("dragend", () => this.updatePlacemarksForMapData())
                    .add("click", () => {
                        this.resetIconColorPlacemark();
                        placemark.options.set("iconColor", this.selectedIconColor);
                        selectedPlacemark = placemark;
                    });
            },

            handleDeletePlacemark() {
                if (selectedPlacemark) {
                    mapInstance.geoObjects.remove(selectedPlacemark);
                    selectedPlacemark = null;
                    this.updatePlacemarksForMapData();
                } else {
                    alert("Выберите метку для удаления.");
                }
            },

            handleFitToBounds() {
                const options = {
                    checkZoomRange: true,
                    duration: 500,
                    zoomMargin: 100,
                };

                if (this.mapData.placemarks.length === 1) {
                    mapInstance.setCenter(
                        this.mapData.placemarks[0], 
                        this.mapData.zoom, 
                        options
                    );
                    return;
                }

                if (this.mapData.placemarks.length > 1) {
                    const bounds = mapInstance.geoObjects.getBounds();
                    mapInstance.setBounds(bounds, options);
                }
            }
        };
    });
});