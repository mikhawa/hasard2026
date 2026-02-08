# Securite - Ancien vs Nouveau

---

## Tableau comparatif

| Aspect | AVANT | APRES |
|--------|-------|-------|
| **Credentials** | En dur dans `config.php` | Fichier `.env` git-ignore |
| **CSRF** | Aucune protection | Token genere par `Csrf::field()` |
| **Sessions** | `cookie_lifetime` uniquement | + `httponly`, `samesite=Lax` |
| **Escaping HTML** | Manuel (`<?= ?>` non echappe) | Auto-escaping Twig |
| **Headers securite** | Aucun | `.htaccess` (X-Content-Type, X-Frame-Options) |
| **Fichiers sensibles** | Accessibles | Bloques par `.htaccess` |
| **Requetes SQL** | Prepared statements (OK) | Prepared statements (inchange) |
| **Mots de passe** | `password_verify()` (OK) | `password_verify()` (inchange) |

---

## Details des ameliorations

### 1. Variables d'environnement

**AVANT** - `config.php` (commite dans Git) :
```php
const DB_HOST = "localhost";
const DB_PORT = "3307";
const DB_NAME = "hasard";
const DB_LOGIN = "root";
const DB_PWD = "";
```

**APRES** - `.env` (git-ignore) :
```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=hasard
DB_LOGIN=root
DB_PWD=
```

Le fichier `.env.example` sert de template sans valeurs sensibles.

---

### 2. Protection CSRF

**AVANT** - Aucune protection :
```html
<form action="" method="post">
    <input type="text" name="username">
    <input type="password" name="userpwd">
</form>
```

**APRES** - Token CSRF dans chaque formulaire :
```twig
<form action="/" method="post">
    {{ csrf_field|raw }}
    <input type="text" name="username">
    <input type="password" name="userpwd">
</form>
```

Le token est verifie cote serveur :
```php
// Dans AuthController::login()
if (!Csrf::validate($_POST['_csrf'] ?? '')) {
    $error = 'Session expiree.';
}
```

Pour les requetes AJAX, le token est envoye dans un header :
```javascript
headers: {
    'X-CSRF-Token': this.csrfToken
}
```

---

### 3. Sessions securisees

**AVANT** :
```php
session_start([
    'cookie_lifetime' => 86400,
]);
```

**APRES** :
```php
session_start([
    'cookie_lifetime' => 86400,
    'cookie_httponly' => true,    // Pas accessible en JS
    'cookie_samesite' => 'Lax',  // Protection CSRF navigateur
]);
```

---

### 4. Auto-escaping Twig

**AVANT** - Risque XSS :
```php
<td><?= $item["prenom"] ?></td>
```
Si `$item["prenom"]` contient `<script>alert('xss')</script>`, le code est execute.

**APRES** - Echappe automatiquement :
```twig
<td>{{ student.prenom }}</td>
```
Twig convertit automatiquement `<` en `&lt;`, `>` en `&gt;`, etc.

---

### 5. Protection des fichiers sensibles

**AVANT** : Les fichiers `.env`, `.sql`, `.ini` etaient accessibles via URL.

**APRES** - `public/.htaccess` :
```apache
<IfModule mod_authz_core.c>
    <FilesMatch "\.(env|ini|log|sql)$">
        Require all denied
    </FilesMatch>
</IfModule>
```

---

### 6. Classe Csrf - Reference

```php
// Generer un token
$token = Csrf::generate();

// Champ hidden pour formulaire
echo Csrf::field();
// → <input type="hidden" name="_csrf" value="abc123...">

// Valider un token recu
if (Csrf::validate($_POST['_csrf'])) { ... }

// Regenerer apres login (previent fixation de session)
Csrf::regenerate();
```
