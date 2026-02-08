<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Csrf;
use App\Model\UserManager;
use App\Model\UserModel;

class AuthController extends AbstractController
{
    public function showLogin(): void
    {
        if ($this->isLoggedIn()) {
            $this->redirectBasedOnPermission();
            return;
        }

        $this->render('auth/login.html.twig');
    }

    public function login(): void
    {
        if ($this->isLoggedIn()) {
            $this->redirectBasedOnPermission();
            return;
        }

        $error = null;

        if (isset($_POST['username'], $_POST['userpwd'])) {
            // Validate CSRF token
            if (!Csrf::validate($_POST['_csrf'] ?? '')) {
                $error = 'Session expirée. Veuillez réessayer.';
            } else {
                $userManager = new UserManager($this->db);
                $user = new UserModel([
                    'username' => $_POST['username'],
                    'userpwd' => $_POST['userpwd']
                ]);

                if ($userManager->connectUser($user)) {
                    Csrf::regenerate();
                    $this->redirectBasedOnPermission();
                    return;
                } else {
                    $error = 'Login ou mot de passe incorrect.';
                }
            }
        }

        $this->render('auth/login.html.twig', [
            'error' => $error
        ]);
    }

    public function logout(): void
    {
        UserManager::disconnect();
        $this->redirect('/');
    }

    // ── API endpoints ──────────────────────────────────────

    public function apiLogin(): void
    {
        $body = $this->getJsonBody();
        $username = $body['username'] ?? null;
        $password = $body['userpwd'] ?? null;

        if (!$username || !$password) {
            $this->jsonError('Champs requis manquants', 400);
            return;
        }

        $csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!Csrf::validate($csrfToken)) {
            $this->jsonError('Token CSRF invalide', 403);
            return;
        }

        $userManager = new UserManager($this->db);
        $user = new UserModel([
            'username' => $username,
            'userpwd' => $password,
        ]);

        if (!$userManager->connectUser($user)) {
            $this->jsonError('Login ou mot de passe incorrect', 401);
            return;
        }

        Csrf::regenerate();

        $classes = [];
        $idannee = $_SESSION['idannee'] ?? [];
        $annee = $_SESSION['annee'] ?? [];
        $section = $_SESSION['section'] ?? [];

        for ($i = 0; $i < count($idannee); $i++) {
            $classes[] = [
                'idannee' => (int) $idannee[$i],
                'annee' => $annee[$i] ?? '',
                'section' => $section[$i] ?? '',
            ];
        }

        // Auto-select class for students
        if (($_SESSION['perm'] ?? -1) === 0 && !empty($idannee)) {
            $_SESSION['classe'] = $idannee[0];
        }

        $this->jsonSuccess([
            'user' => [
                'iduser' => (int) $_SESSION['iduser'],
                'username' => $_SESSION['username'],
                'perm' => (int) $_SESSION['perm'],
            ],
            'classes' => $classes,
            'csrf' => Csrf::getToken(),
        ]);
    }

    public function apiLogout(): void
    {
        UserManager::disconnect();
        session_start();
        $this->jsonSuccess(['message' => 'Déconnexion réussie']);
    }

    public function apiMe(): void
    {
        if (!$this->requireApiAuth()) return;

        $classes = [];
        $idannee = $_SESSION['idannee'] ?? [];
        $annee = $_SESSION['annee'] ?? [];
        $section = $_SESSION['section'] ?? [];

        for ($i = 0; $i < count($idannee); $i++) {
            $classes[] = [
                'idannee' => (int) $idannee[$i],
                'annee' => $annee[$i] ?? '',
                'section' => $section[$i] ?? '',
            ];
        }

        $this->jsonSuccess([
            'user' => [
                'iduser' => (int) $_SESSION['iduser'],
                'username' => $_SESSION['username'],
                'perm' => (int) $_SESSION['perm'],
            ],
            'classes' => $classes,
            'selectedClass' => isset($_SESSION['classe']) ? (int) $_SESSION['classe'] : null,
            'csrf' => Csrf::getToken(),
        ]);
    }

    public function apiCsrf(): void
    {
        $this->jsonSuccess(['csrf' => Csrf::getToken()]);
    }

    // ── Twig helpers ────────────────────────────────────────

    private function redirectBasedOnPermission(): void
    {
        if (!isset($_SESSION['perm'])) {
            $this->redirect('/');
            return;
        }

        switch ($_SESSION['perm']) {
            case 0:
                $_SESSION['classe'] = $_SESSION['idannee'][0];
                $this->redirect('/student');
                break;
            case 1:
                if (!isset($_SESSION['classe'])) {
                    $this->redirect('/choice');
                } else {
                    $this->redirect('/dashboard');
                }
                break;
            default:
                if (!isset($_SESSION['classe'])) {
                    $this->redirect('/choice');
                } else {
                    $this->redirect('/dashboard');
                }
                break;
        }
    }
}
