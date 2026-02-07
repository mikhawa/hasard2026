<?php

declare(strict_types=1);

namespace App\Service;

use App\Core\Config;

class TimeSlotService
{
    private const TIME_MAPPING = [
        'tous' => 'tous',
        '1-an' => '1 an',
        '6-mois' => '6 mois',
        '3-mois' => '3 mois',
        '1-mois' => '1 mois',
        '2-semaines' => '2 semaines',
        '1-semaine' => '1 semaine',
        '1-jour' => '1 jour',
    ];

    private const LABELS = [
        'tous' => 'le debut',
        '1 an' => '1 an',
        '6 mois' => '6 mois',
        '3 mois' => '3 mois',
        '1 mois' => '1 mois',
        '2 semaines' => '2 semaines',
        '1 semaine' => '1 semaine',
        '1 jour' => '1 jour',
    ];

    public function getFilter(?string $temps = null): array
    {
        $key = 'tous';

        if ($temps !== null && isset(self::TIME_MAPPING[$temps])) {
            $key = self::TIME_MAPPING[$temps];
        }

        $days = Config::getTimeFilter($key) ?? Config::getTimeFilter('tous') ?? 600;

        return [
            'key' => $temps ?? 'tous',
            'label' => self::LABELS[$key] ?? 'le debut',
            'date' => $this->calculateDate($days),
            'days' => $days,
        ];
    }

    public function calculateDate(int $days): string
    {
        $now = new \DateTime();
        $past = (new \DateTime())->modify("-{$days} days");

        return $past->format('Y-m-d H:i:s') . '" AND "' . $now->format('Y-m-d H:i:s');
    }

    public function getAvailableFilters(): array
    {
        return [
            ['key' => 'tous', 'label' => 'Tout'],
            ['key' => '1-an', 'label' => '1 an'],
            ['key' => '6-mois', 'label' => '6 mois'],
            ['key' => '3-mois', 'label' => '3 mois'],
            ['key' => '1-mois', 'label' => '1 mois'],
            ['key' => '2-semaines', 'label' => '2 semaines'],
            ['key' => '1-semaine', 'label' => '1 semaine'],
            ['key' => '1-jour', 'label' => '1 jour'],
        ];
    }
}
