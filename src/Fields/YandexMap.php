<?php

namespace Iprikot\YandexMap\Fields;

use Closure;
use MoonShine\AssetManager\Js;
use MoonShine\UI\Fields\Field;
use MoonShine\AssetManager\Css;
use Illuminate\Contracts\Support\Renderable;
use MoonShine\Contracts\Core\TypeCasts\DataWrapperContract;

class YandexMap extends Field
{
    const VERSION = '2.1';

    const MAX_MAP_ZOOM = 21;

    const DEFAULT_CONTAINER_MAP_WIDTH = '100%';

    const DEFAULT_CONTAINER_MAP_HEIGHT = '400px';

    protected string $view = 'yandexmap::fields.yandexmap';

    protected bool $objectMode = false;

    protected string $width;

    protected string $height;

    protected string $deletePlacemarkButtonLabel = 'Delete placemark';

    protected string $fitToBoundsButtonLabel = 'Fit to bounds';

    protected string $defaultIconColor = '#0095b6';

    protected string $selectedIconColor = '#ff0000';

    protected array $defaultMapCenter = [56.02309737020559, 92.87417199999999];

    protected int $defaultMapZoom = 13;

    protected function assets(): array
    {
        $assets = [];

        if ($this->getApiKey()) {
            $assets[] = Js::make("https://api-maps.yandex.ru/{$this->getVersion()}/?apikey={$this->getApiKey()}&lang={$this->getLanguage()}");
        }

        $assets[] = Js::make('vendor/moonshine-yandexmap/app.js');
        $assets[] = Css::make('vendor/moonshine-yandexmap/style.css');

        return $assets;
    }

    protected function setUnit(string|int $unit)
    {
        // Если значение числовое или строка без единиц измерения
        if (is_int($unit) || (is_string($unit) && preg_match('/^\d+$/', $unit))) {
            $unit .= 'px';
        }
        // Проверяем, есть ли уже единицы измерения (например: 100px, 25rem, 75%)
        elseif (is_string($unit) && !preg_match('/^\d+(px|em|rem|%|vw|vh|vmin|vmax)$/', $unit)) {
            $unit .= 'px';
        }

        return $unit;
    }

    protected function isHexColor(string $color)
    {
        return preg_match('/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/', $color) === 1;
    }

    protected function getApiKey(): string
    {
        return config('moonshine_yandexmap.api_key', '');
    }

    protected function getVersion(): string
    {
        return self::VERSION;
    }

    protected function getLanguage(): string
    {
        $default = 'en_US';

        $lang = config('app.locale', $default);

        if ($lang === 'ru') {
            return 'ru_RU';
        }

        return $default;
    }

    protected function getWidth(): string
    {
        return $this->width ?? self::DEFAULT_CONTAINER_MAP_WIDTH;
    }

    protected function getHeight(): string
    {
        return $this->height ?? self::DEFAULT_CONTAINER_MAP_HEIGHT;
    }

    public function deletePlacemarkButtonLabel(string $label): self
    {
        $this->deletePlacemarkButtonLabel = $label;
        return $this;
    }

    public function fitToBoundsButtonLabel(string $label): self
    {
        $this->fitToBoundsButtonLabel = $label;
        return $this;
    }

    public function width(string|int $width): self
    {
        $this->width = $this->setUnit($width);
        return $this;
    }

    public function height(string|int $height): self
    {
        $this->height = $this->setUnit($height);
        return $this;
    }

    public function defaultIconHEXColor(string $color): self
    {
        if ($this->isHexColor($color)) {
            $this->defaultIconColor = $color;
        }

        return $this;
    }

    public function selectedIconHEXColor(string $color): self
    {
        if ($this->isHexColor($color)) {
            $this->selectedIconColor = $color;
        }

        return $this;
    }

    public function defaultMapCenter(float $lat, float $lon): self
    {
        $this->defaultMapCenter = [$lat, $lon];
        return $this;
    }

    public function defaultMapZoom(int $zoom): self
    {
        $this->defaultMapZoom = max(0, min(self::MAX_MAP_ZOOM, $zoom));
        return $this;
    }

    protected function resolveOnApply(): ?Closure
    {
        return function ($item) {
            $value = $this->getRequestValue();
            
            if (is_string($value)) {
                $value = json_decode($value, true, 512, JSON_THROW_ON_ERROR);
            }
           
            data_set(
                $item,
                $this->getColumn(),
                $value,
            );
        };
    }

    protected function resolvePreview(): Renderable|string
    {
        $value = $this->toFormattedValue();
        return '';
    }

    protected function resolveRawValue(): mixed
    {
        if (\is_array($this->rawValue)) {
            return json_encode($this->rawValue, JSON_THROW_ON_ERROR);
        }

        return (string) $this->rawValue;
    }

    protected function reformatFilledValue(mixed $data): mixed
    {
        if (\is_string($data)) {
            $data = json_decode($data, true, 512, JSON_THROW_ON_ERROR);
        }

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    protected function viewData(): array
    {
        return [
            'width' => $this->getWidth(),
            'height' => $this->getHeight(),
            'options' => [
                'deletePlacemarkButtonLabel' => $this->deletePlacemarkButtonLabel,
                'fitToBoundsButtonLabel' => $this->fitToBoundsButtonLabel,
                'selectedIconColor' => $this->selectedIconColor,
                'defaultIconColor' => $this->defaultIconColor,
                'defaultMapCenter' => $this->defaultMapCenter,
                'defaultMapZoom' => $this->defaultMapZoom,
                'mapSavedData' => $this->getValue()
            ]
        ];
    }
}
