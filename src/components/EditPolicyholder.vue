<template>
  <div v-if="notification.show" class="notification" :class="{ 'error': notification.isError }">{{ notification.message }}</div>
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
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import { computed, ref, onMounted } from 'vue';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const policyholderId = route.params.id;
    const policyholder = ref(null);

    const fetchPolicyholder = async () => {
      if (!store.getters.isAuthenticated) {
        router.push('/login');
        return;
      }
      if (!store.state.policyholders.some(p => p.id === policyholderId)) {
        try {
          const response = await axios.get(`http://localhost:8001/policyholders/${policyholderId}`);
          policyholder.value = response.data.policyholder;
        } catch (error) {
          console.error('Error fetching policyholder:', error);
        }
      } else {
        policyholder.value = store.state.policyholders.find(p => p.id === policyholderId);
      }
    };

    onMounted(fetchPolicyholder);


    const policyAmountModel = computed({
      get: () => (policyholder.value.policy_amount || 0).toFixed(2),
      set: value => {
        policyholder.value = { ...policyholder.value, policy_amount: parseFloat(value) };
      }
    });

    const notification = ref({
      show: false,
      message: '',
      isError: false
    });

    const showNotification = (message, isError = false) => {
      notification.value = { show: true, message, isError };
      setTimeout(() => notification.value.show = false, 3000);  // Hide after 3 seconds
    };

    const handleSubmit = async () => {
      if (!store.getters.isAuthenticated) {
        router.push('/login');
        return;
      }
      try {
        const updatedData = { ...policyholder.value, policy_amount: parseFloat(policyAmountModel.value) };
        const response = await axios.put(`http://localhost:8001/policyholders/${policyholderId}`, updatedData);
        if (response.status === 200) {
          store.commit('UPDATE_POLICYHOLDER', response.data.policyholder);
          showNotification('Policyholder updated successfully');
        } else {
          showNotification('Error updating policyholder', true);
          console.error('Error updating policyholder:', response.data);
        }
      } catch (error) {
        console.error('Error updating policyholder:', error);
      }
    };

    return { policyholder, handleSubmit, policyAmountModel, notification  };
  }
};
</script>

<style>
.notification {
  position: fixed;
  top: 50px; /* Adjust this value based on your nav bar's height */
  left: 50%;
  transform: translateX(-50%);
  background-color: lightyellow;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  width: 100%;
  text-align: center;
  z-index: 1000;
}

.notification.error {
  background-color: pink;
}

</style>