<?php

namespace App\Model;

interface ManagerInterface
{
    public function __construct(\PDO $db);
}
