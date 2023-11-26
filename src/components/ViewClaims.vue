<template>
    <div class="view-claims-container">
      <h2>Claims for Policyholder</h2>
      <ul v-if="claims && claims.length" class="claims-list">
        <li v-for="claim in claims" :key="claim.id" class="claim-item">
          {{ claim.textfile }}
          <!-- Display other claim details as needed -->
        </li>
      </ul>
      <p v-else>No claims found for this policyholder.</p>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    computed: {
      ...mapState(['claims']),
      policyholderId() {
        return this.$route.params.id;
      }
    },
    methods: {
      ...mapActions(['fetchClaimsForPolicyholder'])
    },
    mounted() {
      this.fetchClaimsForPolicyholder(this.policyholderId);
    }
  };
  </script>
  
  <style>
  /* Add styles for your claims list here */
  </style>
  