require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurazione Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

// Funzione per ottenere i dati da un foglio
async function getSheetData(range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Errore nel recupero dei dati:', error);
    throw error;
  }
}

// API per ottenere i dati di interesse (Foglio1)
app.get('/api/interests', async (req, res) => {
  try {
    const range = 'Foglio1!A2:D'; // Salta l'intestazione
    const data = await getSheetData(range);
    
    // Elabora i dati
    const interests = {};
    let totalInterest = 0;
    let validEntries = 0;
    
    data.forEach(row => {
      if (row.length >= 4 && row[3]) {
        const value = parseInt(row[3]);
        if (!isNaN(value)) {
          totalInterest += value;
          validEntries++;
          
          const interest = row[2] || 'Non specificato';
          interests[interest] = (interests[interest] || 0) + 1;
        }
      }
    });
    
    const avgInterest = validEntries > 0 ? (totalInterest / validEntries).toFixed(1) : 0;
    
    res.json({
      interests,
      avgInterest,
      totalEntries: validEntries
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati di interesse' });
  }
});

// API per ottenere i dati di valutazione (Foglio2)
app.get('/api/ratings', async (req, res) => {
  try {
    const range = 'Foglio2!A2:D'; // Salta l'intestazione
    const data = await getSheetData(range);
    
    // Elabora i dati
    const projectRatings = {};
    let totalRating = 0;
    let validEntries = 0;
    const companies = new Set();
    
    data.forEach(row => {
      if (row.length >= 4 && row[3]) {
        const rating = parseFloat(row[3]);
        if (!isNaN(rating)) {
          totalRating += rating;
          validEntries++;
          
          const project = row[2] || 'Progetto non specificato';
          if (!projectRatings[project]) {
            projectRatings[project] = [];
          }
          projectRatings[project].push(rating);
          
          companies.add(row[1]);
        }
      }
    });
    
    const avgRating = validEntries > 0 ? (totalRating / validEntries).toFixed(1) : 0;
    
    // Calcola la media per progetto
    const projectAverages = {};
    for (const project in projectRatings) {
      const ratings = projectRatings[project];
      const sum = ratings.reduce((acc, val) => acc + val, 0);
      projectAverages[project] = (sum / ratings.length).toFixed(1);
    }
    
    res.json({
      projectRatings: projectAverages,
      avgRating,
      totalEntries: validEntries,
      uniqueCompanies: companies.size
    });
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati di valutazione' });
  }
});

// API per ottenere i dati di correlazione
app.get('/api/correlation', async (req, res) => {
  try {
    const interestsRange = 'Foglio1!A2:D';
    const ratingsRange = 'Foglio2!A2:D';
    
    const interestsData = await getSheetData(interestsRange);
    const ratingsData = await getSheetData(ratingsRange);
    
    // Crea una mappa di interesse per azienda
    const companyInterests = {};
    interestsData.forEach(row => {
      if (row.length >= 4 && row[1] && row[3]) {
        const company = row[1];
        const interest = parseInt(row[3]);
        if (!isNaN(interest)) {
          companyInterests[company] = interest;
        }
      }
    });
    
    // Crea una mappa di valutazione per azienda
    const companyRatings = {};
    ratingsData.forEach(row => {
      if (row.length >= 4 && row[1] && row[3]) {
        const company = row[1];
        const rating = parseFloat(row[3]);
        if (!isNaN(rating)) {
          if (!companyRatings[company]) {
            companyRatings[company] = [];
          }
          companyRatings[company].push(rating);
        }
      }
    });
    
    // Calcola la media di valutazione per azienda
    const avgCompanyRatings = {};
    for (const company in companyRatings) {
      const ratings = companyRatings[company];
      const sum = ratings.reduce((acc, val) => acc + val, 0);
      avgCompanyRatings[company] = (sum / ratings.length).toFixed(1);
    }
    
    // Crea i dati di correlazione
    const correlationData = [];
    for (const company in companyInterests) {
      if (avgCompanyRatings[company]) {
        correlationData.push({
          company,
          interest: companyInterests[company],
          rating: parseFloat(avgCompanyRatings[company])
        });
      }
    }
    
    res.json(correlationData);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati di correlazione' });
  }
});

// API per ottenere i dati del mood
app.get('/api/mood', async (req, res) => {
  try {
    const range = 'Foglio1!A2:D'; // Salta l'intestazione
    const data = await getSheetData(range);
    
    // Elabora i dati per il mood
    const moodCounts = {
      'Non interessato 😢': 0,
      'Distratto 😕': 0,
      'Curioso 🙂': 0,
      'Coinvolto 😃': 0,
      'Molto interessato 🤩': 0
    };
    
    data.forEach(row => {
      if (row.length >= 3 && row[2]) {
        const mood = row[2];
        if (moodCounts.hasOwnProperty(mood)) {
          moodCounts[mood]++;
        }
      }
    });
    
    res.json(moodCounts);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati del mood' });
  }
});

// API per ottenere i dati delle competenze
app.get('/api/skills', async (req, res) => {
  try {
    // Dati statici per le competenze
    const skillsData = [
      { skill: 'Programmazione', level: 90 },
      { skill: 'Elettronica', level: 85 },
      { skill: 'Design', level: 75 },
      { skill: 'Networking', level: 80 },
      { skill: 'Sicurezza', level: 70 }
    ];
    
    res.json(skillsData);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati delle competenze' });
  }
});

// API per ottenere i dati del tempo per progetto
app.get('/api/time', async (req, res) => {
  try {
    // Dati statici per il tempo dedicato ai progetti
    const timeData = [
      { project: 'ESP3D BOX', hours: 120 },
      { project: 'Simocoloweb', hours: 80 },
      { project: 'Flipper Zero', hours: 60 },
      { project: 'Bruce', hours: 40 },
      { project: 'Website', hours: 100 }
    ];
    
    res.json(timeData);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati del tempo' });
  }
});

// API per ottenere i dati dell'andamento temporale
app.get('/api/trend', async (req, res) => {
  try {
    const range = 'Foglio2!A2:D'; // Salta l'intestazione
    const data = await getSheetData(range);
    
    // Elabora i dati per l'andamento temporale
    const monthlyData = {};
    
    data.forEach(row => {
      if (row.length >= 1 && row[0]) {
        const date = new Date(row[0]);
        const month = date.toLocaleDateString('it-IT', { month: 'short' });
        
        if (!monthlyData[month]) {
          monthlyData[month] = [];
        }
        
        if (row.length >= 4 && row[3]) {
          const rating = parseFloat(row[3]);
          if (!isNaN(rating)) {
            monthlyData[month].push(rating);
          }
        }
      }
    });
    
    // Calcola la media per mese
    const trendData = [];
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    
    months.forEach(month => {
      if (monthlyData[month] && monthlyData[month].length > 0) {
        const sum = monthlyData[month].reduce((acc, val) => acc + val, 0);
        const avg = (sum / monthlyData[month].length).toFixed(1);
        trendData.push({ month, rating: parseFloat(avg) });
      } else {
        trendData.push({ month, rating: 0 });
      }
    });
    
    res.json(trendData);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati dell\'andamento temporale' });
  }
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});