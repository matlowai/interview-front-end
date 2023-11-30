<template>
  <div class="view-claims-container">
    <h2>Claims for Policyholder</h2>
    <ul v-if="generatedClaims  && generatedClaims .length" class="claims-list">
      <li v-for="claim in generatedClaims " :key="claim.id" class="claim-item">
        <input type="checkbox" v-model="selectedClaims" :value="claim.id" class="claim-checkbox">
        <button 
          class="claim-number-button" 
          @mouseover="hoveredClaimId = claim.id" 
          @mouseleave="hoveredClaimId = null" 
          @click="copyToClipboard(claim.id)"
          :title="hoveredClaimId === claim.id ? claim.id : ''">
          {{ hoveredClaimId === claim.id ? 'Copy' : 'Claim Number' }}
        </button>
        <div>
          <p v-if="!claim.showTextfileAnalysis">{{ claim.textfile }}</p>
          <p v-else>{{ claim.textfileAnalysis }}</p>
        </div>
        <div v-if="claim.gptmsg" class="gpt-message">
          <p v-if="!claim.showGptmsgAnalysis">{{ claim.gptmsg }}</p>
          <p v-else>{{ claim.gptmsgAnalysis }}</p>
        </div>
      </li>
    </ul>
    <p v-else>No claims found for this policyholder.</p>
    <div class="actions-container">
      <button @click="processSelectedClaims" class="action-button">Process Selected Claims with GPT</button>
      <button @click="deleteSelectedClaims" class="action-button">Delete Selected Claims</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      hoveredClaimId: null,
      copySuccess: null,
      selectedClaims: [],
      generatedClaims: []
    };
  },
  computed: {
    ...mapState(['claims']),
    
  },
  methods: {
  ...mapActions(['processClaims', 'deleteClaims', 'analyzeClaims']),
    async copyToClipboard(claimId) {
      if (navigator.clipboard && claimId) {
        try {
          await navigator.clipboard.writeText(claimId);
          this.copySuccess = claimId;
          setTimeout(() => (this.copySuccess = null), 2000);
        } catch (error) {
          console.error('Failed to copy:', error);
        }
      }
    },
    generateFilteredClaims() {
      this.generatedClaims = this.claims.filter(claim => claim.policyholder_id === this.$route.params.id)
                                        .map(claim => ({
                                          ...claim,
                                          showTextfileAnalysis: false,
                                          textfileAnalysis: '',
                                          showGptmsgAnalysis: false,
                                          gptmsgAnalysis: ''
                                        }));
    },
    async deleteSelectedClaims() {
      try {
        await this.deleteClaims(this.selectedClaims);
        this.selectedClaims = []; // Reset selected claims after deletion
      } catch (error) {
        console.error('Error deleting claims:', error);
      }
    },

    async processSelectedClaims() {
      try {
        await this.processClaims(this.selectedClaims);
        this.selectedClaims = []; // Reset selected claims after processing
      } catch (error) {
        console.error('Error processing claims:', error);
      }
    },
   /* async toggleAnalysis(claim, type) {
  const index = this.generatedClaims.findIndex(c => c.id === claim.id);
  if (index === -1) return; // Claim not found

  if (type === 'textfile' && !claim.showTextfileAnalysis) {
    const analysis = await this.analyzeClaims([claim.textfile]);
    this.generatedClaims[index].textfileAnalysis = analysis;
  } else if (type === 'gptmsg' && !claim.showGptmsgAnalysis) {
    const analysis = await this.analyzeClaims([claim.gptmsg]);
    this.generatedClaims[index].gptmsgAnalysis = analysis;
  }
  this.generatedClaims[index][`show${type.charAt(0).toUpperCase() + type.slice(1)}Analysis`] = !this.generatedClaims[index][`show${type.charAt(0).toUpperCase() + type.slice(1)}Analysis`];

  // To trigger reactivity    will implement properly if I have time
  this.generatedClaims = [...this.generatedClaims];
} */ 

  },
  mounted() {
    const route = useRoute();
    this.$store.dispatch('fetchClaimsForPolicyholder', route.params.id)
              .then(() => this.generateFilteredClaims());
  }
};
</script>


<style>

.claims-list {
  list-style: none;
  padding: 0;
}

.claim-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.claim-checkbox {
  margin-right: 10px;
}

.claim-number-button {
  
  min-width: 120px; /* Making the button not change size */
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.claim-number-button:hover {
  background-color: #45a049;
}

.hover-info {
  display: none; /* Hide the span element */
}

.gpt-message {
  margin-top: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.actions-container {
  margin-top: 20px;
}

.action-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 10px;
}

.action-button:hover {
  background-color: #0069d9;
}
</style>