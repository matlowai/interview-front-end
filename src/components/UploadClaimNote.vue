<template>
    <div class="upload-claim-note-container">
      <h2>Upload Claim Note</h2>
      <form @submit.prevent="handleUpload">
        <div>
          <label for="claimId">Claim ID:</label>
      <input type="text" id="claimId" v-model="claimId" required>
        </div>
        <div>
          <label for="file">Claim Note File:</label>
          <input type="file" id="file" ref="fileInput" required>
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        claimId: '',
      };
    },
    methods: {
      ...mapActions(['uploadClaimNote']),
      async handleUpload() {
      const fileInput = this.$refs.fileInput;
      if (fileInput && fileInput.files.length > 0 && this.claimId) {
        const file = fileInput.files[0];
        try {
          await this.uploadClaimNote({
            claimId: this.claimId,
            file: file,
          });
          // Handle successful upload
        } catch (error) {
          console.error('Error uploading claim note:', error);
        }
      }
    },
    },
  };
  </script>
    
  <style>
  .upload-claim-note-container {
    max-width: 2600px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  .upload-claim-note-container form {
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
  