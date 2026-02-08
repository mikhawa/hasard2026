<?php

declare(strict_types=1);

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            try {
                self::$instance = new PDO(
                    sprintf(
                        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                        $_ENV['DB_HOST'],
                        $_ENV['DB_PORT'],
                        $_ENV['DB_NAME'],
                        $_ENV['DB_CHARSET']
                    ),
                    $_ENV['DB_LOGIN'],
                    $_ENV['DB_PWD'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => true,
                    ]
                );
            } catch (PDOException $e) {
                if ($_ENV['APP_DEBUG'] === 'true') {
                    throw $e;
                }
                throw new PDOException('Database connection failed');
            }
        }
        return self::$instance;
    }

    public static function closeConnection(): void
    {
        self::$instance = null;
    }
}
