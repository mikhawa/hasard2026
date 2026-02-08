# Technologies - Ancien vs Nouveau

---

## Tableau comparatif

| Composant | AVANT | APRES |
|-----------|-------|-------|
| **PHP** | 8.4 | 8.4 (inchange) |
| **Autoloading** | Composer PSR-4 `App\` → `model/` | Composer PSR-4 `App\` → `src/` |
| **Configuration** | `config.php` (constantes PHP, credentials en dur) | `vlucas/phpdotenv` 5.6 (fichier `.env` git-ignore) |
| **Routing** | `if/else/switch` dans `index.php` (106 lignes) | `nikic/fast-route` 1.3 (routes declaratives) |
| **Templates** | PHP brut dans `view/*.php` (HTML + `<?= ?>`) | `twig/twig` 3.x (heritage, auto-escaping) |
| **Graphiques** | `amenadiel/jpgraph` 4.1 (images PNG serveur) | Chart.js 4.x CDN (canvas interactifs client) |
| **JavaScript** | XMLHttpRequest (vanilla) | Fetch API (vanilla moderne) |
| **CSS** | Bootstrap 5.2.1 CDN | Bootstrap 5.3.x CDN |
| **CSRF** | Aucune protection | Token CSRF (session + header) |
| **Session** | `session_start()` basique | `session_start()` securise (httponly, samesite) |
| **Connexion DB** | `new PDO()` dans `index.php` + variable `$connect` | `Database::getConnection()` singleton |
| **Validation** | Manuelle (`ctype_digit`, `isset`) | `rakit/validation` 1.4 (disponible) |

---

## Dependencies Composer

### AVANT (`composer.json`)

```json
{
    "require": {
        "amenadiel/jpgraph": "^4"
    },
    "autoload": {
        "psr-4": {
            "App\\": "model/"
        }
    }
}
```

### APRES (`composer.json`)

```json
{
    "name": "cf2m/hasard2026",
    "description": "Classroom question management system",
    "type": "project",
    "require": {
        "php": ">=8.2",
        "vlucas/phpdotenv": "^5.6",
        "nikic/fast-route": "^1.3",
        "twig/twig": "^3.8",
        "rakit/validation": "^1.4"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

---

## Pourquoi ces choix ?

### vlucas/phpdotenv

- **Probleme** : `config.php` contenait les credentials en clair dans le code source
- **Solution** : Fichier `.env` separe, git-ignore, avec `.env.example` comme template
- **Avantage** : Standard de l'industrie, configuration differente par environnement

### nikic/fast-route

- **Probleme** : Routing par `if/else` et `$_GET['myfile']` dans index.php
- **Solution** : Routes declaratives avec support des parametres (`/choice/{id}`)
- **Avantage** : Leger (~1 fichier), rapide, regex-based, URLs propres

### twig/twig

- **Probleme** : HTML et PHP melanges dans les vues, code duplique (head, navbar, footer)
- **Solution** : Heritage de templates (`extends`), inclusion de partiels (`include`)
- **Avantage** : Auto-escaping XSS, syntaxe claire, separation logique/affichage

### Chart.js (remplace JpGraph)

- **Probleme** : JpGraph genere des images PNG cote serveur (pas interactif, pas responsive)
- **Solution** : Chart.js genere des graphiques dans des `<canvas>` cote client
- **Avantage** : Interactif (hover, click), responsive, anime, leger (CDN)

### Fetch API (remplace XMLHttpRequest)

- **Probleme** : `XMLHttpRequest` verbeux, callbacks complexes
- **Solution** : `fetch()` natif avec `async/await`
- **Avantage** : Syntaxe moderne, Promises, meilleure gestion d'erreurs
