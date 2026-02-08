<?php

namespace Tests\Core;

use App\Core\Config;
use PHPUnit\Framework\TestCase;

class ConfigTest extends TestCase
{
    protected function setUp(): void
    {
        // Reset the private static $timeFilters cache between tests
        $reflection = new \ReflectionClass(Config::class);
        $prop = $reflection->getProperty('timeFilters');
        $prop->setAccessible(true);
        $prop->setValue(null, []);
    }

    public function testGetTimeFiltersReturnsAllEight(): void
    {
        $filters = Config::getTimeFilters();
        $this->assertCount(8, $filters);
        $this->assertArrayHasKey('tous', $filters);
        $this->assertArrayHasKey('1 an', $filters);
        $this->assertArrayHasKey('1 jour', $filters);
    }

    public function testGetTimeFiltersDefaultValues(): void
    {
        unset($_ENV['TIME_FILTER_ALL']);
        $filters = Config::getTimeFilters();
        $this->assertSame(600, $filters['tous']);
    }

    public function testGetTimeFiltersReadsEnv(): void
    {
        $_ENV['TIME_FILTER_ALL'] = '999';
        $filters = Config::getTimeFilters();
        $this->assertSame(999, $filters['tous']);
    }

    public function testGetTimeFilterReturnsValue(): void
    {
        $result = Config::getTimeFilter('tous');
        $this->assertIsInt($result);
    }

    public function testGetTimeFilterReturnsNullForUnknown(): void
    {
        $this->assertNull(Config::getTimeFilter('nonexistent'));
    }

    public function testIsDebugFalseByDefault(): void
    {
        unset($_ENV['APP_DEBUG']);
        $this->assertFalse(Config::isDebug());
    }

    public function testIsDebugTrueWhenSet(): void
    {
        $_ENV['APP_DEBUG'] = 'true';
        $this->assertTrue(Config::isDebug());
    }

    public function testGetTimezoneDefault(): void
    {
        unset($_ENV['APP_TIMEZONE']);
        $this->assertSame('Europe/Brussels', Config::getTimezone());
    }

    public function testGetEnvironmentDefault(): void
    {
        unset($_ENV['APP_ENV']);
        $this->assertSame('production', Config::getEnvironment());
    }

    protected function tearDown(): void
    {
        unset($_ENV['TIME_FILTER_ALL'], $_ENV['APP_DEBUG'], $_ENV['APP_TIMEZONE'], $_ENV['APP_ENV']);
    }
}
