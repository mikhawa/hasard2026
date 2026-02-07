<?php

namespace App\Model;

class UserModel extends AbstractModel
{
    protected int $iduser;
    protected string $username;
    protected string $userpwd;
    protected string $themail;
    protected string $clefunique;
    protected int $perm;

    protected string|array $idannee;
    protected string|array $section;
    protected string|array $annee;

    public function getIduser(): int
    {
        return $this->iduser;
    }

    public function setIduser(int $iduser): UserModel
    {
        $this->iduser = $iduser;
        return $this;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): UserModel
    {
        $this->username = $username;
        return $this;
    }

    public function getUserpwd(): string
    {
        return $this->userpwd;
    }

    public function setUserpwd(string $userpwd): UserModel
    {
        $this->userpwd = $userpwd;
        return $this;
    }

    public function getThemail(): string
    {
        return $this->themail;
    }

    public function setThemail(string $themail): UserModel
    {
        $this->themail = $themail;
        return $this;
    }

    public function getClefunique(): string
    {
        return $this->clefunique;
    }

    public function setClefunique(string $clefunique): UserModel
    {
        $this->clefunique = $clefunique;
        return $this;
    }

    public function getPerm(): int
    {
        return $this->perm;
    }

    public function setPerm(int $perm): UserModel
    {
        $this->perm = $perm;
        return $this;
    }

    public function getIdannee(): array|string
    {
        $separator = ',';
        $array = explode($separator, $this->idannee);
        return $array;
    }

    public function setIdannee(string $idannee): UserModel
    {
        $this->idannee = $idannee;
        return $this;
    }

    public function getSection(): array|string
    {
        $separator = '|||';
        $array = explode($separator, $this->section);
        return $array;
    }

    public function setSection(string $section): UserModel
    {
        $this->section = $section;
        return $this;
    }

    public function getAnnee(): array|string
    {
        $separator = ',';
        $array = explode($separator, $this->annee);
        return $array;
    }

    public function setAnnee(string $annee): UserModel
    {
        $this->annee = $annee;
        return $this;
    }
}
