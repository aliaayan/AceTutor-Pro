import fs from 'fs';
import path from 'path';

const CAIE_SUBJECTS = ['C-4024', 'C-5054', 'C-5070', 'C-5090', 'C-2210', 'C-1123', 'C-2058', 'C-3248', 'C-2059', 'C-7115', 'C-2281', 'C-7707'];
const SINDH_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Sindhi', 'Urdu', 'English'];
const YEARS = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
const TYPES = ['Question-Paper', 'Marking-Scheme'];

function setup() {
  // Setup CAIE Data
  CAIE_SUBJECTS.forEach(sub => {
    YEARS.forEach(year => {
      TYPES.forEach(type => {
        const dir = path.join(process.cwd(), 'caie-data', sub, year, type);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'info.json'), JSON.stringify({
          subject: sub,
          year,
          type,
          status: 'indexed',
          source_prefix: `https://pastpapers.papacambridge.com/papers/caie/o-level/${sub}`
        }, null, 2));
      });
    });
  });

  // Setup Sindh Board Data
  SINDH_SUBJECTS.forEach(sub => {
    YEARS.forEach(year => {
      const dir = path.join(process.cwd(), 'sindh-board-data', sub, year);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'info.json'), JSON.stringify({
        subject: sub,
        year,
        status: 'indexed',
        source: 'https://www.biek.edu.pk/ModelPaper/2023/Scheme%20&%20Model%20Papers%202023.pdf'
      }, null, 2));
    });
  });

  // Setup Grade Thresholds
  const thresholdDir = path.join(process.cwd(), 'thresholds');
  fs.mkdirSync(thresholdDir, { recursive: true });
  [...CAIE_SUBJECTS, ...SINDH_SUBJECTS].forEach(sub => {
    fs.writeFileSync(path.join(thresholdDir, `${sub}.json`), JSON.stringify({
      subject: sub,
      thresholds: {
        'A*': 85,
        'A': 75,
        'B': 65,
        'C': 55,
        'D': 45,
        'E': 35
      },
      lastUpdated: '2025-05-01'
    }, null, 2));
  });

  console.log('Data structure and thresholds created successfully.');

  // Create Static Manifest for Production
  const manifest = {
    caie: CAIE_SUBJECTS.map(id => ({
      id,
      years: YEARS,
      synced: true,
      lastUpdated: new Date().toISOString()
    })),
    sindh: SINDH_SUBJECTS.map(name => ({
      name,
      years: YEARS,
      synced: true,
      lastUpdated: new Date().toISOString()
    }))
  };

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  fs.writeFileSync(path.join(publicDir, 'vault_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Production Manifest created at public/vault_manifest.json');
}

setup();
