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

    protected function requireClass(): void
    {
        if (!isset($_SESSION['classe'])) {
            $this->redirect('/choice');
        }
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
