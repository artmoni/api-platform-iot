<?php

namespace App\DataFixtures;

use App\Entity\Game;
use App\Entity\Player;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class PlayerFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $this->newLine($manager, "0013A20041A72956", "");
        $this->newLine($manager, "0013A2004147961D", "");
        $this->newLine($manager, "macAddr3", "");
        $this->newLine($manager, "macAddr4", "");


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
