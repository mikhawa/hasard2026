<?php

namespace Tests\Service;

use App\Core\Config;
use App\Service\TimeSlotService;
use PHPUnit\Framework\TestCase;

class TimeSlotServiceTest extends TestCase
{
    private TimeSlotService $service;

    protected function setUp(): void
    {
        $this->service = new TimeSlotService();

        // Reset Config static cache so it re-reads $_ENV
        $reflection = new \ReflectionClass(Config::class);
        $prop = $reflection->getProperty('timeFilters');
        $prop->setAccessible(true);
        $prop->setValue(null, []);
    }

    public function testGetFilterDefaultsToTous(): void
    {
        $filter = $this->service->getFilter(null);
        $this->assertSame('tous', $filter['key']);
        $this->assertSame('le debut', $filter['label']);
        $this->assertSame(600, $filter['days']);
        $this->assertIsString($filter['date']);
    }

    public function testGetFilterWithValidKey(): void
    {
        $filter = $this->service->getFilter('1-mois');
        $this->assertSame('1-mois', $filter['key']);
        $this->assertSame('1 mois', $filter['label']);
        $this->assertSame(31, $filter['days']);
    }

    public function testGetFilterWithInvalidKeyFallsBack(): void
    {
        $filter = $this->service->getFilter('invalid');
        $this->assertSame('invalid', $filter['key']);
        $this->assertSame('le debut', $filter['label']);
        $this->assertSame(600, $filter['days']);
    }

    public function testCalculateDateContainsAndSeparator(): void
    {
        $result = $this->service->calculateDate(7);
        $this->assertStringContainsString('" AND "', $result);
    }

    public function testCalculateDateFormat(): void
    {
        $result = $this->service->calculateDate(7);
        $parts = explode('" AND "', $result);
        $this->assertCount(2, $parts);
        // Both parts should match datetime format
        $this->assertMatchesRegularExpression('/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/', $parts[0]);
        $this->assertMatchesRegularExpression('/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/', $parts[1]);
    }

    public function testGetAvailableFiltersReturnsEight(): void
    {
        $filters = $this->service->getAvailableFilters();
        $this->assertCount(8, $filters);
        $this->assertSame('tous', $filters[0]['key']);
        $this->assertSame('Tout', $filters[0]['label']);
        $this->assertSame('1-jour', $filters[7]['key']);
    }

    public function testGetAvailableFiltersStructure(): void
    {
        $filters = $this->service->getAvailableFilters();
        foreach ($filters as $filter) {
            $this->assertArrayHasKey('key', $filter);
            $this->assertArrayHasKey('label', $filter);
        }
    }
}
