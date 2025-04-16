<?php

declare(strict_types=1);

namespace Iprikot\YandexMap\Providers;

use Illuminate\Support\ServiceProvider;

final class YandexMapServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../../resources/views', 'yandexmap');

        $this->publishes([
            __DIR__ . '/../../config/moonshine_yandexmap.php' => config_path('moonshine_yandexmap.php'),
        ], ['moonshine-yandexmap-config']);

        $this->mergeConfigFrom(
            __DIR__ . '/../../config/moonshine_yandexmap.php',
            'moonshine_yandexmap'
        );

        $this->publishes([
            __DIR__ . '/../../public' => public_path('vendor/moonshine-yandexmap'),
        ], ['moonshine-yandexmap-assets', 'laravel-assets']);
    }
}
