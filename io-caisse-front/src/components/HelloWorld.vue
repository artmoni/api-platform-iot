<template>
    <div class="last">
        <h1>Veuillez vous diriger vers les caisses n° : </h1>
        <h2>{{ test(caissesData) }}</h2>
    </div>

    <div class="flex-box">
        <div class="row-container">
            <div class="item" v-for="entry in caissesData" :key="entry.id">
                <div class="edit-box" v-if="currentlyEditing !== entry.id && entry.isPlugged">

                    <b v-if="entry.isPlugged"> {{ entry.numero }}</b>
                    <b v-else></b>
                    <button
                        @click="editEntry(entry)"
                        class="todo-button">
                        <Pencil_name></Pencil_name>
                    </button>


                </div>
                <form v-else-if="currentlyEditing === entry.id && entry.isPlugged" class="edit-todo-form">
                    <input type="text" v-model="entryEditText" class="edit-todo-input">
                    <button
                        type="submit"
                        class="edit-todo-button"
                        @click.prevent="updateTodoText()">
                        +
                    </button>
                </form>


                <cash-register-machine v-if="entry.disponibilite" fill-color="#BEEE62" height="128px"
                                       width="128px"/>
                <cash-register-machine v-else-if="!entry.isPlugged" fill-color="rgba(255,255,255,0)" height="128px"
                                       width="128px"/>
                <cash-register-machine v-else fill-color="#DA3E52" height="128px" width="128px"/>

            </div>
            <div>
                <div class="item">
                    <h1>
                        Nombre de caisses disponibles :
                    </h1>
                    <h2>{{ nbDispo }}</h2>

                </div>
            </div>
        </div>


    </div>
</template>

<script>
import {useCollection} from 'vuefire'
import * as firestore from "firebase/firestore";
import {db} from "@/firebaseInit";
import CashRegisterMachine from "@/assets/cash-register-machine";
import Pencil_name from "@/assets/pencil_name";

export default {
    components: {Pencil_name, CashRegisterMachine},
    data() {
        return {
            newTodo: '',
            caissesData: [],
            currentlyEditing: null,
            entryEditText: '',
            listeCaisses: '',
            nbDispo: 0

        }
    },
    methods: {

        test(list) {
            this.listeCaisses = ''
            this.nbDispo = 0;
            list.forEach((data) => {
                if (data.disponibilite) {
                    this.listeCaisses += data.numero + " "
                    this.nbDispo++
                }
            })
            return this.listeCaisses
        },
        editEntry(entry) {
            this.currentlyEditing = entry.id
            this.entryEditText = entry.text
        },

        updateTodoText() {
            const docRef = firestore.doc(db, "caisse", this.currentlyEditing);

            firestore.updateDoc(docRef, {
                numero: this.entryEditText

            })
                .then(() => {
                    console.log("A New Document Field has been added to an existing document");
                })
                .catch(error => {
                    console.log(error);
                })
            this.currentlyEditing = null;
            this.entryEditText = '';


        }


    },
    mounted() {
        this.caissesData = useCollection(firestore.collection(db, 'caisse'))

    }
};

firestore.onSnapshot(firestore.collection(db, 'caisse'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
            console.log("mon gros anus")
        }
    });
})
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
    justify-content: start;

}

.item {
    margin: 1em;
}

.page-header {
    padding: 5rem 0;
    width: 100%;
    background: #FF33AE;
}

.last {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.edit-todo-form {
    width: 70%;
    top: 10%;
    display: flex;
}


.edit-todo-input {
    border-radius: 3px;
    border: 1px solid lightgrey;
    font-size: 1rem;
    font-weight: normal;
    width: 20%;
    margin-left: 1rem;
}

.edit-todo-button {
    font-size: 1rem;
    padding: .5rem .7rem;
    border-radius: 3px;
    color: #FF33AE;
    font-weight: bold;
    border: 1px solid #FF33AE;
}

.edit-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.todo-item__checkbox {
    margin-right: 1rem;
}

.todo-list {
    max-width: 100%;
    margin: 2rem auto;
}

.todo-button {
    background: transparent;
    border: 0;
    padding: .5rem;
    width: 40px;
    height: 40px;
    border-radius: 3px;
    cursor: pointer;
}
</style>
