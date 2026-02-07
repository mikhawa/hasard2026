<?php

namespace App;
class UserModel extends AbstractModel
{
    protected int $iduser;
    protected string $username;
    protected string $userpwd;
    protected string $themail;
    protected string $clefunique;
    protected int $perm;

    // linked tables (annee)
    protected string|array $idannee;
    protected string|array $section;
    protected string|array $annee;

    /**
     * @return int
     */
    public function getIduser(): int
    {
        return $this->iduser;
    }

    /**
     * @param int $iduser
     * @return UserModel
     */
    public function setIduser(int $iduser): UserModel
    {
        $this->iduser = $iduser;
        return $this;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @param string $username
     * @return UserModel
     */
    public function setUsername(string $username): UserModel
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return string
     */
    public function getUserpwd(): string
    {
        return $this->userpwd;
    }

    /**
     * @param string $userpwd
     * @return UserModel
     */
    public function setUserpwd(string $userpwd): UserModel
    {
        $this->userpwd = $userpwd;
        return $this;
    }

    /**
     * @return string
     */
    public function getThemail(): string
    {
        return $this->themail;
    }

    /**
     * @param string $themail
     * @return UserModel
     */
    public function setThemail(string $themail): UserModel
    {
        $this->themail = $themail;
        return $this;
    }

    /**
     * @return string
     */
    public function getClefunique(): string
    {
        return $this->clefunique;
    }

    /**
     * @param string $clefunique
     * @return UserModel
     */
    public function setClefunique(string $clefunique): UserModel
    {
        $this->clefunique = $clefunique;
        return $this;
    }

    /**
     * @return int
     */
    public function getPerm(): int
    {
        return $this->perm;
    }

    /**
     * @param int $perm
     * @return UserModel
     */
    public function setPerm(int $perm): UserModel
    {
        $this->perm = $perm;
        return $this;
    }

    /**
     * @return string
     */
    public function getIdannee(): array|string
    {
    $separator = ',';
    $array = explode($separator, $this->idannee);
        return $array;
    }

    /**
     * @param string $idannee
     * @return UserModel
     */
    public function setIdannee(string $idannee): UserModel
    {
        $this->idannee = $idannee;
        return $this;
    }

    /**
     * @return string
     */
    public function getSection(): array|string
    {
        $separator = '|||';
        $array = explode($separator, $this->section);
        return $array;
    }

    /**
     * @param string $section
     * @return UserModel
     */
    public function setSection(string $section): UserModel
    {
        $this->section = $section;
        return $this;
    }

    /**
     * @return string
     */
    public function getAnnee(): array|string
    {
        $separator = ',';
        $array = explode($separator, $this->annee);
        return $array;
    }

    /**
     * @param string $annee
     * @return UserModel
     */
    public function setAnnee(string $annee): UserModel
    {
        $this->annee = $annee;
        return $this;
    }



}