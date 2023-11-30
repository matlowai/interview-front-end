<template>
  <div class="manage-claim-container">
    <h2 v-if="policyholder">Manage Claim for Policyholder: {{ policyholder.name }} (ID: {{ policyholder.id }})</h2>
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
import { mapActions, mapState, useStore } from 'vuex';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; 

export default {
  data() {
    return {
      claimDetails: ''
    };
  },
  computed: {
    ...mapState({
      policyholder: state => state.currentPolicyholder,
    }),
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    onMounted(() => {
      store.dispatch('fetchPolicyholder', route.params.id);
    });

    return {};
  },
  methods: {
    ...mapActions(['addClaim', 'fetchPolicyholder']),
    handleSubmit() {
      this.addClaim({ policyholderId: this.$route.params.id, details: this.claimDetails })
        .then(() => {
          this.$router.push('/');
        })
        .catch(error => {
          alert(`Failure: ${error.message}`);
        });
    },
    generateRandomClaim() {
      this.addClaim({ policyholderId: this.$route.params.id, generateRandom: true })
        .then(() => {
          this.$router.push('/');
        })
        .catch(error => {
          console.error('Policyholder ID is missing', error);
        });
     }
  }
};
</script>

<style>
  /* Styles */
</style>
