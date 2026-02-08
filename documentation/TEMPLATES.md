# Templates - Ancien vs Nouveau

---

## Mapping des vues

| AVANT (PHP brut) | APRES (Twig) |
|-------------------|--------------|
| `view/loginView.php` | `templates/auth/login.html.twig` |
| `view/homepageView.php` | `templates/dashboard/index.html.twig` |
| `view/choiceView.php` | `templates/choice/index.html.twig` |
| `view/stagView.php` | `templates/student/index.html.twig` |
| `view/logView.php` | `templates/dashboard/logs.html.twig` |
| `view/footerView.php` | `templates/partials/footer.html.twig` |
| *(navbar dupliquee)* | `templates/partials/navbar.html.twig` |
| *(n'existait pas)* | `templates/base.html.twig` |

---

## Heritage de templates

### AVANT

Chaque vue repetait le meme HTML (doctype, head, bootstrap, matomo, body, footer) :

```
loginView.php     : doctype + head + bootstrap + matomo + body + footer + scripts
homepageView.php  : doctype + head + bootstrap + matomo + navbar + body + footer + scripts
stagView.php      : doctype + head + bootstrap + matomo + navbar + body + footer + scripts
choiceView.php    : doctype + head + bootstrap + matomo + navbar + body + footer + scripts
logView.php       : doctype + head + bootstrap + matomo + navbar + body + footer + scripts
```

**~70 lignes de HTML identique dupliquees dans chaque fichier.**

### APRES

Un template de base, les pages n'ecrivent que leur contenu :

```
base.html.twig          → doctype + head + bootstrap + body structure + scripts
    ├── login.html.twig     → extends base → block content (formulaire)
    ├── index.html.twig     → extends base → block navbar + block content
    ├── logs.html.twig      → extends base → block navbar + block content
    └── choice.html.twig    → extends base → block navbar + block content
```

---

## Exemple de transformation

### AVANT - `view/loginView.php` (73 lignes)

```php
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" ...>
    <link rel="icon" type="image/x-icon" href="img/logo.png"/>
    <title>Et la question est pour ... Connexion</title>
    <!-- Matomo (15 lignes) -->
</head>
<body>
<div class="col-lg-11 mx-auto p-3 py-md-5">
    <header>...</header>
    <main>
        <h1 class="h2">Groupe Webdev <?=date("Y");?></h1>
        <form action="" method="post">
            <!-- pas de CSRF -->
            <input type="text" name="username" required>
            <input type="password" name="userpwd" required>
            <button type="submit">Connexion</button>
        </form>
        <?php if(isset($error)) echo $error ?>
    </main>
    <footer><?php include "footerView.php" ?></footer>
</div>
<script src="bootstrap.min.js"></script>
</body>
</html>
```

### APRES - `templates/auth/login.html.twig` (27 lignes)

```twig
{% extends 'base.html.twig' %}

{% block title %}Et la question est pour ... Connexion{% endblock %}
{% block header_title %}Et la question est pour ... Connexion !{% endblock %}

{% block content %}
<h1 class="h2">Groupe Webdev {{ "now"|date("Y") }}</h1>
<p class="fs-5 col-md-8 mb-4">Une question, un.e stagiaire, une reponse !</p>
<hr>

<form action="/" method="post" name="login">
    {{ csrf_field|raw }}
    <div class="d-grid gap-2 col-6 mx-auto">
        <!-- champs du formulaire -->
    </div>
    {% if error is defined %}
    <p class="text-danger">{{ error }}</p>
    {% endif %}
</form>
{% endblock %}
```

**Gain : 73 → 27 lignes**, plus de duplication, CSRF integre.

---

## Syntaxe Twig - Aide-memoire

| Syntaxe | Usage | Exemple |
|---------|-------|---------|
| `{{ }}` | Afficher une variable (echappe auto) | `{{ student.prenom }}` |
| `{% %}` | Logique (if, for, block) | `{% if error %}...{% endif %}` |
| `{# #}` | Commentaire (non rendu) | `{# TODO: ajouter filtre #}` |
| `extends` | Heriter d'un template | `{% extends 'base.html.twig' %}` |
| `block` | Definir/surcharger une zone | `{% block content %}...{% endblock %}` |
| `include` | Inclure un partiel | `{% include 'partials/navbar.html.twig' %}` |
| `for` | Boucle | `{% for s in stagiaires %}...{% endfor %}` |
| `loop.index` | Index de boucle (1-based) | `{{ loop.index }}` |
| `\|slice` | Extraire des caracteres | `{{ nom\|slice(0, 1) }}` |
| `\|date` | Formater une date | `{{ "now"\|date("Y") }}` |
| `\|raw` | Ne pas echapper (attention!) | `{{ csrf_field\|raw }}` |

---

## Variables globales Twig

Definies dans `AbstractController::initTwig()` :

| Variable | Contenu |
|----------|---------|
| `csrf_field` | Champ hidden HTML avec le token CSRF |
| `csrf_token` | Valeur brute du token CSRF |
