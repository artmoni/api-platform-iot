<?php

namespace App\DataFixtures;

use App\Entity\Game;
use App\Entity\Player;
use App\Repository\GameRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class PlayerFixtures extends Fixture
{
    private $gameRepository;

    public function __construct(GameRepository $gameRepository)
    {
        $this->gameRepository = $gameRepository;
    }

    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $games = $this->gameRepository->findAll();
        dump($this->gameRepository->findAll());
        if($games!=0) {
            $game = $games[0];

            $this->newLine($manager, "0013A20041A72956", $game);
            $this->newLine($manager, "0013A2004147961D", $game);
            $this->newLine($manager, "macAddr3", $game);
            $this->newLine($manager, "macAddr4", $game);
        }
        else{
            dump("ERROR : Table Game is null");
        }

        $manager->flush();
    }

    public function newLine(ObjectManager $manager, string $macAddr, Game $game)
    {
        $player = new Player();
        $player->setMacAddress($macAddr);
        $player->setGame($game);
        $manager->persist($player);
    }
}
