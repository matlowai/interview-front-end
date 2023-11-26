<template>
  <div class="policyholders-container">
    <h2>Policyholders List</h2>
    <ul v-if="policyholders && policyholders.length" class="policyholders-list">
      <li v-for="policyholder in policyholders" :key="policyholder.id" class="policyholder-item">
        <span class="policyholder-name">{{ policyholder.name }}</span> -
        Age: <span class="policyholder-age">{{ policyholder.age }}</span>,
        Start Date: <span class="policyholder-date">{{ policyholder.policy_start_date }}</span>,
        Amount: <span class="policyholder-amount">{{ policyholder.policy_amount }}</span>
        <!-- Edit Link -->
        <router-link :to="`/edit/${policyholder.id}`" class="action-button">Edit</router-link>
        <!-- Add Claim Button -->
        <router-link :to="`/claims/manage/${policyholder.id}`" class="action-button">Add Claim</router-link>
        <!-- View Claims Button -->
        <router-link :to="`/claims/view/${policyholder.id}`" class="action-button">View Claims</router-link>
      </li>
    </ul>
    <p v-else class="no-policyholders">No policyholders found.</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['policyholders'])
  },
  methods: {
    ...mapActions(['fetchPolicyholders'])
  },
  mounted() {
    this.fetchPolicyholders();
  }
};
</script>

<style>
.policyholders-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.policyholders-list {
  list-style: none;
  padding: 0;
}

.policyholder-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.policyholder-name {
  font-weight: bold;
}

.policyholder-age, .policyholder-date, .policyholder-amount {
  font-style: italic;
}

.action-button {
  display: inline-block;
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  text-decoration: none;
}

.action-button:hover {
  background-color: #45a049;
}

.no-policyholders {
  text-align: center;
}
</style>
