<?php

declare(strict_types=1);

/**
 * Hasard 2026 - Main Entry Point
 *
 * Modern PHP application with:
 * - Environment variables (phpdotenv)
 * - PSR-4 autoloading
 * - Router (FastRoute)
 * - Twig templates
 * - CSRF protection
 */

use App\Core\Router;
use Dotenv\Dotenv;

// Composer autoload
require dirname(__DIR__) . '/vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

// Session configuration with security settings
session_start([
    'cookie_lifetime' => 86400, // 24 hours
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

// Set timezone
date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'Europe/Brussels');

// Route the request
Router::dispatch();
