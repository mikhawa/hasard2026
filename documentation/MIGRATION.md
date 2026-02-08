# Guide de migration

---

## Fichiers a supprimer (apres validation)

Une fois que le nouveau systeme fonctionne correctement, supprimer les anciens fichiers :

### Anciens controleurs (`controller/`)

```
controller/publicController.php    → remplace par src/Controller/AuthController.php
controller/privateController.php   → remplace par src/Controller/DashboardController.php
controller/stagController.php      → remplace par src/Controller/StudentController.php
controller/choiceController.php    → remplace par src/Controller/ChoiceController.php
controller/timeslotController.php  → remplace par src/Service/TimeSlotService.php
controller/load.php                → remplace par src/Controller/ApiController.php
controller/update.php              → remplace par src/Controller/ApiController.php
```

### Anciennes vues (`view/`)

```
view/loginView.php      → remplace par templates/auth/login.html.twig
view/homepageView.php   → remplace par templates/dashboard/index.html.twig
view/stagView.php       → remplace par templates/student/index.html.twig
view/choiceView.php     → remplace par templates/choice/index.html.twig
view/logView.php        → remplace par templates/dashboard/logs.html.twig
view/footerView.php     → remplace par templates/partials/footer.html.twig
```

### Anciens modeles (`model/`)

```
model/*.php             → remplaces par src/Model/*.php (namespace App\Model)
```

### Ancienne configuration

```
config.php              → remplace par .env (deja dans .gitignore)
config-dev.php          → remplace par .env
config.php.ini          → remplace par .env
```

### Anciens graphiques (JpGraph)

```
public/img/plots1.php   → remplace par public/js/charts.js + ChartController
public/img/plots2.php   → remplace par public/js/charts.js + ChartController
```

### Ancien JavaScript

```
public/js/myAjax.js     → remplace par public/js/app.js
public/js/myAjax.min.js → remplace par public/js/app.js
```

### Divers

```
index.html              → page par defaut Plesk, inutile
```

---

## Changements de namespace

| AVANT | APRES |
|-------|-------|
| `App\UserModel` | `App\Model\UserModel` |
| `App\UserManager` | `App\Model\UserManager` |
| `App\StagiairesModel` | `App\Model\StagiairesModel` |
| `App\StagiairesManager` | `App\Model\StagiairesManager` |
| `App\AnneeModel` | `App\Model\AnneeModel` |
| `App\AnneeManager` | `App\Model\AnneeManager` |
| `App\ReponseslogModel` | `App\Model\ReponseslogModel` |
| `App\ReponselogManager` | `App\Model\ReponselogManager` |
| `App\Calcul` | `App\Model\Calcul` |
| `App\AbstractModel` | `App\Model\AbstractModel` |
| `App\ManagerInterface` | `App\Model\ManagerInterface` |

Autoload Composer : `"App\\"` pointe vers `src/` au lieu de `model/`.

---

## Changements d'URLs

| AVANT | APRES |
|-------|-------|
| `./` (login) | `/` |
| `?disconnect` | `/logout` |
| `?choice=5` | `/choice/5` |
| `?newChoice` | `/dashboard?newChoice` |
| `?logs` | `/dashboard/logs` |
| `?logs&page=2` | `/dashboard/logs?page=2` |
| `?temps=1-mois` | `/dashboard?temps=1-mois` |
| `index.php?myfile=update` | `/api/update` |
| `index.php?myfile=load&partie=general` | `/api/load/general` |
| `index.php?myfile=load&partie=equipe` | `/api/load/equipe` |
| `index.php?myfile=load&partie=hasard` | `/api/load/hasard` |
| `img/plots1.php?p1=...` | `/api/chart/pie/{id}` |
| `img/plots2.php?...` | `/api/chart/bar/{id}` |

---

## Checklist de validation

Tester chaque fonctionnalite avant de supprimer les anciens fichiers :

- [ ] Connexion utilisateur (login)
      Route: POST /  →  AuthController::login()
      Template: templates/auth/login.html.twig (avec champ CSRF)

- [ ] Deconnexion
      Route: GET /logout  →  AuthController::logout()

- [ ] Selection de classe (si multi-classes)
      Route: GET /choice/{id}  →  ChoiceController::select()
      Auto-selection si 1 seule classe dans ChoiceController::index()

- [ ] Affichage du dashboard avec statistiques
      Route: GET /dashboard  →  DashboardController::index()
      Template: templates/dashboard/index.html.twig
      Donnees: stagiaires, stats globales, pourcentages, random student

- [ ] Filtre temporel (tous, 1 an, 6 mois, etc.)
      Route: GET /dashboard/temps/{key}  →  DashboardController::index()
      Service: src/Service/TimeSlotService.php (valeurs depuis .env)
      Cles: tous, 1-an, 6-mois, 3-mois, 1-mois, 2-semaines, 1-semaine, 1-jour

- [ ] Tirage au sort d'un stagiaire (bouton "Nouvelle question")
      JS: app.js → HasardApp.loadRandomStudent()
      API: GET /api/load/hasard  →  ApiController::load('hasard')

- [ ] Selection d'un stagiaire specifique (boutons noms)
      JS: app.js → fonction choix(idannee, idstagiaire, nom)
      Template: boutons generes dans dashboard/index.html.twig

- [ ] Enregistrement d'une reponse (4 boutons)
      JS: app.js → HasardApp.updateResponse()
      API: POST /api/update  →  ApiController::update() (avec CSRF header)
      Boutons: b3=Super(+2), b2=Bonne(+1), b1=Mauvaise(-1), b0=Absent(-1)

- [ ] Rafraichissement AJAX des statistiques
      JS: app.js → HasardApp.refreshStats()
      API: GET /api/load/general + GET /api/load/equipe
      Cibles DOM: #statstotal et #updateAllStagiaires

- [ ] Page des logs avec pagination
      Route: GET /dashboard/logs?page=N  →  DashboardController::logs()
      Template: templates/dashboard/logs.html.twig

- [ ] Vue stagiaire (permission 0)
      Route: GET /student  →  StudentController::index()
      Template: templates/student/index.html.twig
      Redirection auto si perm != 0

- [ ] Graphiques (Chart.js)
      JS: public/js/charts.js → loadPieChartFromApi(), loadBarChartFromApi()
      API: GET /api/chart/pie/{id} + GET /api/chart/bar/{id}
      Controleur: src/Controller/ChartController.php

- [ ] Changement de classe
      Route: GET /dashboard/new-choice  →  DashboardController::newChoice()
      Action: supprime $_SESSION['classe'], redirige vers /choice

---

## Audit de code (2026-02-08)

Resultat de la revue de code comparant anciens et nouveaux fichiers :

| Fonctionnalite              | Ancien fichier                | Nouveau fichier                   | Statut |
|-----------------------------|-------------------------------|-----------------------------------|--------|
| Connexion                   | controller/publicController   | src/Controller/AuthController     | OK     |
| Deconnexion                 | controller/publicController   | src/Controller/AuthController     | OK     |
| Selection classe            | controller/choiceController   | src/Controller/ChoiceController   | OK     |
| Dashboard                   | controller/privateController  | src/Controller/DashboardController| OK     |
| Filtre temporel             | config.php (CHOIX_DATE)       | TimeSlotService + .env            | OK     |
| Tirage au sort              | controller/load.php           | src/Controller/ApiController      | OK     |
| Selection stagiaire         | view/homepageView.php         | templates/dashboard/index.twig    | OK     |
| Enregistrement reponse      | controller/update.php         | src/Controller/ApiController      | OK     |
| Rafraichissement AJAX       | public/js/myAjax.js           | public/js/app.js                  | OK     |
| Logs + pagination           | view/logView.php              | templates/dashboard/logs.twig     | OK     |
| Vue stagiaire               | controller/stagController     | src/Controller/StudentController  | OK     |
| Graphiques                  | public/img/plots1/2.php       | ChartController + charts.js       | OK     |
| Changement classe           | controller/privateController  | src/Controller/DashboardController| OK     |

Ameliorations apportees lors de la migration :
- Protection CSRF sur le formulaire de login et les appels API
- Templates Twig avec heritage (base.html.twig) au lieu de PHP brut
- Routeur FastRoute avec URLs propres au lieu de query strings
- API v1 JSON pour futur frontend React SPA
- Fetch API au lieu de XMLHttpRequest
- Chart.js (client) au lieu de JpGraph (serveur)
- Configuration .env au lieu de constantes PHP en clair
- Namespaces PSR-4 (App\Model\*) au lieu de namespace racine

---

## Suppression des anciens fichiers

Apres avoir coche toute la checklist ci-dessus, executer le script de nettoyage :

```bash
# Simulation (aucun fichier supprime, affiche ce qui serait fait)
php cleanup.php

# Suppression reelle
php cleanup.php --confirm
```

Le script supprime :
- 8 anciens controleurs (controller/*.php)
- 7 anciennes vues (view/*.php)
- 12 anciens modeles (model/*.php)
- 1 ancien fichier de configuration (config.php)
- 2 anciens graphiques JpGraph (public/img/plots*.php)
- 2 anciens fichiers JavaScript (public/js/myAjax*.js)
- Les dossiers controller/, view/, model/ s'ils sont vides

Apres le nettoyage, supprimer le script lui-meme :
```bash
rm cleanup.php
```
