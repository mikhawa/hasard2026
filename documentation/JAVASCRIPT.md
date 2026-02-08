# JavaScript - Ancien vs Nouveau

---

## Mapping des fichiers

| AVANT | APRES | Role |
|-------|-------|------|
| `public/js/myAjax.js` | `public/js/app.js` | Logique AJAX principale |
| `public/img/plots1.php` (JpGraph) | `public/js/charts.js` | Graphiques |
| `public/img/plots2.php` (JpGraph) | `public/js/charts.js` | Graphiques |

---

## AJAX : XMLHttpRequest vs Fetch API

### AVANT - `myAjax.js`

```javascript
function onUpdate(idstag, idan, point, temps, remarque) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("test").innerHTML = this.responseText;
            // rafraichir les stats
            var num = new XMLHttpRequest();
            onLoadPage('statstotal', 'general', num, temps, idan);
            var num2 = new XMLHttpRequest();
            onLoadPage('updateAllStagiaires', 'equipe', num2, temps, idan);
            var num3 = new XMLHttpRequest();
            onLoadPage('hasard', 'hasard', num3, temps, idan);
        }
    };
    xhttp.open("POST", "index.php?myfile=update", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("idstag=" + idstag + "&idan=" + idan + "&points=" + point + "&remarque=" + remarque);
}
```

**Problemes :**
- Callbacks imbriques (callback hell)
- Pas de gestion d'erreur
- Pas de CSRF
- URL par query string (`?myfile=update`)

### APRES - `app.js`

```javascript
async updateResponse(studentId, points, remarque = '') {
    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': this.csrfToken
            },
            body: JSON.stringify({
                idstag: studentId,
                idan: this.classeId,
                points: points,
                remarque: remarque
            })
        });

        if (!response.ok) throw new Error('Update failed');

        const result = await response.json();

        // Rafraichir en parallele
        await Promise.all([
            this.refreshStats(),
            this.loadRandomStudent()
        ]);

    } catch (error) {
        console.error('Error:', error);
        alert('Erreur lors de la mise a jour');
    }
}
```

**Ameliorations :**
- `async/await` au lieu de callbacks
- `try/catch` pour la gestion d'erreur
- Token CSRF dans le header
- URLs propres (`/api/update`)
- `Promise.all()` pour les requetes paralleles
- Corps en JSON au lieu de query string

---

## Graphiques : JpGraph vs Chart.js

### AVANT - JpGraph (cote serveur)

```php
// public/img/plots1.php - Genere une image PNG
require_once '../../vendor/autoload.php';
use Amenadiel\JpGraph\Graph\PieGraph;
use Amenadiel\JpGraph\Plot\PiePlot3D;

$graph = new PieGraph(400, 300);
$data = [$_GET['p1'], $_GET['p2'], $_GET['p3'], $_GET['p4']];
$p1 = new PiePlot3D($data);
$graph->Stroke();
```

Utilise dans les vues :
```html
<img src="img/plots1.php?p1=<?=$stats["vgood"]?>&p2=<?=$stats["good"]?>..." width="80%">
```

**Problemes :**
- Image statique, pas interactif
- Pas responsive
- Charge le serveur a chaque affichage
- Parametres GET non valides

### APRES - Chart.js (cote client)

```javascript
// public/js/charts.js
async function loadPieChartFromApi(canvasId, classeId, temps) {
    const response = await fetch(`/api/chart/pie/${classeId}?temps=${temps}`);
    const data = await response.json();

    new Chart(document.getElementById(canvasId), {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { /* pourcentages au survol */ }
            }
        }
    });
}
```

Utilise dans les templates :
```twig
<canvas id="pieChart"></canvas>
<script>
    loadPieChartFromApi('pieChart', {{ classe_id }}, '{{ current_time }}');
</script>
```

**Ameliorations :**
- Interactif (survol, clic, animation)
- Responsive automatiquement
- Donnees via API JSON securisee
- Pas de charge serveur pour le rendu

---

## Classe HasardApp

```javascript
// Initialisation dans le template dashboard
window.HASARD_CONFIG = {
    classeId: 1,
    temps: 'tous',
    csrfToken: 'abc123...'
};

// app.js cree l'instance automatiquement
const app = new HasardApp(config);

// Methodes disponibles :
app.updateResponse(studentId, points, remarque);  // Enregistrer une reponse
app.refreshStats();                                // Rafraichir les statistiques
app.loadRandomStudent();                           // Nouveau stagiaire aleatoire
```

---

## Fonctions globales conservees

Pour la compatibilite avec les boutons dans le template :

```javascript
// Choisir un stagiaire specifique (boutons dans le dashboard)
choix(idannee, idstagiaire, nom);

// Recharger un stagiaire aleatoire (bouton fermer du modal)
onLoadPage(containerId, type, temps, classeId);
```
