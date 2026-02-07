<?php

namespace App\Model;

class StagiairesModel extends AbstractModel
{
    protected int $idstagiaires;
    protected string $nom;
    protected string $prenom;
    protected int $annee_idannee;

    public function getIdstagiaires(): int
    {
        return $this->idstagiaires;
    }

    public function setIdstagiaires(int $idstagiaires): StagiairesModel
    {
        $this->idstagiaires = $idstagiaires;
        return $this;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function setNom(string $nom): StagiairesModel
    {
        $this->nom = $nom;
        return $this;
    }

    public function getPrenom(): string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): StagiairesModel
    {
        $this->prenom = $prenom;
        return $this;
    }

    public function getAnneeidannee(): int
    {
        return $this->annee_idannee;
    }

    public function setAnneeidannee(int $annee_idannee): StagiairesModel
    {
        $this->annee_idannee = $annee_idannee;
        return $this;
    }
}
