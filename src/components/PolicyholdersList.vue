<template>
  <div class="policyholders-container">
    <header class="policyholders-header">
      <h2>Policyholders</h2>
    </header>
    <div class="search-container">
      <input type="radio" id="all" value="all" v-model="searchMode" @change="fetchPolicyholders">
      <label for="all">All Policyholders</label>
      <input type="radio" id="search" value="search" v-model="searchMode">
      <label for="search">Search</label>
      <input 
        v-if="searchMode === 'search'" 
        v-model="searchQuery" 
        placeholder="Enter name to search">
      <button v-if="searchMode === 'search'" @click="searchPolicyholders">Search</button>
    </div>

    <table v-if="policyholders && policyholders.length" class="policyholders-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Start Date</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="policyholder in policyholders" :key="policyholder.id">
          <td>{{ policyholder.name }}</td>
          <td>{{ policyholder.age }}</td>
          <td>{{ policyholder.policy_start_date }}</td>
          <td>{{ policyholder.policy_amount | currencyFormat }}</td>
          <td>
        <!-- Edit Link -->
        <router-link :to="`/edit/${policyholder.id}`" class="action-button">Edit</router-link>
        <!-- Add Claim Button -->
        <router-link :to="`/claims/manage/${policyholder.id}`" class="action-button">Add Claim</router-link>
        <!-- View Claims Button -->
        <router-link 
          :to="`/claims/view/${policyholder.id}`" 
          class="action-button" 
          :class="{ 'inactive': !hasClaims[policyholder.id] }"
          v-if="hasClaims[policyholder.id]">View Claims</router-link>
        </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="no-policyholders">No policyholders found.</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['policyholders', 'claims']),
    hasClaims() {
      let claimStatus = {};
      this.policyholders.forEach(policyholder => {
        claimStatus[policyholder.id] = this.claims.some(claim => claim.policyholder_id === policyholder.id);
      });
      return claimStatus;
    }
  },
  data() {
    return {
      searchMode: 'search', // Default to 'search' mode
      searchQuery: ''       // Holds the search query
    };
  },
  methods: {
    fetchPolicyholders() {
      if (this.searchMode === 'all') {
        this.$store.dispatch('fetchPolicyholders');
        this.$store.dispatch('fetchClaims');
      }
    },
    searchPolicyholders() {
      if (this.searchQuery.trim()) {
        // Dispatch the search action and wait for it to complete
        this.$store.dispatch('searchPolicyholders', this.searchQuery)
          .then(() => {
            // After the policyholders have been fetched and set, fetch the claims
            const policyholderIds = this.policyholders.map(ph => ph.id);
            return this.$store.dispatch('fetchClaimsForPolicyholder', policyholderIds);
          })
          .catch(error => {
            console.error('Error in search process:', error);
          });
      } else {
        this.fetchPolicyholders();
      }
    }
  },
  mounted() {
  }
};
</script>


<style>
.policyholders-container {
  max-width: 2800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.policyholders-header {
  text-align: center;
  margin-bottom: 20px;
}

.policyholders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.policyholders-table thead {
  background-color: #4CAF50;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.policyholders-table th, .policyholders-table td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.policyholders-table tr:hover {
  background-color: #f5f5f5;
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

.action-button.inactive {
  opacity: 0.5;
  pointer-events: none; /* Disables clicking */
}

</style>