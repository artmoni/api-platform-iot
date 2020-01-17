<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * This is a heating/cooling element.
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\HeaterRepository")
 */
class Heater
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The name of the heating/cooling element
     * @ORM\Column(type="string", length=30, nullable=true)
     */
    private $name;

    /**
     * The adress64 of the Xbee associated to the element.
     * @ORM\Column(type="string", length=30)
     */
    private $adress64;

    /**
     * The openings which affects the element. Usually, the doors and windows in the same room as the element.
     * @ORM\ManyToMany(targetEntity="App\Entity\Opening", mappedBy="heaters")
     */
    private $openings;

    public function __construct()
    {
        $this->openings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
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
     * @return Collection|Opening[]
     */
    public function getOpenings(): Collection
    {
        return $this->openings;
    }

    public function addOpening(Opening $opening): self
    {
        if (!$this->openings->contains($opening)) {
            $this->openings[] = $opening;
            $opening->addHeater($this);
        }

        return $this;
    }

    public function removeOpening(Opening $opening): self
    {
        if ($this->openings->contains($opening)) {
            $this->openings->removeElement($opening);
            $opening->removeHeater($this);
        }

        return $this;
    }
}
