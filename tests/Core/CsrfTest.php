<?php

namespace Tests\Core;

use App\Core\Csrf;
use PHPUnit\Framework\TestCase;

class CsrfTest extends TestCase
{
    protected function setUp(): void
    {
        $_SESSION = [];
    }

    public function testGenerateCreatesToken(): void
    {
        $token = Csrf::generate();
        $this->assertIsString($token);
        $this->assertSame(64, strlen($token)); // 32 bytes = 64 hex chars
    }

    public function testGenerateReturnsSameTokenOnSecondCall(): void
    {
        $token1 = Csrf::generate();
        $token2 = Csrf::generate();
        $this->assertSame($token1, $token2);
    }

    public function testValidateWithCorrectToken(): void
    {
        $token = Csrf::generate();
        $this->assertTrue(Csrf::validate($token));
    }

    public function testValidateWithWrongToken(): void
    {
        Csrf::generate();
        $this->assertFalse(Csrf::validate('wrong-token'));
    }

    public function testValidateWithNull(): void
    {
        Csrf::generate();
        $this->assertFalse(Csrf::validate(null));
    }

    public function testValidateWithNoSession(): void
    {
        $this->assertFalse(Csrf::validate('anything'));
    }

    public function testRegenerateCreatesNewToken(): void
    {
        $token1 = Csrf::generate();
        $token2 = Csrf::regenerate();
        $this->assertNotSame($token1, $token2);
    }

    public function testFieldReturnsHtmlInput(): void
    {
        $html = Csrf::field();
        $this->assertStringContainsString('<input type="hidden"', $html);
        $this->assertStringContainsString('name="_csrf"', $html);
        $this->assertStringContainsString('value="', $html);
    }

    public function testGetTokenReturnsSameAsGenerate(): void
    {
        $token = Csrf::getToken();
        $this->assertSame($token, Csrf::generate());
    }

    protected function tearDown(): void
    {
        $_SESSION = [];
    }
}
