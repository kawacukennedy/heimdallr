fetch('https://heimdallr-backend.onrender.com/api/cctv')
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
