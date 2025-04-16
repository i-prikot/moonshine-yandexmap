document.addEventListener("alpine:init", () => {
    Alpine.data("MoonShineYandexMap", (params) => ({
        lat: params.lat,
        lng: params.lng,
        map: null,
        placemark: null,

        init() {
            ymaps.ready(() => {
                this.map = new ymaps.Map(`map-${this.$el.id}`, {
                    center: [this.lat, this.lng],
                    zoom: 13,
                });

                this.placemark = new ymaps.Placemark([this.lat, this.lng]);
                this.map.geoObjects.add(this.placemark);

                this.map.events.add("click", (e) => {
                    const coords = e.get("coords");
                    this.lat = coords[0].toPrecision(8);
                    this.lng = coords[1].toPrecision(8);
                    this.placemark.geometry.setCoordinates(coords);
                });
            });
        },
    }));
});
