import { createStore } from 'vuex';
import axios from 'axios';

const apiUrl = 'http://localhost:8001';

export default createStore({
  state: {
    policyholders: [],
    claimNotes: [],
    claims: []  // New state for managing claims
  },
  mutations: {
    SET_POLICYHOLDERS(state, policyholders) {
      state.policyholders = policyholders;
    }, 
    UPDATE_POLICYHOLDER(state, updatedPolicyholder) {
      const index = state.policyholders.findIndex(p => p.id === updatedPolicyholder.id);
      if (index !== -1) {
        Vue.set(state.policyholders, index, updatedPolicyholder);
      }
    },
    SET_CLAIM_NOTES(state, claimNotes) {
      state.claimNotes = claimNotes;
    },
    ADD_CLAIM_NOTE(state, claimNote) {
      state.claimNotes.push(claimNote);
    },
    SET_CLAIMS(state, claims) {  // New mutation to set claims
      state.claims = claims;
    }
  },
  actions: {
    async fetchPolicyholders({ commit }) {
      try {
        const response = await axios.get(`${apiUrl}/policyholders`);
        commit('SET_POLICYHOLDERS', response.data.policyholders);
      } catch (error) {
        console.error('Error fetching policyholders:', error);
      }
    },
    async createPolicyholder({ dispatch }, policyholder) {
      try {
        await axios.post(`${apiUrl}/policyholders`, policyholder);
        dispatch('fetchPolicyholders'); // Refresh the list after adding
      } catch (error) {
        console.error('Error creating policyholder:', error);
      }
    },
    async generateSyntheticPolicyholders({ dispatch }, count) {
      try {
        await axios.post(`${apiUrl}/generate-synthetic-policyholders`, {
          number_of_policyholders: count,
          add_to_database: true
        });
        dispatch('fetchPolicyholders'); // Refresh the list after adding
      } catch (error) {
        console.error('Error generating synthetic policyholders:', error);
      }
    },
    
    // Actions for claim notes
    async fetchClaimNotes({ commit }) {
      try {
        const response = await axios.get(`${apiUrl}/claim-notes`);
        for (const blobName of response.data.claim_notes) {
          const noteResponse = await axios.get(`${apiUrl}/claim-notes/${blobName}`);
          commit('ADD_CLAIM_NOTE', { name: blobName, content: noteResponse.data.claim_note, metadata: noteResponse.data.metadata });
        }
      } catch (error) {
        console.error('Error fetching claim notes:', error);
      }
    },
    
    async addClaim({ commit }, { policyholderId, details, generateRandom = false }) {
      try {
        const payload = generateRandom
          ? { policyholder_id: policyholderId, generate_random: true }
          : { policyholder_id: policyholderId, details };
  
        const response = await axios.post(`${apiUrl}/add-claim`, payload);
        commit('ADD_CLAIM_NOTE', response.data.claim_note);
  
        // Handle the response here, such as updating the state or redirecting the user
      } catch (error) {
        console.error('Error adding claim:', error);
        // Handle the error appropriately
      }
    },
    async fetchClaimsForPolicyholder({ commit }, policyholderId) {
      try {
        const response = await axios.get(`${apiUrl}/claims-for-policyholder/${policyholderId}`);
        commit('SET_CLAIMS', response.data.claims);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    },
    async generateClaimNotes({ commit }, { numberOfNotes, policyholderIds }) {
      try {
        const response = await axios.post(`${apiUrl}/generate-claim-notes`, {
          number_of_notes: numberOfNotes,
          policyholder_ids: policyholderIds
        });
        response.data.uploaded_notes.forEach(noteData => {
          commit('ADD_CLAIM_NOTE', noteData);
        });
      } catch (error) {
        console.error('Error generating claim notes:', error);
      }
    },
    
    async uploadClaimNote({ commit }, file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${apiUrl}/claim-notes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });
        commit('ADD_CLAIM_NOTE', response.data);
      } catch (error) {
        console.error('Error uploading claim note:', error);
      }
    },
    
    // Getters for claim notes
    allClaimNotes(state) {
      return state.claimNotes;
    },
    getClaimNoteById: (state) => (id) => {
      return state.claimNotes.find(note => note.id === id);
    },
    // Additional actions for update, delete, etc.
  }
});
