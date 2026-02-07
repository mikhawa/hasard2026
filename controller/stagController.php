<?php
/*
 * Controller
 */

use App\Calcul;
use App\StagiairesManager;
use App\AnneeManager;
use App\ReponselogManager;
use App\UserManager;


// if you want to disconnect
if(isset($_GET['disconnect'])){
    if(UserManager::disconnect()){
        header("Location: ./");
        exit();
    }
}



$stagiairesManager = new StagiairesManager($connect);
$statsManager = new AnneeManager($connect);
$responseManager = new ReponselogManager($connect);

// logs
if(isset($_GET['logs'])){
    $logs = (int) $_SESSION['classe'];;
    // année
    $recupStats = $statsManager->SelectAllByAnnee($logs);
    // logs et pagination
    $nblogs = $responseManager->countAllLogsByAnnee($logs);
    $pg = (isset($_GET['page'])&&ctype_digit($_GET['page']))? (int) $_GET['page'] : 1;
    $recupLogs = $responseManager->selectAllLogsByAnneeWithPG($logs,$pg);
    $pagination = ReponselogManager::pagination($nblogs,"?logs",$pg,"page",100);


    if(is_string($recupStats)) die($recupStats);
    if(is_string($recupLogs)) die($recupLogs);

    // View
    require_once "../view/logView.php";
}else{

// tous les stagiaires de l'année:
$recupAll = $stagiairesManager->SelectOnlyStagiairesByIdAnnee($_SESSION['classe'],$tps);

// par points
$recupAllStagiaires = Calcul::calculPoints($recupAll);

// par sorties
$sortiesStagiaires = Calcul::calculSorties($recupAll);

$recupStats = $statsManager->SelectStatsByAnneeAndDate($_SESSION['classe'],$tps);

if(is_string($recupAllStagiaires)) die($recupAllStagiaires);
if(is_string($recupStats)) die($recupStats);

// View
require_once "../view/stagView.php";
}
