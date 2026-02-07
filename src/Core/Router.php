<?php

declare(strict_types=1);

namespace App\Core;

use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;

class Router
{
    public static function dispatch(): void
    {
        $dispatcher = simpleDispatcher(function (RouteCollector $r) {
            // Public routes (authentication)
            $r->addRoute('GET', '/', ['App\\Controller\\AuthController', 'showLogin']);
            $r->addRoute('POST', '/', ['App\\Controller\\AuthController', 'login']);
            $r->addRoute('GET', '/logout', ['App\\Controller\\AuthController', 'logout']);

            // Choice routes (class selection for teachers)
            $r->addRoute('GET', '/choice', ['App\\Controller\\ChoiceController', 'index']);
            $r->addRoute('GET', '/choice/{id:\d+}', ['App\\Controller\\ChoiceController', 'select']);

            // Dashboard routes (admin/teacher)
            $r->addRoute('GET', '/dashboard', ['App\\Controller\\DashboardController', 'index']);
            $r->addRoute('GET', '/dashboard/logs', ['App\\Controller\\DashboardController', 'logs']);

            // Student routes
            $r->addRoute('GET', '/student', ['App\\Controller\\StudentController', 'index']);
            $r->addRoute('GET', '/student/logs', ['App\\Controller\\StudentController', 'logs']);

            // API routes (AJAX)
            $r->addRoute('POST', '/api/update', ['App\\Controller\\ApiController', 'update']);
            $r->addRoute('GET', '/api/load/{type}', ['App\\Controller\\ApiController', 'load']);

            // Chart data API (replaces JpGraph)
            $r->addRoute('GET', '/api/chart/pie/{id:\d+}', ['App\\Controller\\ChartController', 'pieData']);
            $r->addRoute('GET', '/api/chart/bar/{id:\d+}', ['App\\Controller\\ChartController', 'barData']);
        });

        $httpMethod = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['REQUEST_URI'];

        // Strip query string and decode URI
        if (false !== $pos = strpos($uri, '?')) {
            $uri = substr($uri, 0, $pos);
        }
        $uri = rawurldecode($uri);

        $routeInfo = $dispatcher->dispatch($httpMethod, $uri);

        switch ($routeInfo[0]) {
            case \FastRoute\Dispatcher::NOT_FOUND:
                http_response_code(404);
                echo '404 Not Found';
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
}
