<?php

/**
 * ============================================================================
 * SCRIPT DE NETTOYAGE POST-MIGRATION — Hasard 2026
 * ============================================================================
 *
 * Ce script supprime les anciens fichiers devenus obsoletes apres la migration
 * vers la nouvelle architecture (src/, templates/, .env).
 *
 * PREREQUIS :
 *   Avoir teste TOUTES les fonctionnalites listees dans documentation/MIGRATION.md
 *   (checklist de validation) avant d'executer ce script.
 *
 * UTILISATION :
 *   php cleanup.php              → Mode simulation (aucun fichier supprime)
 *   php cleanup.php --confirm    → Suppression reelle des fichiers
 *
 * SECURITE :
 *   - Mode simulation par defaut (dry-run)
 *   - Verification d'existence avant chaque suppression
 *   - Log detaille de chaque action
 *   - Les dossiers ne sont supprimes que s'ils sont vides
 *
 * @author  Migration Hasard 2026
 * @date    2026-02-08
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/** Racine du projet (le dossier contenant ce script) */
$projectRoot = __DIR__;

/**
 * Liste des fichiers a supprimer, organises par categorie.
 *
 * Chaque entree contient :
 *   - 'path'        : chemin relatif depuis la racine du projet
 *   - 'replaced_by' : le nouveau fichier/composant equivalent
 *   - 'reason'      : explication de la suppression
 */
$filesToDelete = [

    // ─── ANCIENS CONTROLEURS ────────────────────────────────────────────
    // Ces fichiers ont ete remplaces par les controleurs dans src/Controller/
    // qui utilisent le routeur FastRoute et les namespaces PSR-4.

    [
        'path'        => 'controller/publicController.php',
        'replaced_by' => 'src/Controller/AuthController.php',
        'reason'      => 'Gestion de la connexion/deconnexion migree vers AuthController avec protection CSRF',
    ],
    [
        'path'        => 'controller/privateController.php',
        'replaced_by' => 'src/Controller/DashboardController.php',
        'reason'      => 'Dashboard enseignant migre avec templates Twig et calcul de pourcentages cote serveur',
    ],
    [
        'path'        => 'controller/stagController.php',
        'replaced_by' => 'src/Controller/StudentController.php',
        'reason'      => 'Vue stagiaire migree avec verification de permission (perm=0)',
    ],
    [
        'path'        => 'controller/choiceController.php',
        'replaced_by' => 'src/Controller/ChoiceController.php',
        'reason'      => 'Selection de classe migree avec auto-selection si une seule classe',
    ],
    [
        'path'        => 'controller/timeslotController.php',
        'replaced_by' => 'src/Service/TimeSlotService.php',
        'reason'      => 'Filtres temporels migres vers un service dedie, valeurs lues depuis .env',
    ],
    [
        'path'        => 'controller/load.php',
        'replaced_by' => 'src/Controller/ApiController.php (methode load)',
        'reason'      => 'Endpoints AJAX (general, equipe, hasard) migres vers ApiController::load()',
    ],
    [
        'path'        => 'controller/update.php',
        'replaced_by' => 'src/Controller/ApiController.php (methode update)',
        'reason'      => 'Enregistrement de reponse migre vers ApiController::update() avec validation CSRF',
    ],
    [
        'path'        => 'controller/README.md',
        'replaced_by' => 'documentation/MIGRATION.md',
        'reason'      => 'Documentation de transition, plus necessaire',
    ],

    // ─── ANCIENNES VUES ─────────────────────────────────────────────────
    // Ces fichiers PHP generaient du HTML directement. Ils sont remplaces
    // par des templates Twig dans le dossier templates/.

    [
        'path'        => 'view/loginView.php',
        'replaced_by' => 'templates/auth/login.html.twig',
        'reason'      => 'Formulaire de connexion migre vers Twig avec champ CSRF automatique',
    ],
    [
        'path'        => 'view/homepageView.php',
        'replaced_by' => 'templates/dashboard/index.html.twig',
        'reason'      => 'Page d\'accueil enseignant migree vers Twig avec boutons stagiaires et modal',
    ],
    [
        'path'        => 'view/stagView.php',
        'replaced_by' => 'templates/student/index.html.twig',
        'reason'      => 'Vue stagiaire migree vers Twig avec tri par points et par sorties',
    ],
    [
        'path'        => 'view/choiceView.php',
        'replaced_by' => 'templates/choice/index.html.twig',
        'reason'      => 'Page de selection de classe migree vers Twig',
    ],
    [
        'path'        => 'view/logView.php',
        'replaced_by' => 'templates/dashboard/logs.html.twig + templates/student/logs.html.twig',
        'reason'      => 'Page des logs migree vers Twig avec pagination, separee enseignant/stagiaire',
    ],
    [
        'path'        => 'view/footerView.php',
        'replaced_by' => 'templates/partials/footer.html.twig',
        'reason'      => 'Footer migre en partial Twig reutilisable',
    ],
    [
        'path'        => 'view/README.md',
        'replaced_by' => 'documentation/MIGRATION.md',
        'reason'      => 'Documentation de transition, plus necessaire',
    ],

    // ─── ANCIENS MODELES ────────────────────────────────────────────────
    // Les modeles ont ete deplaces dans src/Model/ avec le namespace
    // App\Model au lieu de App\ (racine). L'autoload Composer pointe
    // desormais vers src/.

    [
        'path'        => 'model/AbstractModel.php',
        'replaced_by' => 'src/Model/AbstractModel.php',
        'reason'      => 'Namespace change de App\\AbstractModel vers App\\Model\\AbstractModel',
    ],
    [
        'path'        => 'model/ManagerInterface.php',
        'replaced_by' => 'src/Model/ManagerInterface.php',
        'reason'      => 'Namespace change de App\\ManagerInterface vers App\\Model\\ManagerInterface',
    ],
    [
        'path'        => 'model/UserModel.php',
        'replaced_by' => 'src/Model/UserModel.php',
        'reason'      => 'Namespace change de App\\UserModel vers App\\Model\\UserModel',
    ],
    [
        'path'        => 'model/UserManager.php',
        'replaced_by' => 'src/Model/UserManager.php',
        'reason'      => 'Namespace change de App\\UserManager vers App\\Model\\UserManager',
    ],
    [
        'path'        => 'model/StagiairesModel.php',
        'replaced_by' => 'src/Model/StagiairesModel.php',
        'reason'      => 'Namespace change de App\\StagiairesModel vers App\\Model\\StagiairesModel',
    ],
    [
        'path'        => 'model/StagiairesManager.php',
        'replaced_by' => 'src/Model/StagiairesManager.php',
        'reason'      => 'Namespace change de App\\StagiairesManager vers App\\Model\\StagiairesManager',
    ],
    [
        'path'        => 'model/AnneeModel.php',
        'replaced_by' => 'src/Model/AnneeModel.php',
        'reason'      => 'Namespace change de App\\AnneeModel vers App\\Model\\AnneeModel',
    ],
    [
        'path'        => 'model/AnneeManager.php',
        'replaced_by' => 'src/Model/AnneeManager.php',
        'reason'      => 'Namespace change de App\\AnneeManager vers App\\Model\\AnneeManager',
    ],
    [
        'path'        => 'model/ReponseslogModel.php',
        'replaced_by' => 'src/Model/ReponseslogModel.php',
        'reason'      => 'Namespace change de App\\ReponseslogModel vers App\\Model\\ReponseslogModel',
    ],
    [
        'path'        => 'model/ReponselogManager.php',
        'replaced_by' => 'src/Model/ReponselogManager.php',
        'reason'      => 'Namespace change de App\\ReponselogManager vers App\\Model\\ReponselogManager',
    ],
    [
        'path'        => 'model/Calcul.php',
        'replaced_by' => 'src/Model/Calcul.php',
        'reason'      => 'Namespace change de App\\Calcul vers App\\Model\\Calcul',
    ],
    [
        'path'        => 'model/README.md',
        'replaced_by' => 'documentation/MIGRATION.md',
        'reason'      => 'Documentation de transition, plus necessaire',
    ],

    // ─── ANCIENNE CONFIGURATION ─────────────────────────────────────────
    // La configuration est desormais geree par un fichier .env (phpdotenv)
    // et la classe App\Core\Config.

    [
        'path'        => 'config.php',
        'replaced_by' => '.env + src/Core/Config.php',
        'reason'      => 'Identifiants BDD et constantes de dates migres vers .env (hors git)',
    ],

    // ─── ANCIENS GRAPHIQUES (JpGraph) ───────────────────────────────────
    // Les graphiques generes cote serveur en PHP (images PNG via JpGraph)
    // sont remplaces par Chart.js cote client + une API JSON.

    [
        'path'        => 'public/img/plots1.php',
        'replaced_by' => 'src/Controller/ChartController.php (pieData) + public/js/charts.js',
        'reason'      => 'Graphique camembert migre vers Chart.js avec donnees JSON via API',
    ],
    [
        'path'        => 'public/img/plots2.php',
        'replaced_by' => 'src/Controller/ChartController.php (barData) + public/js/charts.js',
        'reason'      => 'Graphique barres migre vers Chart.js avec donnees JSON via API',
    ],

    // ─── ANCIEN JAVASCRIPT ──────────────────────────────────────────────
    // L'ancien code AJAX utilisant XMLHttpRequest a ete reecrit avec
    // l'API Fetch et une architecture classe (HasardApp).

    [
        'path'        => 'public/js/myAjax.js',
        'replaced_by' => 'public/js/app.js',
        'reason'      => 'Ancien code AJAX (XMLHttpRequest) remplace par Fetch API dans app.js',
    ],
    [
        'path'        => 'public/js/myAjax.min.js',
        'replaced_by' => 'public/js/app.js',
        'reason'      => 'Version minifiee de myAjax.js, plus necessaire',
    ],
];

/**
 * Dossiers a supprimer apres la suppression des fichiers.
 * Ils ne seront supprimes QUE s'ils sont vides.
 */
$foldersToDelete = [
    [
        'path'   => 'controller',
        'reason' => 'Remplace par src/Controller/ (namespace App\\Controller)',
    ],
    [
        'path'   => 'view',
        'reason' => 'Remplace par templates/ (moteur Twig)',
    ],
    [
        'path'   => 'model',
        'reason' => 'Remplace par src/Model/ (namespace App\\Model)',
    ],
];

// ============================================================================
// EXECUTION
// ============================================================================

$dryRun = !in_array('--confirm', $argv ?? [], true);

echo "╔══════════════════════════════════════════════════════════════════╗\n";
echo "║          HASARD 2026 — NETTOYAGE POST-MIGRATION                ║\n";
echo "╠══════════════════════════════════════════════════════════════════╣\n";

if ($dryRun) {
    echo "║  MODE : SIMULATION (aucun fichier ne sera supprime)            ║\n";
    echo "║  Pour supprimer : php cleanup.php --confirm                    ║\n";
} else {
    echo "║  MODE : SUPPRESSION REELLE                                     ║\n";
    echo "║  Les fichiers vont etre supprimes definitivement !             ║\n";
}

echo "╚══════════════════════════════════════════════════════════════════╝\n\n";

// Compteurs
$deleted  = 0;
$skipped  = 0;
$errors   = 0;
$missing  = 0;

// ─── Suppression des fichiers ───────────────────────────────────────────────

foreach ($filesToDelete as $file) {
    $fullPath = $projectRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $file['path']);

    echo "── {$file['path']}\n";
    echo "   Remplace par : {$file['replaced_by']}\n";
    echo "   Raison       : {$file['reason']}\n";

    if (!file_exists($fullPath)) {
        echo "   Statut       : ABSENT (deja supprime)\n\n";
        $missing++;
        continue;
    }

    if ($dryRun) {
        echo "   Statut       : A SUPPRIMER (simulation)\n\n";
        $skipped++;
    } else {
        if (unlink($fullPath)) {
            echo "   Statut       : SUPPRIME\n\n";
            $deleted++;
        } else {
            echo "   Statut       : ERREUR (impossible de supprimer)\n\n";
            $errors++;
        }
    }
}

// ─── Suppression des dossiers vides ─────────────────────────────────────────

echo "── Nettoyage des dossiers vides ─────────────────────────────────\n\n";

foreach ($foldersToDelete as $folder) {
    $fullPath = $projectRoot . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $folder['path']);

    echo "── {$folder['path']}/\n";
    echo "   Raison : {$folder['reason']}\n";

    if (!is_dir($fullPath)) {
        echo "   Statut : ABSENT (deja supprime)\n\n";
        continue;
    }

    // Verifier si le dossier est vide
    $remaining = array_diff(scandir($fullPath), ['.', '..']);

    if (!empty($remaining)) {
        echo "   Statut : NON VIDE — fichiers restants :\n";
        foreach ($remaining as $item) {
            echo "            - {$item}\n";
        }
        echo "\n";
        continue;
    }

    if ($dryRun) {
        echo "   Statut : A SUPPRIMER (simulation)\n\n";
    } else {
        if (rmdir($fullPath)) {
            echo "   Statut : SUPPRIME\n\n";
        } else {
            echo "   Statut : ERREUR (impossible de supprimer)\n\n";
        }
    }
}

// ─── Rapport final ──────────────────────────────────────────────────────────

echo "╔══════════════════════════════════════════════════════════════════╗\n";
echo "║  RAPPORT FINAL                                                 ║\n";
echo "╠══════════════════════════════════════════════════════════════════╣\n";

if ($dryRun) {
    echo "║  Fichiers a supprimer : " . str_pad((string)$skipped, 3, ' ', STR_PAD_LEFT) . "                                      ║\n";
    echo "║  Fichiers absents     : " . str_pad((string)$missing, 3, ' ', STR_PAD_LEFT) . "                                      ║\n";
    echo "╠══════════════════════════════════════════════════════════════════╣\n";
    echo "║  Relancer avec --confirm pour supprimer reellement.            ║\n";
} else {
    echo "║  Fichiers supprimes   : " . str_pad((string)$deleted, 3, ' ', STR_PAD_LEFT) . "                                      ║\n";
    echo "║  Fichiers absents     : " . str_pad((string)$missing, 3, ' ', STR_PAD_LEFT) . "                                      ║\n";
    echo "║  Erreurs              : " . str_pad((string)$errors, 3, ' ', STR_PAD_LEFT) . "                                      ║\n";

    if ($errors === 0) {
        echo "╠══════════════════════════════════════════════════════════════════╣\n";
        echo "║  Nettoyage termine avec succes !                               ║\n";
        echo "║  Vous pouvez supprimer ce script : rm cleanup.php              ║\n";
    }
}

echo "╚══════════════════════════════════════════════════════════════════╝\n";
