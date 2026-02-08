# Architecture du projet Hasard 2026

## Comparaison Ancien vs Nouveau

---

## Structure des fichiers

### AVANT (Architecture originale)

```
hasard2026/
├── config.php                  # Credentials en dur
├── config-dev.php              # Config dev en dur
├── index.html                  # Page par defaut Plesk
├── composer.json               # Dependance: jpgraph uniquement
│
├── public/
│   ├── index.php               # Point d'entree (routing if/else)
│   ├── .php-version
│   ├── robots.txt
│   ├── img/
│   │   ├── logo.png
│   │   ├── load.gif
│   │   ├── plots1.php          # Graphique camembert (JpGraph)
│   │   └── plots2.php          # Graphique barres (JpGraph)
│   └── js/
│       ├── myAjax.js           # AJAX avec XMLHttpRequest
│       └── myAjax.min.js
│
├── controller/
│   ├── publicController.php    # Login (fichier procedural)
│   ├── privateController.php   # Dashboard admin (procedural)
│   ├── stagController.php      # Vue stagiaire (procedural)
│   ├── choiceController.php    # Choix de classe (procedural)
│   ├── timeslotController.php  # Filtre temporel (switch/case)
│   ├── load.php                # AJAX chargement (procedural)
│   └── update.php              # AJAX mise a jour (procedural)
│
├── model/
│   ├── AbstractModel.php       # namespace App
│   ├── ManagerInterface.php
│   ├── UserModel.php
│   ├── UserManager.php
│   ├── StagiairesModel.php
│   ├── StagiairesManager.php
│   ├── AnneeModel.php
│   ├── AnneeManager.php
│   ├── ReponseslogModel.php
│   ├── ReponselogManager.php
│   └── Calcul.php
│
└── view/
    ├── loginView.php           # HTML + PHP melange
    ├── homepageView.php        # HTML + PHP melange
    ├── stagView.php            # HTML + PHP melange
    ├── choiceView.php          # HTML + PHP melange
    ├── logView.php             # HTML + PHP melange
    └── footerView.php
```

### APRES (Architecture modernisee)

```
hasard2026/
├── .env                        # Variables d'environnement (git-ignore)
├── .env.example                # Template pour .env
├── .htaccess                   # Redirection vers public/
├── .gitignore                  # Mis a jour
├── composer.json               # Dependencies modernes
│
├── public/
│   ├── index.php               # Point d'entree simplifie (37 lignes)
│   ├── .htaccess               # Front controller + securite
│   ├── img/
│   │   └── logo.png
│   └── js/
│       ├── app.js              # JavaScript moderne (Fetch API)
│       └── charts.js           # Integration Chart.js
│
├── src/
│   ├── Core/
│   │   ├── Router.php          # FastRoute - routing declaratif
│   │   ├── Config.php          # Acces aux variables d'environnement
│   │   ├── Csrf.php            # Protection CSRF
│   │   └── Database.php        # Connexion PDO singleton
│   │
│   ├── Controller/
│   │   ├── AbstractController.php  # Base commune (Twig, auth, DB)
│   │   ├── AuthController.php      # Login / Logout
│   │   ├── ChoiceController.php    # Selection de classe
│   │   ├── DashboardController.php # Dashboard admin/prof
│   │   ├── StudentController.php   # Vue stagiaire
│   │   ├── ApiController.php       # Endpoints AJAX
│   │   └── ChartController.php     # API donnees graphiques
│   │
│   ├── Model/                  # namespace App\Model
│   │   ├── AbstractModel.php
│   │   ├── ManagerInterface.php
│   │   ├── UserModel.php
│   │   ├── UserManager.php
│   │   ├── StagiairesModel.php
│   │   ├── StagiairesManager.php
│   │   ├── AnneeModel.php
│   │   ├── AnneeManager.php
│   │   ├── ReponseslogModel.php
│   │   ├── ReponselogManager.php
│   │   └── Calcul.php
│   │
│   └── Service/
│       └── TimeSlotService.php # Logique des filtres temporels
│
├── templates/
│   ├── base.html.twig          # Template de base (layout)
│   ├── partials/
│   │   ├── navbar.html.twig    # Barre de navigation
│   │   └── footer.html.twig   # Pied de page
│   ├── auth/
│   │   └── login.html.twig    # Page de connexion
│   ├── choice/
│   │   └── index.html.twig    # Selection de classe
│   ├── dashboard/
│   │   ├── index.html.twig    # Dashboard principal
│   │   └── logs.html.twig     # Logs d'activite
│   └── student/
│       ├── index.html.twig    # Vue stagiaire
│       └── logs.html.twig     # Logs stagiaire
│
└── documentation/              # Ce dossier
```

---

## Flux de requete

### AVANT

```
Requete HTTP
    │
    ▼
public/index.php (106 lignes)
    ├── require config.php          (credentials en dur)
    ├── require autoload
    ├── new PDO(...)                (connexion manuelle)
    │
    ├── SI connecte ?
    │   ├── include timeslotController.php
    │   ├── SI perm == 0 → require stagController.php
    │   ├── SI perm == 1 → require choiceController.php
    │   ├── SI $_GET['myfile'] == 'update' → require update.php
    │   ├── SI $_GET['myfile'] == 'load'   → require load.php
    │   └── SINON → require privateController.php
    │
    └── SINON
        ├── SI $_GET['myfile'] → deconnexion
        └── SINON → require publicController.php
```

### APRES

```
Requete HTTP
    │
    ▼
public/index.php (37 lignes)
    ├── require autoload
    ├── Dotenv::load()              (.env securise)
    ├── session_start()             (config securisee)
    └── Router::dispatch()
            │
            ▼
        FastRoute Dispatcher
            ├── GET  /              → AuthController::showLogin()
            ├── POST /              → AuthController::login()
            ├── GET  /logout        → AuthController::logout()
            ├── GET  /choice        → ChoiceController::index()
            ├── GET  /choice/{id}   → ChoiceController::select()
            ├── GET  /dashboard     → DashboardController::index()
            ├── GET  /dashboard/logs→ DashboardController::logs()
            ├── GET  /student       → StudentController::index()
            ├── GET  /student/logs  → StudentController::logs()
            ├── POST /api/update    → ApiController::update()
            ├── GET  /api/load/{t}  → ApiController::load()
            ├── GET  /api/chart/pie → ChartController::pieData()
            └── GET  /api/chart/bar → ChartController::barData()
                    │
                    ▼
            AbstractController
                ├── Database::getConnection()
                ├── Twig::render()
                └── Csrf::validate()
```
