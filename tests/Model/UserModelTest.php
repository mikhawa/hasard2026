<?php

namespace Tests\Model;

use App\Model\UserModel;
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase
{
    public function testHydrationFromArray(): void
    {
        $user = new UserModel([
            'iduser' => 1,
            'username' => 'prof1',
            'userpwd' => 'hashed',
            'themail' => 'prof@example.com',
            'clefunique' => 'abc123',
            'perm' => 1,
        ]);

        $this->assertSame(1, $user->getIduser());
        $this->assertSame('prof1', $user->getUsername());
        $this->assertSame('hashed', $user->getUserpwd());
        $this->assertSame('prof@example.com', $user->getThemail());
        $this->assertSame('abc123', $user->getClefunique());
        $this->assertSame(1, $user->getPerm());
    }

    public function testSettersFluency(): void
    {
        $user = new UserModel([]);
        $result = $user->setUsername('test');
        $this->assertInstanceOf(UserModel::class, $result);
    }

    public function testIdanneeSplitsByComma(): void
    {
        $user = new UserModel(['idannee' => '1,2,3']);
        $this->assertSame(['1', '2', '3'], $user->getIdannee());
    }

    public function testSectionSplitsByTriplePipe(): void
    {
        $user = new UserModel(['section' => 'Web Dev|||Design|||Data']);
        $this->assertSame(['Web Dev', 'Design', 'Data'], $user->getSection());
    }

    public function testAnneeSplitsByComma(): void
    {
        $user = new UserModel(['annee' => '2024,2025,2026']);
        $this->assertSame(['2024', '2025', '2026'], $user->getAnnee());
    }

    public function testHydrationIgnoresUnknownKeys(): void
    {
        $user = new UserModel(['iduser' => 1, 'nonexistent_field' => 'value']);
        $this->assertSame(1, $user->getIduser());
    }
}
