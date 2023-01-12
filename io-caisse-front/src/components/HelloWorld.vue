<template>

    <h3>Veuillez vous diriger vers les caisse n° : </h3>
    <h3>{{ test() }}</h3>
    <div class="flex-box">
        <div class="row-container">
            <div class="item" v-for="entry in caissesData" :key="entry.id">
                <div>
                    <p v-if="entry.isPlugged"> {{ entry.numero }}</p>
                    <p v-else></p>

                </div>

                <cash-register-machine v-if="entry.disponibilite" fill-color="#BEEE62" height="128px"
                                       width="128px"/>
                <cash-register-machine v-else-if="!entry.isPlugged" fill-color="rgba(255,255,255,0)" height="128px"
                                       width="128px"/>
                <cash-register-machine v-else fill-color="#DA3E52" height="128px" width="128px"/>

            </div>
        </div>


    </div>
</template>

<script setup>
import {useCollection} from 'vuefire'
import * as firestore from "firebase/firestore";
import {db} from "@/firebaseInit";
import CashRegisterMachine from "@/assets/cash-register-machine";

const caissesData = useCollection(firestore.collection(db, 'caisse'))
const test = () => {
    let str = "";
    caissesData.data.value.forEach((data) => {
        if (data.disponibilite && data.isPlugged) {
            str += data.numero + " "
        }
    })
    return str

    // prendre l'adresse MAC
    // faire en sorte d'avoir uen chaine complete avec la led ( l'app mobile qui allume la lumiere
    // faire un system input, qui modifie le nom
    // si le nom change, le ni change
}
</script>
<style scoped>

.flex-box {
    width: 100%;
    justify-content: center;
    display: flex;
}

.row-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 50%;
    justify-content: center;

}

.item {
    margin: 1em;
}
</style>
