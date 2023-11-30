import { createStore } from 'vuex';
import axios from 'axios';

//const apiUrl = 'http://localhost:8001';
const apiUrl = 'http://matlowaiassignmentfastapiapp-dns-name.westus2.azurecontainer.io:8001';


export default createStore({
  state: {
    policyholders: [],
    claimNotes: [],
    claims: [],  // New state for managing claims
    token: localStorage.getItem('token') || null, // Initialize token from local storage
    
    averagePolicyAmount: 0,
    incidentTypeAnalysis: {
      textfile_category_counts: {},
      textfile_category_averages: {},
      gptmsg_category_counts: {},
      gptmsg_category_averages: {}
    },
 
  },
  mutations: {
    SET_POLICYHOLDERS(state, policyholders) {
      state.policyholders = policyholders;
    }, 
    SET_CURRENT_POLICYHOLDER(state, policyholder) {
      state.currentPolicyholder = policyholder;
    },
    UPDATE_POLICYHOLDER(state, updatedPolicyholder) {
      const index = state.policyholders.findIndex(p => p.id === updatedPolicyholder.id);
      if (index !== -1) {
        state.policyholders[index] = updatedPolicyholder;
      }
    },
    SET_CLAIM_NOTES(state, claimNotes) {
      state.claimNotes = claimNotes;
    },
    ADD_CLAIM_NOTE(state, claimNote) {
      state.claimNotes.push(claimNote);
    },
    SET_CLAIMS(state, claims) { 
      state.claims = claims;
    },
    UPDATE_CLAIM(state, { id, gptmsg }) {
      const index = state.claims.findIndex(c => c.id === id);
      if (index !== -1) {
        state.claims[index].gptmsg = gptmsg;
      }
    },
    REMOVE_CLAIM(state, claimId) {
      state.claims = state.claims.filter(c => c.id !== claimId);
    },
    SET_TOKEN(state, { token, expiresIn }) {
      const expiryTime = new Date().getTime() + expiresIn * 1000; // expiresIn is in seconds
      state.token = token;
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime);
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
    },
    SET_AVERAGE_POLICY_AMOUNT(state, amount) {
      state.averagePolicyAmount = amount;
    },
    SET_INCIDENT_TYPE_ANALYSIS(state, analysisData) {
      state.incidentTypeAnalysis.textfile_category_counts = analysisData.textfile_category_counts;
      state.incidentTypeAnalysis.textfile_category_averages = analysisData.textfile_category_averages;
      state.incidentTypeAnalysis.gptmsg_category_counts = analysisData.gptmsg_category_counts;
      state.incidentTypeAnalysis.gptmsg_category_averages = analysisData.gptmsg_category_averages;
    },
    
    UPDATE_CLAIM_ANALYSIS(state, { claimId, analysis }) {
        const claimIndex = state.claims.findIndex(claim => claim.id === claimId);
        if (claimIndex !== -1) {
            // Assuming you want to store the entire analysis object in the claim
            state.claims[claimIndex].analysis = analysis;
        }
    },
  },
  actions: {
    async login({ commit }, authCode) {
      try {
        const response = await axios.post('http://matlowaiassignmentfastapiapp-dns-name.westus2.azurecontainer.io:8001/exchange-code', { code: authCode });
        const expiresIn = 3600; // 1 hours in seconds
        commit('SET_TOKEN', { token: response.data.token, expiresIn });
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    logout({ commit }) {
      commit('CLEAR_TOKEN');
      // Redirect to login page or perform other necessary cleanup
    },
    async fetchAveragePolicyAmount({ commit, state }) {
      try {
        const response = await axios.get(`${apiUrl}/policyholders`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        const policyholders = response.data.policyholders;
        const totalAmount = policyholders.reduce((acc, policyholder) => acc + parseFloat(policyholder.policy_amount), 0);
        const averageAmount = policyholders.length > 0 ? totalAmount / policyholders.length : 0;
        commit('SET_AVERAGE_POLICY_AMOUNT', averageAmount);
      } catch (error) {
        console.error('Error fetching average policy amount:', error);
      }
    },
    async processClaims({ commit, state }, claimIds) {
      try {
        const idsToProcess = claimIds.length ? claimIds : state.claims.map(claim => claim.id);
        const response = await axios.post(`${apiUrl}/process-claims`, { claimIds: idsToProcess }, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });

        // Iterate over the object and update each claim
        for (const id in response.data) {
          if (response.data.hasOwnProperty(id)) {
            commit('UPDATE_CLAIM', { id, gptmsg: response.data[id] });
          }
        }
      } catch (error) {
        console.error('Error processing claims:', error);
      }
    },
    async analyzeClaims({ commit, state }, { claims, betterPrompt }) {
        try {
            const formattedClaims = claims.map(claim => ({
                id: claim.id,
                textfile: claim.textfile,
                gptmsg: claim.gptmsg
            }));
            const response = await axios.post(`${apiUrl}/claims-analysis`, { claims, betterPrompt }, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });

            // Commit each analysis result to the store
            response.data.analysis.forEach(analysisResult => {
                commit('UPDATE_CLAIM_ANALYSIS', { claimId: analysisResult.id, analysis: analysisResult });
            });
        } catch (error) {
            console.error('Error in claims analysis:', error);
        }
    },
    async fetchAnalysisData({ commit, state }) {
      try {
        const response = await axios.post(`${apiUrl}/analyze-claims`, {}, {
          headers: {
              'Authorization': `Bearer ${state.token}`
          }
        });
  
        // Assuming the response contains the analysis data in the specific format
        commit('SET_INCIDENT_TYPE_ANALYSIS', response.data);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      }
    },
    async downloadFile({ state }, filename) {
      try {
        const response = await axios.get(`${apiUrl}/download/${filename}`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          },
          responseType: 'blob'
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    },
    async fetchPolicyholders({ commit, state }) {
      try {
        const response = await axios.get(`${apiUrl}/policyholders`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('SET_POLICYHOLDERS', response.data.policyholders);
      } catch (error) {
        console.error('Error fetching policyholders:', error);
      }
    },
    async fetchPolicyholder({ commit, state }, policyholderId) {
      try {
        const response = await axios.get(`${apiUrl}/policyholders/${policyholderId}`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('SET_CURRENT_POLICYHOLDER', response.data.policyholder);
      } catch (error) {
        console.error('Error fetching policyholder:', error);
      }
    },
    async createPolicyholder({ dispatch, state }, policyholder) {
      try {
        await axios.post(`${apiUrl}/policyholders`, policyholder, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        dispatch('fetchPolicyholders');
      } catch (error) {
        console.error('Error creating policyholder:', error);
      }
    },
    async generateSyntheticPolicyholders({ dispatch, state }, count) {
      try {
        await axios.post(`${apiUrl}/generate-synthetic-policyholders`, {
          number_of_policyholders: count,
          add_to_database: true
        }, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        dispatch('fetchPolicyholders');
      } catch (error) {
        console.error('Error generating synthetic policyholders:', error);
      }
    },
    async fetchClaimNotes({ commit, state }) {
      try {
        const response = await axios.get(`${apiUrl}/claim-notes`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('SET_CLAIM_NOTES', response.data.claim_notes.map(note => ({
          ...note,
          downloadUrl: `${apiUrl}/download/${note.name}`
        })));
      } catch (error) {
        console.error('Error fetching claim notes:', error);
      }
    },
    async deleteClaims({ commit, state }, claimIds) {
      try {
        await axios.post(`${apiUrl}/delete-claims`, { claimIds }, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        claimIds.forEach(id => {
          commit('REMOVE_CLAIM', id);
        });
      } catch (error) {
        console.error('Error deleting claims:', error);
      }
    },
    
    async addClaim({ commit, state }, { policyholderId, details, generateRandom = false }) {
      try {
        const payload = generateRandom
          ? { policyholder_id: policyholderId, generate_random: true }
          : { policyholder_id: policyholderId, details };
        const response = await axios.post(`${apiUrl}/add-claim`, payload, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('ADD_CLAIM_NOTE', response.data.claim_note);
      } catch (error) {
        console.error('Error adding claim:', error);
      }
    },
    async fetchClaims({ commit, state }) {
      try {
        const response = await axios.get(`${apiUrl}/claims`, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('SET_CLAIMS', response.data.claims);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    },
    async fetchClaimsForPolicyholder({ commit, state }, policyholderIds) {
      try {
        // Ensure policyholderIds is always an array
        const ids = Array.isArray(policyholderIds) ? policyholderIds : [policyholderIds];
        const response = await axios.get(`${apiUrl}/claims`, {
          params: { policyholder_ids: ids },
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('SET_CLAIMS', response.data.claims);
      } catch (error) {
        console.error('Error fetching claims for policyholder(s):', error);
      }
    },
    async searchPolicyholders({ commit, state }, query) {
      try {
        const response = await axios.post(`${apiUrl}/policyholders/search`, { name: query }, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        commit('SET_POLICYHOLDERS', response.data.policyholders);
      } catch (error) {
        console.error('Error searching policyholders:', error);
        throw error;
      }
    },
    async generateClaimNotes({ commit, state }, { numberOfNotes, policyholderIds }) {
      try {
        const response = await axios.post(`${apiUrl}/generate-claim-notes`, {
          number_of_notes: numberOfNotes,
          policyholder_ids: policyholderIds
        }, {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        });
        response.data.uploaded_notes.forEach(noteData => {
          commit('ADD_CLAIM_NOTE', noteData);
        });
      } catch (error) {
        console.error('Error generating claim notes:', error);
      }
    },
    async uploadClaimNote({ commit, state }, { claimId, file }) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('claimId', claimId);

        const response = await axios.post(`${apiUrl}/claim-notes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${state.token}`
          },
        });

        // Handle the response here, e.g., commit a mutation or show a notification
      } catch (error) {
        console.error('Error uploading claim note:', error);
      }
    },
    // Getters
    isAuthenticated(state) {
      return !!state.token;
    },
    allClaimNotes(state) {
      return state.claimNotes;
    },
    getClaimNoteById: (state) => (id) => {
      return state.claimNotes.find(note => note.id === id);
    },
    // Additional actions for update, delete, etc.
  }
});
