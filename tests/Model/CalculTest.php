<?php

namespace Tests\Model;

use App\Model\Calcul;
use PHPUnit\Framework\TestCase;

class CalculTest extends TestCase
{
    // --- Pourcent() ---

    public function testPourcentNormalValues(): void
    {
        $this->assertSame('5 (50 %)', Calcul::Pourcent(5, 10));
    }

    public function testPourcentWithDecimal(): void
    {
        $this->assertSame('1 (33.33 %)', Calcul::Pourcent(1, 3));
    }

    public function testPourcentHundredPercent(): void
    {
        $this->assertSame('10 (100 %)', Calcul::Pourcent(10, 10));
    }

    public function testPourcentZeroNumerator(): void
    {
        // empty(0) === true, so returns "0 (0 %)"
        $this->assertSame('0 (0 %)', Calcul::Pourcent(0, 10));
    }

    public function testPourcentZeroDenominator(): void
    {
        $this->assertSame('5 (0 %)', Calcul::Pourcent(5, 0));
    }

    public function testPourcentBothZero(): void
    {
        $this->assertSame('0 (0 %)', Calcul::Pourcent(0, 0));
    }

    public function testPourcentLargeValues(): void
    {
        $this->assertSame('999 (99.9 %)', Calcul::Pourcent(999, 1000));
    }

    // --- laDate() ---

    public function testLaDateZeroDays(): void
    {
        $result = Calcul::laDate(0);
        $expected = date('Y-m-d');
        $this->assertStringStartsWith($expected, $result);
    }

    public function testLaDateOneDayAgo(): void
    {
        $result = Calcul::laDate(1);
        $expected = date('Y-m-d', time() - 86400);
        $this->assertStringStartsWith($expected, $result);
    }

    public function testLaDateFormat(): void
    {
        $result = Calcul::laDate(7);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $result);
    }

    // --- calculPoints() ---

    public function testCalculPointsComputesAndSorts(): void
    {
        $input = [
            ['nom' => 'Alice', 'vgood' => 1, 'good' => 1, 'nogood' => 0, 'absent' => 0],
            ['nom' => 'Bob', 'vgood' => 3, 'good' => 2, 'nogood' => 1, 'absent' => 0],
        ];
        $result = Calcul::calculPoints($input);

        // Bob: (3*2)+2-1-0 = 7, Alice: (1*2)+1-0-0 = 3
        $this->assertSame(7, $result[0]['points']);
        $this->assertSame('Bob', $result[0]['nom']);
        $this->assertSame(3, $result[1]['points']);
        $this->assertSame('Alice', $result[1]['nom']);
    }

    public function testCalculPointsEmptyArray(): void
    {
        $this->assertSame([], Calcul::calculPoints([]));
    }

    public function testCalculPointsNegative(): void
    {
        $input = [
            ['nom' => 'Bad', 'vgood' => 0, 'good' => 0, 'nogood' => 3, 'absent' => 2],
        ];
        $result = Calcul::calculPoints($input);
        $this->assertSame(-5, $result[0]['points']);
    }

    public function testCalculPointsPreservesExtraFields(): void
    {
        $input = [
            ['nom' => 'A', 'vgood' => 1, 'good' => 0, 'nogood' => 0, 'absent' => 0, 'extra' => 'keep'],
        ];
        $result = Calcul::calculPoints($input);
        $this->assertSame('keep', $result[0]['extra']);
    }

    // --- calculSorties() ---

    public function testCalculSortiesSortsDescending(): void
    {
        $input = [
            ['nom' => 'Alice', 'sorties' => 3],
            ['nom' => 'Bob', 'sorties' => 7],
            ['nom' => 'Charlie', 'sorties' => 1],
        ];
        $result = Calcul::calculSorties($input);

        $this->assertSame('Bob', $result[0]['nom']);
        $this->assertSame('Alice', $result[1]['nom']);
        $this->assertSame('Charlie', $result[2]['nom']);
    }

    public function testCalculSortiesEmptyArray(): void
    {
        $this->assertSame([], Calcul::calculSorties([]));
    }
}
