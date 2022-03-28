<?php

namespace App\DataFixtures;

use App\Entity\Questions;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class QuestionsFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        // $product = new Product();
        // $manager->persist($product);
        $this->newLine($manager, "Quelle est la hauteur de l'Evrest ?", "8846m", "8848m", "Culture");
        $this->newLine($manager, "Dans Magic, quelle est la carte la plus rare ?", "Le Black Mamba", "Le Black Lotus", "Nerd");
        $this->newLine($manager, "Quelle est la couleur dominante de pikachu", " 	#ffe62d", " 	#f4dc26", "Nerd");
        $this->newLine($manager, "En quelle année la ma chine à vapeur a été inventée", " 	1712", " 	1812", "Culture");

        $manager->flush();
    }

    public function newLine(ObjectManager $manager, string $quest, string $mRep, string $bRep, string $type)
    {
        $question = new Questions();
        $question->setQuestion($quest);
        $question->setGoodAnsw($bRep);
        $question->setWrongAnsw($mRep);
        $question->setTypeQestion($type);
        $manager->persist($question);
    }
}
