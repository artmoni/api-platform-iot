<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\QuestionsRepository")
 */
class Questions
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $question;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $goodAnsw;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $wrongAnsw;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $typeQestion;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): self
    {
        $this->question = $question;

        return $this;
    }

    public function getGoodAnsw(): ?string
    {
        return $this->goodAnsw;
    }

    public function setGoodAnsw(string $goodAnsw): self
    {
        $this->goodAnsw = $goodAnsw;

        return $this;
    }

    public function getWrongAnsw(): ?string
    {
        return $this->wrongAnsw;
    }

    public function setWrongAnsw(string $wrongAnsw): self
    {
        $this->wrongAnsw = $wrongAnsw;

        return $this;
    }

    public function getTypeQestion(): ?string
    {
        return $this->typeQestion;
    }

    public function setTypeQestion(string $typeQestion): self
    {
        $this->typeQestion = $typeQestion;

        return $this;
    }
}
