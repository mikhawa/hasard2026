<?php

namespace Tests\Model;

use App\Model\AnneeModel;
use PHPUnit\Framework\TestCase;

class AnneeModelTest extends TestCase
{
    public function testHydration(): void
    {
        $annee = new AnneeModel([
            'idannee' => 5,
            'section' => 'Web Developer',
            'annee' => '2025-2026',
        ]);

        $this->assertSame(5, $annee->getIdannee());
        $this->assertSame('Web Developer', $annee->getSection());
        $this->assertSame('2025-2026', $annee->getAnnee());
    }

    public function testSettersReturnSelf(): void
    {
        $annee = new AnneeModel([]);
        $this->assertInstanceOf(AnneeModel::class, $annee->setIdannee(1));
        $this->assertInstanceOf(AnneeModel::class, $annee->setSection('Test'));
        $this->assertInstanceOf(AnneeModel::class, $annee->setAnnee('2026'));
    }
}
