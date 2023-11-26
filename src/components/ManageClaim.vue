<template>
    <div class="manage-claim-container">
      <h2>Manage Claim for Policyholder</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="details">Claim Details:</label>
          <textarea id="details" v-model="claimDetails"></textarea>
        </div>
        <div>
          <button type="button" @click="generateRandomClaim">Generate Random Claim</button>
          <button type="submit">Submit Claim</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        claimDetails: ''
      };
    },
    methods: {
      ...mapActions(['addClaim']),
      handleSubmit() {
        const policyholderId = this.$route.params.id;
        this.addClaim({ policyholderId, details: this.claimDetails });
        // Handle success, redirect or show notification
      },
      generateRandomClaim() {
    const policyholderId = this.$route.params.id;
    if (policyholderId) {
      this.addClaim({ policyholderId, generateRandom: true });
      // Handle success, redirect or show notification
    } else {
      console.error('Policyholder ID is missing');
      // Handle the error, e.g., show notification
    }
  },
    }
  };
  </script>
  
  <style>
  .manage-claim-container {
    /* Styles for the container */
  }
  
  button {
    /* Styles for buttons */
  }
  </style>
  