<template>
  <q-layout style="background-color: rgb(30, 61, 88)">
    <q-card class="mainCard">
      <q-card-section class="title"> Datos familiares </q-card-section>
      <q-card-section>
        <PaginationApplication :page="6" :required-fields="requiredFieldsOnThisPage"></PaginationApplication>
        <p
          style="
            font-size: 130%;
            color: rgb(255, 255, 255);
            padding-left: 4%;
            padding-top: 2%;
            margin-top: 2%;
          "
        >
          Datos de Padres y Esposa(o)
        </p>
        <FamilyFathers class="table-position" />
        <br />
        <p
          style="
            font-size: 130%;
            color: rgb(255, 255, 255);
            padding-left: 4%;
            padding-top: 2%;
          "
        >
          Datos de Hijas(os)
        </p>
        <FamilySons class="table-position" />
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus v-if="updatingApplication"/>
  </q-layout>
</template>

<!-- SCRIPT BEGGINS ............................................................................................................................ -->
<script setup>
import { computed } from "vue"
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";
import FamilyFathers from "src/components/TableFamilyData.vue";
import FamilySons from "src/components/TableFamilyData2.vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";

const requiredFieldsOnThisPage = computed(() => [familyFathersData.value[0], familyFathersData.value[1]])

const useApplication = useRequestUser();

const { updatingApplication, familyFathersData} = storeToRefs(useApplication);
</script>

<!-- STYLE BEGGINS ............................................................................................................................ -->
<style scoped>
.q-card {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(49, 49, 49, 0.473) 51%;
  position: relative;
  height: 75%;
  width: 75%;
  margin-left: 23.5%;
  margin-top: 2%;
}

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}

.mainCard {
  border-radius: 10px;
  background: rgba(49, 49, 49, 0.473) 51%;
}

.mainCard {
  display: relative;
  justify-content: center;
  align-items: center;
}

.avatar {
  position: relative;
  margin-left: 20%;
}

.menu {
  background: rgba(22, 48, 70);
  width: 70px;
}

.menu-register {
  color: rgb(95, 158, 160);
  font-size: 150%;
  margin-top: 15%;
  margin-left: 10%;
}

.logo-turbo {
  margin-top: 5%;
  margin-left: 31%;
}

.turbo {
  color: rgb(255, 255, 255);
  font-size: 150%;
  margin-left: 20%;
}

.personaldata-background {
  display: flex;
  position: relative;
  width: 80%;
  height: 100%;
  left: 10%;
  padding-bottom: 2%;
  padding-top: 3%;
}

.table-position {
  position: relative;
  margin-top: 2%;
  width: 92%;
  left: 4%;
}
</style>
