<template>
    <div class="analysis-container">
      <header class="analysis-header">
        <h2>Claims Analysis</h2>
      </header>
  
      <!-- Display average policy amount -->
      <div class="average-amount-container">
        <h3>Average Policy Amount: {{ averagePolicyAmount | currencyFormat }}</h3>
      </div>
  
      <!-- Claims Table -->
      <div class="claims-container">
        <h2>All Claims</h2>
        <table class="claims-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Policyholder ID</th>
              <th>Claim ID</th>
              <th>Textfile</th>
              <th>GPT Message</th>
              <th>File Blob Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="claim in claims" :key="claim.id">
              <td><input type="checkbox" v-model="selectedClaims" :value="claim.id"></td>
              <td>
                <router-link :to="`/claims/view/${claim.policyholder_id}`">{{ claim.policyholder_id }}</router-link>
              </td>
              <td>{{ claim.id }}</td>
              <td>{{ claim.textfile }}</td>
              <td>{{ claim.gptmsg }}</td>
              <td v-if="claim.file_blob_name">{{ claim.file_blob_name }}</td>
              <td v-else>N/A</td>
              <td v-if="claim.analysis">
                <td v-html="formatAnalysisData(claim.analysis)"></td>
            </td>
            <td v-else>
                No Analysis
            </td>
            </tr>
          </tbody>
        </table>
        <input type="checkbox" v-model="useBetterPrompt"> Apply Better Categorization Prompt

        <button @click="analyzeSelectedClaims" class="analyze-button">Analyze Selected</button>
      </div>
  
      <!-- Display incident type analysis -->
      <div class="incident-type-analysis">
    <h3>Textfile Incident Type Analysis</h3>
    <div class="incident-type-analysis">
      <h3>Textfile Analysis</h3>
      <table class="analysis-table">
        <thead>
          <tr>
            <th>Incident Type</th>
            <th>Count</th>
            <th>Average Claim Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, type) in incidentTypeAnalysis.textfile_category_counts" :key="`textfile-${type}`">
            <td>{{ type }}</td>
            <td :class="{ 'bold': isHighestCount(type, 'textfile') }">{{ count }}</td>
            <td>{{ incidentTypeAnalysis.textfile_category_averages[type] | currencyFormat }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>GPT Message Incident Type Analysis</h3>
    <table class="analysis-table">
        <thead>
          <tr>
            <th>Incident Type</th>
            <th>Count</th>
            <th>Average Claim Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, type) in incidentTypeAnalysis.gptmsg_category_counts" :key="`gptmsg-${type}`">
            <td>{{ type }}</td>
            <td :class="{ 'bold': isHighestCount(type, 'gptmsg') }">{{ count }}</td>
            <td>{{ incidentTypeAnalysis.gptmsg_category_averages[type] | currencyFormat }}</td>
          </tr>
        </tbody>
      </table>
  </div>
  
      <button @click="initiateAnalysis" class="analysis-button">Initiate Analysis</button>
  
      <!-- Popup Modal -->
      <div v-if="showPopup" class="popup-modal">
        <p>Analysis may take a while. Please wait...</p>
        <button @click="showPopup = false">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    data() {
      return {
        showPopup: false,
        selectedClaims: [],
        useBetterPrompt: false,
      };
    },
    computed: {
      ...mapState(['averagePolicyAmount', 'incidentTypeAnalysis', 'claims'])
    },
    methods: {
        ...mapActions(['fetchAveragePolicyAmount', 'analyzeClaims', 'fetchClaims']),
        isHighestCount(type, category) {
            const categoryData = this.incidentTypeAnalysis[`${category}_category_counts`];
            if (!categoryData) {
            return false;
            }

            const counts = categoryData[type];
            if (typeof counts === 'undefined') {
            return false;
            }

            const maxCount = Math.max(...Object.values(categoryData));
            return counts === maxCount;
        },
        currencyFormat(value) {
            if (!value) return '$0.00';
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        },
        async analyzeSelectedClaims() {
            if (this.selectedClaims.length > 0) {
                const claimsToAnalyze = this.claims.filter(claim => this.selectedClaims.includes(claim.id));
                await this.analyzeClaims({ claims: claimsToAnalyze, betterPrompt: this.useBetterPrompt });
            } else {
                alert('Please select at least one claim to analyze.');
            }
        },
        formatAnalysisData(analysis) {
            if (!analysis) return 'No Analysis';

            let formattedText = '';
            if (analysis.textfile_analysis) {
            formattedText += '<strong>Textfile Analysis:</strong> ';
            for (const [key, value] of Object.entries(analysis.textfile_analysis)) {
                formattedText += `${key}: ${value}, `;
            }
            formattedText = formattedText.slice(0, -2); // Remove last comma
            formattedText += '<br>'; // Line break
            }

            if (analysis.gptmsg_analysis) {
            formattedText += '<strong>GPT Message Analysis:</strong> ';
            for (const [key, value] of Object.entries(analysis.gptmsg_analysis)) {
                formattedText += `${key}: ${value}, `;
            }
            formattedText = formattedText.slice(0, -2);
            }

            return formattedText;
        },
        async initiateAnalysis() {
            this.showPopup = true;
            try {
            // Filter the first 5 claims without an analysis
            const claimsToAnalyze = this.claims.filter(claim => !claim.analysis).slice(0, 5);
            if (claimsToAnalyze.length > 0) {
                await this.analyzeClaims(claimsToAnalyze);
                alert('Analysis complete for selected claims');
            } else {
                alert('No more claims to analyze.');
            }
            } catch (error) {
            console.error('Analysis failed:', error);
            alert('Analysis failed. Please try again later.');
            }
            this.showPopup = false;
        },
    },
    mounted() {
      this.fetchAveragePolicyAmount();
      this.$store.dispatch('fetchClaims');
      this.$store.dispatch('fetchAnalysisData');
      this.$store.dispatch('fetchAveragePolicyAmount');
    },
    filters: {
      currencyFormat(value) {
        if (!value) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      },
    },
  };
  </script>
  

  
<style>
.analysis-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.analysis-header {
  text-align: center;
  margin-bottom: 30px;
}

.average-amount-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #eef2f7;
  border-radius: 5px;
  text-align: center;
}

.incident-type-analysis {
  margin-top: 20px;
}

.analysis-table {
  width: 100%;
  border-collapse: collapse;
}

.analysis-table thead {
  background-color: #007bff;
  color: white;
}

.analysis-table th, .analysis-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.analysis-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.analysis-button {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.analysis-button:hover {
  background-color: #45a049;
}

.popup-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
  z-index: 1000;
  width: 300px;
}

.popup-modal p {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.popup-modal button {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.popup-modal button:hover {
  background-color: #0069d9;
}

.claims-container {
  max-width: 2000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.claims-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.claims-table th, .claims-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.claims-table thead {
  background-color: #007bff;
  color: white;
}

.claims-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.analyze-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.analyze-button:hover {
  background-color: #45a049;
}
</style>
