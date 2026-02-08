<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Csrf;
use App\Model\AnneeManager;
use App\Model\StagiairesManager;

class ApiController extends AbstractController
{
    public function update(): void
    {
        $this->requireAuth();

        // Validate CSRF token from header
        $csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!Csrf::validate($csrfToken)) {
            $this->json(['error' => 'Invalid CSRF token'], 403);
            return;
        }

        // Get JSON body if Content-Type is JSON, otherwise use POST
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'application/json') !== false) {
            $data = json_decode(file_get_contents('php://input'), true);
        } else {
            $data = $_POST;
        }

        if (!isset($data['idstag'])) {
            $this->json(['error' => 'Missing required fields'], 400);
            return;
        }

        $idstag = (int) $data['idstag'];
        $idan = (int) ($data['idan'] ?? $_SESSION['classe']);
        $points = (int) ($data['points'] ?? 0);
        $remarque = !empty($data['remarque']) ? htmlspecialchars($data['remarque'], ENT_QUOTES) : null;

        $stagiairesManager = new StagiairesManager($this->db);
        $result = $stagiairesManager->updatePointsStagiaireById($idstag, $points, $idan, $remarque);

        $this->json([
            'success' => true,
            'message' => $result,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function load(string $type): void
    {
        $this->requireAuth();

        $classeId = (int) ($_GET['idan'] ?? $_SESSION['classe']);
        $temps = $_GET['temps'] ?? 'tous';
        $timeFilter = $this->timeSlot->getFilter($temps);

        $stagiairesManager = new StagiairesManager($this->db);
        $statsManager = new AnneeManager($this->db);

        switch ($type) {
            case 'general':
                $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);
                if (is_string($stats)) {
                    echo $stats;
                    return;
                }

                $output = "<p>Nombre de questions : <strong>{$stats['sorties']}</strong></p>";
                $output .= "<p>Nombre de tres bonnes reponses : <strong>" . $this->formatPercent($stats['vgood'], $stats['sorties']) . "</strong></p>";
                $output .= "<p>Nombre de bonnes reponses : <strong>" . $this->formatPercent($stats['good'], $stats['sorties']) . "</strong></p>";
                $output .= "<p>Nombre de mauvaises reponses : <strong>" . $this->formatPercent($stats['nogood'], $stats['sorties']) . "</strong></p>";
                $output .= "<p>Nombre d'absences : <strong>" . $this->formatPercent($stats['absent'], $stats['sorties']) . "</strong></p>";
                echo $output;
                break;

            case 'equipe':
                $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);
                $stagiaires = $stagiairesManager->SelectOnlyStagiairesByIdAnnee($classeId, $timeFilter['date']);

                if (is_string($stagiaires)) {
                    echo $stagiaires;
                    return;
                }

                // Sort by points
                usort($stagiaires, fn($a, $b) => $b['points'] - $a['points']);

                $output = '';
                $i = 1;
                foreach ($stagiaires as $item) {
                    $output .= "<tr>";
                    $output .= "<th scope='row'>{$i}</th>";
                    $output .= "<td>{$item['prenom']} " . substr($item['nom'], 0, 1) . "</td>";
                    $output .= "<td>{$item['points']}</td>";
                    $output .= "<td>" . $this->formatPercent($item['vgood'], $item['sorties']) . "</td>";
                    $output .= "<td>" . $this->formatPercent($item['good'], $item['sorties']) . "</td>";
                    $output .= "<td>" . $this->formatPercent($item['nogood'], $item['sorties']) . "</td>";
                    $output .= "<td>" . $this->formatPercent($item['absent'], $item['sorties']) . "</td>";
                    $output .= "<td>{$item['sorties']}</td>";
                    $output .= "<td>" . $this->formatPercent($item['sorties'], $stats['sorties']) . "</td>";
                    $output .= "</tr>";
                    $i++;
                }
                echo $output;
                break;

            case 'hasard':
                $randomStudent = $stagiairesManager->SelectOneRandomStagiairesByIdAnnee($classeId);

                if (is_string($randomStudent)) {
                    $this->json(['error' => $randomStudent], 500);
                    return;
                }

                $this->json([
                    'idstagiaires' => $randomStudent['idstagiaires'],
                    'prenom' => $randomStudent['prenom'],
                    'nom' => $randomStudent['nom'],
                ]);
                break;

            default:
                $this->json(['error' => 'Unknown type'], 400);
        }
    }

    // ── API v1 endpoints ────────────────────────────────────

    public function apiRecordResponse(): void
    {
        if (!$this->requireApiAuth()) return;

        $csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!Csrf::validate($csrfToken)) {
            $this->jsonError('Token CSRF invalide', 403);
            return;
        }

        $data = $this->getJsonBody();

        if (!isset($data['idstag'])) {
            $this->jsonError('Champs requis manquants', 400);
            return;
        }

        $idstag = (int) $data['idstag'];
        $idan = (int) ($data['idan'] ?? $_SESSION['classe']);
        $points = (int) ($data['points'] ?? 0);
        $remarque = !empty($data['remarque']) ? htmlspecialchars($data['remarque'], ENT_QUOTES) : null;

        $stagiairesManager = new StagiairesManager($this->db);
        $result = $stagiairesManager->updatePointsStagiaireById($idstag, $points, $idan, $remarque);

        $this->jsonSuccess([
            'message' => $result,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function apiRandomStudent(): void
    {
        if (!$this->requireApiAuth()) return;

        $classeId = (int) ($_GET['idan'] ?? $_SESSION['classe']);

        $stagiairesManager = new StagiairesManager($this->db);
        $randomStudent = $stagiairesManager->SelectOneRandomStagiairesByIdAnnee($classeId);

        if (is_string($randomStudent)) {
            $this->jsonError($randomStudent, 500);
            return;
        }

        $this->jsonSuccess([
            'idstagiaires' => $randomStudent['idstagiaires'],
            'prenom' => $randomStudent['prenom'],
            'nom' => $randomStudent['nom'],
        ]);
    }

    public function apiStats(): void
    {
        if (!$this->requireApiAuth()) return;

        $classeId = (int) ($_GET['idan'] ?? $_SESSION['classe']);
        $temps = $_GET['temps'] ?? 'tous';
        $timeFilter = $this->timeSlot->getFilter($temps);

        $statsManager = new AnneeManager($this->db);
        $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);

        if (is_string($stats)) {
            $this->jsonError($stats, 500);
            return;
        }

        $stats['vgood_pct'] = $this->calculatePercent($stats['vgood'], $stats['sorties']);
        $stats['good_pct'] = $this->calculatePercent($stats['good'], $stats['sorties']);
        $stats['nogood_pct'] = $this->calculatePercent($stats['nogood'], $stats['sorties']);
        $stats['absent_pct'] = $this->calculatePercent($stats['absent'], $stats['sorties']);

        $this->jsonSuccess($stats);
    }

    // ── Legacy helpers ───────────────────────────────────────

    private function formatPercent(int $value, int $total): string
    {
        if ($total === 0) {
            return '0 (0%)';
        }
        $percent = round(($value / $total) * 100, 1);
        return "{$value} ({$percent}%)";
    }
}
