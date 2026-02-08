<?php

declare(strict_types=1);

namespace App\Controller;

class ChoiceController extends AbstractController
{
    public function index(): void
    {
        $this->requireAuth();

        // If only one class, auto-select it
        if (count($_SESSION['idannee']) === 1) {
            $_SESSION['classe'] = (int) $_SESSION['idannee'][0];
            $this->redirect('/dashboard');
            return;
        }

        $this->render('choice/index.html.twig', [
            'session_annees' => $_SESSION['idannee'],
            'session_years' => $_SESSION['annee'],
            'session_sections' => $_SESSION['section'],
        ]);
    }

    public function select(string $id): void
    {
        $this->requireAuth();

        $id = (int) $id;

        // Validate that the choice is valid for this user
        if (in_array($id, $_SESSION['idannee'])) {
            $_SESSION['classe'] = $id;
            $this->redirect('/dashboard');
        } else {
            $this->redirect('/choice');
        }
    }

    // ── API endpoints ──────────────────────────────────────

    public function apiSelect(string $id): void
    {
        if (!$this->requireApiAuth()) return;

        $id = (int) $id;

        if (!in_array($id, $_SESSION['idannee'])) {
            $this->jsonError('Classe invalide', 400);
            return;
        }

        $_SESSION['classe'] = $id;
        $idx = array_search($id, $_SESSION['idannee']);

        $this->jsonSuccess([
            'classeId' => $id,
            'annee' => $_SESSION['annee'][$idx] ?? '',
            'section' => $_SESSION['section'][$idx] ?? '',
        ]);
    }
}
