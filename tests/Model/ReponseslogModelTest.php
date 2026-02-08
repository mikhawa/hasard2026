<?php

namespace Tests\Model;

use App\Model\ReponseslogModel;
use PHPUnit\Framework\TestCase;

class ReponseslogModelTest extends TestCase
{
    public function testHydration(): void
    {
        $log = new ReponseslogModel([
            'idreponseslog' => 100,
            'reponseslogcol' => 3,
            'remarque' => 'Excellent',
            'reponseslogdate' => '2026-01-15 10:30:00',
        ]);

        $this->assertSame(100, $log->getIdreponseslog());
        $this->assertSame(3, $log->getReponseslogcol());
        $this->assertSame('Excellent', $log->getRemarque());
        $this->assertSame('2026-01-15 10:30:00', $log->getReponseslogdate());
    }
}
