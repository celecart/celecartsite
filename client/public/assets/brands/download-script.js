// This is a helper script to download images

const fs = require('fs');
const https = require('https');

// URL of the image to download
const imageUrl = 'https://configurator.lamborghini.com/assets/models-gallery/urusperformante/gallery/performante_anteprima.jpg';
const filePath = './client/public/assets/brands/lamborghini-urus-performante.jpg';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve(true));
        console.log(`Downloaded image to ${dest}`);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file on error
      reject(err.message);
    });
  });
};

download(imageUrl, filePath)
  .then(() => {
    console.log('Download completed successfully');
  })
  .catch((err) => {
    console.error('Error downloading image:', err);
  });