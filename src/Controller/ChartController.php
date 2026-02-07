<?php

declare(strict_types=1);

namespace App\Controller;

use App\Model\AnneeManager;
use App\Model\StagiairesManager;

class ChartController extends AbstractController
{
    public function pieData(string $id): void
    {
        $this->requireAuth();

        $classeId = (int) $id;
        $temps = $_GET['temps'] ?? 'tous';
        $timeFilter = $this->timeSlot->getFilter($temps);

        $statsManager = new AnneeManager($this->db);
        $stats = $statsManager->SelectStatsByAnneeAndDate($classeId, $timeFilter['date']);

        if (is_string($stats)) {
            $this->json(['error' => $stats], 500);
            return;
        }

        $this->json([
            'labels' => ['Tres bien', 'Bien', 'Pas bien', 'Absent'],
            'data' => [
                $stats['vgood'],
                $stats['good'],
                $stats['nogood'],
                $stats['absent']
            ],
            'colors' => ['#1E90FF', '#BA55D3', '#DC143C', '#ADFF2F']
        ]);
    }

    public function barData(string $id): void
    {
        $this->requireAuth();

        $classeId = (int) $id;
        $type = $_GET['type'] ?? 'points';
        $temps = $_GET['temps'] ?? 'tous';
        $timeFilter = $this->timeSlot->getFilter($temps);

        $stagiairesManager = new StagiairesManager($this->db);
        $stagiaires = $stagiairesManager->SelectOnlyStagiairesByIdAnnee($classeId, $timeFilter['date']);

        if (is_string($stagiaires)) {
            $this->json(['error' => $stagiaires], 500);
            return;
        }

        // Sort based on type
        if ($type === 'sorties') {
            usort($stagiaires, fn($a, $b) => $b['sorties'] - $a['sorties']);
            $title = 'Top sorties de la classe';
            $dataKey = 'sorties';
        } else {
            usort($stagiaires, fn($a, $b) => $b['points'] - $a['points']);
            $title = 'Top points de la classe';
            $dataKey = 'points';
        }

        $labels = [];
        $data = [];

        foreach ($stagiaires as $student) {
            $labels[] = $student['prenom'] . ' ' . substr($student['nom'], 0, 1);
            $data[] = $student[$dataKey];
        }

        $this->json([
            'title' => $title,
            'labels' => $labels,
            'data' => $data
        ]);
    }
}
