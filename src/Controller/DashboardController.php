<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\AnneeManager;
use App\Model\Calcul;
use App\Model\ReponselogManager;
use App\Model\StagiairesManager;

class DashboardController extends AbstractController
{
    public function index(string $key = null): void
    {
        $this->requireAuth();
        $this->requireClass();

        $classeId = (int) $_SESSION['classe'];
        $timeFilter = $this->getTimeFilter($key);

        $stagiairesManager = new StagiairesManager($this->db);
        $statsManager = new AnneeManager($this->db);

        // Get all students with stats and calculate points
        $stagiaires = $stagiairesManager->SelectOnlyStagiairesByIdAnnee($classeId, $timeFilter['date']);
        if (is_string($stagiaires)) {
            die($stagiaires);
        }

        // Calculate points and sort (adds 'points' key to each student)
        $stagiaires = Calcul::calculPoints($stagiaires);

        // Get global stats
        $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);
        if (is_string($stats)) {
            die($stats);
        }

        // Get random student
        $randomStudent = $stagiairesManager->SelectOneRandomStagiairesByIdAnnee($classeId);
        if (is_string($randomStudent)) {
            die($randomStudent);
        }

        // Calculate percentages for stats
        $stats['vgood_pct'] = $this->calculatePercent($stats['vgood'], $stats['sorties']);
        $stats['good_pct'] = $this->calculatePercent($stats['good'], $stats['sorties']);
        $stats['nogood_pct'] = $this->calculatePercent($stats['nogood'], $stats['sorties']);
        $stats['absent_pct'] = $this->calculatePercent($stats['absent'], $stats['sorties']);

        // Calculate percentages for each student
        foreach ($stagiaires as &$student) {
            $student['vgood_pct'] = $this->calculatePercent($student['vgood'], $student['sorties']);
            $student['good_pct'] = $this->calculatePercent($student['good'], $student['sorties']);
            $student['nogood_pct'] = $this->calculatePercent($student['nogood'], $student['sorties']);
            $student['absent_pct'] = $this->calculatePercent($student['absent'], $student['sorties']);
            $student['sortie_pct'] = $this->calculatePercent($student['sorties'], $stats['sorties']);
        }

        // Get class info from session
        $idannee = array_search($classeId, $_SESSION['idannee']);

        $this->render('dashboard/index.html.twig', [
            'stagiaires' => $stagiaires,
            'stats' => $stats,
            'random_student' => $randomStudent,
            'time_label' => $timeFilter['label'],
            'current_time' => $timeFilter['key'],
            'time_filters' => $this->getTimeFilters(),
            'classe_id' => $classeId,
            'class_year' => $_SESSION['annee'][$idannee],
            'class_section' => $_SESSION['section'][$idannee],
        ]);
    }

    public function newChoice(): void
    {
        $this->requireAuth();
        unset($_SESSION['classe']);
        $this->redirect('/choice');
    }

    public function logs(): void
    {
        $this->requireAuth();
        $this->requireClass();

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

        $pagination = ReponselogManager::pagination($totalLogs, '/dashboard/logs', $page, 'page', 100);

        $this->render('dashboard/logs.html.twig', [
            'stats' => $stats,
            'logs' => $logs,
            'total_logs' => $totalLogs,
            'page' => $page,
            'pagination' => $pagination,
            'base_url' => '/dashboard',
        ]);
    }
}
