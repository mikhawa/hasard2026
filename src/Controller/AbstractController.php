<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Config;
use App\Core\Csrf;
use App\Core\Database;
use App\Service\TimeSlotService;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

abstract class AbstractController
{
    protected Environment $twig;
    protected \PDO $db;
    protected TimeSlotService $timeSlot;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->timeSlot = new TimeSlotService();
        $this->initTwig();
    }

    private function initTwig(): void
    {
        $loader = new FilesystemLoader(dirname(__DIR__, 2) . '/templates');
        $this->twig = new Environment($loader, [
            'cache' => Config::isDebug() ? false : dirname(__DIR__, 2) . '/cache/twig',
            'debug' => Config::isDebug(),
            'auto_reload' => true,
        ]);

        // Add CSRF function
        $this->twig->addGlobal('csrf_field', Csrf::field());
        $this->twig->addGlobal('csrf_token', Csrf::getToken());
    }

    protected function render(string $template, array $data = []): void
    {
        echo $this->twig->render($template, $data);
    }

    protected function json(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
    }

    protected function jsonSuccess(array $data, int $statusCode = 200): void
    {
        $this->setCorsHeaders();
        $this->json(['success' => true, 'data' => $data], $statusCode);
    }

    protected function jsonError(string $message, int $statusCode = 400): void
    {
        $this->setCorsHeaders();
        $this->json(['success' => false, 'error' => $message], $statusCode);
    }

    protected function setCorsHeaders(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = ['http://localhost:5173', 'http://127.0.0.1:5173'];

        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        }
    }

    protected function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }

    protected function requireAuth(): void
    {
        if (!isset($_SESSION['myidsession']) || $_SESSION['myidsession'] !== session_id()) {
            $this->redirect('/');
        }
    }

    protected function requireApiAuth(): bool
    {
        if (!isset($_SESSION['myidsession']) || $_SESSION['myidsession'] !== session_id()) {
            $this->jsonError('Non authentifié', 401);
            return false;
        }
        return true;
    }

    protected function requireClass(): void
    {
        if (!isset($_SESSION['classe'])) {
            $this->redirect('/choice');
        }
    }

    protected function requireApiClass(): bool
    {
        if (!isset($_SESSION['classe'])) {
            $this->jsonError('Aucune classe sélectionnée', 403);
            return false;
        }
        return true;
    }

    protected function getJsonBody(): array
    {
        $body = file_get_contents('php://input');
        return json_decode($body, true) ?? [];
    }

    protected function isLoggedIn(): bool
    {
        return isset($_SESSION['myidsession']) && $_SESSION['myidsession'] === session_id();
    }

    protected function getTimeFilter(?string $temps = null): array
    {
        return $this->timeSlot->getFilter($temps);
    }

    protected function getTimeFilters(): array
    {
        return $this->timeSlot->getAvailableFilters();
    }

    protected function calculatePercent(int $value, int $total): float
    {
        if ($total === 0) {
            return 0;
        }
        return round(($value / $total) * 100, 1);
    }
}
