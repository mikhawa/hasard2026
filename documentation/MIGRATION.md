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
- [ ] Deconnexion
- [ ] Selection de classe (si multi-classes)
- [ ] Affichage du dashboard avec statistiques
- [ ] Filtre temporel (tous, 1 an, 6 mois, etc.)
- [ ] Tirage au sort d'un stagiaire (bouton "Nouvelle question")
- [ ] Selection d'un stagiaire specifique (boutons noms)
- [ ] Enregistrement d'une reponse (4 boutons)
- [ ] Rafraichissement AJAX des statistiques
- [ ] Page des logs avec pagination
- [ ] Vue stagiaire (permission 0)
- [ ] Graphiques (si Chart.js integre)
- [ ] Changement de classe
