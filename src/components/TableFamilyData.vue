<template>
  <div v-on:vnode-unmounted="saveLocalStore()">
    <q-table
      :columns="columns"
      :rows="familyFathersData"
      :rows-per-page-options="[0]"
      no-data-label="Sin datos"
    >
      <template v-slot:body-cell-relationship="{ row }">
        <q-td>
          <q-select
            v-model="row.relationship"
            :readonly="viewingApplication"
            :options="relationOptions"
            outlined
            color="black"
            label-color="black"
            class="q-mb-md"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-name="{ row }">
        <q-td>
          <q-input
            v-model="row.name"
            :readonly="viewingApplication"
            :rules="[lettersRule]"
            class="q-mt-xs"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-birthdate="{ row }">
        <q-td style="color: rgb(0, 0, 0)">
          <q-input
            label="AAAA/MM/DD"
            v-model="row.birthdate"
            :readonly="viewingApplication"
            mask="####/##/##"
            class="q-mt-xs"
            lazy-rules
            :rules="[dateRule]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  v-if="!viewingApplication"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="row.birthdate"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-td>
      </template>
      <template v-slot:body-cell-job="{ row }">
        <q-td>
          <q-input
            v-model="row.job"
            :readonly="viewingApplication"
            :rules="[lettersRule]"
            class="q-mt-xs"
          /><!--  checar rules ocupacion -->
        </q-td>
      </template>
      <template v-slot:body-cell-jobAddress="{ row }">
        <q-td>
          <q-input
            v-model="row.jobAddress"
            :readonly="viewingApplication"
            :rules="[workPlaceRule]"
            class="q-mt-xs"
          />
        </q-td>
      </template>
    </q-table>
    <br />
    <q-btn
      v-if="!viewingApplication"
      rounded
      :style="{
        background: disableAddButton() ? 'grey' : 'rgb(104, 192, 197)',
      }"
      style="position: relative; bottom: 2%; left: 2%"
      icon="add"
      label="Agregar familiar"
      @click="addNewRelative"
      :disable="disableAddButton()"
    />
    <q-btn
      v-if="!viewingApplication"
      rounded
      :style="{ background: disableDeleteButton ? 'grey' : 'rgb(244, 36, 36)' }"
      style="position: relative; bottom: 2%; left: 5%"
      icon="delete"
      label="Eliminar ultimo"
      @click="deleteLastRelative"
      :disable="disableDeleteButton"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";

const $q = useQuasar();
const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();

const relationOptions = ["Padre", "Madre", "Esposo/a"];

const currentIndex = ref(0);

const disableDeleteButton = ref(true);

const {
  familyFathersData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const columns = [
  {
    name: "relationship",
    align: "left",
    label: "Parentesco",
    field: "relationship",
  },
  { name: "name", align: "left", label: "Nombre", field: "name" },
  {
    name: "birthdate",
    align: "left",
    label: "Fecha de nacimiento",
    field: "birthdate",
  },
  { name: "job", align: "left", label: "Trabajo", field: "job" },
  {
    name: "jobAddress",
    align: "left",
    label: "Direccion de su trabajo",
    field: "jobAddress",
  },
];

onMounted(() => {
  loadLocalStore();
  setCurrentIndex();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }
  disableDeleteButton.value =
    familyFathersData.value.length === 0 ? true : false;
});

const setSavedStoredValues = () => {
  if (familyFathersData.value.length > 0) return;

  savedApplication.value.datos_familiares.forEach((element) => {
    if (element.job != null) {
      familyFathersData.value.push(element);
    }
  });
};

const lettersRule = (value) => {
  const charactersValid = /^[A-Za-zñ áéíóúÁÉÍÓÚ]*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const dateRule = (value) => {
  const dateValid = /^\d{4}\/\d{2}\/\d{2}$/.test(value);
  const requiredValid = !!value;

  if (!dateValid) {
    return "Ingresa una fecha válida en el formato AAAA/MM/DD";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};
const workPlaceRule = (value) => {
  const charactersValid = /^[A-Za-z0-9ñáéíóúÁÉÍÓÚ., ]*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras, números, puntos y comas";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};


const disableAddButton = () => {
  if (familyFathersData.value.length === 0) return false;

  if (
    familyFathersData.value[currentIndex.value].relationship === "" ||
    familyFathersData.value[currentIndex.value].name === "" ||
    familyFathersData.value[currentIndex.value].birthdate === "" ||
    familyFathersData.value[currentIndex.value].job === "" ||
    familyFathersData.value[currentIndex.value].jobAddress === "" ||
    familyFathersData.value.length === 0
  ) {
    return true;
  }
  return false;
};

const addNewRelative = () => {
  if (disableAddButton()) return;

  const newRelative = {
    relationship: "",
    name: "",
    birthdate: "",
    job: "",
    jobAddress: "",
  };

  familyFathersData.value.push(newRelative);
  setCurrentIndex();
  disableDeleteButton.value = false;
  if (familyFathersData.value.length === 3) {
    disableAddButton.value = true;
  }
};

const deleteLastRelative = () => {
  if (familyFathersData.value.length > 0) {
    disableDeleteButton.value = false;
    disableAddButton.value = false;
    familyFathersData.value.pop();
    setCurrentIndex();

    if (familyFathersData.value.length === 0) {
      disableDeleteButton.value = true;
      disableAddButton.value = false;
    }
  }
};

const saveLocalStore = () => {
  useLocalStorage.save("familyFathersData", familyFathersData.value);
  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("familyFathersData");

  if (localStoreData) familyFathersData.value = localStoreData;
};

const setCurrentIndex = () => {
  currentIndex.value = familyFathersData.value.length - 1;
};
</script>
