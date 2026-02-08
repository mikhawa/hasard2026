# Controleurs - Ancien vs Nouveau

---

## Mapping des controleurs

| AVANT (fichier procedural) | APRES (classe) | Role |
|----------------------------|----------------|------|
| `controller/publicController.php` | `src/Controller/AuthController.php` | Login / Logout |
| `controller/choiceController.php` | `src/Controller/ChoiceController.php` | Selection de classe |
| `controller/privateController.php` | `src/Controller/DashboardController.php` | Dashboard admin/prof |
| `controller/stagController.php` | `src/Controller/StudentController.php` | Vue stagiaire |
| `controller/load.php` | `src/Controller/ApiController.php` | AJAX chargement |
| `controller/update.php` | `src/Controller/ApiController.php` | AJAX mise a jour |
| `controller/timeslotController.php` | `src/Service/TimeSlotService.php` | Filtres temporels |
| *(n'existait pas)* | `src/Controller/ChartController.php` | API donnees graphiques |

---

## Exemple de transformation

### AVANT - `controller/publicController.php`

```php
<?php
use App\UserModel;
use App\UserManager;

$userManager = new UserManager($connect);  // $connect = variable globale

if(isset($_POST['username'],$_POST['userpwd'])){
    $user = new UserModel([
        "username" => $_POST['username'],
        "userpwd" => $_POST['userpwd']
    ]);

    if($userManager->connectUser($user)){
        header("Location: ./");
        exit();
    }else{
        $error = "<p style='text-align: center'>Login ou mot de passe incorrecte.</p>";
    }
}

require_once "../view/loginView.php";
```

**Problemes :**
- Variable `$connect` globale passee implicitement
- Pas de protection CSRF
- Message d'erreur en HTML dans le controleur
- Vue incluse par `require_once`

### APRES - `src/Controller/AuthController.php`

```php
<?php
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
            if (!Csrf::validate($_POST['_csrf'] ?? '')) {
                $error = 'Session expiree. Veuillez reessayer.';
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

        $this->render('auth/login.html.twig', ['error' => $error]);
    }
}
```

**Ameliorations :**
- Classe avec namespace, injectable
- Connexion DB via `$this->db` (singleton)
- Protection CSRF validee
- Rendu via Twig (`$this->render()`)
- Redirection intelligente selon le role

---

## AbstractController

Tous les controleurs heritent de `AbstractController` qui fournit :

```php
abstract class AbstractController
{
    protected Environment $twig;     // Moteur de templates
    protected \PDO $db;              // Connexion base de donnees
    protected TimeSlotService $timeSlot;

    // Methodes disponibles dans tous les controleurs :
    $this->render('template.twig', $data);  // Rendu Twig
    $this->json($data, $statusCode);        // Reponse JSON
    $this->redirect('/url');                 // Redirection
    $this->requireAuth();                   // Verifie la session
    $this->requireClass();                  // Verifie la classe en session
    $this->isLoggedIn();                    // Bool: connecte ?
    $this->getTimeFilter();                 // Filtre temporel actif
    $this->getTimeFilters();                // Liste des filtres
    $this->calculatePercent($val, $total);  // Calcul pourcentage
}
```

---

## Routes definies

```php
// Public
GET  /                    → AuthController::showLogin
POST /                    → AuthController::login
GET  /logout              → AuthController::logout

// Selection de classe
GET  /choice              → ChoiceController::index
GET  /choice/{id}         → ChoiceController::select

// Dashboard admin/prof
GET  /dashboard           → DashboardController::index
GET  /dashboard/logs      → DashboardController::logs

// Vue stagiaire
GET  /student             → StudentController::index
GET  /student/logs        → StudentController::logs

// API AJAX
POST /api/update          → ApiController::update
GET  /api/load/{type}     → ApiController::load     (type: general|equipe|hasard)

// API Graphiques
GET  /api/chart/pie/{id}  → ChartController::pieData
GET  /api/chart/bar/{id}  → ChartController::barData
```
