<template>
    <div v-if="policyholder">
      <h2>Edit Policyholder</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="name">Name:</label>
          <input id="name" v-model="policyholder.name" required>
        </div>
        <div>
          <label for="age">Age:</label>
          <input id="age" type="number" v-model.number="policyholder.age" required>
        </div>
        <div>
          <label for="policyStartDate">Policy Start Date:</label>
          <input id="policyStartDate" type="date" v-model="policyholder.policy_start_date" required>
        </div>
        <div>
          <label for="policyAmount">Policy Amount:</label>
          <input id="policyAmount" type="number" v-model.lazy.number="policyAmountModel" step="0.01" required>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
    <div v-else>
      <p>Loading policyholder data...</p>
    </div>
  </template>
  
  <script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const policyholderId = route.params.id;

    const defaultPolicyholder = {
      name: '',
      age: 0,
      policy_start_date: new Date().toISOString().substring(0, 10),
      policy_amount: 0
    };

    const policyholder = computed({
      get: () => store.state.policyholders.find(p => p.id === policyholderId) || defaultPolicyholder,
      set: value => store.commit('UPDATE_POLICYHOLDER', value)
    });

    const policyAmountModel = computed({
      get: () => (policyholder.value.policy_amount || 0).toFixed(2),
      set: value => {
        policyholder.value = { ...policyholder.value, policy_amount: parseFloat(value) };
      }
    });

    const handleSubmit = async () => {
      try {
        const updatedData = { ...policyholder.value, policy_amount: parseFloat(policyAmountModel.value) };
        const response = await axios.put(`http://localhost:8001/policyholders/${policyholderId}`, updatedData);
        if (response.status === 200) {
          store.commit('UPDATE_POLICYHOLDER', response.data.policyholder);
          alert('Policyholder updated successfully');
          console.log('Store state immediately after update:', store.state);
          setTimeout(() => {
            console.log('Store state 2 seconds after update:', store.state);
          }, 2000);
        } else {
          console.error('Error updating policyholder:', response.data);
        }
      } catch (error) {
        console.error('Error updating policyholder:', error);
      }
    };

    return { policyholder, handleSubmit, policyAmountModel };
  }
};
</script>

  