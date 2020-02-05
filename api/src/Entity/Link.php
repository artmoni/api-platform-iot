<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\LinkRepository")
 */
class Link
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
    private $adressHeater;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $adressOpening;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAdressHeater(): ?string
    {
        return $this->adressHeater;
    }

    public function setAdressHeater(string $adressHeater): self
    {
        $this->adressHeater = $adressHeater;

        return $this;
    }

    public function getAdressOpening(): ?string
    {
        return $this->adressOpening;
    }

    public function setAdressOpening(string $adressOpening): self
    {
        $this->adressOpening = $adressOpening;

        return $this;
    }
}
