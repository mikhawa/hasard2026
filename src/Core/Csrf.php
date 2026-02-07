<?php

declare(strict_types=1);

namespace App\Core;

class Csrf
{
    private const TOKEN_KEY = 'csrf_token';

    public static function generate(): string
    {
        if (empty($_SESSION[self::TOKEN_KEY])) {
            $_SESSION[self::TOKEN_KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[self::TOKEN_KEY];
    }

    public static function validate(?string $token): bool
    {
        if ($token === null || empty($_SESSION[self::TOKEN_KEY])) {
            return false;
        }
        return hash_equals($_SESSION[self::TOKEN_KEY], $token);
    }

    public static function field(): string
    {
        return '<input type="hidden" name="_csrf" value="' . htmlspecialchars(self::generate(), ENT_QUOTES, 'UTF-8') . '">';
    }

    public static function regenerate(): string
    {
        unset($_SESSION[self::TOKEN_KEY]);
        return self::generate();
    }

    public static function getToken(): string
    {
        return self::generate();
    }
}
