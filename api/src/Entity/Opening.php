<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * This is an opening which could impact the room temperature. Usually, the opening leads outside.
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\OpeningRepository")
 */
class Opening
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The name of the opening.
     * @ORM\Column(type="string", length=30)
     */
    private $name;

    /**
     * The adress64 of the XBee associated with the opening.
     * @ORM\Column(type="string", length=255)
     */
    private $adress64;

    /**
     * The heaters/cooling devices that are impacted by the opening.
     * @ORM\ManyToMany(targetEntity="App\Entity\Heater", inversedBy="openings")
     */
    private $heaters;

    public function __construct()
    {
        $this->heaters = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getAdress64(): ?string
    {
        return $this->adress64;
    }

    public function setAdress64(string $adress64): self
    {
        $this->adress64 = $adress64;

        return $this;
    }

    /**
     * @return Collection|Heater[]
     */
    public function getHeaters(): Collection
    {
        return $this->heaters;
    }

    public function addHeater(Heater $heater): self
    {
        if (!$this->heaters->contains($heater)) {
            $this->heaters[] = $heater;
        }

        return $this;
    }

    public function removeHeater(Heater $heater): self
    {
        if ($this->heaters->contains($heater)) {
            $this->heaters->removeElement($heater);
        }

        return $this;
    }
}
