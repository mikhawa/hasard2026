<?php
/*
 * Private controller
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

// if you want to change the class
if(isset($_GET['newChoice'])){
    // delete the class in session
    unset($_SESSION['classe']);
    // redirect to the choice controller
    header("Location: ./");
    exit();
}

$stagiairesManager = new StagiairesManager($connect);
$statsManager = new AnneeManager($connect);
$responseManager = new ReponselogManager($connect);

// logs
if(isset($_GET['logs'])){
    $logs = (int) $_SESSION['classe'];
    // année
    $recupStats = $statsManager->SelectAllByAnnee($logs);
    // logs et pagination
    $nblogs = $responseManager->countAllLogsByAnnee($logs);
    $pg = (isset($_GET['page'])&&ctype_digit($_GET['page']))? (int) $_GET['page'] : 1;
    $recupLogs = $responseManager->selectAllLogsByAnneeWithPG($logs,$pg);
    $pagination = ReponselogManager::pagination($nblogs,"?logs",$pg,"page",100);


    if(is_string($recupStats)) die($recupStats);
    if(is_string($recupLogs)) die($recupLogs);

    // View logs
    require_once "../view/logView.php";

// homepage admin
}else {

    $recupAllStagiaires = Calcul::calculPoints($stagiairesManager->SelectOnlyStagiairesByIdAnnee($_SESSION['classe'], $tps));

    $recupStats = $statsManager->SelectStatsByAnneeAndDate($_SESSION['classe'], $tps);

    $recupOneStagiaire = $stagiairesManager->SelectOneRandomStagiairesByIdAnnee($_SESSION['classe']);

    if(is_string($recupAllStagiaires)) die($recupAllStagiaires);
    if(is_string($recupStats)) die($recupStats);
    if(is_string($recupOneStagiaire)) die($recupOneStagiaire);

    // View
    require_once "../view/homepageView.php";
}
