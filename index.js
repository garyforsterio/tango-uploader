/**
 * Imports
 */
const fetch = require('node-fetch');
const JSDOM = require('jsdom').JSDOM;
const words = require('./words').words;
const dotenv = require('dotenv');
const constants = require('./constants');
const utilities = require('./utilities');

/**
 * Init
 */
dotenv.config();

/**
 * Variables
 */
const cookie = `sessionid_2=${process.env.SESSION_ID_2}; csrftoken=${
  process.env.CSRF_TOKEN
};`;
const levelId = parseInt(process.env.LEVEL_ID);

/**
 * Fetch information for word and upload to memrise along with audio url
 * @param {string} keyword Keyword ideally in kanji form for accuracy
 */
async function addWord(keyword) {
  const jishoResult = await fetch(
    constants.JISHO_SEARCH_API + encodeURIComponent(keyword)
  );
  if (jishoResult.status !== 200) {
    throw new Error(jishoResult.status);
  }
  const content = await jishoResult.json();
  if (content.data.length === 0) {
    throw new Error('No results for word ' + keyword);
  }

  const item = content.data[0];
  const body = {
    columns: {
      1: item.japanese[0].reading,
      2: item.senses[0].english_definitions.join(', '),
      4: item.japanese[0].word,
      6: item.senses[0].parts_of_speech.join(', ')
    },
    level_id: levelId
  };

  const audioUrl = await getAudioUrl(item.japanese[0].word);
  if (audioUrl) {
    body.columns['5'] = audioUrl;
  }

  const memriseResult = await fetch(constants.MEMRISE_ADD_THING_API, {
    method: 'POST',
    body: utilities.urlEncode(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: cookie,
      Origin: 'https://www.memrise.com',
      Referer: 'https://www.memrise.com',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36',
      'X-CSRFToken': process.env.CSRF_TOKEN
    }
  });
  if (memriseResult.status !== 200) {
    throw new Error(memriseResult.status);
  }
}

/**
 * Scrape the jisho word page for a possible audio source
 * @param {string} kanji Word in kanji form
 */
async function getAudioUrl(kanji) {
  const html = await fetch(
    constants.JISHO_WORD_API + encodeURIComponent(kanji)
  ).then(res => res.text());
  const dom = new JSDOM(html);

  const sourceElement = dom.window.document.querySelector(
    "audio > source[type='audio/mpeg']"
  );
  return sourceElement && sourceElement.src
    ? 'https:' + sourceElement.src
    : null;
}

/**
 * Add all words to memrise
 * @param {string[]} words words to be added to memrise
 */
async function run(words) {
  const badWords = [];
  words
    .reverse()
    .reduce(
      (prom, word) =>
        prom.then(() =>
          addWord(word).catch(err => {
            console.error(word, err);
            badWords.push(word);
          })
        ),
      Promise.resolve()
    )
    .then(() => {
      console.log('====================================');
      console.log('Finished uploading words');
      console.log('====================================');
      if (badWords.length > 0) {
        console.log(
          'Some problematic words were encoutered, please investigate'
        );
        console.log(JSON.stringify(badWords));
      }
    });
}

run(words);
