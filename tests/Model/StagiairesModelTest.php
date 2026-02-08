<?php

namespace Tests\Model;

use App\Model\StagiairesModel;
use PHPUnit\Framework\TestCase;

class StagiairesModelTest extends TestCase
{
    public function testHydration(): void
    {
        $stag = new StagiairesModel([
            'idstagiaires' => 10,
            'nom' => 'Dupont',
            'prenom' => 'Jean',
        ]);

        $this->assertSame(10, $stag->getIdstagiaires());
        $this->assertSame('Dupont', $stag->getNom());
        $this->assertSame('Jean', $stag->getPrenom());
    }

    public function testSettersReturnSelf(): void
    {
        $stag = new StagiairesModel([]);
        $this->assertInstanceOf(StagiairesModel::class, $stag->setNom('Test'));
    }
}
