import axios from 'axios';

const state = {
  claimNotes: [],
};

const getters = {
  allClaimNotes: (state) => state.claimNotes,
};

const actions = {
  async fetchClaimNotes({ commit }) {
    const response = await axios.get('http://localhost:8001/claim-notes');
    commit('setClaimNotes', response.data.claim_notes);
  },
  // Other actions like postClaimNote, deleteClaimNote, etc.
};

const mutations = {
  setClaimNotes: (state, claimNotes) => (state.claimNotes = claimNotes),
  // Other mutations as needed
};

export default {
  state,
  getters,
  actions,
  mutations,
};
