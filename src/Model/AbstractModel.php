<?php

namespace App\Model;

class AbstractModel
{
    public function __construct(array $tab)
    {
        $this->hydrate($tab);
    }

    protected function hydrate(array $assoc): void
    {
        foreach ($assoc as $clef => $valeur) {
            $methodeName = "set" . str_replace("_", "", ucfirst($clef));
            if (method_exists($this, $methodeName)) {
                $this->$methodeName($valeur);
            }
        }
    }
}
