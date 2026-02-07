<?php

namespace App\Model;

class ReponseslogModel extends AbstractModel
{
    protected int $idreponseslog;
    protected int $reponseslogcol;
    protected string $remarque;
    protected string $reponseslogdate;
    protected int $user_iduser;
    protected int $stagiaires_idstagiaires;
    protected int $annee_idannee;

    public function getIdreponseslog(): int
    {
        return $this->idreponseslog;
    }

    public function setIdreponseslog(int $idreponseslog): ReponseslogModel
    {
        $this->idreponseslog = $idreponseslog;
        return $this;
    }

    public function getReponseslogcol(): int
    {
        return $this->reponseslogcol;
    }

    public function setReponseslogcol(int $reponseslogcol): ReponseslogModel
    {
        $this->reponseslogcol = $reponseslogcol;
        return $this;
    }

    public function getRemarque(): string
    {
        return $this->remarque;
    }

    public function setRemarque(string $remarque): ReponseslogModel
    {
        $this->remarque = $remarque;
        return $this;
    }

    public function getReponseslogdate(): string
    {
        return $this->reponseslogdate;
    }

    public function setReponseslogdate(string $reponseslogdate): ReponseslogModel
    {
        $this->reponseslogdate = $reponseslogdate;
        return $this;
    }

    public function getUserIduser(): int
    {
        return $this->user_iduser;
    }

    public function setUserIduser(int $user_iduser): ReponseslogModel
    {
        $this->user_iduser = $user_iduser;
        return $this;
    }

    public function getStagiairesIdstagiaires(): int
    {
        return $this->stagiaires_idstagiaires;
    }

    public function setStagiairesIdstagiaires(int $stagiaires_idstagiaires): ReponseslogModel
    {
        $this->stagiaires_idstagiaires = $stagiaires_idstagiaires;
        return $this;
    }

    public function getAnneeIdannee(): int
    {
        return $this->annee_idannee;
    }

    public function setAnneeIdannee(int $annee_idannee): ReponseslogModel
    {
        $this->annee_idannee = $annee_idannee;
        return $this;
    }
}
