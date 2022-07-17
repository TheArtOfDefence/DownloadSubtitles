const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
    useragent:'TemporaryUserAgent',
    ssl: true
});
const prompts = require('prompts');

const axios = require('axios');
const zlib = require('zlib');
const fs = require ('fs');


async function subtitles(){
  const movieOrTvShow = await prompts({
    type : 'text',
    name : 'type',
    message : 'Do you wish to watch a TV Show or a Movie? '});
  var nameAndYear = await prompts([{
      type : 'text',
      name : 'name',
      message : `What is the name of the ${movieOrTvShow.type.toLowerCase()} that you would like to watch?`},{
      type : 'text',
      name : 'year',
      message : `What is the year of the ${movieOrTvShow.type.toLowerCase()} that you would like to watch?`}]);
  const imdbMovie = async () => {
      try {
          const res = await axios.get(`https://imdb-api.com/en/API/SearchTitle/#ENTER_YOUR_TOKEN_HERE/${nameAndYear.name}` + ' ' + `${nameAndYear.year}`);
          return res.data.results[0].id;
      }catch (e) {
          console.log(e);}};
  console.log(nameAndYear.name);
  console.log(nameAndYear.year);
  console.log(movieOrTvShow.type);
  const imdbID = await imdbMovie()
  console.log(imdbID);
  if (movieOrTvShow.type == 'TV Show') {
  const seasonAndEpisode = await prompts([{
      type : 'number',
      name : 'season',
      message : 'Enter the number of season that you wish to watch.'},
    {
      type : 'number',
      name : 'episode',
      message : 'Enter the number of episode that you wish to watch. '}]);
    var season = seasonAndEpisode.season;
    var episode = seasonAndEpisode.episode;}
  else {
    var season = ''
    var episode = ''}
  console.log(season);
  console.log(episode);


  const responses = await prompts({
    type : 'text',
    name : 'releaseGroup',
    message : 'What is the name of the format or the release group of this file? (Note : The last thing in the files name.) '});
  console.log('You Managed This')
  let releaseGroup = responses.releaseGroup;
  let data1 = await OpenSubtitles.api.LogIn(#ENTER_YOUR_OPENSUBTITLES_NICKNAME_HERE, #ENTER_YOUR_TOKEN_HERE, 'en', 'TemporaryUserAgent');
  let token = data1.token;
  let data2 = await OpenSubtitles.api.SearchSubtitles(String(token),[{
    sublanguageid : 'eng',
    imdbid : imdbID.slice(2),
    tags : releaseGroup,
    season : season,
    episode : episode
  }]);
  console.log(data2.data);
  console.log(data2.data[0].IDSubtitleFile);
  let data3 = await OpenSubtitles.api.DownloadSubtitles(String(token),{
    idsubtitlefile : data2.data[0].IDSubtitleFile});
  console.log(data3);
  var b64string = data3.data[0].data;
  var buf = Buffer.from(b64string, 'base64');
  console.log(buf);

  zlib.gunzip(buf, (err,buffer) => {
          var text =  buffer.toString('utf8');
          fs.writeFile(`../../../Downloads/${nameAndYear.name}.srt`, text, function (err) {
            if (err) throw err;
            console.log('Saved!');
          });})
  }



subtitles()
