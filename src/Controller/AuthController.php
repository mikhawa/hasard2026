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
