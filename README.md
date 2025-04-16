# YandexMap Field for MoonShine

A custom Yandex Maps field for MoonShine admin panel that allows users to interact with Yandex Maps, place markers, and save coordinates.

## Features

- Interactive Yandex Maps integration
- Placemark management (add/delete)
- Configurable default map center and zoom level

## Installation

1. Install the package via Composer:
   ```bash
   composer require iprikot/moonshine-yandexmap
   ```

2. Publish the configuration file:
   ```bash
   php artisan vendor:publish --tag=moonshine-yandexmap-config
   ```

3. Add your Yandex Maps API key to the `.env` file:
   ```env
   MOONSHINE_YANDEXMAP_API_KEY=your_api_key_here
   ```

## Usage

### Basic Usage

```php
use Iprikot\YandexMap\Fields\YandexMap;

// In your MoonShine resource
YandexMap::make('Location', 'location')
```

### Customization Options

```php
YandexMap::make('Location', 'location')
    ->width('100%') // or 500, '50vw', etc.
    ->height(400) // or '50vh', '30rem', etc.
    ->defaultMapCenter(56.023097, 92.874172) // latitude, longitude
    ->defaultMapZoom(13)
    ->defaultIconHEXColor('#0095b6')
    ->selectedIconHEXColor('#ff0000')
    ->deletePlacemarkButtonLabel('Remove marker')
    ->fitToBoundsButtonLabel('Fit to bounds');
```

### Configuration

The package comes with a config file (`moonshine_yandexmap.php`) where you can set default values:

```php
return [
    'api_key' => env('MOONSHINE_YANDEXMAP_API_KEY', ''),
];
```

## Data Structure

The field stores data as JSON with the following structure:

```json
{
    "center": [56.023097, 92.874172],
    "zoom": 13,
    "placemarks": [[56.023097, 92.874172],[58.023097, 92.874172]]
}
```

## Requirements

- PHP 8.0+
- MoonShine 3.0+
- Yandex Maps API 2.1

## License

This package is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).