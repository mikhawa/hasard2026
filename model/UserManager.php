<?php

namespace App;
use PDO;
class UserManager implements ManagerInterface
{

    protected \PDO $connect;

    public function __construct(\PDO $db)
    {
        $this->connect = $db;
    }

    // connect a user
    public function connectUser(UserModel $user):bool{

        $sql = "SELECT u.*, 
                    GROUP_CONCAT(a.idannee) AS idannee,
                    GROUP_CONCAT(a.section SEPARATOR '|||') AS section,
                    GROUP_CONCAT(a.annee) AS annee  
                FROM `user` u
                    LEFT JOIN `user_has_annee` h 
                        ON u.iduser = h.user_iduser
                    LEFT JOIN `annee` a 
                        ON h.annee_idannee = a.idannee
                 WHERE username = ?
                 GROUP BY u.iduser;";
        $request = $this->connect->prepare($sql);

        try {
            $request->execute([$user->getUsername()]);

        }catch (\Exception $e ){
            return $e->getMessage();

        }
        if($request->rowCount()==0){
            return false;

        }else{
            // verify password
            $userConnect = $request->fetch(PDO::FETCH_ASSOC);
            if(password_verify($user->getUserpwd(),$userConnect['userpwd'])){
                $goodUser = new UserModel($userConnect);
                // create session
                return $this->connectSession($goodUser);
            }else{
                return false;
            }
        }
    }

    // create a user's session
    private function connectSession(UserModel $user): bool{
        $_SESSION['myidsession']= session_id();
        $_SESSION['username']=$user->getUsername();
        $_SESSION['iduser']=$user->getIduser();
        $_SESSION['perm']=$user->getPerm();
        $_SESSION['clefunique']=$user->getClefunique();
        $_SESSION['usermail']=$user->getThemail();
        // linked tables (annee) for choice class
        $_SESSION['idannee']=$user->getIdannee();
        $_SESSION['section']=$user->getSection();
        $_SESSION['annee']=$user->getAnnee();

        return true;
    }

    // disconnect a user
    public static function disconnect(): bool{

        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        return true;
    }

}