<?php

namespace App;
class ReponseslogModel extends AbstractModel
{
    protected int $idreponseslog;
    protected int $reponseslogcol;
    protected string $remarque;
    protected string $reponseslogdate;
    protected int $user_iduser;
    protected int $stagiaires_idstagiaires;
    protected int $annee_idannee;

    /**
     * @return int
     */
    public function getIdreponseslog(): int
    {
        return $this->idreponseslog;
    }

    /**
     * @param int $idreponseslog
     * @return ReponseslogModel
     */
    public function setIdreponseslog(int $idreponseslog): ReponseslogModel
    {
        $this->idreponseslog = $idreponseslog;
        return $this;
    }

    /**
     * @return int
     */
    public function getReponseslogcol(): int
    {
        return $this->reponseslogcol;
    }

    /**
     * @param int $reponseslogcol
     * @return ReponseslogModel
     */
    public function setReponseslogcol(int $reponseslogcol): ReponseslogModel
    {
        $this->reponseslogcol = $reponseslogcol;
        return $this;
    }

    /**
     * @return string
     */
    public function getRemarque(): string
    {
        return $this->remarque;
    }

    /**
     * @param string $remarque
     * @return ReponseslogModel
     */
    public function setRemarque(string $remarque): ReponseslogModel
    {
        $this->remarque = $remarque;
        return $this;
    }

    /**
     * @return string
     */
    public function getReponseslogdate(): string
    {
        return $this->reponseslogdate;
    }

    /**
     * @param string $reponseslogdate
     * @return ReponseslogModel
     */
    public function setReponseslogdate(string $reponseslogdate): ReponseslogModel
    {
        $this->reponseslogdate = $reponseslogdate;
        return $this;
    }

    /**
     * @return int
     */
    public function getUserIduser(): int
    {
        return $this->user_iduser;
    }

    /**
     * @param int $user_iduser
     * @return ReponseslogModel
     */
    public function setUserIduser(int $user_iduser): ReponseslogModel
    {
        $this->user_iduser = $user_iduser;
        return $this;
    }

    /**
     * @return int
     */
    public function getStagiairesIdstagiaires(): int
    {
        return $this->stagiaires_idstagiaires;
    }

    /**
     * @param int $stagiaires_idstagiaires
     * @return ReponseslogModel
     */
    public function setStagiairesIdstagiaires(int $stagiaires_idstagiaires): ReponseslogModel
    {
        $this->stagiaires_idstagiaires = $stagiaires_idstagiaires;
        return $this;
    }

    /**
     * @return int
     */
    public function getAnneeIdannee(): int
    {
        return $this->annee_idannee;
    }

    /**
     * @param int $annee_idannee
     * @return ReponseslogModel
     */
    public function setAnneeIdannee(int $annee_idannee): ReponseslogModel
    {
        $this->annee_idannee = $annee_idannee;
        return $this;
    }




}