<?php
/*
 * Choice controller
 */
use App\UserManager;


// if you want to disconnect
if(isset($_GET['disconnect'])){
    if(UserManager::disconnect()){
        header("Location: ./");
        exit();
    }
}

// if we choose a class
if(isset($_GET['choice'])&&ctype_digit($_GET['choice'])){
    // if the choice is valid for this user
    if(in_array($_GET['choice'],$_SESSION['idannee'])){
        // we put the choice in session
        $_SESSION['classe'] = (int) $_GET['choice'];
        // we redirect to the homepage
        header("Location: ./");
        exit();
    }
}

// View
require_once "../view/choiceView.php";

