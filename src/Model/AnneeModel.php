<?php

namespace App\Model;

class AnneeModel extends AbstractModel
{
    protected int $idannee;
    protected string $section;
    protected string $annee;

    public function getIdannee(): int
    {
        return $this->idannee;
    }

    public function setIdannee(int $idannee): AnneeModel
    {
        $this->idannee = $idannee;
        return $this;
    }

    public function getSection(): string
    {
        return $this->section;
    }

    public function setSection(string $section): AnneeModel
    {
        $this->section = $section;
        return $this;
    }

    public function getAnnee(): string
    {
        return $this->annee;
    }

    public function setAnnee(string $annee): AnneeModel
    {
        $this->annee = $annee;
        return $this;
    }
}
