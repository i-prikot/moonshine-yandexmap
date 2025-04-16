@props([
    'width' => '',
    'height' => '',
    'options' => '',
])
<div x-data="MoonShineYandexMap(@js($options))" class="moonshine-yandexmap">
    <div x-ref="map" style="height: {{ $height }}; width: {{ $width }}"></div>
    <input type="hidden" {{ $attributes }} x-model="mapDataToJson">
</div>
