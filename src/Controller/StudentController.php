<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\AnneeManager;
use App\Model\ReponselogManager;
use App\Model\StagiairesManager;

class StudentController extends AbstractController
{
    public function index(string $key = null): void
    {
        $this->requireAuth();

        // Student permission check
        if ($_SESSION['perm'] != 0) {
            $this->redirect('/dashboard');
            return;
        }

        $classeId = (int) $_SESSION['classe'];
        $timeFilter = $this->getTimeFilter($key);

        $stagiairesManager = new StagiairesManager($this->db);
        $statsManager = new AnneeManager($this->db);

        // Get all students with stats
        $stagiaires = $stagiairesManager->SelectOnlyStagiairesByIdAnnee($classeId, $timeFilter['date']);
        if (is_string($stagiaires)) {
            die($stagiaires);
        }

        // Get global stats
        $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);
        if (is_string($stats)) {
            die($stats);
        }

        // Sort by points (descending)
        $stagiairesByPoints = $stagiaires;
        usort($stagiairesByPoints, fn($a, $b) => $b['points'] - $a['points']);

        // Sort by sorties (descending)
        $stagiairesBySorties = $stagiaires;
        usort($stagiairesBySorties, fn($a, $b) => $b['sorties'] - $a['sorties']);

        // Calculate percentages for stats
        $stats['vgood_pct'] = $this->calculatePercent($stats['vgood'], $stats['sorties']);
        $stats['good_pct'] = $this->calculatePercent($stats['good'], $stats['sorties']);
        $stats['nogood_pct'] = $this->calculatePercent($stats['nogood'], $stats['sorties']);
        $stats['absent_pct'] = $this->calculatePercent($stats['absent'], $stats['sorties']);

        // Calculate percentages for each student
        foreach ($stagiairesByPoints as &$student) {
            $student['vgood_pct'] = $this->calculatePercent($student['vgood'], $student['sorties']);
            $student['good_pct'] = $this->calculatePercent($student['good'], $student['sorties']);
            $student['nogood_pct'] = $this->calculatePercent($student['nogood'], $student['sorties']);
            $student['absent_pct'] = $this->calculatePercent($student['absent'], $student['sorties']);
            $student['sortie_pct'] = $this->calculatePercent($student['sorties'], $stats['sorties']);
        }

        $this->render('student/index.html.twig', [
            'stagiaires' => $stagiairesByPoints,
            'stagiaires_by_points' => $stagiairesByPoints,
            'stagiaires_by_sorties' => $stagiairesBySorties,
            'stats' => $stats,
            'time_label' => $timeFilter['label'],
            'current_time' => $timeFilter['key'],
            'time_filters' => $this->getTimeFilters(),
        ]);
    }

    // ── API endpoints ──────────────────────────────────────

    public function apiIndex(string $key = null): void
    {
        if (!$this->requireApiAuth()) return;

        if (($_SESSION['perm'] ?? -1) != 0) {
            $this->jsonError('Accès réservé aux étudiants', 403);
            return;
        }

        $classeId = (int) $_SESSION['classe'];
        $timeFilter = $this->getTimeFilter($key);

        $stagiairesManager = new StagiairesManager($this->db);
        $statsManager = new AnneeManager($this->db);

        $stagiaires = $stagiairesManager->SelectOnlyStagiairesByIdAnnee($classeId, $timeFilter['date']);
        if (is_string($stagiaires)) {
            $this->jsonError($stagiaires, 500);
            return;
        }

        $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);
        if (is_string($stats)) {
            $this->jsonError($stats, 500);
            return;
        }

        $stagiairesByPoints = $stagiaires;
        usort($stagiairesByPoints, fn($a, $b) => $b['points'] - $a['points']);

        $stagiairesBySorties = $stagiaires;
        usort($stagiairesBySorties, fn($a, $b) => $b['sorties'] - $a['sorties']);

        $stats['vgood_pct'] = $this->calculatePercent($stats['vgood'], $stats['sorties']);
        $stats['good_pct'] = $this->calculatePercent($stats['good'], $stats['sorties']);
        $stats['nogood_pct'] = $this->calculatePercent($stats['nogood'], $stats['sorties']);
        $stats['absent_pct'] = $this->calculatePercent($stats['absent'], $stats['sorties']);

        foreach ($stagiairesByPoints as &$student) {
            $student['vgood_pct'] = $this->calculatePercent($student['vgood'], $student['sorties']);
            $student['good_pct'] = $this->calculatePercent($student['good'], $student['sorties']);
            $student['nogood_pct'] = $this->calculatePercent($student['nogood'], $student['sorties']);
            $student['absent_pct'] = $this->calculatePercent($student['absent'], $student['sorties']);
            $student['sortie_pct'] = $this->calculatePercent($student['sorties'], $stats['sorties']);
        }

        $this->jsonSuccess([
            'timeFilter' => [
                'key' => $timeFilter['key'],
                'label' => $timeFilter['label'],
                'available' => $this->getTimeFilters(),
            ],
            'stats' => $stats,
            'studentsByPoints' => $stagiairesByPoints,
            'studentsBySorties' => $stagiairesBySorties,
        ]);
    }

    public function apiLogs(): void
    {
        if (!$this->requireApiAuth()) return;

        if (($_SESSION['perm'] ?? -1) != 0) {
            $this->jsonError('Accès réservé aux étudiants', 403);
            return;
        }

        $classeId = (int) $_SESSION['classe'];
        $page = isset($_GET['page']) && ctype_digit($_GET['page']) ? (int) $_GET['page'] : 1;
        $perPage = 100;

        $statsManager = new AnneeManager($this->db);
        $responseManager = new ReponselogManager($this->db);

        $stats = $statsManager->SelectAllByAnnee($classeId);
        if (is_string($stats)) {
            $this->jsonError($stats, 500);
            return;
        }

        $totalLogs = $responseManager->countAllLogsByAnnee($classeId);
        $logs = $responseManager->selectAllLogsByAnneeWithPG($classeId, $page);
        if (is_string($logs)) {
            $this->jsonError($logs, 500);
            return;
        }

        $totalPages = (int) ceil($totalLogs / $perPage);

        $this->jsonSuccess([
            'stats' => $stats,
            'logs' => $logs,
            'pagination' => [
                'totalLogs' => $totalLogs,
                'currentPage' => $page,
                'perPage' => $perPage,
                'totalPages' => $totalPages,
            ],
        ]);
    }

    // ── Twig endpoints ──────────────────────────────────────

    public function logs(): void
    {
        $this->requireAuth();

        // Student permission check
        if ($_SESSION['perm'] != 0) {
            $this->redirect('/dashboard/logs');
            return;
        }

        $classeId = (int) $_SESSION['classe'];
        $page = isset($_GET['page']) && ctype_digit($_GET['page']) ? (int) $_GET['page'] : 1;

        $statsManager = new AnneeManager($this->db);
        $responseManager = new ReponselogManager($this->db);

        // Get class info
        $stats = $statsManager->SelectAllByAnnee($classeId);
        if (is_string($stats)) {
            die($stats);
        }

        // Get logs with pagination
        $totalLogs = $responseManager->countAllLogsByAnnee($classeId);
        $logs = $responseManager->selectAllLogsByAnneeWithPG($classeId, $page);
        if (is_string($logs)) {
            die($logs);
        }

        $pagination = ReponselogManager::pagination($totalLogs, '/student/logs', $page, 'page', 100);

        $this->render('student/logs.html.twig', [
            'stats' => $stats,
            'logs' => $logs,
            'total_logs' => $totalLogs,
            'page' => $page,
            'pagination' => $pagination,
            'base_url' => '/student',
        ]);
    }
}
