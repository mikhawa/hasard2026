<?php

declare(strict_types=1);

namespace App\Core;

use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;

class Router
{
    public static function dispatch(): void
    {
        $httpMethod = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];

        // Strip query string and decode URI
        if (false !== $pos = strpos($uri, '?')) {
            $uri = substr($uri, 0, $pos);
        }
        $uri = rawurldecode($uri);

        // Handle CORS preflight for API routes
        if ($httpMethod === 'OPTIONS' && str_starts_with($uri, '/api/')) {
            self::handleCorsOptions();
            return;
        }

        $dispatcher = simpleDispatcher(function (RouteCollector $r) {
            // ── Twig routes (legacy, kept during transition) ──────

            // Public routes (authentication)
            $r->addRoute('GET', '/', ['App\\Controller\\AuthController', 'showLogin']);
            $r->addRoute('POST', '/', ['App\\Controller\\AuthController', 'login']);
            $r->addRoute('GET', '/logout', ['App\\Controller\\AuthController', 'logout']);

            // Choice routes (class selection for teachers)
            $r->addRoute('GET', '/choice', ['App\\Controller\\ChoiceController', 'index']);
            $r->addRoute('GET', '/choice/{id:\d+}', ['App\\Controller\\ChoiceController', 'select']);

            // Dashboard routes (admin/teacher)
            $r->addRoute('GET', '/dashboard', ['App\\Controller\\DashboardController', 'index']);
            $r->addRoute('GET', '/dashboard/temps/{key}', ['App\\Controller\\DashboardController', 'index']);
            $r->addRoute('GET', '/dashboard/new-choice', ['App\\Controller\\DashboardController', 'newChoice']);
            $r->addRoute('GET', '/dashboard/logs', ['App\\Controller\\DashboardController', 'logs']);

            // Student routes
            $r->addRoute('GET', '/student', ['App\\Controller\\StudentController', 'index']);
            $r->addRoute('GET', '/student/temps/{key}', ['App\\Controller\\StudentController', 'index']);
            $r->addRoute('GET', '/student/logs', ['App\\Controller\\StudentController', 'logs']);

            // Legacy API routes (AJAX - kept during transition)
            $r->addRoute('POST', '/api/update', ['App\\Controller\\ApiController', 'update']);
            $r->addRoute('GET', '/api/load/{type}', ['App\\Controller\\ApiController', 'load']);
            $r->addRoute('GET', '/api/chart/pie/{id:\d+}', ['App\\Controller\\ChartController', 'pieData']);
            $r->addRoute('GET', '/api/chart/bar/{id:\d+}', ['App\\Controller\\ChartController', 'barData']);

            // ── API v1 routes (React SPA) ────────────────────────

            // Auth
            $r->addRoute('GET', '/api/v1/csrf', ['App\\Controller\\AuthController', 'apiCsrf']);
            $r->addRoute('POST', '/api/v1/login', ['App\\Controller\\AuthController', 'apiLogin']);
            $r->addRoute('POST', '/api/v1/logout', ['App\\Controller\\AuthController', 'apiLogout']);
            $r->addRoute('GET', '/api/v1/me', ['App\\Controller\\AuthController', 'apiMe']);

            // Class selection
            $r->addRoute('POST', '/api/v1/classes/{id:\d+}/select', ['App\\Controller\\ChoiceController', 'apiSelect']);

            // Dashboard
            $r->addRoute('GET', '/api/v1/dashboard', ['App\\Controller\\DashboardController', 'apiIndex']);
            $r->addRoute('GET', '/api/v1/dashboard/temps/{key}', ['App\\Controller\\DashboardController', 'apiIndex']);
            $r->addRoute('GET', '/api/v1/dashboard/logs', ['App\\Controller\\DashboardController', 'apiLogs']);

            // Student
            $r->addRoute('GET', '/api/v1/student', ['App\\Controller\\StudentController', 'apiIndex']);
            $r->addRoute('GET', '/api/v1/student/temps/{key}', ['App\\Controller\\StudentController', 'apiIndex']);
            $r->addRoute('GET', '/api/v1/student/logs', ['App\\Controller\\StudentController', 'apiLogs']);

            // Data API
            $r->addRoute('POST', '/api/v1/responses', ['App\\Controller\\ApiController', 'apiRecordResponse']);
            $r->addRoute('GET', '/api/v1/random-student', ['App\\Controller\\ApiController', 'apiRandomStudent']);
            $r->addRoute('GET', '/api/v1/stats', ['App\\Controller\\ApiController', 'apiStats']);

            // Charts
            $r->addRoute('GET', '/api/v1/chart/pie/{id:\d+}', ['App\\Controller\\ChartController', 'pieData']);
            $r->addRoute('GET', '/api/v1/chart/bar/{id:\d+}', ['App\\Controller\\ChartController', 'barData']);
        });

        $routeInfo = $dispatcher->dispatch($httpMethod, $uri);

        switch ($routeInfo[0]) {
            case \FastRoute\Dispatcher::NOT_FOUND:
                // If not an API route, serve the SPA (if built)
                $spaIndex = dirname(__DIR__, 2) . '/public/app/index.html';
                if (!str_starts_with($uri, '/api/') && file_exists($spaIndex)) {
                    readfile($spaIndex);
                } else {
                    http_response_code(404);
                    echo '404 Not Found';
                }
                break;

            case \FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
                http_response_code(405);
                echo '405 Method Not Allowed';
                break;

            case \FastRoute\Dispatcher::FOUND:
                [$controllerClass, $method] = $routeInfo[1];
                $vars = $routeInfo[2];

                $controller = new $controllerClass();
                call_user_func_array([$controller, $method], $vars);
                break;
        }
    }

    private static function handleCorsOptions(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = ['http://localhost:5173', 'http://127.0.0.1:5173'];

        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Max-Age: 86400');
        }

        http_response_code(204);
    }
}
