<template>
    <div>
      <h2>New Policyholder</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="name">Name:</label>
          <input v-model="policyholder.name" id="name" required>
        </div>
        <div>
          <label for="age">Age:</label>
          <input type="number" v-model.number="policyholder.age" id="age" required>
        </div>
        <div>
          <label for="date">Policy Start Date:</label>
          <input type="date" v-model="policyholder.policy_start_date" id="date" required>
        </div>
        <div>
          <label for="amount">Policy Amount:</label>
          <input type="number" v-model.number="policyholder.policy_amount" id="amount" step="0.01" required>
        </div>
        <button type="submit">Create Policyholder</button>
      </form>
      <div>
        <button @click="generateRandom">Generate Random Policyholders</button>
        <input type="number" v-model.number="randomCount" min="1" placeholder="Count">
      </div>
    </div>
</template>


<script>
import { v4 as uuidv4 } from 'uuid';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      policyholder: {
        id: '', // Add id field
        name: '',
        age: null,
        policy_start_date: '',
        policy_amount: null
      },
      randomCount: 1
    };
  },
  methods: {
    ...mapActions(['createPolicyholder', 'generateSyntheticPolicyholders']),
    handleSubmit() {
      if (!this.policyholder.id) {
        this.policyholder.id = uuidv4(); // Generate UUID if id is not present
      }
      this.createPolicyholder(this.policyholder);
      this.resetForm();
    },
    generateRandom() {
      this.generateSyntheticPolicyholders(this.randomCount);
    },
    resetForm() {
      this.policyholder = { id: '', name: '', age: null, policy_start_date: '', policy_amount: null };
    }
  }
};
</script>