<?php

namespace App\Model;

class Calcul
{
    public static function Pourcent($valeur1, $valeur2): string
    {
        $retour = $valeur1 . " (";
        if (!empty($valeur1)) {
            if (!empty($valeur2)) {
                $retour .= round((($valeur1 / $valeur2) * 100), 2) . " %)";
            } else {
                $retour .= "0 %)";
            }
        } else {
            $retour .= "0 %)";
        }
        return $retour;
    }

    public static function laDate(int $days): string
    {
        $date = time() - ($days * 60 * 60 * 24);
        return date("Y-m-d H:i:s", $date);
    }

    public static function calculPoints(array $ori): array
    {
        $new = $ori;
        foreach ($new as $key => $valeur) {
            $new[$key]['points'] = ($valeur['vgood'] * 2) + ($valeur['good']) - ($valeur['nogood']) - ($valeur['absent']);
        }

        $points = array_column($new, 'points');
        array_multisort($points, SORT_DESC, $new);

        return $new;
    }

    public static function calculSorties(array $ori): array
    {
        $new = $ori;

        $sorties = array_column($new, 'sorties');
        array_multisort($sorties, SORT_DESC, $new);

        return $new;
    }
}
