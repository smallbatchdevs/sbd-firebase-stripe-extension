import admin = require('firebase-admin');
import * as functions from 'firebase-functions';

const { SitemapStream, streamToPromise } = require('sitemap');

// static routes that you can't easily get or generate from your database. i.e. /home or /login
const staticRoutes: string[] = [];

async function getDynamicRoutes(): Promise<string[]> {
  return (
    admin
      .firestore()
      .collection(`posts`)
      .get()
      .then((snapshot) => snapshot.docs.map((doc) => doc.data()))
      // convert each document into an app route, these will be appended to 'https://smallbatchdevs.com/'
      .then((posts) => posts.map((post) => `post/${post.prettyUrl}`))
  );
}

export const generateSitemap = functions.https.onRequest(async (req, res) => {
  const hostname = `https://smallbatchdevs.com`;
  const changefreq = 'weekly'; // how often do your web pages change?

  const smStream = new SitemapStream({ hostname });
  streamToPromise(smStream)
    .then((buffer: Buffer) => buffer.toString())
    .then((xmlString: string) => {
      console.log('Generated Sitemap: ', xmlString);
      res.status(200).contentType('text/xml; charset=utf8').send(xmlString);
    })
    .catch((e: any) => {
      console.log(`Error Generating Sitemap... `, e);
      res.status(500).send(e);
    });

  console.log(`Adding Static Routes... `);

  staticRoutes.forEach((url) => smStream.write({ url, changefreq }));

  const dynamicRoutes = await getDynamicRoutes();

  console.log(`Adding ${dynamicRoutes.length} Dynamic Routes... `);

  dynamicRoutes.forEach((url) => smStream.write({ url, changefreq }));

  smStream.end();
});
