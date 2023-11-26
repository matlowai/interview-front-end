<template>
    <div class="generate-claim-notes-container">
      <h2>Generate Claim Notes</h2>
      <form @submit.prevent="handleGenerate">
        <div>
          <label for="numberOfNotes">Number of Notes:</label>
          <input type="number" v-model.number="numberOfNotes" min="1" id="numberOfNotes" required>
        </div>
        <div>
          <label>Select Policyholders:</label>
          <select v-model="selectedPolicyholderIds" multiple>
            <option v-for="policyholder in policyholders" :value="policyholder.id" :key="policyholder.id">
              {{ policyholder.name }}
            </option>
          </select>
        </div>
        <button type="submit">Generate</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        numberOfNotes: 1,
        selectedPolicyholderIds: []
      };
    },
    computed: {
      ...mapState(['policyholders'])
    },
    methods: {
      ...mapActions(['generateClaimNotes', 'fetchPolicyholders']),
      async handleGenerate() {
        try {
          await this.generateClaimNotes({ numberOfNotes: this.numberOfNotes, policyholderIds: this.selectedPolicyholderIds });
          // Handle successful note generation, e.g., show a notification
        } catch (error) {
          console.error('Error generating claim notes:', error);
          // Handle error, e.g., show a notification
        }
      }
    },
    mounted() {
      this.fetchPolicyholders();
    }
  };
  </script>
  
  <style>
  .generate-claim-notes-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  .generate-claim-notes-container form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  